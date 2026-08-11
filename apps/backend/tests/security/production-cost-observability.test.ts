import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import {
  InMemoryProductionCostRepository,
  PRODUCTION_BILLABLE_OPERATION_ENVELOPES,
  PRODUCTION_MONTHLY_COST_LIMITS,
  PRODUCTION_PROVIDER_OPERATION_ENVELOPE,
  ProductionCostObservabilityGuard,
  type ProductionUsage,
} from "../../src/cost/production-cost-observability.js";
import type { PriceManifest } from "../../src/cost/price-manifest.js";
import {
  InMemoryTelemetrySink,
  SafeLogger,
  type SafeTelemetryEvent,
  type TelemetrySink,
} from "../../src/observability/safe-logger.js";

interface CostFixture {
  readonly price_manifest: PriceManifest;
}

const now = Date.parse("2026-07-15T00:00:00Z");

async function manifest(): Promise<PriceManifest> {
  const fixture = JSON.parse(await readFile(resolve(
    process.cwd(), "contracts/security/fixtures/cost-ledger-cases.json",
  ), "utf8")) as CostFixture;
  return fixture.price_manifest;
}

function reservation(operationId: string) {
  return {
    operationId,
    maxInputTokens: 5_000,
    maxOutputTokens: 2_000,
    maxProviderAttempts: 1,
    priceQuantities: { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE },
  };
}

async function fixture(options: {
  readonly committed?: ProductionUsage;
  readonly sink?: TelemetrySink;
  readonly clock?: () => number;
  readonly lastReconciledAt?: () => number;
  readonly priceManifest?: PriceManifest;
} = {}) {
  const repository = new InMemoryProductionCostRepository({
    billingMonth: "2026-07",
    ...(options.committed === undefined ? {} : { committed: options.committed }),
  });
  const sink = options.sink ?? new InMemoryTelemetrySink();
  const logger = new SafeLogger({ sink, now: options.clock ?? (() => now) });
  const guard = new ProductionCostObservabilityGuard({
    repository,
    manifest: options.priceManifest ?? await manifest(),
    logger,
    now: options.clock ?? (() => now),
    lastReconciledAt: options.lastReconciledAt ?? (() => now - 1_000),
  });
  return { repository, sink, logger, guard };
}

test("provider reservation is atomic across calls, tokens and KRW and replays without a second attempt", async () => {
  const { repository, sink, guard } = await fixture();
  assert.equal(guard.reserveProviderOperation(reservation("provider-atomic-1")), "accepted");
  assert.equal(guard.reserveProviderOperation(reservation("provider-atomic-1")), "replayed");
  assert.equal(guard.reserveProviderOperation({
    ...reservation("provider-atomic-1"), maxOutputTokens: 1_999,
  }), "service_disabled");
  assert.deepEqual(repository.snapshot().active, {
    providerCalls: 1,
    inputTokens: 5_000,
    outputTokens: 2_000,
    externalCostKrw: repository.snapshot().active.externalCostKrw,
  });
  assert.equal((sink as InMemoryTelemetrySink).events().length, 2);
  assert.equal(JSON.stringify((sink as InMemoryTelemetrySink).events()).includes("provider-atomic-1"), false);
});

test("each approved monthly hard cutoff rejects before provider side effects", async () => {
  const cases: readonly ProductionUsage[] = [
    { providerCalls: 5_500, inputTokens: 0, outputTokens: 0, externalCostKrw: 0 },
    { providerCalls: 0, inputTokens: 20_000_000, outputTokens: 0, externalCostKrw: 0 },
    { providerCalls: 0, inputTokens: 0, outputTokens: 8_000_000, externalCostKrw: 0 },
    { providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw: 45_000 },
  ];
  for (const [index, committed] of cases.entries()) {
    const { repository, guard } = await fixture({ committed });
    assert.equal(guard.reserveProviderOperation(reservation(`hard-cutoff-${index}`)),
      "quota_exceeded");
    assert.deepEqual(repository.snapshot().active, {
      providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw: 0,
    });
    assert.equal(repository.snapshot().killSwitch, true);
  }
});

