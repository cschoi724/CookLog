import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

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
const CRITICAL_AFTER_MS = 23 * 60 * 60 * 1_000;

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
  pendingTerminal: PendingTerminal | null;
  cleanupPending: boolean;
}

type PendingTerminal =
  | { readonly nextState: "succeeded" }
  | { readonly nextState: "failed"; readonly failureCode: RecipeJobFailureCode };

export interface PendingTerminalFacts {
  readonly previousState: "processing";
  readonly nextState: "succeeded" | "failed";
  readonly providerAttemptCount: 1;
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

interface RepositoryState {
  readonly jobs: Map<string, StoredJob>;
  readonly contents: Map<string, ContentRecord>;
  readonly createIdempotency: Map<string, CreateIdempotencyRecord>;
  readonly ackIdempotency: Map<string, AckIdempotencyRecord>;
  readonly workerOutbox: Array<{ readonly jobId: string; readonly executionGeneration: number }>;
  readonly cleanupTasks: Array<{ readonly jobId: string; readonly deleteAfter: number }>;
  readonly publishedTasks: Set<string>;
  contentDeleteCount: number;
  contentReadCount: number;
  remainingDeleteFailures: number;
}

interface SerializedRepositoryState {
  readonly schema: "cooklog.recipe-job-state.v1";
  readonly jobs: readonly (readonly [string, StoredJob])[];
  readonly contents: readonly (readonly [string, ContentRecord])[];
  readonly createIdempotency: readonly (readonly [string, CreateIdempotencyRecord])[];
  readonly ackIdempotency: readonly (readonly [string, AckIdempotencyRecord])[];
  readonly workerOutbox: RepositoryState["workerOutbox"];
  readonly cleanupTasks: RepositoryState["cleanupTasks"];
  readonly publishedTasks: readonly string[];
  readonly contentDeleteCount: number;
  readonly contentReadCount: number;
  readonly remainingDeleteFailures: number;
}

function createRepositoryState(): RepositoryState {
  return {
    jobs: new Map(),
    contents: new Map(),
    createIdempotency: new Map(),
    ackIdempotency: new Map(),
    workerOutbox: [],
    cleanupTasks: [],
    publishedTasks: new Set(),
    contentDeleteCount: 0,
    contentReadCount: 0,
    remainingDeleteFailures: 0,
  };
}

function serializeRepositoryState(state: RepositoryState): SerializedRepositoryState {
  return {
    schema: "cooklog.recipe-job-state.v1",
    jobs: [...state.jobs.entries()],
    contents: [...state.contents.entries()],
    createIdempotency: [...state.createIdempotency.entries()],
    ackIdempotency: [...state.ackIdempotency.entries()],
    workerOutbox: state.workerOutbox,
    cleanupTasks: state.cleanupTasks,
    publishedTasks: [...state.publishedTasks],
    contentDeleteCount: state.contentDeleteCount,
    contentReadCount: state.contentReadCount,
    remainingDeleteFailures: state.remainingDeleteFailures,
  };
}

function deserializeRepositoryState(value: unknown): RepositoryState {
  if (typeof value !== "object" || value === null ||
    (value as { schema?: unknown }).schema !== "cooklog.recipe-job-state.v1") {
    throw new Error("durable recipe job state schema is invalid");
  }
  const stored = value as SerializedRepositoryState;
  const collections = [stored.jobs, stored.contents, stored.createIdempotency,
    stored.ackIdempotency, stored.workerOutbox, stored.cleanupTasks, stored.publishedTasks];
  const counters = [stored.contentDeleteCount, stored.contentReadCount, stored.remainingDeleteFailures];
  if (collections.some((collection) => !Array.isArray(collection)) ||
    counters.some((counter) => !Number.isSafeInteger(counter) || counter < 0)) {
    throw new Error("durable recipe job state payload is invalid");
  }
  return {
    jobs: new Map(stored.jobs),
    contents: new Map(stored.contents),
    createIdempotency: new Map(stored.createIdempotency),
    ackIdempotency: new Map(stored.ackIdempotency),
    workerOutbox: [...stored.workerOutbox],
    cleanupTasks: [...stored.cleanupTasks],
    publishedTasks: new Set(stored.publishedTasks),
    contentDeleteCount: stored.contentDeleteCount,
    contentReadCount: stored.contentReadCount,
    remainingDeleteFailures: stored.remainingDeleteFailures,
  };
}

function replaceRepositoryState(target: RepositoryState, source: RepositoryState): void {
  const replaceMap = <K, V>(targetMap: Map<K, V>, sourceMap: Map<K, V>): void => {
    targetMap.clear();
    for (const [key, value] of sourceMap) targetMap.set(key, value);
  };
  replaceMap(target.jobs, source.jobs);
  replaceMap(target.contents, source.contents);
  replaceMap(target.createIdempotency, source.createIdempotency);
  replaceMap(target.ackIdempotency, source.ackIdempotency);
  target.workerOutbox.splice(0, target.workerOutbox.length, ...source.workerOutbox);
  target.cleanupTasks.splice(0, target.cleanupTasks.length, ...source.cleanupTasks);
  target.publishedTasks.clear();
  for (const task of source.publishedTasks) target.publishedTasks.add(task);
  target.contentDeleteCount = source.contentDeleteCount;
  target.contentReadCount = source.contentReadCount;
  target.remainingDeleteFailures = source.remainingDeleteFailures;
}

export const COOKLOG_CLOUD_REGION = "asia-northeast3" as const;

export class FirestoreRecipeJobDatastoreContractAdapter {
  readonly region: typeof COOKLOG_CLOUD_REGION;
  readonly mode: "local-emulator-contract" | "durable-local-emulator-contract";
  readonly #durableFilePath: string | undefined;
  #ephemeralState = createRepositoryState();
  #transactionDepth = 0;
  #transactionDirty = false;

