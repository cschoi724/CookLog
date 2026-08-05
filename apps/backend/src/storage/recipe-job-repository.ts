import { randomUUID } from "node:crypto";

import { isUuidV4 } from "../http/public-errors.js";
import type {
  RecipeDraft,
  RecipeJobCreateRequest,
  RecipeJobFailure,
  RecipeJobFailureCode,
  RecipeJobState,
  RecipeJobStatus,
  RecipeResultState,
} from "../ai/types.js";

const DAY_MS = 86_400_000;
const DELETE_AFTER_MS = 22 * 60 * 60 * 1_000;

interface StoredJob {
  readonly jobId: string;
  readonly installationId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  state: RecipeJobState;
  stateVersion: number;
  resultState: RecipeResultState;
  resultVersion: number | null;
  acknowledgedResultVersion: number | null;
  updatedAt: number;
  failure: RecipeJobFailure | null;
  executionGeneration: number;
  activeGeneration: number | null;
  providerAttempt: 0 | 1;
  providerStartedAt: number | null;
  providerIdempotencyKey: string | null;
  cleanupPending: boolean;
}

interface ContentRecord {
  readonly input: RecipeJobCreateRequest;
  draft: RecipeDraft | null;
  readonly deleteAfter: number;
  readonly expiresAt: number;
}

interface CreateIdempotencyRecord {
  readonly bodyHash: string;
  readonly jobId: string;
  readonly expiresAt: number;
}

interface AckIdempotencyRecord {
  readonly bodyHash: string;
  readonly resultVersion: number;
}

export type CreateRepositoryResult =
  | { readonly kind: "created"; readonly jobId: string }
  | { readonly kind: "replay"; readonly jobId: string }
  | { readonly kind: "reused" };

export interface WorkerClaim {
  readonly jobId: string;
  readonly executionGeneration: number;
  readonly stateVersion: number;
  readonly input: RecipeJobCreateRequest;
}

export type AcknowledgeResult =
  | { readonly kind: "success"; readonly replayed: boolean }
  | { readonly kind: "not_found" }
  | { readonly kind: "mismatch" }
  | { readonly kind: "reused" }
  | { readonly kind: "delete_failed" };

export class ContentCleanupPendingError extends Error {
  constructor() {
    super("expired content cleanup is pending");
    this.name = "ContentCleanupPendingError";
  }
}

function failureFor(code: RecipeJobFailureCode): RecipeJobFailure {
  return {
    code,
    user_action: code === "SAFETY_REJECTED" ? "review_steps_then_retry" : "retry_manually",
  };
}

export class InMemoryRecipeJobRepository {
  readonly #now: () => number;
  readonly #jobs = new Map<string, StoredJob>();
  readonly #contents = new Map<string, ContentRecord>();
  readonly #createIdempotency = new Map<string, CreateIdempotencyRecord>();
  readonly #ackIdempotency = new Map<string, AckIdempotencyRecord>();
  readonly #workerOutbox: Array<{ readonly jobId: string; readonly executionGeneration: number }> = [];
  readonly #cleanupTasks: Array<{ readonly jobId: string; readonly deleteAfter: number }> = [];
  #contentDeleteCount = 0;
  #contentReadCount = 0;
  #remainingDeleteFailures = 0;

  constructor(options: { readonly now?: () => number } = {}) {
    this.#now = options.now ?? Date.now;
  }

  inspectCreate(installationId: string, idempotencyKey: string, bodyHash: string): CreateRepositoryResult | undefined {
    const key = this.#createKey(installationId, idempotencyKey);
    const record = this.#createIdempotency.get(key);
    if (record === undefined) return undefined;
    if (record.expiresAt <= this.#now()) {
      this.#createIdempotency.delete(key);
      return undefined;
    }
    return record.bodyHash === bodyHash
      ? { kind: "replay", jobId: record.jobId }
      : { kind: "reused" };
  }

