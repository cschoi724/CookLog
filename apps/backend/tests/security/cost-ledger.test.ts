import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import {
  InMemoryCostLedger,
  type CostOperationKind,
} from "../../src/cost/cost-ledger.js";
import {
  calculateReservationKrw,
  validatePriceManifest,
  type PriceManifest,
} from "../../src/cost/price-manifest.js";
import { RecipeJobCostAdmission } from "../../src/cost/recipe-job-cost-admission.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import { InMemoryRecipeJobRepository } from "../../src/storage/recipe-job-repository.js";

interface CostFixture {
  readonly hard_cutoff_krw: number;
  readonly delayed_billing_reserve_krw: number;
  readonly price_manifest: PriceManifest;
  readonly concurrency_cases: readonly {
    readonly name: string;
    readonly committed_actual_krw: number;
    readonly active_reservations_before_krw: number;
    readonly operations: readonly {
      readonly operation_id: string;
      readonly requested_reservation_krw: number;
      readonly decision: "accepted" | "rejected";
    }[];
    readonly guarded_total_krw: number;
    readonly alerts_observed_percent?: readonly number[];
    readonly kill_switch?: boolean;
    readonly privacy_cleanup_continues_from_reserved_envelope?: boolean;
  }[];
  readonly settlement_cases: readonly {
    readonly name: string;
    readonly committed_before_krw: number;
    readonly active_reservation_before_krw: number;
    readonly delayed_reserve_before_krw: number;
    readonly requested_reservation_krw: number;
    readonly actual_krw: number;
    readonly committed_after_krw: number;
    readonly active_reservation_after_krw: number;
    readonly delayed_reserve_after_krw: number;
    readonly unused_reservation_released_krw?: number;
    readonly overflow_delta_krw?: number;
    readonly price_manifest_integrity_incident?: boolean;
  }[];
}

async function costFixture(): Promise<CostFixture> {
  return JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/security/fixtures/cost-ledger-cases.json"),
    "utf8",
  )) as CostFixture;
}

test("fixture concurrency decisions are whole-operation atomic and never exceed KRW 50,000", async () => {
  const fixture = await costFixture();
  const kinds: readonly CostOperationKind[] = ["provider", "logging", "privacy_cleanup"];

  for (const fixtureCase of fixture.concurrency_cases) {
    const initialOperationId = `${fixtureCase.name}-existing`;
    const ledger = new InMemoryCostLedger({
      committedActualKrw: fixtureCase.committed_actual_krw,
      delayedBillingReserveKrw: fixture.delayed_billing_reserve_krw,
      hardCutoffKrw: fixture.hard_cutoff_krw,
      activeReservations: fixtureCase.active_reservations_before_krw === 0 ? [] : [{
        operationId: initialOperationId,
        requestedReservationKrw: fixtureCase.active_reservations_before_krw,
        kind: "privacy_cleanup",
      }],
    });
    const decisions = await Promise.all(fixtureCase.operations.map(async (operation, index) =>
      ledger.reserve({
        operationId: operation.operation_id,
        requestedReservationKrw: operation.requested_reservation_krw,
        kind: kinds[index % kinds.length] ?? "runtime",
      })));

    assert.deepEqual(decisions.map((decision) => decision.decision),
      fixtureCase.operations.map((operation) => operation.decision), fixtureCase.name);
    const snapshot = ledger.snapshot();
    assert.equal(snapshot.guardedTotalKrw, fixtureCase.guarded_total_krw, fixtureCase.name);
    assert.ok(snapshot.guardedTotalKrw <= fixture.hard_cutoff_krw, fixtureCase.name);
    assert.deepEqual(snapshot.alertThresholdsObserved,
      fixtureCase.alerts_observed_percent ?? snapshot.alertThresholdsObserved, fixtureCase.name);
    if (fixtureCase.kill_switch !== undefined) assert.equal(snapshot.killSwitch, fixtureCase.kill_switch);
    if (fixtureCase.privacy_cleanup_continues_from_reserved_envelope === true) {
      assert.equal(ledger.authorizeReservedPrivacyCleanup(initialOperationId), true);
    }
  }
});

test("reservation replay is immutable and conflicting operation IDs fail closed", () => {
  const ledger = new InMemoryCostLedger();
  const request = { operationId: "provider-immutable", requestedReservationKrw: 1_000, kind: "provider" as const };
  assert.deepEqual(ledger.reserve(request), { decision: "accepted", operationId: request.operationId, replayed: false });
  assert.deepEqual(ledger.reserve(request), { decision: "accepted", operationId: request.operationId, replayed: true });
  assert.equal(ledger.reserve({ ...request, requestedReservationKrw: 999 }).decision, "rejected");
  assert.equal(ledger.snapshot().activeReservationsKrw, 1_000);
});