test("competing reservations have one whole-operation winner and immutable rejection", async () => {
  const { repository } = await fixture({
    committed: {
      providerCalls: 0,
      inputTokens: 19_993_000,
      outputTokens: 0,
      externalCostKrw: 0,
    },
  });
  const requests = ["competition-a", "competition-b"].map((operationId) => ({
    operationId,
    billingMonth: "2026-07",
    operationKind: "provider" as const,
    envelopeHash: "a".repeat(64),
    usage: { providerCalls: 1, inputTokens: 5_000, outputTokens: 1, externalCostKrw: 1 },
  }));
  const decisions = await Promise.all(requests.map(async (request) => repository.reserve(request)));
  assert.deepEqual(decisions.map((decision) => decision.kind), ["accepted", "hard_cutoff"]);
  assert.equal(repository.snapshot().active.providerCalls, 1);
  assert.equal(repository.snapshot().active.inputTokens, 5_000);
  assert.equal(repository.reserve(requests[1]!).kind, "hard_cutoff");
  assert.equal(repository.reserve({
    ...requests[1]!, usage: { ...requests[1]!.usage, inputTokens: 1 },
  }).kind, "operation_conflict");
});

test("cost admission emits bounded 50, 75 and 90 percent alert buckets", async () => {
  const cases = [
    [20_000, "50"],
    [32_500, "75"],
    [40_000, "90"],
  ] as const;
  for (const [committedKrw, expectedBucket] of cases) {
    const run = await fixture({
      committed: {
        providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw: committedKrw,
      },
    });
    assert.equal(run.guard.reserveBillableOperation({
      operationId: `alert-${expectedBucket}`,
      operationKind: "logging",
      priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES.logging },
    }), "accepted");
    const events = (run.sink as InMemoryTelemetrySink).events();
    assert.equal(events[0]?.percentage_bucket, expectedBucket);
    assert.equal(events[0]?.quota_dimension, "external_cost");
  }
});

test("request limits, billing month, clock, price and reconciliation fail closed", async () => {
  const valid = await fixture();
  assert.equal(valid.guard.reserveProviderOperation({
    ...reservation("too-many-input"), maxInputTokens: 5_001,
  }), "service_disabled");
  assert.equal(valid.guard.reserveProviderOperation({
    ...reservation("too-many-output"), maxOutputTokens: 2_001,
  }), "service_disabled");
  assert.equal(valid.guard.reserveProviderOperation({
    ...reservation("retry-not-reserved"), maxProviderAttempts: 2,
  }), "service_disabled");
  const incompleteEnvelope = reservation("incomplete-envelope");
  assert.equal(valid.guard.reserveProviderOperation({
    ...incompleteEnvelope,
    priceQuantities: { ai_provider_input: 0.005, ai_provider_output: 0.002 },
  }), "service_disabled");
  assert.deepEqual(valid.repository.snapshot().active, {
    providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw: 0,
  });

  const badClock = await fixture({ clock: () => Number.NaN });
  assert.equal(badClock.guard.reserveProviderOperation(reservation("bad-clock")), "service_disabled");
  const stale = await fixture({ lastReconciledAt: () => now - 21_600_001 });
  assert.equal(stale.guard.reserveProviderOperation(reservation("stale-billing")), "service_disabled");
  const expiredManifest = { ...(await manifest()), expires_at: "2026-07-14T00:00:00Z" };
  const expired = await fixture({ priceManifest: expiredManifest });
  assert.equal(expired.guard.reserveProviderOperation(reservation("expired-price")), "service_disabled");
});