  create(
    installationId: string,
    idempotencyKey: string,
    bodyHash: string,
    input: RecipeJobCreateRequest,
  ): CreateRepositoryResult {
    const existing = this.inspectCreate(installationId, idempotencyKey, bodyHash);
    if (existing !== undefined) return existing;
    const now = this.#now();
    const jobId = randomUUID();
    const expiresAt = now + DAY_MS;
    const job: StoredJob = {
      jobId,
      installationId,
      createdAt: now,
      expiresAt,
      state: "queued",
      stateVersion: 1,
      resultState: "none",
      resultVersion: null,
      acknowledgedResultVersion: null,
      updatedAt: now,
      failure: null,
      executionGeneration: 1,
      activeGeneration: null,
      providerAttempt: 0,
      providerStartedAt: null,
      providerIdempotencyKey: null,
      cleanupPending: false,
    };
    this.#jobs.set(jobId, job);
    this.#contents.set(jobId, {
      input: structuredClone(input),
      draft: null,
      deleteAfter: now + DELETE_AFTER_MS,
      expiresAt,
    });
    this.#createIdempotency.set(this.#createKey(installationId, idempotencyKey), {
      bodyHash,
      jobId,
      expiresAt,
    });
    this.#workerOutbox.push({ jobId, executionGeneration: 1 });
    this.#cleanupTasks.push({ jobId, deleteAfter: now + DELETE_AFTER_MS });
    return { kind: "created", jobId };
  }

  claimWorker(jobId: string, executionGeneration = 1): WorkerClaim | undefined {
    const job = this.#jobs.get(jobId);
    if (job === undefined || executionGeneration !== job.executionGeneration || job.providerAttempt !== 0 ||
      job.activeGeneration !== null || (job.state !== "queued" && job.state !== "processing")) return undefined;
    const content = this.#contents.get(jobId);
    if (content === undefined) return undefined;
    if (this.#expireIfDue(job)) return undefined;
    if (job.state === "queued") {
      job.state = "processing";
      job.stateVersion += 1;
      job.updatedAt = this.#now();
    }
    job.activeGeneration = executionGeneration;
    this.#contentReadCount += 1;
    return {
      jobId,
      executionGeneration,
      stateVersion: job.stateVersion,
      input: structuredClone(content.input),
    };
  }

  releaseBeforeProvider(claim: WorkerClaim): boolean {
    const job = this.#jobs.get(claim.jobId);
    if (job === undefined || job.state !== "processing" || job.providerAttempt !== 0 ||
      job.activeGeneration !== claim.executionGeneration) return false;
    job.activeGeneration = null;
    return true;
  }

  beginProvider(claim: WorkerClaim): string | undefined {
    const job = this.#jobs.get(claim.jobId);
    if (job === undefined || job.state !== "processing" || job.stateVersion !== claim.stateVersion ||
      job.providerAttempt !== 0 || job.activeGeneration !== claim.executionGeneration) return undefined;
    const providerIdempotencyKey = randomUUID();
    job.providerAttempt = 1;
    job.providerStartedAt = this.#now();
    job.providerIdempotencyKey = providerIdempotencyKey;
    return providerIdempotencyKey;
  }

  completeSuccess(claim: WorkerClaim, draft: RecipeDraft): boolean {
    const job = this.#activeProviderJob(claim);
    const content = this.#contents.get(claim.jobId);
    if (job === undefined || content === undefined) return false;
    content.draft = structuredClone(draft);
    job.state = "succeeded";
    job.stateVersion += 1;
    job.resultState = "available";
    job.resultVersion = 1;
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    return true;
  }

  completeFailure(jobId: string, code: RecipeJobFailureCode): boolean {
    const job = this.#jobs.get(jobId);
    if (job === undefined || (job.state !== "queued" && job.state !== "processing")) return false;
    job.state = "failed";
    job.stateVersion += 1;
    job.resultState = "none";
    job.resultVersion = null;
    job.failure = failureFor(code);
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    this.#deleteContent(jobId);
    return true;
  }

  getStatus(installationId: string, jobId: string): RecipeJobStatus | undefined {
    const job = this.#jobs.get(jobId);
    if (job === undefined || job.installationId !== installationId) return undefined;
    this.#expireIfDue(job);
    if (job.cleanupPending) throw new ContentCleanupPendingError();
    let result: RecipeDraft | null = null;
    if (job.state === "succeeded" && job.resultState === "available") {
      const content = this.#contents.get(jobId);
      if (content?.draft === null || content === undefined) return undefined;
      this.#contentReadCount += 1;
      result = structuredClone(content.draft);
    }
    return this.#toStatus(job, result);
  }

  acknowledge(
    installationId: string,
    jobId: string,
    idempotencyKey: string,
    bodyHash: string,
    resultVersion: number,
  ): AcknowledgeResult {
    const job = this.#jobs.get(jobId);
    if (job === undefined || job.installationId !== installationId) return { kind: "not_found" };
    this.#expireIfDue(job);
    if (job.cleanupPending) return { kind: "delete_failed" };
    const ackKey = `${installationId}\u0000${jobId}\u0000${idempotencyKey}`;
    const existing = this.#ackIdempotency.get(ackKey);
    if (existing !== undefined) {
      if (existing.bodyHash !== bodyHash) return { kind: "reused" };
      return existing.resultVersion === resultVersion
        ? { kind: "success", replayed: true }
        : { kind: "mismatch" };
    }
    if (job.state !== "succeeded") return { kind: "mismatch" };
    if (job.resultState === "acknowledged_deleted") {
      if (job.acknowledgedResultVersion !== resultVersion) return { kind: "mismatch" };
      this.#ackIdempotency.set(ackKey, { bodyHash, resultVersion });
      return { kind: "success", replayed: true };
    }
    if (job.resultState !== "available" || job.resultVersion !== resultVersion) return { kind: "mismatch" };
    if (!this.#deleteContent(jobId)) return { kind: "delete_failed" };
    job.resultState = "acknowledged_deleted";
    job.acknowledgedResultVersion = resultVersion;
    job.resultVersion = null;
    job.stateVersion += 1;
    job.updatedAt = this.#now();
    this.#ackIdempotency.set(ackKey, { bodyHash, resultVersion });
    return { kind: "success", replayed: false };
  }

  runScheduledCleanup(): number {
    const now = this.#now();
    let deleted = 0;
    for (const task of this.#cleanupTasks) {
      if (task.deleteAfter > now || !this.#contents.has(task.jobId)) continue;
      const job = this.#jobs.get(task.jobId);
      if (this.#deleteContent(task.jobId)) {
        deleted += 1;
        if (job !== undefined && job.resultState !== "acknowledged_deleted" &&
          job.resultState !== "expired_deleted") {
          const wasPending = job.cleanupPending;
          job.state = "expired";
          job.resultState = "expired_deleted";
          job.resultVersion = null;
          job.failure = null;
          job.cleanupPending = false;
          job.stateVersion += 1;
          job.updatedAt = now;
          if (wasPending) job.activeGeneration = null;
        }
      } else if (job !== undefined && now >= job.expiresAt) {
        if (job.state !== "expired") job.stateVersion += 1;
        job.state = "expired";
        job.resultState = "none";
        job.resultVersion = null;
        job.failure = null;
        job.cleanupPending = true;
        job.activeGeneration = null;
        job.updatedAt = now;
      }
    }
    return deleted;
  }

  failNextContentDelete(): void {
    this.#remainingDeleteFailures = Math.max(this.#remainingDeleteFailures, 1);
  }

  failContentDeletes(attempts: number): void {
    if (!Number.isInteger(attempts) || attempts < 1) throw new Error("delete failure count must be positive");
    this.#remainingDeleteFailures = attempts;
  }

  isNewJobBlocked(): boolean {
    const now = this.#now();
    return [...this.#contents.entries()].some(([jobId, content]) =>
      content.expiresAt <= now || this.#jobs.get(jobId)?.cleanupPending === true);
  }

  getExecutionFacts(jobId: string): {
    readonly state: RecipeJobState;
    readonly providerStarted: boolean;
  } | undefined {
    const job = this.#jobs.get(jobId);
    return job === undefined ? undefined : {
      state: job.state,
      providerStarted: job.providerAttempt === 1,
    };
  }

  getStats(): {
    readonly jobs: number;
    readonly contents: number;
    readonly workerOutbox: number;
    readonly cleanupTasks: number;
    readonly contentDeletes: number;
    readonly contentReads: number;
    readonly providerAttempts: number;
    readonly cleanupPending: number;
    readonly newJobsBlocked: boolean;
  } {
    return {
      jobs: this.#jobs.size,
      contents: this.#contents.size,
      workerOutbox: this.#workerOutbox.length,
      cleanupTasks: this.#cleanupTasks.length,
      contentDeletes: this.#contentDeleteCount,
      contentReads: this.#contentReadCount,
      providerAttempts: [...this.#jobs.values()].reduce((sum, job) => sum + job.providerAttempt, 0),
      cleanupPending: [...this.#jobs.values()].filter((job) => job.cleanupPending).length,
      newJobsBlocked: this.isNewJobBlocked(),
    };
  }

  #activeProviderJob(claim: WorkerClaim): StoredJob | undefined {
    const job = this.#jobs.get(claim.jobId);
    return job?.state === "processing" && job.stateVersion === claim.stateVersion &&
      job.providerAttempt === 1 && job.activeGeneration === claim.executionGeneration
      ? job
      : undefined;
  }

  #expireIfDue(job: StoredJob): boolean {
    const now = this.#now();
    if (job.state === "expired" && job.resultState === "expired_deleted") return true;
    if (now < job.expiresAt) return job.state === "expired";
    const wasPending = job.cleanupPending;
    if (job.state !== "expired") job.stateVersion += 1;
    job.state = "expired";
    job.resultState = "none";
    job.resultVersion = null;
    job.failure = null;
    job.cleanupPending = true;
    job.updatedAt = now;
    job.activeGeneration = null;
    if (this.#deleteContent(job.jobId)) {
      job.resultState = "expired_deleted";
      job.cleanupPending = false;
      if (wasPending) job.stateVersion += 1;
    }
    return true;
  }

  #deleteContent(jobId: string): boolean {
    if (!this.#contents.has(jobId)) return true;
    if (this.#remainingDeleteFailures > 0) {
      this.#remainingDeleteFailures -= 1;
      return false;
    }
    this.#contents.delete(jobId);
    this.#contentDeleteCount += 1;
    return true;
  }

  #toStatus(job: StoredJob, result: RecipeDraft | null): RecipeJobStatus {
    const pollAfter = job.state === "queued" || job.state === "processing" ? 2 : null;
    return {
      job_id: job.jobId,
      contract_version: "ai-recipe-job.v1",
      state: job.state,
      state_version: job.stateVersion,
      result_state: job.resultState,
      result_version: job.resultState === "available" ? job.resultVersion : null,
      created_at: new Date(job.createdAt).toISOString(),
      updated_at: new Date(job.updatedAt).toISOString(),
      expires_at: new Date(job.expiresAt).toISOString(),
      poll_after_seconds: pollAfter,
      failure: job.failure === null ? null : { ...job.failure },
      result,
    };
  }

  #createKey(installationId: string, idempotencyKey: string): string {
    if (!isUuidV4(idempotencyKey)) throw new Error("create idempotency key must be UUID v4");
    return `${installationId}\u0000${idempotencyKey}`;
  }
}
