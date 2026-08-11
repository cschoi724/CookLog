import { createHash } from "node:crypto";
import { types as utilTypes } from "node:util";

import type { SafeLogger } from "../observability/safe-logger.js";
import {
  calculateReservationKrw,
  validatePriceManifest,
  type PriceManifest,
} from "./price-manifest.js";

export const PRODUCTION_MONTHLY_COST_LIMITS = Object.freeze({
  providerCalls: 5_500,
  inputTokens: 20_000_000,
  outputTokens: 8_000_000,
  externalCostKrw: 50_000,
  delayedBillingReserveKrw: 5_000,
  maxInputTokensPerCall: 5_000,
  maxOutputTokensPerCall: 2_000,
  maxProviderAttemptsPerOperation: 1,
});

export interface ProductionUsage {
  readonly providerCalls: number;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly externalCostKrw: number;
}

export interface ProviderCostReservation {
  readonly operationId: string;
  readonly billingMonth: string;
  readonly operationKind: ProductionCostOperationKind;
  readonly envelopeHash: string;
  readonly usage: ProductionUsage;
}

export type ProductionCostOperationKind = "provider" | "runtime" | "tasks" | "firestore" |
"ttl_delete" | "logging" | "egress" | "build" | "privacy_cleanup" | "authentication";

export const PROVIDER_OPERATION_REQUIRED_SERVICES = Object.freeze([
  "ai_provider_input",
  "ai_provider_output",
  "cloud_run_cpu_seoul_tier2",
  "cloud_run_memory_seoul_tier2",
  "cloud_run_requests",
  "cloud_tasks_operations_seoul",
  "firestore_reads_seoul",
  "firestore_writes_seoul",
  "firestore_deletes_seoul",
  "network_egress",
  "cloud_logging",
  "cloud_trace",
  "cloud_monitoring",
] as const);

export const PRODUCTION_PROVIDER_OPERATION_ENVELOPE = Object.freeze({
  ai_provider_input: 0.005,
  ai_provider_output: 0.002,
  cloud_run_cpu_seoul_tier2: 60,
  cloud_run_memory_seoul_tier2: 60,
  cloud_run_requests: 0.000001,
  cloud_tasks_operations_seoul: 0.000001,
  firestore_reads_seoul: 4,
  firestore_writes_seoul: 4,
  firestore_deletes_seoul: 2,
  network_egress: 0.001,
  cloud_logging: 0.001,
  cloud_trace: 0.000001,
  cloud_monitoring: 0.000001,
});

export const PRODUCTION_BILLABLE_OPERATION_ENVELOPES = Object.freeze({
  runtime: Object.freeze({
    cloud_run_cpu_seoul_tier2: 60,
    cloud_run_memory_seoul_tier2: 60,
    cloud_run_requests: 0.000001,
  }),
  tasks: Object.freeze({ cloud_tasks_operations_seoul: 0.000001 }),
  firestore: Object.freeze({
    firestore_reads_seoul: 4,
    firestore_writes_seoul: 4,
    firestore_deletes_seoul: 2,
    firestore_storage_seoul: 0.000001,
  }),
  ttl_delete: Object.freeze({ firestore_ttl_deletes_seoul: 1 }),
  logging: Object.freeze({
    cloud_logging: 0.001,
    cloud_trace: 0.000001,
    cloud_monitoring: 0.000001,
  }),
  egress: Object.freeze({ network_egress: 0.001 }),
  build: Object.freeze({ cloud_build: 1, artifact_registry: 0.001 }),
  privacy_cleanup: Object.freeze({
    cloud_run_cpu_seoul_tier2: 60,
    cloud_run_memory_seoul_tier2: 60,
    cloud_run_requests: 0.000001,
    cloud_tasks_operations_seoul: 0.000001,
    firestore_deletes_seoul: 2,
    firestore_ttl_deletes_seoul: 1,
  }),
  authentication: Object.freeze({
    cloud_run_cpu_seoul_tier2: 1,
    cloud_run_memory_seoul_tier2: 1,
    cloud_run_requests: 0.000001,
    firestore_reads_seoul: 1,
    firestore_writes_seoul: 1,
  }),
} satisfies Readonly<Record<Exclude<ProductionCostOperationKind, "provider">,
Readonly<Record<string, number>>>>);