test("QA-HIGH-004-001 exact provider envelope rejects every quantity mutation", async () => {
  const providerEnvelope: Readonly<Record<string, number>> = PRODUCTION_PROVIDER_OPERATION_ENVELOPE;
  const requiredServices = Object.keys(providerEnvelope);
  for (const service of requiredServices) {
    for (const mutation of [0, providerEnvelope[service]! / 2,
      providerEnvelope[service]! * 2, Number.POSITIVE_INFINITY] as const) {
      const run = await fixture();
      assert.equal(run.guard.reserveProviderOperation({
        ...reservation(`provider-${service}-${mutation}`),
        priceQuantities: { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE, [service]: mutation },
      }), "service_disabled", `${service}=${mutation}`);
      assert.equal(run.repository.snapshot().active.providerCalls, 0);
    }
    const missing = { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE } as Record<string, number>;
    delete missing[service];
    const run = await fixture();
    assert.equal(run.guard.reserveProviderOperation({
      ...reservation(`provider-missing-${service}`), priceQuantities: missing,
    }), "service_disabled", `missing ${service}`);
  }
  const extra = await fixture();
  assert.equal(extra.guard.reserveProviderOperation({
    ...reservation("provider-extra"),
    priceQuantities: { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE, cloud_build: 1 },
  }), "service_disabled");
  const invalid = await fixture();
  assert.equal(invalid.guard.reserveProviderOperation({
    ...reservation("provider-nan"),
    priceQuantities: { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE, cloud_logging: Number.NaN },
  }), "service_disabled");
});

test("QA-HIGH-004-002 full envelope hash distinguishes same-KRW accepted and rejected requests", () => {
  const accepted = new InMemoryProductionCostRepository({ billingMonth: "2026-07" });
  const base = {
    operationId: "same-rounded-accepted",
    billingMonth: "2026-07",
    operationKind: "provider" as const,
    usage: { providerCalls: 1, inputTokens: 5_000, outputTokens: 2_000, externalCostKrw: 11 },
  };
  assert.equal(accepted.reserve({ ...base, envelopeHash: "a".repeat(64) }).kind, "accepted");
  assert.equal(accepted.reserve({ ...base, envelopeHash: "b".repeat(64) }).kind,
    "operation_conflict");

  const rejected = new InMemoryProductionCostRepository({
    billingMonth: "2026-07",
    committed: { providerCalls: 5_500, inputTokens: 0, outputTokens: 0, externalCostKrw: 0 },
  });
  const blocked = { ...base, operationId: "same-rounded-rejected" };
  assert.equal(rejected.reserve({ ...blocked, envelopeHash: "c".repeat(64) }).kind, "hard_cutoff");
  assert.equal(rejected.reserve({ ...blocked, envelopeHash: "d".repeat(64) }).kind,
    "operation_conflict");
});

test("QA-HIGH-004-002 manifest identity is part of an accepted guard replay", async () => {
  const first = await fixture();
  assert.equal(first.guard.reserveProviderOperation(reservation("manifest-identity")), "accepted");
  const changedManifest: PriceManifest = {
    ...(await manifest()),
    skus: (await manifest()).skus.map((sku) => sku.service === "cloud_run_cpu_seoul_tier2"
      ? { ...sku, unit_price_usd: 0.0000263 }
      : sku),
  };
  const second = new ProductionCostObservabilityGuard({
    repository: first.repository,
    manifest: changedManifest,
    logger: new SafeLogger({ sink: new InMemoryTelemetrySink(), now: () => now }),
    now: () => now,
    lastReconciledAt: () => now - 1_000,
  });
  assert.equal(second.reserveProviderOperation(reservation("manifest-identity")), "service_disabled");
  assert.equal(first.repository.snapshot().active.providerCalls, 1);
});

test("storage, authentication, logging and retry costs share the KRW ledger", async () => {
  const { repository, guard } = await fixture();
  const operations = [
    "firestore",
    "authentication",
    "logging",
    "privacy_cleanup",
  ] as const;
  for (const [index, operationKind] of operations.entries()) {
    assert.equal(guard.reserveBillableOperation({
      operationId: `${operationKind}-${index}`,
      operationKind,
      priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[operationKind] },
    }), "accepted");
  }
  assert.equal(guard.reserveBillableOperation({
    operationId: "logging-retry-1",
    operationKind: "logging",
    priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES.logging },
  }), "accepted");
  assert.equal(repository.snapshot().active.providerCalls, 0);
  assert.ok(repository.snapshot().active.externalCostKrw >= operations.length + 1);
  assert.equal(repository.authorizeReservedPrivacyCleanup("privacy_cleanup-3"), true);
});