test("settlement releases unused cost and consumes delayed reserve without increasing guarded total", async () => {
  const fixture = await costFixture();
  for (const fixtureCase of fixture.settlement_cases) {
    const operationId = fixtureCase.name;
    const ledger = new InMemoryCostLedger({
      committedActualKrw: fixtureCase.committed_before_krw,
      delayedBillingReserveKrw: fixtureCase.delayed_reserve_before_krw,
      activeReservations: [{
        operationId,
        requestedReservationKrw: fixtureCase.active_reservation_before_krw,
        kind: "provider",
      }],
    });
    const guardedBefore = ledger.snapshot().guardedTotalKrw;
    const settled = ledger.settle(operationId, fixtureCase.actual_krw);
    assert.equal(settled.kind, "settled", fixtureCase.name);
    if (settled.kind !== "settled") continue;
    assert.equal(settled.unusedReservationReleasedKrw, fixtureCase.unused_reservation_released_krw ?? 0);
    assert.equal(settled.overflowDeltaKrw, fixtureCase.overflow_delta_krw ?? 0);
    assert.equal(settled.integrityIncident, fixtureCase.price_manifest_integrity_incident ?? false);
    const snapshot = ledger.snapshot();
    assert.equal(snapshot.committedActualKrw, fixtureCase.committed_after_krw);
    assert.equal(snapshot.activeReservationsKrw, fixtureCase.active_reservation_after_krw);
    assert.equal(snapshot.delayedBillingReserveKrw, fixtureCase.delayed_reserve_after_krw);
    assert.ok(snapshot.guardedTotalKrw <= guardedBefore);
  }
});

test("settlement CAS mismatch or overflow beyond delayed reserve blocks every new operation", () => {
  for (const failure of ["cas", "overflow"] as const) {
    const ledger = new InMemoryCostLedger({
      activeReservations: [{ operationId: failure, requestedReservationKrw: 1_000, kind: "provider" }],
    });
    const result = failure === "cas"
      ? ledger.settle(failure, 900, ledger.snapshot().version + 1)
      : ledger.settle(failure, 7_000);
    assert.equal(result.kind, "integrity_blocked");
    assert.equal(ledger.snapshot().integrityIncident, true);
    assert.equal(ledger.snapshot().killSwitch, true);
    assert.equal(ledger.reserve({ operationId: `${failure}-new`, requestedReservationKrw: 1, kind: "logging" }).decision, "rejected");
  }
});

test("100 percent kill switch and observed alerts cannot be cleared by later settlement", () => {
  const ledger = new InMemoryCostLedger({ committedActualKrw: 44_000 });
  assert.equal(ledger.reserve({
    operationId: "reach-cutoff",
    requestedReservationKrw: 1_000,
    kind: "logging",
  }).decision, "accepted");
  assert.equal(ledger.snapshot().guardedTotalKrw, 50_000);
  assert.equal(ledger.snapshot().killSwitch, true);
  assert.deepEqual(ledger.snapshot().alertThresholdsObserved, [50, 75, 90, 100]);
  assert.equal(ledger.settle("reach-cutoff", 0).kind, "settled");
  assert.equal(ledger.snapshot().guardedTotalKrw, 49_000);
  assert.equal(ledger.snapshot().killSwitch, true);
  assert.deepEqual(ledger.snapshot().alertThresholdsObserved, [50, 75, 90, 100]);
});

test("invalid or duplicate initial ledger state is rejected before reservations", () => {
  assert.throws(() => new InMemoryCostLedger({ committedActualKrw: -1 }), /invalid initial/);
  assert.throws(() => new InMemoryCostLedger({
    activeReservations: [
      { operationId: "duplicate", requestedReservationKrw: 1, kind: "provider" },
      { operationId: "duplicate", requestedReservationKrw: 1, kind: "logging" },
    ],
  }), /duplicate initial operation ID/);
});

test("price, FX, SKU, and reconciliation drift fail closed and reservation includes 10 percent buffer", async () => {
  const fixture = await costFixture();
  const now = Date.parse("2026-07-15T00:00:00Z");
  assert.deepEqual(validatePriceManifest({
    manifest: fixture.price_manifest,
    now,
    lastReconciledAt: now - 1_000,
  }), { allowed: true });

  const cases: readonly [PriceManifest, number, string][] = [
    [{ ...fixture.price_manifest, expires_at: "2026-07-14T00:00:00Z" }, now - 1_000, "PRICE_SNAPSHOT_EXPIRED"],
    [{ ...fixture.price_manifest, skus: fixture.price_manifest.skus.slice(1) }, now - 1_000, "CATALOG_SKU_MISSING"],
    [{ ...fixture.price_manifest, usd_krw: 0 }, now - 1_000, "FX_SNAPSHOT_INVALID"],
    [fixture.price_manifest, now - 21_600_001, "BILLING_RECONCILIATION_STALE"],
  ];
  for (const [manifest, lastReconciledAt, reason] of cases) {
    assert.deepEqual(validatePriceManifest({ manifest, now, lastReconciledAt }), { allowed: false, reason });
  }
  const duplicateSkuManifest: PriceManifest = {
    ...fixture.price_manifest,
    skus: [...fixture.price_manifest.skus.slice(0, -1), fixture.price_manifest.skus[0]!],
  };
  assert.deepEqual(validatePriceManifest({
    manifest: duplicateSkuManifest,
    now,
    lastReconciledAt: now - 1_000,
  }), { allowed: false, reason: "CATALOG_SKU_MISSING" });
  assert.deepEqual(validatePriceManifest({
    manifest: { ...fixture.price_manifest, effective_at: "2026-02-30T00:00:00Z" },
    now,
    lastReconciledAt: now - 1_000,
  }), { allowed: false, reason: "MANIFEST_INVALID" });
  const cost = calculateReservationKrw(fixture.price_manifest, {
    ai_provider_input: 1,
    cloud_run_requests: 1,
    firestore_ttl_deletes_seoul: 1,
  });
  assert.ok(cost !== undefined && cost > 0);
  assert.equal(calculateReservationKrw(fixture.price_manifest, { unknown_service: 1 }), undefined);
});

