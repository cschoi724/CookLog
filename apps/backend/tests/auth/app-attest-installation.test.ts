import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import {
  AppAttestInstallationAuthService,
  type AppleAppAttestCryptographicResult,
  type AppleAppAttestCryptographicVerifier,
  type AppleAppAttestProofRequest,
  InMemoryInstallationAuthRepository,
  InstallationAuthError,
  type RegisteredAppAttestCredential,
} from "../../src/auth/app-attest-installation.js";
import {
  AttestationVerificationError,
  LimitedDevelopmentAttestationVerifier,
} from "../../src/auth/attestation.js";
import {
  InstallationTokenError,
  SignedInstallationTokenService,
  type InstallationTokenGrant,
} from "../../src/auth/installation-token.js";

const appId = "TEAMID.app.cooklog.ios";
const keyId = "app-attest-key-id-0001";
const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";
const signingKey = { keyId: "signing-v1", secret: "a".repeat(32) };

class ContractAppleVerifier implements AppleAppAttestCryptographicVerifier {
  readonly kind: AppleAppAttestCryptographicVerifier["kind"];
  counter = 0;
  valid = true;
  hang = false;
  afterVerify: (() => void) | undefined;
  lastRegisteredCredential: RegisteredAppAttestCredential | undefined;
  publicKey = "synthetic-public-key-not-a-credential";
  receiptHash = "b".repeat(64);

  constructor(kind: AppleAppAttestCryptographicVerifier["kind"] = "apple-app-attest-production") {
    this.kind = kind;
  }

  async verify(
    request: AppleAppAttestProofRequest,
    expectedClientDataHash: string,
    registeredCredential: RegisteredAppAttestCredential | undefined,
  ): Promise<AppleAppAttestCryptographicResult> {
    this.lastRegisteredCredential = registeredCredential;
    if (this.hang) return new Promise(() => undefined);
    await Promise.resolve();
    this.afterVerify?.();
    return {
      appId,
      environment: "production",
      keyId: request.keyId,
      publicKey: this.publicKey,
      receiptHash: this.receiptHash,
      clientDataHash: expectedClientDataHash,
      counter: this.counter,
      attestationChainValid: this.valid,
      nonceValid: this.valid,
      appIdHashValid: this.valid,
      productionAaguid: this.valid,
      credentialIdMatches: this.valid,
    };
  }
}

function request(challengeId: string, proofKind: "attestation" | "assertion" = "attestation"):
AppleAppAttestProofRequest {
  return {
    installationId,
    challengeId,
    appVersion: "1.0.0",
    keyId,
    proof: `base64-proof-${proofKind}-not-for-logs`,
    proofKind,
  };
}

function fixture(options: {
  readonly verifier?: ContractAppleVerifier;
  readonly nowMs?: () => number;
  readonly runtimeEnvironment?: "local" | "test" | "production";
  readonly verificationTimeoutMs?: number;
} = {}) {
  const nowMs = options.nowMs ?? (() => Date.parse("2026-08-10T00:00:00Z"));
  const repository = new InMemoryInstallationAuthRepository();
  const verifier = options.verifier ?? new ContractAppleVerifier();
  const tokenService = new SignedInstallationTokenService({
    activeKey: signingKey,
    nowSeconds: () => Math.floor(nowMs() / 1_000),
  });
  const service = new AppAttestInstallationAuthService({
    runtimeEnvironment: options.runtimeEnvironment ?? "production",
    allowedAppIds: [appId],
    repository,
    tokenIssuer: tokenService,
    verifier,
    nowMs,
    ...(options.verificationTimeoutMs === undefined
      ? {}
      : { verificationTimeoutMs: options.verificationTimeoutMs }),
  });
  return { repository, verifier, tokenService, service };
}