test("QA-HIGH-004-003 every operation kind enforces its exact SKU contract", async () => {
  const kinds = Object.keys(PRODUCTION_BILLABLE_OPERATION_ENVELOPES) as Array<
  keyof typeof PRODUCTION_BILLABLE_OPERATION_ENVELOPES>;
  for (const kind of kinds) {
    const expectedEnvelope: Readonly<Record<string, number>> =
      PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind];
    const valid = await fixture();
    assert.equal(valid.guard.reserveBillableOperation({
      operationId: `${kind}-valid`, operationKind: kind,
      priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind] },
    }), "accepted", kind);

    const firstService = Object.keys(expectedEnvelope)[0]!;
    const mutations: Record<string, number>[] = [
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], [firstService]: 0 },
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], [firstService]:
        expectedEnvelope[firstService]! / 2 },
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], [firstService]:
        expectedEnvelope[firstService]! * 2 },
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], [firstService]: Number.NaN },
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], [firstService]: Number.POSITIVE_INFINITY },
      { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind], ai_provider_input: 0.000001 },
    ];
    const missing = { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES[kind] } as Record<string, number>;
    delete missing[firstService];
    mutations.push(missing);
    for (const [index, priceQuantities] of mutations.entries()) {
      const invalid = await fixture();
      assert.equal(invalid.guard.reserveBillableOperation({
        operationId: `${kind}-invalid-${index}`, operationKind: kind, priceQuantities,
      }), "service_disabled", `${kind} mutation ${index}`);
      assert.equal(invalid.repository.snapshot().active.externalCostKrw, 0);
    }
  }

  const cleanup = await fixture();
  assert.equal(cleanup.guard.reserveBillableOperation({
    operationId: "cleanup-reserved",
    operationKind: "privacy_cleanup",
    priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES.privacy_cleanup },
  }), "accepted");
  cleanup.repository.tripKillSwitch();
  assert.equal(cleanup.repository.authorizeReservedPrivacyCleanup("cleanup-reserved"), true);
  assert.equal(cleanup.repository.authorizeReservedPrivacyCleanup("cleanup-invalid"), false);
});

test("QA-HIGH-004-004 provider request uses one immutable data-property projection", async () => {
  const tokenGetter = await fixture();
  let tokenReads = 0;
  const changingTokenRequest = {
    ...reservation("changing-token-getter"),
    get maxInputTokens(): number {
      tokenReads += 1;
      return tokenReads === 1 ? 5_000 : 0;
    },
  };
  assert.equal(tokenGetter.guard.reserveProviderOperation(changingTokenRequest), "service_disabled");
  assert.equal(tokenReads, 0);
  assert.deepEqual(tokenGetter.repository.snapshot().active, {
    providerCalls: 0, inputTokens: 0, outputTokens: 0, externalCostKrw: 0,
  });

  const quantityGetter = await fixture();
  let quantityReads = 0;
  const accessorEnvelope = { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE };
  Object.defineProperty(accessorEnvelope, "cloud_logging", {
    enumerable: true,
    get(): number {
      quantityReads += 1;
      throw new Error("quantity getter must not execute");
    },
  });
  assert.equal(quantityGetter.guard.reserveProviderOperation({
    ...reservation("quantity-accessor"), priceQuantities: accessorEnvelope,
  }), "service_disabled");
  assert.equal(quantityReads, 0);
  assert.equal(quantityGetter.repository.snapshot().active.providerCalls, 0);

  const throwingProxy = await fixture();
  let proxyTrapReads = 0;
  const proxyRequest = new Proxy(reservation("throwing-request-proxy"), {
    ownKeys(): never {
      proxyTrapReads += 1;
      throw new Error("request proxy trap must not execute");
    },
  });
  assert.equal(throwingProxy.guard.reserveProviderOperation(proxyRequest), "service_disabled");
  assert.equal(proxyTrapReads, 0);
  assert.equal(throwingProxy.repository.snapshot().active.providerCalls, 0);

  const unknownField = await fixture();
  assert.equal(unknownField.guard.reserveProviderOperation({
    ...reservation("unknown-request-field"), unknown: true,
  } as Parameters<ProductionCostObservabilityGuard["reserveProviderOperation"]>[0]),
  "service_disabled");
  const symbolField = await fixture();
  const symbolRequest = reservation("symbol-request-field") as Record<PropertyKey, unknown>;
  symbolRequest[Symbol("secret")] = "must-not-be-read";
  assert.equal(symbolField.guard.reserveProviderOperation(symbolRequest as unknown as
    Parameters<ProductionCostObservabilityGuard["reserveProviderOperation"]>[0]),
  "service_disabled");
  assert.equal(symbolField.repository.snapshot().active.providerCalls, 0);
});