interface StoredReservation {
  readonly request: ProviderCostReservation;
  readonly decision: "accepted" | "hard_cutoff";
  settledUsage: ProductionUsage | undefined;
}

export type ProductionCostDecision =
  | { readonly kind: "accepted"; readonly replayed: boolean }
  | { readonly kind: "hard_cutoff" | "operation_conflict" | "unavailable" | "invalid" };

export type ProductionSettlementDecision =
  | { readonly kind: "settled"; readonly replayed: boolean }
  | { readonly kind: "not_found" | "operation_conflict" | "integrity_blocked" | "unavailable" };

export interface ProductionCostSnapshot {
  readonly billingMonth: string;
  readonly committed: ProductionUsage;
  readonly active: ProductionUsage;
  readonly delayedBillingReserveKrw: number;
  readonly guarded: ProductionUsage;
  readonly killSwitch: boolean;
  readonly integrityIncident: boolean;
}

const ZERO_USAGE: ProductionUsage = Object.freeze({
  providerCalls: 0,
  inputTokens: 0,
  outputTokens: 0,
  externalCostKrw: 0,
});

export class InMemoryProductionCostRepository {
  readonly #billingMonth: string;
  readonly #reservations = new Map<string, StoredReservation>();
  #committed: ProductionUsage;
  #delayedBillingReserveKrw: number;
  #available = true;
  #killSwitch = false;
  #hardCutoffReached = false;
  #integrityIncident = false;

