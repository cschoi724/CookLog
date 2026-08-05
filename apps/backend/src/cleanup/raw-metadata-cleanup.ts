import { randomUUID } from "node:crypto";

const DAY_MS = 86_400_000;
export const RAW_METADATA_DELETE_AFTER_MS = 28 * DAY_MS;
export const RAW_METADATA_WARNING_AT_MS = 29 * DAY_MS;
export const RAW_METADATA_CRITICAL_AT_MS = 29 * DAY_MS + 12 * 60 * 60 * 1_000;
export const RAW_METADATA_INCIDENT_AT_MS = 29 * DAY_MS + 18 * 60 * 60 * 1_000;
export const RAW_METADATA_RETRY_STOPS_AT_MS = 29 * DAY_MS + 23 * 60 * 60 * 1_000 + 45 * 60 * 1_000;
export const RAW_METADATA_EXPIRES_AT_MS = 30 * DAY_MS;
export const RAW_METADATA_SWEEPER_INTERVAL_MS = 15 * 60 * 1_000;

export const REQUIRED_RAW_METADATA_SINKS = Object.freeze([
  "source",
  "error_tracker",
  "analytics_staging",
  "incident_replica",
  "export_object",
  "backup",
] as const);

export type RawMetadataSinkId = typeof REQUIRED_RAW_METADATA_SINKS[number];
export type RawMetadataAccessPurpose = "read" | "export" | "aggregate";
export type RawMetadataSafetyState = "active" | "cleanup_due" | "warning" | "critical" | "incident" | "final_cleanup" | "expired";

interface RawMetadataRecord {
  readonly recordId: string;
  readonly createdAt: number;
  readonly deleteAfter: number;
  readonly warningAt: number;
  readonly criticalAt: number;
  readonly incidentAt: number;
  readonly cleanupRetryStopsAt: number;
  readonly expiresAt: number;
  readonly aggregateCount: number;
  outboxAvailable: boolean;
  deleted: boolean;
  syncDeleteAttempts: number;
  readonly receipts: Map<RawMetadataSinkId, number>;
}

export interface RawMetadataReceipt {
  readonly sink_id: RawMetadataSinkId;
  readonly deleted_at: string;
  readonly outcome: "deleted";
}

export interface RawMetadataSnapshot {
  readonly recordId: string;
  readonly state: RawMetadataSafetyState;
  readonly deleted: boolean;
  readonly receiptsComplete: boolean;
  readonly receiptSinkIds: readonly RawMetadataSinkId[];
  readonly syncDeleteAttempts: number;
  readonly outboxAvailable: boolean;
}

export class InMemoryRawMetadataRepository {
  readonly #now: () => number;
  readonly #records = new Map<string, RawMetadataRecord>();
  readonly #remainingSinkFailures = new Map<RawMetadataSinkId, number>();
  #queueAvailable = true;

  constructor(options: { readonly now?: () => number } = {}) {
    this.#now = options.now ?? Date.now;
  }

