import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

import type { RuntimeEnvironment } from "../config/runtime-config.js";
import { isUuidV4 } from "../http/public-errors.js";
import type {
  InstallationTokenGrant,
  InstallationTokenIssuer,
  IssuedInstallationToken,
} from "./installation-token.js";

const CHALLENGE_TTL_MS = 120_000;
const MAX_CHALLENGE_FAILURES = 3;

export interface AppAttestChallenge {
  readonly challengeId: string;
  readonly challenge: string;
  readonly expiresAt: string;
}

export interface AppleAppAttestProofRequest {
  readonly installationId: string;
  readonly challengeId: string;
  readonly appVersion: string;
  readonly keyId: string;
  readonly proof: string;
  readonly proofKind: "attestation" | "assertion";
}

export interface AppleAppAttestCryptographicResult {
  readonly appId: string;
  readonly environment: "development" | "production";
  readonly keyId: string;
  readonly publicKey: string;
  readonly receiptHash: string;
  readonly clientDataHash: string;
  readonly counter: number;
  readonly attestationChainValid: boolean;
  readonly nonceValid: boolean;
  readonly appIdHashValid: boolean;
  readonly productionAaguid: boolean;
  readonly credentialIdMatches: boolean;
}

export interface RegisteredAppAttestCredential {
  readonly appId: string;
  readonly keyId: string;
  readonly publicKey: string;
  readonly receiptHash: string;
  readonly counter: number;
}

export interface AppleAppAttestCryptographicVerifier {
  readonly kind: "apple-app-attest-production" | "synthetic-test";
  verify(
    request: AppleAppAttestProofRequest,
    expectedClientDataHash: string,
    registeredCredential: RegisteredAppAttestCredential | undefined,
  ): Promise<AppleAppAttestCryptographicResult>;
}

export type InstallationAuthErrorCode =
  | "ATTESTATION_INVALID"
  | "ATTESTATION_REPLAYED"
  | "IDEMPOTENCY_KEY_REUSED"
  | "AUTH_REQUIRED";

export class InstallationAuthError extends Error {
  constructor(readonly code: InstallationAuthErrorCode) {
    super(code === "ATTESTATION_REPLAYED" ? "attestation replay rejected" : "installation auth rejected");
    this.name = "InstallationAuthError";
  }
}

interface ChallengeRecord {
  readonly challengeId: string;
  readonly challengeHash: string;
  readonly expiresAtMs: number;
  failures: number;
  state: "unused" | "consumed" | "invalid";
  consumedByInstallationId: string | null;
  consumedByRequestId: string | null;
}

interface InstallationRecord {
  readonly installationId: string;
  readonly appId: string;
  readonly keyId: string;
  readonly publicKey: string;
  readonly receiptHash: string;
  counter: number;
  revoked: boolean;
}

interface IdempotencyRecord {
  readonly bodyHash: string;
  readonly grant: InstallationTokenGrant;
}

type GrantLookup =
  | { readonly kind: "none" }
  | { readonly kind: "replay"; readonly grant: InstallationTokenGrant }
  | { readonly kind: "reused" };

type CommitResult =
  | { readonly kind: "committed" | "replay"; readonly grant: InstallationTokenGrant }
  | { readonly kind: "reused" }
  | { readonly kind: "replayed" }
  | { readonly kind: "invalid" };

