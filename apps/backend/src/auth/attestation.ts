import { createHash } from "node:crypto";

import type { RuntimeEnvironment } from "../config/runtime-config.js";

export type AttestationProvider = "apple_app_attest" | "firebase_app_check";

export interface AttestationInput {
  readonly provider: AttestationProvider;
  readonly appId: string;
  readonly environment: "development" | "production";
  readonly installationId: string;
  readonly proof: string;
}

export interface VerifiedAttestation {
  readonly provider: AttestationProvider;
  readonly appId: string;
  readonly environment: "production";
  readonly installationId: string;
  readonly replayProtected: true;
  readonly verifiedAt: Date;
}

export interface AttestationVerifier {
  verify(input: AttestationInput): Promise<VerifiedAttestation>;
}

export class AttestationVerificationError extends Error {
  constructor(readonly code: "ATTESTATION_INVALID" | "ATTESTATION_REPLAYED") {
    super(code === "ATTESTATION_REPLAYED" ? "attestation replay rejected" : "attestation rejected");
    this.name = "AttestationVerificationError";
  }
}

export class LocalAttestationVerifier implements AttestationVerifier {
  readonly #acceptedProofHash: string;
  readonly #allowedAppIds: ReadonlySet<string>;
  readonly #consumedProofHashes = new Set<string>();
  readonly #now: () => Date;

  constructor(options: {
    readonly runtimeEnvironment: RuntimeEnvironment;
    readonly acceptedProof: string;
    readonly allowedAppIds: readonly string[];
    readonly now?: () => Date;
  }) {
    if (options.runtimeEnvironment === "production") {
      throw new AttestationVerificationError("ATTESTATION_INVALID");
    }
    this.#acceptedProofHash = hash(options.acceptedProof);
    this.#allowedAppIds = new Set(options.allowedAppIds);
    this.#now = options.now ?? (() => new Date());
  }

  async verify(input: AttestationInput): Promise<VerifiedAttestation> {
    const proofHash = hash(input.proof);
    if (
      proofHash !== this.#acceptedProofHash ||
      !this.#allowedAppIds.has(input.appId) ||
      input.environment !== "production"
    ) {
      throw new AttestationVerificationError("ATTESTATION_INVALID");
    }
    if (this.#consumedProofHashes.has(proofHash)) {
      throw new AttestationVerificationError("ATTESTATION_REPLAYED");
    }
    this.#consumedProofHashes.add(proofHash);

    return {
      provider: input.provider,
      appId: input.appId,
      environment: "production",
      installationId: input.installationId,
      replayProtected: true,
      verifiedAt: this.#now(),
    };
  }
}

function hash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
