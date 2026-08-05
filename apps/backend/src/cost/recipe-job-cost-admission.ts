import type { RecipeJobAdmission } from "../jobs/recipe-job-service.js";
import type { InMemoryCostLedger } from "./cost-ledger.js";
import {
  calculateReservationKrw,
  validatePriceManifest,
  type PriceManifest,
} from "./price-manifest.js";

export class RecipeJobCostAdmission implements RecipeJobAdmission {
  readonly #ledger: InMemoryCostLedger;
  readonly #manifest: PriceManifest;
  readonly #quantities: Readonly<Record<string, number>>;
  readonly #now: () => number;
  readonly #lastReconciledAt: () => number;
  readonly #nextOperationId: () => string;

  constructor(options: {
    readonly ledger: InMemoryCostLedger;
    readonly manifest: PriceManifest;
    readonly quantities: Readonly<Record<string, number>>;
    readonly now?: () => number;
    readonly lastReconciledAt: () => number;
    readonly nextOperationId: () => string;
  }) {
    this.#ledger = options.ledger;
    this.#manifest = options.manifest;
    this.#quantities = Object.freeze({ ...options.quantities });
    this.#now = options.now ?? Date.now;
    this.#lastReconciledAt = options.lastReconciledAt;
    this.#nextOperationId = options.nextOperationId;
  }

  reserve(): "accepted" | "quota_exceeded" | "service_disabled" {
    const manifestDecision = validatePriceManifest({
      manifest: this.#manifest,
      now: this.#now(),
      lastReconciledAt: this.#lastReconciledAt(),
    });
    if (!manifestDecision.allowed) return "service_disabled";
    const reservationKrw = calculateReservationKrw(this.#manifest, this.#quantities);
    if (reservationKrw === undefined || reservationKrw < 1) return "service_disabled";
    const decision = this.#ledger.reserve({
      operationId: this.#nextOperationId(),
      requestedReservationKrw: reservationKrw,
      kind: "provider",
    });
    if (decision.decision === "accepted") return "accepted";
    return decision.reason === "HARD_CUTOFF" ? "quota_exceeded" : "service_disabled";
  }
}
