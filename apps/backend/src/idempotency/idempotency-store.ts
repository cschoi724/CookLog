import { randomUUID } from "node:crypto";

import { isUuidV4 } from "../http/public-errors.js";

export interface IdempotencyInput {
  readonly installationId: string;
  readonly method: string;
  readonly canonicalPath: string;
  readonly key: string;
  readonly bodyHash: string;
}

export interface StoredHttpResponse {
  readonly statusCode: number;
  readonly body: unknown;
  readonly requestId: string;
  readonly contentType?: "application/json" | "application/problem+json";
}

export interface IdempotencyOwner {
  readonly kind: "owner";
  readonly ownerToken: string;
}

export type IdempotencyBeginResult =
  | IdempotencyOwner
  | { readonly kind: "invalid_key" }
  | { readonly kind: "reused" }
  | { readonly kind: "in_progress" }
  | { readonly kind: "outcome_unknown" }
  | { readonly kind: "replay"; readonly response: StoredHttpResponse };

type RecordState =
  | { readonly kind: "processing"; readonly ownerToken: string }
  | { readonly kind: "outcome_unknown" }
  | { readonly kind: "completed"; readonly response: StoredHttpResponse };

interface IdempotencyRecord {
  readonly bodyHash: string;
  readonly canonicalPath: string;
  readonly expiresAt: number;
  state: RecordState;
}

export class InMemoryIdempotencyStore {
  readonly #now: () => number;
  readonly #records = new Map<string, IdempotencyRecord>();
  readonly #recordKeyByOwner = new Map<string, string>();
  readonly #ttlMs: number;

  constructor(options: { readonly now?: () => number; readonly ttlMs?: number } = {}) {
    this.#now = options.now ?? Date.now;
    this.#ttlMs = options.ttlMs ?? 86_400_000;
    if (!Number.isInteger(this.#ttlMs) || this.#ttlMs < 86_400_000) {
      throw new Error("idempotency TTL must be at least 24 hours");
    }
  }

  begin(input: IdempotencyInput): IdempotencyBeginResult {
    if (!isUuidV4(input.key)) return { kind: "invalid_key" };
    const recordKey = this.#recordKey(input);
    const now = this.#now();
    let record = this.#records.get(recordKey);
    if (record !== undefined && record.expiresAt <= now) {
      if (record.state.kind === "processing") this.#recordKeyByOwner.delete(record.state.ownerToken);
      this.#records.delete(recordKey);
      record = undefined;
    }
    if (record === undefined) {
      const ownerToken = randomUUID();
      this.#records.set(recordKey, {
        bodyHash: input.bodyHash,
        canonicalPath: input.canonicalPath,
        expiresAt: now + this.#ttlMs,
        state: { kind: "processing", ownerToken },
      });
      this.#recordKeyByOwner.set(ownerToken, recordKey);
      return { kind: "owner", ownerToken };
    }
    if (record.canonicalPath !== input.canonicalPath || record.bodyHash !== input.bodyHash) {
      return { kind: "reused" };
    }
    if (record.state.kind === "processing") return { kind: "in_progress" };
    if (record.state.kind === "outcome_unknown") return { kind: "outcome_unknown" };
    return { kind: "replay", response: structuredClone(record.state.response) };
  }

  complete(owner: IdempotencyOwner, response: StoredHttpResponse): void {
    if (!isUuidV4(response.requestId)) throw new Error("stored idempotency response requires a request UUID");
    const record = this.#ownedRecord(owner);
    record.state = { kind: "completed", response: structuredClone(response) };
    this.#recordKeyByOwner.delete(owner.ownerToken);
  }

  markOutcomeUnknown(owner: IdempotencyOwner): void {
    const record = this.#ownedRecord(owner);
    record.state = { kind: "outcome_unknown" };
    this.#recordKeyByOwner.delete(owner.ownerToken);
  }

  #ownedRecord(owner: IdempotencyOwner): IdempotencyRecord {
    const recordKey = this.#recordKeyByOwner.get(owner.ownerToken);
    const record = recordKey === undefined ? undefined : this.#records.get(recordKey);
    if (record === undefined || record.state.kind !== "processing" || record.state.ownerToken !== owner.ownerToken) {
      throw new Error("idempotency owner is no longer active");
    }
    return record;
  }

  #recordKey(input: IdempotencyInput): string {
    return `${input.installationId}\u0000${input.method.toUpperCase()}\u0000${input.key}`;
  }
}