test("non-finite, negative, unsafe, and unrepresentable cost epochs fail closed", async () => {
  const fixture = await costFixture();
  const validNow = Date.parse("2026-07-15T00:00:00Z");
  const invalidEpochs = [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    -1,
    1.5,
    8_640_000_000_000_001,
    Number.MAX_SAFE_INTEGER,
  ];

  for (const now of invalidEpochs) {
    assert.deepEqual(validatePriceManifest({
      manifest: fixture.price_manifest,
      now,
      lastReconciledAt: validNow - 1_000,
    }), { allowed: false, reason: "MANIFEST_INVALID" });
  }
  for (const lastReconciledAt of invalidEpochs) {
    assert.deepEqual(validatePriceManifest({
      manifest: fixture.price_manifest,
      now: validNow,
      lastReconciledAt,
    }), { allowed: false, reason: "BILLING_RECONCILIATION_STALE" });
  }
});

test("invalid cost clocks reject admission before operation IDs or ledger mutation", async () => {
  const fixture = await costFixture();
  const validNow = Date.parse("2026-07-15T00:00:00Z");
  const invalidCases: readonly [number, number][] = [
    [Number.NaN, validNow - 1_000],
    [Number.POSITIVE_INFINITY, validNow - 1_000],
    [validNow, Number.NaN],
    [validNow, Number.NEGATIVE_INFINITY],
    [validNow, Number.MAX_SAFE_INTEGER],
  ];

  for (const [now, lastReconciledAt] of invalidCases) {
    const ledger = new InMemoryCostLedger();
    let operationIds = 0;
    const admission = new RecipeJobCostAdmission({
      ledger,
      manifest: fixture.price_manifest,
      quantities: { ai_provider_input: 1 },
      now: () => now,
      lastReconciledAt: () => lastReconciledAt,
      nextOperationId: () => {
        operationIds += 1;
        return randomUUID();
      },
    });
    assert.equal(admission.reserve(), "service_disabled");
    assert.equal(operationIds, 0);
    assert.equal(ledger.snapshot().activeReservationsKrw, 0);
  }
});

test("recipe job admission rejects the whole operation before content, queue, or provider work", async () => {
  const cost = await costFixture();
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  const draft = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8",
  )) as RecipeDraft;
  const now = Date.parse("2026-07-15T00:00:00Z");
  const ledger = new InMemoryCostLedger({ committedActualKrw: 44_999 });
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const service = new RecipeJobService({
    repository,
    provider,
    admission: new RecipeJobCostAdmission({
      ledger,
      manifest: cost.price_manifest,
      quantities: { ai_provider_input: 1, ai_provider_output: 1, cloud_run_requests: 1 },
      now: () => now,
      lastReconciledAt: () => now - 1_000,
      nextOperationId: randomUUID,
    }),
  });

  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "quota_exceeded");
  assert.deepEqual(repository.getStats(), {
    jobs: 0, contents: 0, workerOutbox: 0, cleanupTasks: 0, contentDeletes: 0,
    contentReads: 0, providerAttempts: 0, cleanupPending: 0, newJobsBlocked: false,
  });
  assert.equal(provider.callCount, 0);
});

test("recipe admission fails before ledger mutation when price or billing snapshot is stale", async () => {
  const cost = await costFixture();
  const now = Date.parse("2026-08-02T00:00:00Z");
  const ledger = new InMemoryCostLedger();
  const admission = new RecipeJobCostAdmission({
    ledger,
    manifest: cost.price_manifest,
    quantities: { ai_provider_input: 1 },
    now: () => now,
    lastReconciledAt: () => now - 21_600_001,
    nextOperationId: randomUUID,
  });
  assert.equal(admission.reserve(), "service_disabled");
  assert.equal(ledger.snapshot().activeReservationsKrw, 0);
});
