import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import type { VerifiedAttestation } from "./attestation.js";

export interface InstallationTokenClaims {
  readonly iss: "https://api.cooklog.app";
  readonly aud: "cooklog-api";
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
  readonly jti: string;
  readonly appId: string;
  readonly attestationProvider: VerifiedAttestation["provider"];
}

export interface IssuedInstallationToken {
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly tokenType: "Bearer";
  readonly installationId: string;
  readonly attestationProvider: VerifiedAttestation["provider"];
}

export interface InstallationTokenGrant {
  readonly installationId: string;
  readonly appId: string;
  readonly attestationProvider: VerifiedAttestation["provider"];
  readonly issuedAtSeconds: number;
  readonly expiresAtSeconds: number;
  readonly jti: string;
}

export interface InstallationTokenIssuer {
  issueGrant(grant: InstallationTokenGrant): IssuedInstallationToken;
  revokeInstallation(installationId: string): void;
}

export interface InstallationTokenService {
  verify(accessToken: string): Promise<InstallationTokenClaims>;
}

export class InstallationTokenError extends Error {
  constructor(readonly code: "AUTH_REQUIRED" | "TOKEN_EXPIRED" | "INSTALLATION_REVOKED") {
    super(code === "TOKEN_EXPIRED" ? "installation token expired" : "installation token rejected");
    this.name = "InstallationTokenError";
  }
}

export class LocalInstallationTokenService implements InstallationTokenService {
  readonly #claimsByTokenHash = new Map<string, InstallationTokenClaims>();
  readonly #nowSeconds: () => number;
  readonly #revokedInstallations = new Set<string>();
  readonly #ttlSeconds: number;

