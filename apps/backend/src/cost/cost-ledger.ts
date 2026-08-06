export const COST_HARD_CUTOFF_KRW = 50_000;
export const DELAYED_BILLING_RESERVE_KRW = 5_000;

export type CostOperationKind =
  | "provider"
  | "runtime"
  | "tasks"
  | "firestore"
  | "ttl_delete"
  | "logging"
  | "egress"
  | "build"
  | "privacy_cleanup";

export type CostRejectionReason =
  | "INVALID_REQUEST"
  | "DUPLICATE_OPERATION_CONFLICT"
  | "GUARDRAIL_UNAVAILABLE"
  | "HARD_CUTOFF";

export interface CostReservationRequest {
  readonly operationId: string;
  readonly requestedReservationKrw: number;
  readonly kind: CostOperationKind;
}

export type CostReservationDecision =
  | { readonly decision: "accepted"; readonly operationId: string; readonly replayed: boolean }
  | { readonly decision: "rejected"; readonly operationId: string; readonly reason: CostRejectionReason; readonly replayed: boolean };

interface StoredReservationDecision {
  readonly request: CostReservationRequest;
  readonly decision: "accepted" | "rejected";
  readonly reason?: CostRejectionReason;
  settled: boolean;
}

export interface CostLedgerSnapshot {
  readonly version: number;
  readonly committedActualKrw: number;
  readonly activeReservationsKrw: number;
  readonly delayedBillingReserveKrw: number;
  readonly guardedTotalKrw: number;
  readonly hardCutoffKrw: number;
  readonly alertThresholdsObserved: readonly number[];
  readonly killSwitch: boolean;
  readonly integrityIncident: boolean;
}

export type SettlementResult =
  | { readonly kind: "settled"; readonly unusedReservationReleasedKrw: number; readonly overflowDeltaKrw: number; readonly integrityIncident: boolean }
  | { readonly kind: "not_found" }
  | { readonly kind: "already_settled" }
  | { readonly kind: "invalid_actual" }
  | { readonly kind: "integrity_blocked" };

function validOperationId(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u.test(value);
}

function validKrw(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 1;
}

export class InMemoryCostLedger {
  readonly #hardCutoffKrw: number;
  readonly #decisions = new Map<string, StoredReservationDecision>();
  #version = 1;
  #committedActualKrw: number;
  #delayedBillingReserveKrw: number;
  #guardrailAvailable: boolean;
  #integrityIncident = false;
  #blocked = false;
  #hardCutoffReached = false;
  readonly #observedAlerts = new Set<number>();