test("QA-MEDIUM-004-002 billable request rejects mutable kind and every non-exact shape", async () => {
  const kindGetter = await fixture();
  let kindReads = 0;
  const changingKindRequest = {
    operationId: "changing-kind-getter",
    get operationKind(): "runtime" | "privacy_cleanup" {
      kindReads += 1;
      return kindReads === 1 ? "runtime" : "privacy_cleanup";
    },
    priceQuantities: { ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES.runtime },
  };
  assert.equal(kindGetter.guard.reserveBillableOperation(changingKindRequest), "service_disabled");
  assert.equal(kindReads, 0);
  assert.equal(kindGetter.repository.authorizeReservedPrivacyCleanup("changing-kind-getter"), false);
  assert.equal(kindGetter.repository.snapshot().active.externalCostKrw, 0);

  const nonEnumerable = await fixture();
  const nonEnumerableEnvelope: Record<string, number> = {
    ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE,
  };
  Object.defineProperty(nonEnumerableEnvelope, "cloud_build", {
    value: 1, enumerable: false, writable: true, configurable: true,
  });
  assert.equal(nonEnumerable.guard.reserveProviderOperation({
    ...reservation("non-enumerable-extra"), priceQuantities: nonEnumerableEnvelope,
  }), "service_disabled");
  assert.equal(nonEnumerable.repository.snapshot().active.providerCalls, 0);

  const invalidKind = await fixture();
  assert.equal(invalidKind.guard.reserveBillableOperation({
    operationId: "invalid-kind",
    operationKind: "provider",
    priceQuantities: { ...PRODUCTION_PROVIDER_OPERATION_ENVELOPE },
  } as unknown as Parameters<ProductionCostObservabilityGuard["reserveBillableOperation"]>[0]),
  "service_disabled");
  assert.equal(invalidKind.repository.snapshot().active.externalCostKrw, 0);

  const quantityProxy = await fixture();
  let proxyTrapReads = 0;
  const proxiedQuantities = new Proxy({ ...PRODUCTION_BILLABLE_OPERATION_ENVELOPES.runtime }, {
    getOwnPropertyDescriptor(): never {
      proxyTrapReads += 1;
      throw new Error("quantity proxy trap must not execute");
    },
  });
  assert.equal(quantityProxy.guard.reserveBillableOperation({
    operationId: "billable-quantity-proxy",
    operationKind: "runtime",
    priceQuantities: proxiedQuantities,
  }), "service_disabled");
  assert.equal(proxyTrapReads, 0);
  assert.equal(quantityProxy.repository.snapshot().active.externalCostKrw, 0);
});