export interface InstallationAuthRepository {
  issueChallenge(record: ChallengeRecord): void;
  readChallenge(challengeId: string): Readonly<ChallengeRecord> | undefined;
  readRegisteredCredential(installationId: string): RegisteredAppAttestCredential | undefined;
  recordChallengeFailure(challengeId: string, nowMs: number): void;
  lookupGrant(operation: "register" | "refresh", installationId: string,
    idempotencyKey: string, bodyHash: string): GrantLookup;
  commitRegistration(input: {
    readonly request: AppleAppAttestProofRequest;
    readonly requestId: string;
    readonly idempotencyKey: string;
    readonly bodyHash: string;
    readonly verification: AppleAppAttestCryptographicResult;
    readonly challengeHash: string;
    readonly nowMs: number;
    readonly grant: InstallationTokenGrant;
  }): CommitResult;
  commitRefresh(input: {
    readonly request: AppleAppAttestProofRequest;
    readonly requestId: string;
    readonly idempotencyKey: string;
    readonly bodyHash: string;
    readonly verification: AppleAppAttestCryptographicResult;
    readonly challengeHash: string;
    readonly nowMs: number;
    readonly grant: InstallationTokenGrant;
  }): CommitResult;
  revokeInstallation(installationId: string): void;
  getSafeStats(): {
    readonly challenges: number;
    readonly consumedChallenges: number;
    readonly installations: number;
    readonly grants: number;
  };
}

export class InMemoryInstallationAuthRepository implements InstallationAuthRepository {
  readonly #challenges = new Map<string, ChallengeRecord>();
  readonly #installations = new Map<string, InstallationRecord>();
  readonly #installationByKeyId = new Map<string, string>();
  readonly #idempotency = new Map<string, IdempotencyRecord>();

  issueChallenge(record: ChallengeRecord): void {
    if (this.#challenges.has(record.challengeId)) throw new Error("challenge ID collision");
    this.#challenges.set(record.challengeId, { ...record });
  }

  readChallenge(challengeId: string): Readonly<ChallengeRecord> | undefined {
    const record = this.#challenges.get(challengeId);
    return record === undefined ? undefined : { ...record };
  }

  readRegisteredCredential(installationId: string): RegisteredAppAttestCredential | undefined {
    const installation = this.#installations.get(installationId);
    if (installation === undefined || installation.revoked) return undefined;
    return {
      appId: installation.appId,
      keyId: installation.keyId,
      publicKey: installation.publicKey,
      receiptHash: installation.receiptHash,
      counter: installation.counter,
    };
  }

  recordChallengeFailure(challengeId: string, nowMs: number): void {
    const record = this.#challenges.get(challengeId);
    if (record === undefined || record.state !== "unused") return;
    if (record.expiresAtMs <= nowMs) {
      record.state = "invalid";
      return;
    }
    record.failures += 1;
    if (record.failures >= MAX_CHALLENGE_FAILURES) record.state = "invalid";
  }

  lookupGrant(
    operation: "register" | "refresh",
    installationId: string,
    idempotencyKey: string,
    bodyHash: string,
  ): GrantLookup {
    const record = this.#idempotency.get(this.#idempotencyKey(operation, installationId, idempotencyKey));
    if (record === undefined) return { kind: "none" };
    return record.bodyHash === bodyHash
      ? { kind: "replay", grant: record.grant }
      : { kind: "reused" };
  }

  commitRegistration(input: Parameters<InstallationAuthRepository["commitRegistration"]>[0]): CommitResult {
    const existing = this.lookupGrant("register", input.request.installationId,
      input.idempotencyKey, input.bodyHash);
    if (existing.kind === "replay") return { kind: "replay", grant: existing.grant };
    if (existing.kind === "reused") return { kind: "reused" };
    const challenge = this.#validChallenge(input.request.challengeId, input.challengeHash, input.nowMs);
    if (challenge === undefined) return { kind: "replayed" };
    const keyOwner = this.#installationByKeyId.get(input.verification.keyId);
    if (keyOwner !== undefined || this.#installations.has(input.request.installationId)) {
      return { kind: "replayed" };
    }
    challenge.state = "consumed";
    challenge.consumedByInstallationId = input.request.installationId;
    challenge.consumedByRequestId = input.requestId;
    this.#installations.set(input.request.installationId, {
      installationId: input.request.installationId,
      appId: input.verification.appId,
      keyId: input.verification.keyId,
      publicKey: input.verification.publicKey,
      receiptHash: input.verification.receiptHash,
      counter: input.verification.counter,
      revoked: false,
    });
    this.#installationByKeyId.set(input.verification.keyId, input.request.installationId);
    this.#idempotency.set(this.#idempotencyKey("register", input.request.installationId,
      input.idempotencyKey), { bodyHash: input.bodyHash, grant: input.grant });
    return { kind: "committed", grant: input.grant };
  }

  commitRefresh(input: Parameters<InstallationAuthRepository["commitRefresh"]>[0]): CommitResult {
    const existing = this.lookupGrant("refresh", input.request.installationId,
      input.idempotencyKey, input.bodyHash);
    if (existing.kind === "replay") return { kind: "replay", grant: existing.grant };
    if (existing.kind === "reused") return { kind: "reused" };
    const challenge = this.#validChallenge(input.request.challengeId, input.challengeHash, input.nowMs);
    const installation = this.#installations.get(input.request.installationId);
    if (challenge === undefined || installation === undefined || installation.revoked ||
      installation.keyId !== input.verification.keyId || installation.appId !== input.verification.appId) {
      return { kind: "invalid" };
    }
    if (input.verification.counter <= installation.counter) return { kind: "replayed" };
    challenge.state = "consumed";
    challenge.consumedByInstallationId = input.request.installationId;
    challenge.consumedByRequestId = input.requestId;
    installation.counter = input.verification.counter;
    this.#idempotency.set(this.#idempotencyKey("refresh", input.request.installationId,
      input.idempotencyKey), { bodyHash: input.bodyHash, grant: input.grant });
    return { kind: "committed", grant: input.grant };
  }

  revokeInstallation(installationId: string): void {
    const installation = this.#installations.get(installationId);
    if (installation !== undefined) installation.revoked = true;
  }

  getSafeStats(): ReturnType<InstallationAuthRepository["getSafeStats"]> {
    return {
      challenges: this.#challenges.size,
      consumedChallenges: [...this.#challenges.values()].filter((value) => value.state === "consumed").length,
      installations: this.#installations.size,
      grants: this.#idempotency.size,
    };
  }

  #validChallenge(challengeId: string, challengeHash: string, nowMs: number): ChallengeRecord | undefined {
    const challenge = this.#challenges.get(challengeId);
    return challenge?.state === "unused" && challenge.expiresAtMs > nowMs &&
      safeEqual(challenge.challengeHash, challengeHash) ? challenge : undefined;
  }

  #idempotencyKey(operation: "register" | "refresh", installationId: string,
    idempotencyKey: string): string {
    return `${operation}\u0000${installationId}\u0000${idempotencyKey}`;
  }
}