  constructor(options: {
    readonly committedActualKrw?: number;
    readonly activeReservations?: readonly CostReservationRequest[];
    readonly delayedBillingReserveKrw?: number;
    readonly hardCutoffKrw?: number;
    readonly guardrailAvailable?: boolean;
  } = {}) {
    this.#hardCutoffKrw = options.hardCutoffKrw ?? COST_HARD_CUTOFF_KRW;
    this.#committedActualKrw = options.committedActualKrw ?? 0;
    this.#delayedBillingReserveKrw = options.delayedBillingReserveKrw ?? DELAYED_BILLING_RESERVE_KRW;
    this.#guardrailAvailable = options.guardrailAvailable ?? true;
    if (!Number.isSafeInteger(this.#hardCutoffKrw) || this.#hardCutoffKrw < 1 ||
      !Number.isSafeInteger(this.#committedActualKrw) || this.#committedActualKrw < 0 ||
      !Number.isSafeInteger(this.#delayedBillingReserveKrw) || this.#delayedBillingReserveKrw < 0) {
      throw new Error("invalid initial cost ledger");
    }
    for (const reservation of options.activeReservations ?? []) {
      if (!validOperationId(reservation.operationId) || !validKrw(reservation.requestedReservationKrw)) {
        throw new Error("invalid initial cost reservation");
      }
      if (this.#decisions.has(reservation.operationId)) throw new Error("duplicate initial operation ID");
      this.#decisions.set(reservation.operationId, {
        request: Object.freeze({ ...reservation }),
        decision: "accepted",
        settled: false,
      });
    }
    if (this.#guardedTotal() > this.#hardCutoffKrw) throw new Error("initial cost ledger exceeds hard cutoff");
    this.#recordAlerts();
  }

  reserve(request: CostReservationRequest): CostReservationDecision {
    const existing = this.#decisions.get(request.operationId);
    if (existing !== undefined) {
      const same = existing.request.requestedReservationKrw === request.requestedReservationKrw &&
        existing.request.kind === request.kind;
      if (!same) {
        return { decision: "rejected", operationId: request.operationId, reason: "DUPLICATE_OPERATION_CONFLICT", replayed: true };
      }
      return existing.decision === "accepted"
        ? { decision: "accepted", operationId: request.operationId, replayed: true }
        : { decision: "rejected", operationId: request.operationId, reason: existing.reason ?? "HARD_CUTOFF", replayed: true };
    }
    if (!validOperationId(request.operationId) || !validKrw(request.requestedReservationKrw)) {
      return { decision: "rejected", operationId: request.operationId, reason: "INVALID_REQUEST", replayed: false };
    }
    const frozenRequest = Object.freeze({ ...request });
    if (!this.#guardrailAvailable || this.#blocked) {
      this.#decisions.set(request.operationId, { request: frozenRequest, decision: "rejected", reason: "GUARDRAIL_UNAVAILABLE", settled: false });
      return { decision: "rejected", operationId: request.operationId, reason: "GUARDRAIL_UNAVAILABLE", replayed: false };
    }
    if (this.#guardedTotal() + request.requestedReservationKrw > this.#hardCutoffKrw) {
      this.#decisions.set(request.operationId, { request: frozenRequest, decision: "rejected", reason: "HARD_CUTOFF", settled: false });
      return { decision: "rejected", operationId: request.operationId, reason: "HARD_CUTOFF", replayed: false };
    }
    this.#decisions.set(request.operationId, { request: frozenRequest, decision: "accepted", settled: false });
    this.#version += 1;
    this.#recordAlerts();
    return { decision: "accepted", operationId: request.operationId, replayed: false };
  }

  settle(operationId: string, actualKrw: number, expectedVersion = this.#version): SettlementResult {
    const reservation = this.#decisions.get(operationId);
    if (reservation === undefined || reservation.decision !== "accepted") return { kind: "not_found" };
    if (reservation.settled) return { kind: "already_settled" };
    if (!Number.isSafeInteger(actualKrw) || actualKrw < 0) return { kind: "invalid_actual" };
    if (expectedVersion !== this.#version) {
      this.#integrityIncident = true;
      this.#blocked = true;
      return { kind: "integrity_blocked" };
    }
    const requested = reservation.request.requestedReservationKrw;
    const overflowDeltaKrw = Math.max(0, actualKrw - requested);
    if (overflowDeltaKrw > this.#delayedBillingReserveKrw) {
      this.#integrityIncident = true;
      this.#blocked = true;
      return { kind: "integrity_blocked" };
    }
    reservation.settled = true;
    this.#committedActualKrw += actualKrw;
    this.#delayedBillingReserveKrw -= overflowDeltaKrw;
    if (overflowDeltaKrw > 0) this.#integrityIncident = true;
    this.#version += 1;
    this.#recordAlerts();
    return {
      kind: "settled",
      unusedReservationReleasedKrw: Math.max(0, requested - actualKrw),
      overflowDeltaKrw,
      integrityIncident: overflowDeltaKrw > 0,
    };
  }

  authorizeReservedPrivacyCleanup(operationId: string): boolean {
    const reservation = this.#decisions.get(operationId);
    return reservation?.decision === "accepted" && !reservation.settled &&
      reservation.request.kind === "privacy_cleanup";
  }

  setGuardrailAvailable(available: boolean): void {
    this.#guardrailAvailable = available;
    if (!available) this.#blocked = true;
  }

  snapshot(): CostLedgerSnapshot {
    const guardedTotalKrw = this.#guardedTotal();
    return Object.freeze({
      version: this.#version,
      committedActualKrw: this.#committedActualKrw,
      activeReservationsKrw: this.#activeReservationsKrw(),
      delayedBillingReserveKrw: this.#delayedBillingReserveKrw,
      guardedTotalKrw,
      hardCutoffKrw: this.#hardCutoffKrw,
      alertThresholdsObserved: Object.freeze([50, 75, 90, 100].filter((threshold) => this.#observedAlerts.has(threshold))),
      killSwitch: this.#blocked || this.#hardCutoffReached,
      integrityIncident: this.#integrityIncident,
    });
  }

  #activeReservationsKrw(): number {
    let total = 0;
    for (const reservation of this.#decisions.values()) {
      if (reservation.decision === "accepted" && !reservation.settled) {
        total += reservation.request.requestedReservationKrw;
      }
    }
    return total;
  }

  #guardedTotal(): number {
    return this.#committedActualKrw + this.#activeReservationsKrw() + this.#delayedBillingReserveKrw;
  }

  #recordAlerts(): void {
    const guardedTotalKrw = this.#guardedTotal();
    const percentage = Math.floor((guardedTotalKrw * 100) / this.#hardCutoffKrw);
    for (const threshold of [50, 75, 90, 100]) {
      if (percentage >= threshold) this.#observedAlerts.add(threshold);
    }
    if (guardedTotalKrw >= this.#hardCutoffKrw) this.#hardCutoffReached = true;
  }
}