  constructor(options: {
    readonly billingMonth: string;
    readonly committed?: ProductionUsage;
    readonly delayedBillingReserveKrw?: number;
  }) {
    if (!validBillingMonth(options.billingMonth)) throw new Error("invalid billing month");
    this.#billingMonth = options.billingMonth;
    this.#committed = options.committed ?? ZERO_USAGE;
    this.#delayedBillingReserveKrw = options.delayedBillingReserveKrw ??
      PRODUCTION_MONTHLY_COST_LIMITS.delayedBillingReserveKrw;
    if (!validUsage(this.#committed) ||
      !Number.isSafeInteger(this.#delayedBillingReserveKrw) || this.#delayedBillingReserveKrw < 0 ||
      exceedsLimits(addUsage(this.#committed, ZERO_USAGE, this.#delayedBillingReserveKrw))) {
      throw new Error("invalid production cost ledger state");
    }
    this.#hardCutoffReached = atOrAboveAnyLimit(this.snapshot().guarded);
  }

  reserve(request: ProviderCostReservation): ProductionCostDecision {
    const existing = this.#reservations.get(request.operationId);
    if (existing !== undefined) {
      if (!sameReservation(existing.request, request)) return { kind: "operation_conflict" };
      return existing.decision === "accepted"
        ? { kind: "accepted", replayed: true }
        : { kind: "hard_cutoff" };
    }
    if (!this.#available || this.#killSwitch) return { kind: "unavailable" };
    if (!validOperationId(request.operationId) || request.billingMonth !== this.#billingMonth ||
      !validOperationKind(request.operationKind) || !/^[0-9a-f]{64}$/u.test(request.envelopeHash) ||
      !validUsage(request.usage) ||
      (request.operationKind === "provider" && request.usage.providerCalls !== 1) ||
      (request.operationKind !== "provider" && (request.usage.providerCalls !== 0 ||
        request.usage.inputTokens !== 0 || request.usage.outputTokens !== 0)) ||
      request.usage.inputTokens > PRODUCTION_MONTHLY_COST_LIMITS.maxInputTokensPerCall ||
      request.usage.outputTokens > PRODUCTION_MONTHLY_COST_LIMITS.maxOutputTokensPerCall ||
      request.usage.externalCostKrw < 1) return { kind: "invalid" };

    if (this.#hardCutoffReached) {
      this.#reservations.set(request.operationId, {
        request: freezeReservation(request),
        decision: "hard_cutoff",
        settledUsage: undefined,
      });
      return { kind: "hard_cutoff" };
    }

    const next = addUsage(this.#committed, this.#activeUsage(), this.#delayedBillingReserveKrw,
      request.usage);
    if (exceedsLimits(next)) {
      if (atOrAboveAnyLimit(this.snapshot().guarded)) this.#hardCutoffReached = true;
      this.#reservations.set(request.operationId, {
        request: freezeReservation(request),
        decision: "hard_cutoff",
        settledUsage: undefined,
      });
      return { kind: "hard_cutoff" };
    }
    this.#reservations.set(request.operationId, {
      request: freezeReservation(request),
      decision: "accepted",
      settledUsage: undefined,
    });
    if (atOrAboveAnyLimit(this.snapshot().guarded)) this.#hardCutoffReached = true;
    return { kind: "accepted", replayed: false };
  }

  settle(operationId: string, actual: ProductionUsage): ProductionSettlementDecision {
    if (!this.#available) return { kind: "unavailable" };
    const stored = this.#reservations.get(operationId);
    if (stored === undefined || stored.decision !== "accepted") return { kind: "not_found" };
    if (stored.settledUsage !== undefined) {
      return sameUsage(stored.settledUsage, actual)
        ? { kind: "settled", replayed: true }
        : { kind: "operation_conflict" };
    }
    const reserved = stored.request.usage;
    if (!validUsage(actual) || actual.providerCalls !== reserved.providerCalls ||
      actual.inputTokens > reserved.inputTokens || actual.outputTokens > reserved.outputTokens) {
      return this.#tripIntegrityIncident();
    }
    const overflowKrw = Math.max(0, actual.externalCostKrw - reserved.externalCostKrw);
    if (overflowKrw > this.#delayedBillingReserveKrw) return this.#tripIntegrityIncident();
    const activeWithoutCurrent = subtractUsage(this.#activeUsage(), reserved);
    const nextDelayedReserve = this.#delayedBillingReserveKrw - overflowKrw;
    const nextCommitted = sumUsage(this.#committed, actual);
    if (exceedsLimits(addUsage(nextCommitted, activeWithoutCurrent, nextDelayedReserve))) {
      return this.#tripIntegrityIncident();
    }
    stored.settledUsage = Object.freeze({ ...actual });
    this.#committed = nextCommitted;
    this.#delayedBillingReserveKrw = nextDelayedReserve;
    if (overflowKrw > 0) this.#integrityIncident = true;
    if (atOrAboveAnyLimit(this.snapshot().guarded)) this.#hardCutoffReached = true;
    return { kind: "settled", replayed: false };
  }

  tripKillSwitch(): void {
    this.#killSwitch = true;
  }

  authorizeReservedPrivacyCleanup(operationId: string): boolean {
    const stored = this.#reservations.get(operationId);
    return stored?.decision === "accepted" && stored.settledUsage === undefined &&
      stored.request.operationKind === "privacy_cleanup";
  }

  setAvailable(available: boolean): void {
    this.#available = available;
    if (!available) this.#killSwitch = true;
  }

  snapshot(): ProductionCostSnapshot {
    const active = this.#activeUsage();
    return Object.freeze({
      billingMonth: this.#billingMonth,
      committed: Object.freeze({ ...this.#committed }),
      active: Object.freeze({ ...active }),
      delayedBillingReserveKrw: this.#delayedBillingReserveKrw,
      guarded: Object.freeze(addUsage(this.#committed, active, this.#delayedBillingReserveKrw)),
      killSwitch: this.#killSwitch || this.#hardCutoffReached,
      integrityIncident: this.#integrityIncident,
    });
  }

  #activeUsage(): ProductionUsage {
    let active = ZERO_USAGE;
    for (const stored of this.#reservations.values()) {
      if (stored.decision === "accepted" && stored.settledUsage === undefined) {
        active = sumUsage(active, stored.request.usage);
      }
    }
    return active;
  }

  #tripIntegrityIncident(): ProductionSettlementDecision {
    this.#integrityIncident = true;
    this.#killSwitch = true;
    return { kind: "integrity_blocked" };
  }
}

export interface ProviderOperationReservationRequest {
  readonly operationId: string;
  readonly maxInputTokens: number;
  readonly maxOutputTokens: number;
  readonly maxProviderAttempts: number;
  readonly priceQuantities: Readonly<Record<string, number>>;
}

export interface ProviderOperationActualUsage {
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly externalCostKrw: number;
  readonly providerOutcome: "succeeded" | "failed" | "timeout" | "outcome_unknown";
  readonly latencyMsBucket: "lt_100" | "lt_500" | "lt_1000" | "lt_5000" | "gte_5000";
}

export interface BillableOperationReservationRequest {
  readonly operationId: string;
  readonly operationKind: Exclude<ProductionCostOperationKind, "provider">;
  readonly priceQuantities: Readonly<Record<string, number>>;
}

export class ProductionCostObservabilityGuard {
  readonly #repository: InMemoryProductionCostRepository;
  readonly #manifest: PriceManifest;
  readonly #logger: SafeLogger;
  readonly #now: () => number;
  readonly #lastReconciledAt: () => number;

  constructor(options: {
    readonly repository: InMemoryProductionCostRepository;
    readonly manifest: PriceManifest;
    readonly logger: SafeLogger;
    readonly now?: () => number;
    readonly lastReconciledAt: () => number;
  }) {
    this.#repository = options.repository;
    this.#manifest = options.manifest;
    this.#logger = options.logger;
    this.#now = options.now ?? Date.now;
    this.#lastReconciledAt = options.lastReconciledAt;
  }

  reserveProviderOperation(request: ProviderOperationReservationRequest):
  "accepted" | "replayed" | "quota_exceeded" | "service_disabled" {
    const projected = projectProviderReservationRequest(request);
    if (projected === undefined) return "service_disabled";
    const now = this.#now();
    const manifestDecision = validatePriceManifest({
      manifest: this.#manifest,
      now,
      lastReconciledAt: this.#lastReconciledAt(),
    });
    if (!manifestDecision.allowed || projected.maxProviderAttempts !==
      PRODUCTION_MONTHLY_COST_LIMITS.maxProviderAttemptsPerOperation ||
      projected.maxInputTokens !== PRODUCTION_MONTHLY_COST_LIMITS.maxInputTokensPerCall ||
      projected.maxOutputTokens !== PRODUCTION_MONTHLY_COST_LIMITS.maxOutputTokensPerCall) {
      return "service_disabled";
    }
    const externalCostKrw = calculateReservationKrw(
      this.#manifest,
      projected.priceQuantities,
    );
    if (externalCostKrw === undefined || externalCostKrw < 1) return "service_disabled";
    const decision = this.#repository.reserve({
      operationId: projected.operationId,
      billingMonth: billingMonthUtc(now),
      operationKind: "provider",
      envelopeHash: envelopeHash("provider", projected.priceQuantities, this.#manifest),
      usage: {
        providerCalls: projected.maxProviderAttempts,
        inputTokens: projected.maxInputTokens,
        outputTokens: projected.maxOutputTokens,
        externalCostKrw,
      },
    });
    if (decision.kind === "hard_cutoff") {
      return this.#emitAdmission("blocked") ? "quota_exceeded" : "service_disabled";
    }
    if (decision.kind !== "accepted") return "service_disabled";
    if (!this.#emitAdmission("accepted")) return "service_disabled";
    return decision.replayed ? "replayed" : "accepted";
  }

  reserveBillableOperation(request: BillableOperationReservationRequest):
  "accepted" | "replayed" | "quota_exceeded" | "service_disabled" {
    const projected = projectBillableReservationRequest(request);
    if (projected === undefined) return "service_disabled";
    const now = this.#now();
    const manifestDecision = validatePriceManifest({
      manifest: this.#manifest,
      now,
      lastReconciledAt: this.#lastReconciledAt(),
    });
    if (!manifestDecision.allowed) return "service_disabled";
    const externalCostKrw = calculateReservationKrw(this.#manifest, projected.priceQuantities);
    if (externalCostKrw === undefined || externalCostKrw < 1) return "service_disabled";
    const decision = this.#repository.reserve({
      operationId: projected.operationId,
      billingMonth: billingMonthUtc(now),
      operationKind: projected.operationKind,
      envelopeHash: envelopeHash(projected.operationKind, projected.priceQuantities, this.#manifest),
      usage: { providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw },
    });
    if (decision.kind === "hard_cutoff") {
      return this.#emitAdmission("blocked") ? "quota_exceeded" : "service_disabled";
    }
    if (decision.kind !== "accepted") return "service_disabled";
    if (!this.#emitAdmission("accepted")) return "service_disabled";
    return decision.replayed ? "replayed" : "accepted";
  }

  settleAndAuthorizeResult(operationId: string, actual: ProviderOperationActualUsage): boolean {
    const settlement = this.#repository.settle(operationId, {
      providerCalls: 1,
      inputTokens: actual.inputTokens,
      outputTokens: actual.outputTokens,
      externalCostKrw: actual.externalCostKrw,
    });
    if (settlement.kind !== "settled") return false;
    const emitted = this.#logger.emit("provider_call_completed", {
      provider_outcome: actual.providerOutcome,
      latency_ms_bucket: actual.latencyMsBucket,
      input_tokens: actual.inputTokens,
      output_tokens: actual.outputTokens,
      estimated_cost_micros: actual.externalCostKrw * 1_000_000,
    });
    if (!emitted) this.#repository.tripKillSwitch();
    return emitted;
  }

  #emitAdmission(outcome: "accepted" | "blocked"): boolean {
    const snapshot = this.#repository.snapshot();
    const [dimension, percentage] = tightestDimension(snapshot.guarded);
    const emitted = this.#logger.emit("cost_guardrail_changed", {
      quota_dimension: dimension,
      percentage_bucket: percentageBucket(percentage),
      quota_outcome: outcome,
    });
    if (!emitted) this.#repository.tripKillSwitch();
    return emitted;
  }
}