export class AppAttestInstallationAuthService {
  readonly #allowedAppIds: ReadonlySet<string>;
  readonly #repository: InstallationAuthRepository;
  readonly #tokenIssuer: InstallationTokenIssuer;
  readonly #verifier: AppleAppAttestCryptographicVerifier;
  readonly #nowMs: () => number;
  readonly #tokenTtlSeconds: number;
  readonly #verificationTimeoutMs: number;

  constructor(options: {
    readonly runtimeEnvironment: RuntimeEnvironment;
    readonly allowedAppIds: readonly string[];
    readonly repository: InstallationAuthRepository;
    readonly tokenIssuer: InstallationTokenIssuer;
    readonly verifier: AppleAppAttestCryptographicVerifier;
    readonly nowMs?: () => number;
    readonly tokenTtlSeconds?: number;
    readonly verificationTimeoutMs?: number;
  }) {
    if (options.runtimeEnvironment === "production" &&
      options.verifier.kind !== "apple-app-attest-production") {
      throw new InstallationAuthError("ATTESTATION_INVALID");
    }
    if (options.allowedAppIds.length === 0 || options.allowedAppIds.some((value) => value.length === 0)) {
      throw new Error("at least one App Attest app ID is required");
    }
    this.#allowedAppIds = new Set(options.allowedAppIds);
    this.#repository = options.repository;
    this.#tokenIssuer = options.tokenIssuer;
    this.#verifier = options.verifier;
    this.#nowMs = options.nowMs ?? Date.now;
    this.#tokenTtlSeconds = options.tokenTtlSeconds ?? 900;
    if (!Number.isInteger(this.#tokenTtlSeconds) || this.#tokenTtlSeconds < 60 ||
      this.#tokenTtlSeconds > 900) throw new Error("installation token TTL must be 60 to 900 seconds");
    this.#verificationTimeoutMs = options.verificationTimeoutMs ?? 3_000;
    if (!Number.isInteger(this.#verificationTimeoutMs) || this.#verificationTimeoutMs < 1 ||
      this.#verificationTimeoutMs > 3_000) throw new Error("App Attest verification timeout is invalid");
  }

  issueChallenge(): AppAttestChallenge {
    const now = this.#readNow();
    const challenge = randomBytes(32).toString("base64url");
    const challengeId = randomUUID();
    const expiresAtMs = now + CHALLENGE_TTL_MS;
    this.#repository.issueChallenge({
      challengeId,
      challengeHash: hash(challenge),
      expiresAtMs,
      failures: 0,
      state: "unused",
      consumedByInstallationId: null,
      consumedByRequestId: null,
    });
    return { challengeId, challenge, expiresAt: new Date(expiresAtMs).toISOString() };
  }

  async register(
    request: AppleAppAttestProofRequest,
    idempotencyKey: string,
    requestId: string,
  ): Promise<IssuedInstallationToken & { readonly replayed: boolean }> {
    this.#validateRequest(request, idempotencyKey, requestId, "attestation");
    return this.#verifyAndCommit("register", request, idempotencyKey, requestId);
  }

  async refresh(
    request: AppleAppAttestProofRequest,
    idempotencyKey: string,
    requestId: string,
  ): Promise<IssuedInstallationToken & { readonly replayed: boolean }> {
    this.#validateRequest(request, idempotencyKey, requestId, "assertion");
    return this.#verifyAndCommit("refresh", request, idempotencyKey, requestId);
  }

  revokeInstallation(installationId: string): void {
    this.#repository.revokeInstallation(installationId);
    this.#tokenIssuer.revokeInstallation(installationId);
  }

  async #verifyAndCommit(
    operation: "register" | "refresh",
    request: AppleAppAttestProofRequest,
    idempotencyKey: string,
    requestId: string,
  ): Promise<IssuedInstallationToken & { readonly replayed: boolean }> {
    const now = this.#readNow();
    const bodyHash = requestBodyHash(request);
    const previous = this.#repository.lookupGrant(operation, request.installationId,
      idempotencyKey, bodyHash);
    if (previous.kind === "reused") throw new InstallationAuthError("IDEMPOTENCY_KEY_REUSED");
    if (previous.kind === "replay") {
      return { ...this.#tokenIssuer.issueGrant(previous.grant), replayed: true };
    }
    const challenge = this.#repository.readChallenge(request.challengeId);
    if (challenge === undefined || challenge.state !== "unused" || challenge.expiresAtMs <= now) {
      throw new InstallationAuthError("ATTESTATION_REPLAYED");
    }
    const registeredCredential = operation === "refresh"
      ? this.#repository.readRegisteredCredential(request.installationId)
      : undefined;
    if (operation === "refresh" && (registeredCredential === undefined ||
      registeredCredential.keyId !== request.keyId)) {
      throw new InstallationAuthError("AUTH_REQUIRED");
    }
    const expectedClientDataHash = clientDataHash(challenge.challengeHash, request, operation);
    let verification: AppleAppAttestCryptographicResult;
    try {
      verification = await withTimeout(this.#verifier.verify(
        request,
        expectedClientDataHash,
        registeredCredential,
      ), this.#verificationTimeoutMs);
    } catch {
      this.#repository.recordChallengeFailure(request.challengeId, now);
      throw new InstallationAuthError("ATTESTATION_INVALID");
    }
    if (!this.#isValidVerification(
      verification,
      request,
      expectedClientDataHash,
      operation,
      registeredCredential,
    )) {
      this.#repository.recordChallengeFailure(request.challengeId, now);
      throw new InstallationAuthError("ATTESTATION_INVALID");
    }
    const commitNow = this.#readNow();
    const nowSeconds = Math.floor(commitNow / 1_000);
    const grant: InstallationTokenGrant = {
      installationId: request.installationId,
      appId: verification.appId,
      attestationProvider: "apple_app_attest",
      issuedAtSeconds: nowSeconds,
      expiresAtSeconds: nowSeconds + this.#tokenTtlSeconds,
      jti: randomUUID(),
    };
    const commit = operation === "register"
      ? this.#repository.commitRegistration({ request, requestId, idempotencyKey, bodyHash,
        verification, challengeHash: challenge.challengeHash, nowMs: commitNow, grant })
      : this.#repository.commitRefresh({ request, requestId, idempotencyKey, bodyHash,
        verification, challengeHash: challenge.challengeHash, nowMs: commitNow, grant });
    if (commit.kind === "reused") throw new InstallationAuthError("IDEMPOTENCY_KEY_REUSED");
    if (commit.kind === "replayed") throw new InstallationAuthError("ATTESTATION_REPLAYED");
    if (commit.kind === "invalid") throw new InstallationAuthError("AUTH_REQUIRED");
    return { ...this.#tokenIssuer.issueGrant(commit.grant), replayed: commit.kind === "replay" };
  }

  #isValidVerification(
    verification: AppleAppAttestCryptographicResult,
    request: AppleAppAttestProofRequest,
    expectedClientDataHash: string,
    operation: "register" | "refresh",
    registeredCredential: RegisteredAppAttestCredential | undefined,
  ): boolean {
    return verification.environment === "production" && this.#allowedAppIds.has(verification.appId) &&
      verification.keyId === request.keyId && safeEqual(verification.clientDataHash, expectedClientDataHash) &&
      verification.attestationChainValid && verification.nonceValid && verification.appIdHashValid &&
      verification.productionAaguid && verification.credentialIdMatches &&
      verification.publicKey.length > 0 && /^[0-9a-f]{64}$/iu.test(verification.receiptHash) &&
      Number.isSafeInteger(verification.counter) && verification.counter >= 0 &&
      (operation === "refresh" || verification.counter === 0) &&
      (operation === "register" || (registeredCredential !== undefined &&
        safeEqual(verification.publicKey, registeredCredential.publicKey) &&
        safeEqual(verification.receiptHash, registeredCredential.receiptHash)));
  }

  #validateRequest(request: AppleAppAttestProofRequest, idempotencyKey: string,
    requestId: string, proofKind: AppleAppAttestProofRequest["proofKind"]): void {
    if (!isUuidV4(request.installationId) || !isUuidV4(request.challengeId) ||
      !isUuidV4(idempotencyKey) || !isUuidV4(requestId) || request.proofKind !== proofKind ||
      !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/u.test(request.appVersion) ||
      request.keyId.length < 16 || request.keyId.length > 512 ||
      request.proof.length < 16 || request.proof.length > 16_384) {
      throw new InstallationAuthError("ATTESTATION_INVALID");
    }
  }

  #readNow(): number {
    const now = this.#nowMs();
    if (!Number.isSafeInteger(now) || now < 0) throw new InstallationAuthError("ATTESTATION_INVALID");
    return now;
  }
}

export function clientDataHash(
  challengeHash: string,
  request: Pick<AppleAppAttestProofRequest, "installationId" | "challengeId" | "appVersion">,
  operation: "register" | "refresh",
): string {
  return hash(["cooklog.app-attest.v1", operation, challengeHash, request.challengeId,
    request.installationId, request.appVersion].join("\u0000"));
}

function requestBodyHash(request: AppleAppAttestProofRequest): string {
  return hash(JSON.stringify({
    installation_id: request.installationId,
    challenge_id: request.challengeId,
    app_version: request.appVersion,
    key_id: request.keyId,
    proof_hash: hash(request.proof),
    proof_kind: request.proofKind,
  }));
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function safeEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error("App Attest verification timeout")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}