  create(aggregateCount = 1): string | undefined {
    if (!Number.isSafeInteger(aggregateCount) || aggregateCount < 0 || this.newRawEventsBlocked()) return undefined;
    const createdAt = this.#now();
    const recordId = randomUUID();
    this.#records.set(recordId, {
      recordId,
      createdAt,
      deleteAfter: createdAt + RAW_METADATA_DELETE_AFTER_MS,
      warningAt: createdAt + RAW_METADATA_WARNING_AT_MS,
      criticalAt: createdAt + RAW_METADATA_CRITICAL_AT_MS,
      incidentAt: createdAt + RAW_METADATA_INCIDENT_AT_MS,
      cleanupRetryStopsAt: createdAt + RAW_METADATA_RETRY_STOPS_AT_MS,
      expiresAt: createdAt + RAW_METADATA_EXPIRES_AT_MS,
      aggregateCount,
      outboxAvailable: true,
      deleted: false,
      syncDeleteAttempts: 0,
      receipts: new Map(),
    });
    return recordId;
  }

  runDueCleanup(maxSinksPerRecord = Number.POSITIVE_INFINITY): number {
    if (!this.#queueAvailable) return 0;
    let completed = 0;
    for (const record of this.#records.values()) {
      if (!record.deleted && record.outboxAvailable && record.deleteAfter <= this.#now() &&
        this.#deleteSinks(record, maxSinksPerRecord)) completed += 1;
    }
    return completed;
  }

  runIndependentSweeper(maxSinksPerRecord = Number.POSITIVE_INFINITY): number {
    let completed = 0;
    for (const record of this.#records.values()) {
      if (!record.deleted && record.deleteAfter <= this.#now() &&
        this.#deleteSinks(record, maxSinksPerRecord)) completed += 1;
    }
    return completed;
  }

  access(recordId: string, purpose: RawMetadataAccessPurpose): number | undefined {
    const record = this.#records.get(recordId);
    if (record === undefined) return undefined;
    if (this.#now() >= record.expiresAt) {
      record.syncDeleteAttempts += 1;
      if (!record.deleted) this.#deleteSinks(record, Number.POSITIVE_INFINITY);
      return undefined;
    }
    if (record.deleted) return undefined;
    if (purpose === "aggregate") return record.aggregateCount;
    return record.aggregateCount;
  }

  dropOutbox(recordId: string): void {
    const record = this.#records.get(recordId);
    if (record !== undefined) record.outboxAvailable = false;
  }

  setQueueAvailable(available: boolean): void {
    this.#queueAvailable = available;
  }

  failSinkDeletes(sinkId: RawMetadataSinkId, attempts: number): void {
    if (!Number.isSafeInteger(attempts) || attempts < 1) throw new Error("sink delete failures must be positive");
    this.#remainingSinkFailures.set(sinkId, attempts);
  }

  newRawEventsBlocked(): boolean {
    const now = this.#now();
    return [...this.#records.values()].some((record) => !record.deleted && now >= record.criticalAt);
  }

  snapshot(recordId: string): RawMetadataSnapshot | undefined {
    const record = this.#records.get(recordId);
    if (record === undefined) return undefined;
    const receiptSinkIds = REQUIRED_RAW_METADATA_SINKS.filter((sink) => record.receipts.has(sink));
    return Object.freeze({
      recordId,
      state: this.#state(record),
      deleted: record.deleted,
      receiptsComplete: receiptSinkIds.length === REQUIRED_RAW_METADATA_SINKS.length,
      receiptSinkIds: Object.freeze(receiptSinkIds),
      syncDeleteAttempts: record.syncDeleteAttempts,
      outboxAvailable: record.outboxAvailable,
    });
  }

  receipts(recordId: string): readonly RawMetadataReceipt[] {
    const record = this.#records.get(recordId);
    if (record === undefined) return [];
    return REQUIRED_RAW_METADATA_SINKS.flatMap((sinkId) => {
      const deletedAt = record.receipts.get(sinkId);
      return deletedAt === undefined ? [] : [{
        sink_id: sinkId,
        deleted_at: new Date(deletedAt).toISOString(),
        outcome: "deleted" as const,
      }];
    });
  }

  #deleteSinks(record: RawMetadataRecord, maxSinks: number): boolean {
    let attempted = 0;
    for (const sinkId of REQUIRED_RAW_METADATA_SINKS) {
      if (record.receipts.has(sinkId) || attempted >= maxSinks) continue;
      attempted += 1;
      const remainingFailures = this.#remainingSinkFailures.get(sinkId) ?? 0;
      if (remainingFailures > 0) {
        this.#remainingSinkFailures.set(sinkId, remainingFailures - 1);
        continue;
      }
      record.receipts.set(sinkId, this.#now());
    }
    if (record.receipts.size === REQUIRED_RAW_METADATA_SINKS.length) record.deleted = true;
    return record.deleted;
  }

  #state(record: RawMetadataRecord): RawMetadataSafetyState {
    const now = this.#now();
    if (now >= record.expiresAt) return "expired";
    if (now >= record.cleanupRetryStopsAt) return "final_cleanup";
    if (now >= record.incidentAt) return "incident";
    if (now >= record.criticalAt) return "critical";
    if (now >= record.warningAt) return "warning";
    if (now >= record.deleteAfter) return "cleanup_due";
    return "active";
  }
}