function billingMonthUtc(now: number): string {
  if (!Number.isSafeInteger(now) || now < 0 || now > 8_640_000_000_000_000) return "invalid";
  const date = new Date(now);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function validBillingMonth(value: string): boolean {
  return /^(?:[0-9]{4})-(?:0[1-9]|1[0-2])$/u.test(value);
}

function validOperationId(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u.test(value);
}

function validOperationKind(value: string): value is ProductionCostOperationKind {
  return ["provider", "runtime", "tasks", "firestore", "ttl_delete", "logging", "egress",
    "build", "privacy_cleanup", "authentication"].includes(value);
}

function validUsage(value: ProductionUsage): boolean {
  return [value.providerCalls, value.inputTokens, value.outputTokens, value.externalCostKrw]
    .every((item) => Number.isSafeInteger(item) && item >= 0);
}

function sumUsage(left: ProductionUsage, right: ProductionUsage): ProductionUsage {
  return {
    providerCalls: left.providerCalls + right.providerCalls,
    inputTokens: left.inputTokens + right.inputTokens,
    outputTokens: left.outputTokens + right.outputTokens,
    externalCostKrw: left.externalCostKrw + right.externalCostKrw,
  };
}

function subtractUsage(left: ProductionUsage, right: ProductionUsage): ProductionUsage {
  return {
    providerCalls: left.providerCalls - right.providerCalls,
    inputTokens: left.inputTokens - right.inputTokens,
    outputTokens: left.outputTokens - right.outputTokens,
    externalCostKrw: left.externalCostKrw - right.externalCostKrw,
  };
}

function addUsage(committed: ProductionUsage, active: ProductionUsage, delayedKrw: number,
  added: ProductionUsage = ZERO_USAGE): ProductionUsage {
  const usage = sumUsage(sumUsage(committed, active), added);
  return { ...usage, externalCostKrw: usage.externalCostKrw + delayedKrw };
}

function exceedsLimits(usage: ProductionUsage): boolean {
  return usage.providerCalls > PRODUCTION_MONTHLY_COST_LIMITS.providerCalls ||
    usage.inputTokens > PRODUCTION_MONTHLY_COST_LIMITS.inputTokens ||
    usage.outputTokens > PRODUCTION_MONTHLY_COST_LIMITS.outputTokens ||
    usage.externalCostKrw > PRODUCTION_MONTHLY_COST_LIMITS.externalCostKrw;
}

function atOrAboveAnyLimit(usage: ProductionUsage): boolean {
  return usage.providerCalls >= PRODUCTION_MONTHLY_COST_LIMITS.providerCalls ||
    usage.inputTokens >= PRODUCTION_MONTHLY_COST_LIMITS.inputTokens ||
    usage.outputTokens >= PRODUCTION_MONTHLY_COST_LIMITS.outputTokens ||
    usage.externalCostKrw >= PRODUCTION_MONTHLY_COST_LIMITS.externalCostKrw;
}

function sameUsage(left: ProductionUsage, right: ProductionUsage): boolean {
  return left.providerCalls === right.providerCalls && left.inputTokens === right.inputTokens &&
    left.outputTokens === right.outputTokens && left.externalCostKrw === right.externalCostKrw;
}

function sameReservation(left: ProviderCostReservation, right: ProviderCostReservation): boolean {
  return left.operationId === right.operationId && left.billingMonth === right.billingMonth &&
    left.operationKind === right.operationKind && left.envelopeHash === right.envelopeHash &&
    sameUsage(left.usage, right.usage);
}

function freezeReservation(request: ProviderCostReservation): ProviderCostReservation {
  return Object.freeze({ ...request, usage: Object.freeze({ ...request.usage }) });
}

interface ProjectedProviderReservationRequest {
  readonly operationId: string;
  readonly maxInputTokens: number;
  readonly maxOutputTokens: number;
  readonly maxProviderAttempts: number;
  readonly priceQuantities: Readonly<Record<string, number>>;
}

interface ProjectedBillableReservationRequest {
  readonly operationId: string;
  readonly operationKind: Exclude<ProductionCostOperationKind, "provider">;
  readonly priceQuantities: Readonly<Record<string, number>>;
}

function projectProviderReservationRequest(input: unknown):
ProjectedProviderReservationRequest | undefined {
  const projected = projectExactOwnDataProperties(input, [
    "operationId", "maxInputTokens", "maxOutputTokens", "maxProviderAttempts", "priceQuantities",
  ]);
  if (projected === undefined || typeof projected.operationId !== "string" ||
    typeof projected.maxInputTokens !== "number" || typeof projected.maxOutputTokens !== "number" ||
    typeof projected.maxProviderAttempts !== "number") return undefined;
  const priceQuantities = projectExactEnvelope(
    projected.priceQuantities,
    PRODUCTION_PROVIDER_OPERATION_ENVELOPE,
  );
  if (priceQuantities === undefined) return undefined;
  return Object.freeze({
    operationId: projected.operationId,
    maxInputTokens: projected.maxInputTokens,
    maxOutputTokens: projected.maxOutputTokens,
    maxProviderAttempts: projected.maxProviderAttempts,
    priceQuantities,
  });
}

function projectBillableReservationRequest(input: unknown):
ProjectedBillableReservationRequest | undefined {
  const projected = projectExactOwnDataProperties(input, [
    "operationId", "operationKind", "priceQuantities",
  ]);
  if (projected === undefined || typeof projected.operationId !== "string" ||
    !validBillableOperationKind(projected.operationKind)) return undefined;
  const expectedEnvelope = PRODUCTION_BILLABLE_OPERATION_ENVELOPES[projected.operationKind];
  const priceQuantities = projectExactEnvelope(projected.priceQuantities, expectedEnvelope);
  if (priceQuantities === undefined) return undefined;
  return Object.freeze({
    operationId: projected.operationId,
    operationKind: projected.operationKind,
    priceQuantities,
  });
}

function validBillableOperationKind(value: unknown):
value is Exclude<ProductionCostOperationKind, "provider"> {
  return typeof value === "string" && value !== "provider" &&
    Object.hasOwn(PRODUCTION_BILLABLE_OPERATION_ENVELOPES, value);
}

function projectExactEnvelope(input: unknown, expected: Readonly<Record<string, number>>):
Readonly<Record<string, number>> | undefined {
  const expectedEntries = Object.entries(expected).sort(([left], [right]) =>
    left.localeCompare(right));
  const projected = projectExactOwnDataProperties(input, expectedEntries.map(([key]) => key));
  if (projected === undefined) return undefined;
  const entries: [string, number][] = [];
  for (const [key, expectedValue] of expectedEntries) {
    const value = projected[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 ||
      value !== expectedValue) return undefined;
    entries.push([key, value]);
  }
  return Object.freeze(Object.fromEntries(entries) as Record<string, number>);
}

function projectExactOwnDataProperties(input: unknown, expectedKeys: readonly string[]):
Readonly<Record<string, unknown>> | undefined {
  try {
    if (typeof input !== "object" || input === null || utilTypes.isProxy(input) ||
      Object.getPrototypeOf(input) !== Object.prototype) return undefined;
    const ownKeys = Reflect.ownKeys(input);
    const expectedKeySet = new Set(expectedKeys);
    if (ownKeys.length !== expectedKeys.length || ownKeys.some((key) =>
      typeof key !== "string" || !expectedKeySet.has(key))) return undefined;
    const entries: [string, unknown][] = [];
    for (const key of expectedKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true ||
        descriptor.get !== undefined || descriptor.set !== undefined) return undefined;
      entries.push([key, descriptor.value]);
    }
    return Object.freeze(Object.fromEntries(entries));
  } catch {
    return undefined;
  }
}