test("production requires the production App Attest cryptographic verifier", () => {
  assert.throws(() => fixture({
    verifier: new ContractAppleVerifier("synthetic-test"),
    runtimeEnvironment: "production",
  }), (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_INVALID");
});

test("challenge registration atomically consumes proof and replays committed token grant", async () => {
  const { repository, service, tokenService } = fixture();
  const challenge = service.issueChallenge();
  assert.equal(Buffer.from(challenge.challenge, "base64url").length, 32);
  assert.equal(Date.parse(challenge.expiresAt) - Date.parse("2026-08-10T00:00:00Z"), 120_000);
  const idempotencyKey = randomUUID();
  const body = request(challenge.challengeId);
  const first = await service.register(body, idempotencyKey, randomUUID());
  assert.equal(first.replayed, false);
  assert.equal(first.installationId, installationId);
  assert.equal(first.attestationProvider, "apple_app_attest");
  assert.equal((await tokenService.verify(first.accessToken)).sub, installationId);
  const replay = await service.register(body, idempotencyKey, randomUUID());
  assert.equal(replay.replayed, true);
  assert.equal(replay.accessToken, first.accessToken);
  await assert.rejects(service.register({ ...body, proof: `${body.proof}-changed` },
    idempotencyKey, randomUUID()),
  (error: unknown) => error instanceof InstallationAuthError && error.code === "IDEMPOTENCY_KEY_REUSED");
  assert.deepEqual(repository.getSafeStats(), {
    challenges: 1, consumedChallenges: 1, installations: 1, grants: 1,
  });
  await assert.rejects(service.register(body, randomUUID(), randomUUID()),
    (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_REPLAYED");
  service.revokeInstallation(installationId);
  await assert.rejects(tokenService.verify(first.accessToken),
    (error: unknown) => error instanceof InstallationTokenError && error.code === "INSTALLATION_REVOKED");
});

test("App Attest key IDs are globally unique across installations", async () => {
  const { service } = fixture();
  const firstChallenge = service.issueChallenge();
  await service.register(request(firstChallenge.challengeId), randomUUID(), randomUUID());
  const secondChallenge = service.issueChallenge();
  await assert.rejects(service.register({
    ...request(secondChallenge.challengeId),
    installationId: randomUUID(),
  }, randomUUID(), randomUUID()),
  (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_REPLAYED");
});

test("concurrent challenge submissions have one installation and one replay loser", async () => {
  const { repository, service } = fixture();
  const challenge = service.issueChallenge();
  const body = request(challenge.challengeId);
  const settled = await Promise.allSettled([
    service.register(body, randomUUID(), randomUUID()),
    service.register(body, randomUUID(), randomUUID()),
  ]);
  assert.equal(settled.filter((value) => value.status === "fulfilled").length, 1);
  const rejected = settled.find((value) => value.status === "rejected");
  assert.ok(rejected?.status === "rejected" && rejected.reason instanceof InstallationAuthError);
  if (rejected?.status === "rejected" && rejected.reason instanceof InstallationAuthError) {
    assert.equal(rejected.reason.code, "ATTESTATION_REPLAYED");
  }
  assert.equal(repository.getSafeStats().installations, 1);
  assert.equal(repository.getSafeStats().grants, 1);
});

test("three invalid proofs invalidate a challenge without exposing proof data", async () => {
  const verifier = new ContractAppleVerifier();
  verifier.valid = false;
  const { service } = fixture({ verifier });
  const challenge = service.issueChallenge();
  const body = request(challenge.challengeId);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await assert.rejects(service.register({ ...body, proof: `${body.proof}-${attempt}` },
      randomUUID(), randomUUID()), (error: unknown) => {
      assert.ok(error instanceof InstallationAuthError);
      assert.equal(error.code, "ATTESTATION_INVALID");
      assert.equal(error.message.includes(body.proof), false);
      return true;
    });
  }
  verifier.valid = true;
  await assert.rejects(service.register(body, randomUUID(), randomUUID()),
    (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_REPLAYED");
});

test("assertion refresh requires a fresh challenge and a monotonic counter", async () => {
  const { verifier, service, tokenService } = fixture();
  const registrationChallenge = service.issueChallenge();
  await service.register(request(registrationChallenge.challengeId), randomUUID(), randomUUID());

  verifier.counter = 1;
  const refreshChallenge = service.issueChallenge();
  const refreshed = await service.refresh(request(refreshChallenge.challengeId, "assertion"),
    randomUUID(), randomUUID());
  assert.equal((await tokenService.verify(refreshed.accessToken)).sub, installationId);
  assert.deepEqual(verifier.lastRegisteredCredential, {
    appId,
    keyId,
    publicKey: "synthetic-public-key-not-a-credential",
    receiptHash: "b".repeat(64),
    counter: 0,
  });

  const replayChallenge = service.issueChallenge();
  await assert.rejects(service.refresh(request(replayChallenge.challengeId, "assertion"),
    randomUUID(), randomUUID()),
  (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_REPLAYED");

  verifier.counter = 2;
  const nextChallenge = service.issueChallenge();
  assert.equal((await service.refresh(request(nextChallenge.challengeId, "assertion"),
    randomUUID(), randomUUID())).replayed, false);
});

test("assertion verification is pinned to the registered public key and receipt", async () => {
  const { verifier, service } = fixture();
  const registrationChallenge = service.issueChallenge();
  await service.register(request(registrationChallenge.challengeId), randomUUID(), randomUUID());

  verifier.counter = 1;
  verifier.publicKey = "different-public-key";
  const refreshChallenge = service.issueChallenge();
  await assert.rejects(service.refresh(request(refreshChallenge.challengeId, "assertion"),
    randomUUID(), randomUUID()),
  (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_INVALID");
});

test("challenge expiry during verification and verifier timeout fail closed", async () => {
  let now = Date.parse("2026-08-10T00:00:00Z");
  const verifier = new ContractAppleVerifier();
  verifier.afterVerify = () => { now += 120_000; };
  const expiring = fixture({ verifier, nowMs: () => now }).service;
  const expiringChallenge = expiring.issueChallenge();
  await assert.rejects(expiring.register(request(expiringChallenge.challengeId), randomUUID(), randomUUID()),
    (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_REPLAYED");

  const hangingVerifier = new ContractAppleVerifier();
  hangingVerifier.hang = true;
  const timingOut = fixture({ verifier: hangingVerifier, verificationTimeoutMs: 5 }).service;
  const timeoutChallenge = timingOut.issueChallenge();
  await assert.rejects(timingOut.register(request(timeoutChallenge.challengeId), randomUUID(), randomUUID()),
    (error: unknown) => error instanceof InstallationAuthError && error.code === "ATTESTATION_INVALID");
});

test("signed tokens reject forgery and clock skew, rotate two keys, and revoke jti", async () => {
  let now = 1_786_000_000;
  const service = new SignedInstallationTokenService({ activeKey: signingKey, nowSeconds: () => now });
  const grant: InstallationTokenGrant = {
    installationId,
    appId,
    attestationProvider: "apple_app_attest",
    issuedAtSeconds: now,
    expiresAtSeconds: now + 60,
    jti: randomUUID(),
  };
  const issued = service.issueGrant(grant);
  assert.equal((await service.verify(issued.accessToken)).jti, grant.jti);
  const forged = `${issued.accessToken.slice(0, -1)}${issued.accessToken.endsWith("A") ? "B" : "A"}`;
  await assert.rejects(service.verify(forged), InstallationTokenError);

  service.rotate({ keyId: "signing-v2", secret: "b".repeat(32) });
  assert.equal((await service.verify(issued.accessToken)).jti, grant.jti);
  const rotated = service.issueGrant({ ...grant, jti: randomUUID() });
  service.rotate({ keyId: "signing-v3", secret: "c".repeat(32) });
  await assert.rejects(service.verify(issued.accessToken), InstallationTokenError);
  assert.equal((await service.verify(rotated.accessToken)).sub, installationId);

  service.revokeJti((await service.verify(rotated.accessToken)).jti);
  await assert.rejects(service.verify(rotated.accessToken), (error: unknown) =>
    error instanceof InstallationTokenError && error.code === "INSTALLATION_REVOKED");

  const future = service.issueGrant({ ...grant, issuedAtSeconds: now + 31, expiresAtSeconds: now + 91,
    jti: randomUUID() });
  await assert.rejects(service.verify(future.accessToken), InstallationTokenError);
  now += 60;
  const expired = service.issueGrant({ ...grant, issuedAtSeconds: now - 60, expiresAtSeconds: now,
    jti: randomUUID() });
  await assert.rejects(service.verify(expired.accessToken),
    (error: unknown) => error instanceof InstallationTokenError && error.code === "TOKEN_EXPIRED");
});

test("development compatibility is bounded, development-only, and replay protected", async () => {
  const proof = "simulator-proof-with-minimum-length";
  const verifier = new LimitedDevelopmentAttestationVerifier({
    runtimeEnvironment: "test",
    acceptedProof: proof,
    allowedAppIds: [appId],
    maxVerifications: 2,
  });
  const input = {
    provider: "apple_app_attest" as const,
    appId,
    environment: "development" as const,
    installationId,
    proof,
  };
  assert.equal((await verifier.verify(input)).environment, "development");
  await assert.rejects(verifier.verify(input), AttestationVerificationError);
  assert.throws(() => new LimitedDevelopmentAttestationVerifier({
    runtimeEnvironment: "production",
    acceptedProof: proof,
    allowedAppIds: [appId],
  }), AttestationVerificationError);
});