test("telemetry reservation or sink failure trips the kill switch before provider work", async () => {
  const throwingSink: TelemetrySink = {
    write(_event: SafeTelemetryEvent): void {
      throw new Error("Bearer synthetic-secret raw-recipe");
    },
  };
  const { repository, logger, guard } = await fixture({ sink: throwingSink });
  assert.equal(guard.reserveProviderOperation(reservation("telemetry-failure")), "service_disabled");
  assert.equal(repository.snapshot().active.providerCalls, 1);
  assert.equal(repository.snapshot().killSwitch, true);
  assert.equal(guard.reserveProviderOperation(reservation("blocked-after-telemetry")), "service_disabled");
  assert.equal(logger.dropCounts().SINK_UNAVAILABLE, 1);
  assert.equal(JSON.stringify(logger.dropCounts()).includes("synthetic-secret"), false);
});

test("result disclosure requires bounded settlement and terminal telemetry", async () => {
  const successful = await fixture();
  assert.equal(successful.guard.reserveProviderOperation(reservation("terminal-success")), "accepted");
  assert.equal(successful.guard.settleAndAuthorizeResult("terminal-success", {
    inputTokens: 4_000,
    outputTokens: 1_000,
    externalCostKrw: successful.repository.snapshot().active.externalCostKrw,
    providerOutcome: "succeeded",
    latencyMsBucket: "lt_5000",
  }), true);
  assert.equal(successful.repository.snapshot().active.providerCalls, 0);
  assert.equal(successful.repository.snapshot().committed.providerCalls, 1);

  const overflow = await fixture();
  assert.equal(overflow.guard.reserveProviderOperation(reservation("token-overflow")), "accepted");
  assert.equal(overflow.guard.settleAndAuthorizeResult("token-overflow", {
    inputTokens: 5_001,
    outputTokens: 1,
    externalCostKrw: 1,
    providerOutcome: "failed",
    latencyMsBucket: "lt_500",
  }), false);
  assert.equal(overflow.repository.snapshot().integrityIncident, true);
  assert.equal(overflow.repository.snapshot().killSwitch, true);
});

test("terminal telemetry failure keeps the settled result private and blocks new cost", async () => {
  let writes = 0;
  const sink: TelemetrySink = {
    write(_event: SafeTelemetryEvent): void {
      writes += 1;
      if (writes >= 2) throw new Error("telemetry unavailable");
    },
  };
  const { repository, guard } = await fixture({ sink });
  assert.equal(guard.reserveProviderOperation(reservation("private-result")), "accepted");
  assert.equal(guard.settleAndAuthorizeResult("private-result", {
    inputTokens: 1,
    outputTokens: 1,
    externalCostKrw: 1,
    providerOutcome: "succeeded",
    latencyMsBucket: "lt_100",
  }), false);
  assert.equal(repository.snapshot().committed.providerCalls, 1);
  assert.equal(repository.snapshot().killSwitch, true);
  assert.equal(guard.reserveProviderOperation(reservation("after-private-result")), "service_disabled");
});

test("approved limits and exact envelopes match the production security contract", async () => {
  const contract = JSON.parse(await readFile(resolve(
    process.cwd(), "contracts/security/fixtures/production-cost-hard-cutoffs.json",
  ), "utf8")) as {
    readonly provider_envelope: Readonly<Record<string, number>>;
    readonly operation_kind_envelopes: Readonly<Record<string, Readonly<Record<string, number>>>>;
  };
  assert.deepEqual(PRODUCTION_MONTHLY_COST_LIMITS, {
    providerCalls: 5_500,
    inputTokens: 20_000_000,
    outputTokens: 8_000_000,
    externalCostKrw: 50_000,
    delayedBillingReserveKrw: 5_000,
    maxInputTokensPerCall: 5_000,
    maxOutputTokensPerCall: 2_000,
    maxProviderAttemptsPerOperation: 1,
  });
  assert.deepEqual(PRODUCTION_PROVIDER_OPERATION_ENVELOPE, contract.provider_envelope);
  assert.deepEqual(PRODUCTION_BILLABLE_OPERATION_ENVELOPES, contract.operation_kind_envelopes);
});