  constructor(options: {
    readonly region: typeof COOKLOG_CLOUD_REGION;
    readonly durableFilePath?: string;
  }) {
    if (options.region !== COOKLOG_CLOUD_REGION) throw new Error("Firestore region must be asia-northeast3");
    if (options.durableFilePath !== undefined && options.durableFilePath.length === 0) {
      throw new Error("durable datastore path must not be empty");
    }
    this.region = options.region;
    this.#durableFilePath = options.durableFilePath;
    this.mode = options.durableFilePath === undefined
      ? "local-emulator-contract"
      : "durable-local-emulator-contract";
  }

  openState(): RepositoryState {
    if (this.#durableFilePath === undefined) return this.#ephemeralState;
    try {
      return deserializeRepositoryState(JSON.parse(readFileSync(this.#durableFilePath, "utf8")) as unknown);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return createRepositoryState();
      throw error;
    }
  }

  commitState(state: RepositoryState): void {
    if (this.#durableFilePath === undefined) {
      this.#ephemeralState = state;
      return;
    }
    if (this.#transactionDepth === 0) {
      throw new Error("durable datastore mutation requires a transaction");
    }
    this.#transactionDirty = true;
  }

  runTransaction<T>(state: RepositoryState, operation: () => T): T {
    if (this.#durableFilePath === undefined) return operation();
    if (this.#transactionDepth > 0) {
      this.#transactionDepth += 1;
      try {
        return operation();
      } finally {
        this.#transactionDepth -= 1;
      }
    }
    const lockPath = `${this.#durableFilePath}.transaction-lock`;
    this.#acquireLock(lockPath);
    this.#transactionDepth = 1;
    this.#transactionDirty = false;
    try {
      replaceRepositoryState(state, this.openState());
      const result = operation();
      if (this.#transactionDirty) this.#writeDurableState(state);
      return result;
    } catch (error) {
      if (this.#transactionDirty) {
        this.#writeDurableState(state);
      } else {
        replaceRepositoryState(state, this.openState());
      }
      throw error;
    } finally {
      this.#transactionDepth = 0;
      this.#transactionDirty = false;
      rmSync(lockPath, { recursive: true, force: true });
    }
  }

  #writeDurableState(state: RepositoryState): void {
    if (this.#durableFilePath === undefined) throw new Error("durable datastore path is missing");
    mkdirSync(dirname(this.#durableFilePath), { recursive: true });
    const temporaryPath = `${this.#durableFilePath}.${process.pid}.${randomUUID()}.tmp`;
    writeFileSync(temporaryPath, `${JSON.stringify(serializeRepositoryState(state))}\n`, {
      encoding: "utf8",
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temporaryPath, this.#durableFilePath);
  }

  #acquireLock(lockPath: string): void {
    if (this.#durableFilePath === undefined) return;
    mkdirSync(dirname(this.#durableFilePath), { recursive: true });
    const deadline = Date.now() + 5_000;
    const waitCell = new Int32Array(new SharedArrayBuffer(4));
    while (true) {
      try {
        mkdirSync(lockPath, { mode: 0o700 });
        return;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      }
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > 30_000) {
          rmSync(lockPath, { recursive: true, force: true });
          continue;
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
      if (Date.now() >= deadline) throw new Error("durable datastore transaction lock timeout");
      Atomics.wait(waitCell, 0, 0, 10);
    }
  }
}

export type RecipeQueueTask =
  | { readonly kind: "recipe-worker"; readonly jobId: string; readonly executionGeneration: number }
  | { readonly kind: "recipe-content-cleanup"; readonly jobId: string; readonly scheduledAt: number };

export interface RecipeTaskQueueAdapter {
  readonly region: typeof COOKLOG_CLOUD_REGION;
  enqueue(task: RecipeQueueTask): "enqueued" | "duplicate";
}

export class LocalCloudTasksContractAdapter implements RecipeTaskQueueAdapter {
  readonly region: typeof COOKLOG_CLOUD_REGION;
  readonly #tasks = new Map<string, RecipeQueueTask>();
  #remainingFailures = 0;

  constructor(options: { readonly region: typeof COOKLOG_CLOUD_REGION }) {
    if (options.region !== COOKLOG_CLOUD_REGION) throw new Error("Cloud Tasks region must be asia-northeast3");
    this.region = options.region;
  }

  enqueue(task: RecipeQueueTask): "enqueued" | "duplicate" {
    if (this.#remainingFailures > 0) {
      this.#remainingFailures -= 1;
      throw new Error("synthetic Cloud Tasks outage");
    }
    const key = task.kind === "recipe-worker"
      ? `${task.kind}:${task.jobId}:${task.executionGeneration}`
      : `${task.kind}:${task.jobId}:${task.scheduledAt}`;
    if (this.#tasks.has(key)) return "duplicate";
    this.#tasks.set(key, structuredClone(task));
    return "enqueued";
  }

  failNextEnqueues(count = 1): void {
    if (!Number.isInteger(count) || count < 1) throw new Error("queue failure count must be positive");
    this.#remainingFailures = count;
  }

  listTasks(): readonly RecipeQueueTask[] {
    return [...this.#tasks.values()].map((task) => structuredClone(task));
  }
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

export interface RecipeJobRepository {
  inspectCreate(installationId: string, idempotencyKey: string, bodyHash: string): CreateRepositoryResult | undefined;
  create(installationId: string, idempotencyKey: string, bodyHash: string,
    input: RecipeJobCreateRequest): CreateRepositoryResult;
  claimWorker(jobId: string, executionGeneration?: number): WorkerClaim | undefined;
  releaseBeforeProvider(claim: WorkerClaim): boolean;
  beginProvider(claim: WorkerClaim): string | undefined;
  stageSuccess(claim: WorkerClaim, draft: RecipeDraft): boolean;
  stageFailure(jobId: string, code: RecipeJobFailureCode): boolean;
  getPendingTerminalFacts(jobId: string): PendingTerminalFacts | undefined;
  finalizePendingTerminal(jobId: string): boolean;
  completeFailure(jobId: string, code: RecipeJobFailureCode): boolean;
  getStatus(installationId: string, jobId: string): RecipeJobStatus | undefined;
  acknowledge(installationId: string, jobId: string, idempotencyKey: string,
    bodyHash: string, resultVersion: number): AcknowledgeResult;
  runScheduledCleanup(): number;
  isNewJobBlocked(): boolean;
  getExecutionFacts(jobId: string): { readonly state: RecipeJobState; readonly providerStarted: boolean } | undefined;
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

export class InMemoryRecipeJobRepository implements RecipeJobRepository {
  readonly #now: () => number;
  readonly #commit: () => void;
  readonly #datastore: FirestoreRecipeJobDatastoreContractAdapter | undefined;
  readonly #state: RepositoryState;
  readonly #jobs: Map<string, StoredJob>;
  readonly #contents: Map<string, ContentRecord>;
  readonly #createIdempotency: Map<string, CreateIdempotencyRecord>;
  readonly #ackIdempotency: Map<string, AckIdempotencyRecord>;
  readonly #workerOutbox: Array<{ readonly jobId: string; readonly executionGeneration: number }>;
  readonly #cleanupTasks: Array<{ readonly jobId: string; readonly deleteAfter: number }>;

  constructor(options: {
    readonly now?: () => number;
    readonly datastore?: FirestoreRecipeJobDatastoreContractAdapter;
  } = {}) {
    const clock = options.now ?? Date.now;
    this.#now = () => {
      const now = clock();
      if (!Number.isSafeInteger(now) || now < 0) throw new Error("repository time must be a safe epoch");
      return now;
    };
    this.#state = options.datastore?.openState() ?? createRepositoryState();
    this.#datastore = options.datastore;
    this.#commit = () => options.datastore?.commitState(this.#state);
    this.#jobs = this.#state.jobs;
    this.#contents = this.#state.contents;
    this.#createIdempotency = this.#state.createIdempotency;
    this.#ackIdempotency = this.#state.ackIdempotency;
    this.#workerOutbox = this.#state.workerOutbox;
    this.#cleanupTasks = this.#state.cleanupTasks;
  }

  inspectCreate(installationId: string, idempotencyKey: string, bodyHash: string): CreateRepositoryResult | undefined {
    const key = this.#createKey(installationId, idempotencyKey);
    const record = this.#createIdempotency.get(key);
    if (record === undefined) return undefined;
    if (record.expiresAt <= this.#now()) {
      this.#createIdempotency.delete(key);
      this.#commit();
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
      pendingTerminal: null,
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
    this.#commit();
    return { kind: "created", jobId };
  }

  claimWorker(jobId: string, executionGeneration = 1): WorkerClaim | undefined {
    const job = this.#jobs.get(jobId);
    if (job === undefined || executionGeneration !== job.executionGeneration || job.providerAttempt !== 0 ||
      job.activeGeneration !== null || (job.state !== "queued" && job.state !== "processing")) return undefined;
    const content = this.#contents.get(jobId);
    if (content === undefined) return undefined;
    if (this.#expireIfDue(job)) {
      this.#commit();
      return undefined;
    }
    if (job.state === "queued") {
      job.state = "processing";
      job.stateVersion += 1;
      job.updatedAt = this.#now();
    }
    job.activeGeneration = executionGeneration;
    this.#state.contentReadCount += 1;
    this.#commit();
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
    this.#commit();
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
    this.#commit();
    return providerIdempotencyKey;
  }

  stageSuccess(claim: WorkerClaim, draft: RecipeDraft): boolean {
    const job = this.#activeProviderJob(claim);
    const content = this.#contents.get(claim.jobId);
    if (job === undefined || content === undefined) return false;
    content.draft = structuredClone(draft);
    job.pendingTerminal = { nextState: "succeeded" };
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    this.#commit();
    return true;
  }

  stageFailure(jobId: string, code: RecipeJobFailureCode): boolean {
    const job = this.#jobs.get(jobId);
    if (job === undefined || job.state !== "processing" || job.providerAttempt !== 1 ||
      job.pendingTerminal !== null) return false;
    job.pendingTerminal = { nextState: "failed", failureCode: code };
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    this.#commit();
    return true;
  }

  getPendingTerminalFacts(jobId: string): PendingTerminalFacts | undefined {
    const job = this.#jobs.get(jobId);
    if (job?.state !== "processing" || job.providerAttempt !== 1 || job.pendingTerminal === null) {
      return undefined;
    }
    return Object.freeze({
      previousState: "processing",
      nextState: job.pendingTerminal.nextState,
      providerAttemptCount: 1,
    });
  }

  finalizePendingTerminal(jobId: string): boolean {
    const job = this.#jobs.get(jobId);
    if (job?.state !== "processing" || job.providerAttempt !== 1 || job.pendingTerminal === null) {
      return false;
    }
    const pending = job.pendingTerminal;
    if (pending.nextState === "succeeded") {
      const content = this.#contents.get(jobId);
      if (content?.draft == null) return false;
      job.state = "succeeded";
      job.resultState = "available";
      job.resultVersion = 1;
      job.failure = null;
    } else {
      job.state = "failed";
      job.resultState = "none";
      job.resultVersion = null;
      job.failure = failureFor(pending.failureCode);
      this.#deleteContent(jobId);
    }
    job.pendingTerminal = null;
    job.stateVersion += 1;
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    this.#commit();
    return true;
  }

  completeFailure(jobId: string, code: RecipeJobFailureCode): boolean {
    const job = this.#jobs.get(jobId);
    if (job === undefined || (job.state !== "queued" && job.state !== "processing")) return false;
    if (job.pendingTerminal !== null) return false;
    job.state = "failed";
    job.stateVersion += 1;
    job.resultState = "none";
    job.resultVersion = null;
    job.failure = failureFor(code);
    job.pendingTerminal = null;
    job.updatedAt = this.#now();
    job.activeGeneration = null;
    this.#deleteContent(jobId);
    this.#commit();
    return true;
  }

  getStatus(installationId: string, jobId: string): RecipeJobStatus | undefined {
    const job = this.#jobs.get(jobId);
    if (job === undefined || job.installationId !== installationId) return undefined;
    this.#expireIfDue(job);
    this.#commit();
    if (job.cleanupPending) throw new ContentCleanupPendingError();
    let result: RecipeDraft | null = null;
    if (job.state === "succeeded" && job.resultState === "available") {
      const content = this.#contents.get(jobId);
      if (content?.draft === null || content === undefined) return undefined;
      this.#state.contentReadCount += 1;
      result = structuredClone(content.draft);
    }
    this.#commit();
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
    this.#commit();
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
      this.#commit();
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
    this.#commit();
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
    this.#commit();
    return deleted;
  }

  publishPendingTasks(queue: RecipeTaskQueueAdapter): number {
    if (queue.region !== COOKLOG_CLOUD_REGION) throw new Error("task queue region mismatch");
    let published = 0;
    for (const task of this.#workerOutbox) {
      const key = `recipe-worker:${task.jobId}:${task.executionGeneration}`;
      if (this.#state.publishedTasks.has(key)) continue;
      queue.enqueue({ kind: "recipe-worker", jobId: task.jobId,
        executionGeneration: task.executionGeneration });
      this.#state.publishedTasks.add(key);
      this.#commit();
      published += 1;
    }
    for (const task of this.#cleanupTasks) {
      const key = `recipe-content-cleanup:${task.jobId}:${task.deleteAfter}`;
      if (this.#state.publishedTasks.has(key)) continue;
      queue.enqueue({ kind: "recipe-content-cleanup", jobId: task.jobId,
        scheduledAt: task.deleteAfter });
      this.#state.publishedTasks.add(key);
      this.#commit();
      published += 1;
    }
    return published;
  }

  getCleanupHealth(): {
    readonly warning: number;
    readonly critical: number;
    readonly incident: number;
    readonly expired: number;
  } {
    const now = this.#now();
    let warning = 0;
    let critical = 0;
    let incident = 0;
    let expired = 0;
    for (const content of this.#contents.values()) {
      const age = DAY_MS - (content.expiresAt - now);
      if (age >= 22.5 * 60 * 60 * 1_000) warning += 1;
      if (age >= 23 * 60 * 60 * 1_000) critical += 1;
      if (age >= 23.5 * 60 * 60 * 1_000) incident += 1;
      if (now >= content.expiresAt) expired += 1;
    }
    return { warning, critical, incident, expired };
  }

  failNextContentDelete(): void {
    this.#state.remainingDeleteFailures = Math.max(this.#state.remainingDeleteFailures, 1);
    this.#commit();
  }

  failContentDeletes(attempts: number): void {
    if (!Number.isInteger(attempts) || attempts < 1) throw new Error("delete failure count must be positive");
    this.#state.remainingDeleteFailures = attempts;
    this.#commit();
  }

  isNewJobBlocked(): boolean {
    const now = this.#now();
    return [...this.#contents.entries()].some(([jobId, content]) =>
      content.expiresAt - DAY_MS + CRITICAL_AFTER_MS <= now ||
      this.#jobs.get(jobId)?.cleanupPending === true);
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
    let newJobsBlocked = true;
    try {
      newJobsBlocked = this.isNewJobBlocked();
    } catch {
      // Invalid server time must keep admission closed without breaking safe counters.
    }
    return {
      jobs: this.#jobs.size,
      contents: this.#contents.size,
      workerOutbox: this.#workerOutbox.length,
      cleanupTasks: this.#cleanupTasks.length,
      contentDeletes: this.#state.contentDeleteCount,
      contentReads: this.#state.contentReadCount,
      providerAttempts: [...this.#jobs.values()].reduce((sum, job) => sum + job.providerAttempt, 0),
      cleanupPending: [...this.#jobs.values()].filter((job) => job.cleanupPending).length,
      newJobsBlocked,
    };
  }

  getDurabilityFacts(): {
    readonly workerOutbox: number;
    readonly cleanupTasks: number;
    readonly publishedTasks: number;
  } {
    return {
      workerOutbox: this.#workerOutbox.length,
      cleanupTasks: this.#cleanupTasks.length,
      publishedTasks: this.#state.publishedTasks.size,
    };
  }

  protected runInDatastoreTransaction<T>(operation: () => T): T {
    if (this.#datastore === undefined) return operation();
    return this.#datastore.runTransaction(this.#state, operation);
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
    if (this.#state.remainingDeleteFailures > 0) {
      this.#state.remainingDeleteFailures -= 1;
      return false;
    }
    this.#contents.delete(jobId);
    this.#state.contentDeleteCount += 1;
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

export class CloudRecipeJobRepository extends InMemoryRecipeJobRepository {
  readonly region = COOKLOG_CLOUD_REGION;
  readonly #queue: RecipeTaskQueueAdapter;

  constructor(options: {
    readonly datastore: FirestoreRecipeJobDatastoreContractAdapter;
    readonly queue: RecipeTaskQueueAdapter;
    readonly now?: () => number;
  }) {
    if (options.datastore.region !== COOKLOG_CLOUD_REGION || options.queue.region !== COOKLOG_CLOUD_REGION) {
      throw new Error("cloud job adapters must use asia-northeast3");
    }
    super({ datastore: options.datastore, ...(options.now === undefined ? {} : { now: options.now }) });
    this.#queue = options.queue;
  }

  override inspectCreate(
    installationId: string,
    idempotencyKey: string,
    bodyHash: string,
  ): CreateRepositoryResult | undefined {
    return this.runInDatastoreTransaction(() =>
      super.inspectCreate(installationId, idempotencyKey, bodyHash));
  }

  override create(
    installationId: string,
    idempotencyKey: string,
    bodyHash: string,
    input: RecipeJobCreateRequest,
  ): CreateRepositoryResult {
    return this.runInDatastoreTransaction(() =>
      super.create(installationId, idempotencyKey, bodyHash, input));
  }

  override claimWorker(jobId: string, executionGeneration = 1): WorkerClaim | undefined {
    return this.runInDatastoreTransaction(() => super.claimWorker(jobId, executionGeneration));
  }

  override releaseBeforeProvider(claim: WorkerClaim): boolean {
    return this.runInDatastoreTransaction(() => super.releaseBeforeProvider(claim));
  }

  override beginProvider(claim: WorkerClaim): string | undefined {
    return this.runInDatastoreTransaction(() => super.beginProvider(claim));
  }

  override stageSuccess(claim: WorkerClaim, draft: RecipeDraft): boolean {
    return this.runInDatastoreTransaction(() => super.stageSuccess(claim, draft));
  }

  override stageFailure(jobId: string, code: RecipeJobFailureCode): boolean {
    return this.runInDatastoreTransaction(() => super.stageFailure(jobId, code));
  }

  override getPendingTerminalFacts(jobId: string): PendingTerminalFacts | undefined {
    return this.runInDatastoreTransaction(() => super.getPendingTerminalFacts(jobId));
  }

  override finalizePendingTerminal(jobId: string): boolean {
    return this.runInDatastoreTransaction(() => super.finalizePendingTerminal(jobId));
  }

  override completeFailure(jobId: string, code: RecipeJobFailureCode): boolean {
    return this.runInDatastoreTransaction(() => super.completeFailure(jobId, code));
  }

  override getStatus(installationId: string, jobId: string): RecipeJobStatus | undefined {
    return this.runInDatastoreTransaction(() => super.getStatus(installationId, jobId));
  }

  override acknowledge(
    installationId: string,
    jobId: string,
    idempotencyKey: string,
    bodyHash: string,
    resultVersion: number,
  ): AcknowledgeResult {
    return this.runInDatastoreTransaction(() =>
      super.acknowledge(installationId, jobId, idempotencyKey, bodyHash, resultVersion));
  }

  override runScheduledCleanup(): number {
    return this.runInDatastoreTransaction(() => super.runScheduledCleanup());
  }

  override publishPendingTasks(queue: RecipeTaskQueueAdapter): number {
    return this.runInDatastoreTransaction(() => super.publishPendingTasks(queue));
  }

  override getCleanupHealth(): ReturnType<InMemoryRecipeJobRepository["getCleanupHealth"]> {
    return this.runInDatastoreTransaction(() => super.getCleanupHealth());
  }

  override failNextContentDelete(): void {
    this.runInDatastoreTransaction(() => super.failNextContentDelete());
  }

  override failContentDeletes(attempts: number): void {
    this.runInDatastoreTransaction(() => super.failContentDeletes(attempts));
  }

  override isNewJobBlocked(): boolean {
    return this.runInDatastoreTransaction(() => super.isNewJobBlocked());
  }

  override getExecutionFacts(jobId: string): ReturnType<InMemoryRecipeJobRepository["getExecutionFacts"]> {
    return this.runInDatastoreTransaction(() => super.getExecutionFacts(jobId));
  }

  override getStats(): ReturnType<InMemoryRecipeJobRepository["getStats"]> {
    return this.runInDatastoreTransaction(() => super.getStats());
  }

  override getDurabilityFacts(): ReturnType<InMemoryRecipeJobRepository["getDurabilityFacts"]> {
    return this.runInDatastoreTransaction(() => super.getDurabilityFacts());
  }

  publishOutbox(): number {
    return this.publishPendingTasks(this.#queue);
  }
}
