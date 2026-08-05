import { createHash, randomUUID } from "node:crypto";

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
    return { accessToken: token, expiresIn: this.#ttlSeconds, tokenType: "Bearer" };
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

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