function envelopeHash(operationKind: ProductionCostOperationKind,
  quantities: Readonly<Record<string, number>>, manifest: PriceManifest): string {
  const skus = [...manifest.skus]
    .map((sku) => ({
      service: sku.service,
      catalog_sku_id: sku.catalog_sku_id,
      unit: sku.unit,
      unit_price_usd: sku.unit_price_usd ?? null,
      unit_price_krw: sku.unit_price_krw ?? null,
    }))
    .sort((left, right) => left.service.localeCompare(right.service));
  return createHash("sha256").update(JSON.stringify({
    contract: "cooklog.production-cost-envelope.v1",
    operation_kind: operationKind,
    quantities: Object.fromEntries(Object.entries(quantities).sort(([left], [right]) =>
      left.localeCompare(right))),
    manifest: {
      effective_at: manifest.effective_at,
      expires_at: manifest.expires_at,
      usd_krw: manifest.usd_krw,
      tax_fx_buffer_percent: manifest.tax_fx_buffer_percent,
      billing_reconciliation_max_delay_seconds: manifest.billing_reconciliation_max_delay_seconds,
      fixture_only: manifest.fixture_only ?? false,
      skus,
    },
  }), "utf8").digest("hex");
}

function tightestDimension(usage: ProductionUsage): ["provider_calls" | "input_tokens" |
"output_tokens" | "external_cost", number] {
  const dimensions = [
    ["provider_calls", usage.providerCalls / PRODUCTION_MONTHLY_COST_LIMITS.providerCalls],
    ["input_tokens", usage.inputTokens / PRODUCTION_MONTHLY_COST_LIMITS.inputTokens],
    ["output_tokens", usage.outputTokens / PRODUCTION_MONTHLY_COST_LIMITS.outputTokens],
    ["external_cost", usage.externalCostKrw / PRODUCTION_MONTHLY_COST_LIMITS.externalCostKrw],
  ] as const;
  const tightest = dimensions.reduce((selected, candidate) => candidate[1] > selected[1]
    ? candidate : selected);
  return [tightest[0], Math.floor(tightest[1] * 100)];
}

function percentageBucket(percentage: number): "lt_50" | "50" | "75" | "90" | "100" {
  if (percentage >= 100) return "100";
  if (percentage >= 90) return "90";
  if (percentage >= 75) return "75";
  if (percentage >= 50) return "50";
  return "lt_50";
}