  constructor(options: { readonly ttlSeconds?: number; readonly nowSeconds?: () => number } = {}) {
    this.#ttlSeconds = options.ttlSeconds ?? 900;
    if (!Number.isInteger(this.#ttlSeconds) || this.#ttlSeconds < 1 || this.#ttlSeconds > 900) {
      throw new Error("local installation token TTL must be between 1 and 900 seconds");
    }
    this.#nowSeconds = options.nowSeconds ?? (() => Math.floor(Date.now() / 1_000));
  }

  issue(attestation: VerifiedAttestation): IssuedInstallationToken {
    const now = this.#nowSeconds();
    const token = `${randomUUID()}${randomUUID()}`;
    const claims: InstallationTokenClaims = {
      iss: "https://api.cooklog.app",
      aud: "cooklog-api",
      sub: attestation.installationId,
      iat: now,
      exp: now + this.#ttlSeconds,
      jti: randomUUID(),
      appId: attestation.appId,
      attestationProvider: attestation.provider,
    };
    this.#claimsByTokenHash.set(hashToken(token), claims);
    return {
      accessToken: token,
      expiresIn: this.#ttlSeconds,
      tokenType: "Bearer",
      installationId: attestation.installationId,
      attestationProvider: attestation.provider,
    };
  }

  revokeInstallation(installationId: string): void {
    this.#revokedInstallations.add(installationId);
  }

  async verify(accessToken: string): Promise<InstallationTokenClaims> {
    const claims = this.#claimsByTokenHash.get(hashToken(accessToken));
    if (claims === undefined) throw new InstallationTokenError("AUTH_REQUIRED");
    if (claims.exp <= this.#nowSeconds()) throw new InstallationTokenError("TOKEN_EXPIRED");
    if (this.#revokedInstallations.has(claims.sub)) {
      throw new InstallationTokenError("INSTALLATION_REVOKED");
    }
    return claims;
  }
}

export interface InstallationSigningKey {
  readonly keyId: string;
  readonly secret: string;
}

export class SignedInstallationTokenService implements InstallationTokenService, InstallationTokenIssuer {
  readonly #nowSeconds: () => number;
  readonly #clockSkewSeconds: number;
  #activeKey: InstallationSigningKey;
  #previousKey: InstallationSigningKey | undefined;
  readonly #revokedInstallations = new Set<string>();
  readonly #revokedJtis = new Set<string>();

  constructor(options: {
    readonly activeKey: InstallationSigningKey;
    readonly previousKey?: InstallationSigningKey;
    readonly nowSeconds?: () => number;
    readonly clockSkewSeconds?: number;
  }) {
    validateSigningKey(options.activeKey);
    if (options.previousKey !== undefined) {
      validateSigningKey(options.previousKey);
      if (options.previousKey.keyId === options.activeKey.keyId) {
        throw new Error("installation signing key IDs must be unique");
      }
    }
    this.#activeKey = options.activeKey;
    this.#previousKey = options.previousKey;
    this.#nowSeconds = options.nowSeconds ?? (() => Math.floor(Date.now() / 1_000));
    this.#clockSkewSeconds = options.clockSkewSeconds ?? 30;
    if (!Number.isInteger(this.#clockSkewSeconds) || this.#clockSkewSeconds < 0 ||
      this.#clockSkewSeconds > 60) {
      throw new Error("installation token clock skew must be between 0 and 60 seconds");
    }
  }

  issueGrant(grant: InstallationTokenGrant): IssuedInstallationToken {
    validateGrant(grant);
    const header = encodeJson({ alg: "HS256", typ: "JWT", kid: this.#activeKey.keyId });
    const payload = encodeJson({
      iss: "https://api.cooklog.app",
      aud: "cooklog-api",
      sub: grant.installationId,
      iat: grant.issuedAtSeconds,
      exp: grant.expiresAtSeconds,
      jti: grant.jti,
      app_id: grant.appId,
      attestation_provider: grant.attestationProvider,
    });
    const unsigned = `${header}.${payload}`;
    const signature = createHmac("sha256", this.#activeKey.secret).update(unsigned).digest("base64url");
    return {
      accessToken: `${unsigned}.${signature}`,
      expiresIn: grant.expiresAtSeconds - grant.issuedAtSeconds,
      tokenType: "Bearer",
      installationId: grant.installationId,
      attestationProvider: grant.attestationProvider,
    };
  }

  async verify(accessToken: string): Promise<InstallationTokenClaims> {
    const parts = accessToken.split(".");
    if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
      throw new InstallationTokenError("AUTH_REQUIRED");
    }
    const [encodedHeader, encodedPayload, suppliedSignature] = parts as [string, string, string];
    const header = decodeJson(encodedHeader);
    if (!isRecord(header) || header.alg !== "HS256" || header.typ !== "JWT" ||
      typeof header.kid !== "string") {
      throw new InstallationTokenError("AUTH_REQUIRED");
    }
    const key = [this.#activeKey, this.#previousKey].find((candidate) => candidate?.keyId === header.kid);
    if (key === undefined) throw new InstallationTokenError("AUTH_REQUIRED");
    const expectedSignature = createHmac("sha256", key.secret)
      .update(`${encodedHeader}.${encodedPayload}`).digest();
    let supplied: Buffer;
    try {
      supplied = Buffer.from(suppliedSignature, "base64url");
    } catch {
      throw new InstallationTokenError("AUTH_REQUIRED");
    }
    if (supplied.length !== expectedSignature.length || !timingSafeEqual(supplied, expectedSignature)) {
      throw new InstallationTokenError("AUTH_REQUIRED");
    }
    const payload = decodeJson(encodedPayload);
    const claims = readClaims(payload);
    const now = this.#readNow();
    if (claims.iat > now + this.#clockSkewSeconds || claims.exp <= now ||
      claims.exp - claims.iat < 60 || claims.exp - claims.iat > 900) {
      throw new InstallationTokenError(claims.exp <= now ? "TOKEN_EXPIRED" : "AUTH_REQUIRED");
    }
    if (this.#revokedInstallations.has(claims.sub) || this.#revokedJtis.has(claims.jti)) {
      throw new InstallationTokenError("INSTALLATION_REVOKED");
    }
    return claims;
  }

  rotate(nextKey: InstallationSigningKey): void {
    validateSigningKey(nextKey);
    if (nextKey.keyId === this.#activeKey.keyId) throw new Error("new signing key ID must change");
    this.#previousKey = this.#activeKey;
    this.#activeKey = nextKey;
  }

  revokeInstallation(installationId: string): void {
    this.#revokedInstallations.add(installationId);
  }

  revokeJti(jti: string): void {
    this.#revokedJtis.add(jti);
  }

  #readNow(): number {
    const now = this.#nowSeconds();
    if (!Number.isSafeInteger(now) || now < 0) throw new InstallationTokenError("AUTH_REQUIRED");
    return now;
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function validateSigningKey(key: InstallationSigningKey): void {
  if (!/^[A-Za-z0-9_-]{1,64}$/u.test(key.keyId) || Buffer.byteLength(key.secret, "utf8") < 32) {
    throw new Error("installation signing key is invalid");
  }
}

function validateGrant(grant: InstallationTokenGrant): void {
  if (!Number.isSafeInteger(grant.issuedAtSeconds) || !Number.isSafeInteger(grant.expiresAtSeconds) ||
    grant.issuedAtSeconds < 0 || grant.expiresAtSeconds - grant.issuedAtSeconds < 60 ||
    grant.expiresAtSeconds - grant.issuedAtSeconds > 900 || !uuidV4(grant.installationId) ||
    !uuidV4(grant.jti) || grant.appId.length === 0) {
    throw new Error("installation token grant is invalid");
  }
}

function uuidV4(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value);
}

function encodeJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decodeJson(value: string): unknown {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;
  } catch {
    throw new InstallationTokenError("AUTH_REQUIRED");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readClaims(value: unknown): InstallationTokenClaims {
  if (!isRecord(value) || value.iss !== "https://api.cooklog.app" || value.aud !== "cooklog-api" ||
    typeof value.sub !== "string" || typeof value.iat !== "number" || typeof value.exp !== "number" ||
    typeof value.jti !== "string" || typeof value.app_id !== "string" ||
    (value.attestation_provider !== "apple_app_attest" &&
      value.attestation_provider !== "firebase_app_check") ||
    !Number.isSafeInteger(value.iat) || !Number.isSafeInteger(value.exp)) {
    throw new InstallationTokenError("AUTH_REQUIRED");
  }
  return {
    iss: value.iss,
    aud: value.aud,
    sub: value.sub,
    iat: value.iat,
    exp: value.exp,
    jti: value.jti,
    appId: value.app_id,
    attestationProvider: value.attestation_provider,
  };
}
