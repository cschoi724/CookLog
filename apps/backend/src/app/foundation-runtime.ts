import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

import { DeterministicMockRecipeAIProvider } from "../ai/mock-recipe-provider.js";
import type { RecipeAIProvider } from "../ai/provider.js";
import type { VerifiedAttestation } from "../auth/attestation.js";
import { createAuthenticationGuard } from "../auth/authentication.js";
import {
  LocalInstallationTokenService,
  type IssuedInstallationToken,
} from "../auth/installation-token.js";
import { InMemoryRawMetadataRepository } from "../cleanup/raw-metadata-cleanup.js";
import type { RuntimeConfig } from "../config/runtime-config.js";
import { InMemoryCostLedger } from "../cost/cost-ledger.js";
import {
  REQUIRED_EXTERNAL_COST_SERVICES,
  type PriceManifest,
} from "../cost/price-manifest.js";
import { RecipeJobCostAdmission } from "../cost/recipe-job-cost-admission.js";
import { InMemoryIdempotencyStore } from "../idempotency/idempotency-store.js";
import { installCommonHttp } from "../http/common-http.js";
import { RecipeJobService } from "../jobs/recipe-job-service.js";
import { createProtectedRateLimitGuard } from "../limits/rate-limit-guard.js";
import { InMemoryRateLimiter } from "../limits/rate-limiter.js";
import {
  InMemoryTelemetrySink,
  SafeLogger,
  type TelemetryEventName,
  type TelemetrySink,
} from "../observability/safe-logger.js";
import { installRecipeJobRoutes } from "../routes/ai/recipe-job-routes.js";
import {
  InMemoryRecipeJobRepository,
  type PendingTerminalFacts,
} from "../storage/recipe-job-repository.js";
import { installDisabledRemoteSTTHttpBoundary } from "../stt/disabled-http-boundary.js";
import { buildApp } from "./build-app.js";

const DAY_MS = 86_400_000;
const LOCAL_DEPLOYMENT_VERSION = "local-foundation-build-v1";
const LOCAL_MANIFEST_VERSION = "local-cost-manifest-v1";

function rfc3339Seconds(epochMs: number): string {
  return new Date(epochMs).toISOString().replace(".000Z", "Z");
}

export function createLocalPriceManifest(now: number): PriceManifest {
  if (!Number.isSafeInteger(now) || now < DAY_MS || now > 8_640_000_000_000_000 - 30 * DAY_MS) {
    throw new Error("local price manifest requires a valid server epoch");
  }
  return Object.freeze({
    effective_at: rfc3339Seconds(now - DAY_MS),
    expires_at: rfc3339Seconds(now + 30 * DAY_MS),
    usd_krw: 1_400,
    tax_fx_buffer_percent: 10,
    billing_reconciliation_max_delay_seconds: 21_600,
    fixture_only: true,
    skus: Object.freeze(REQUIRED_EXTERNAL_COST_SERVICES.map((service) => Object.freeze({
      service,
      catalog_sku_id: `local-${service}`,
      unit: "fixture_unit",
      unit_price_krw: 1,
    }))),
  });
}

export interface LocalFoundationRuntime {
  readonly app: FastifyInstance;
  readonly tokenService: LocalInstallationTokenService;
  readonly repository: InMemoryRecipeJobRepository;
  readonly service: RecipeJobService;
  readonly ledger: InMemoryCostLedger;
  readonly logger: SafeLogger;
  readonly telemetrySink: InMemoryTelemetrySink;
  readonly rawMetadata: InMemoryRawMetadataRepository;
  issueInstallationToken(attestation: VerifiedAttestation): IssuedInstallationToken;
  execute(jobId: string): Promise<"completed" | "ignored" | "telemetry_unavailable">;
  runMaintenance(): { readonly recipeContentDeleted: number; readonly rawMetadataDeleted: number };
}

export async function createLocalFoundationRuntime(
  config: RuntimeConfig,
  options: {
    readonly now?: () => number;
    readonly nowSeconds?: () => number;
    readonly provider?: RecipeAIProvider;
    readonly manifest?: PriceManifest;
    readonly lastReconciledAt?: () => number;
    readonly ledger?: InMemoryCostLedger;
    readonly telemetrySink?: TelemetrySink;
    readonly telemetryReserve?: (eventName: TelemetryEventName) => boolean;
    readonly terminalTelemetryEvent?: (facts: PendingTerminalFacts) => unknown;
    readonly projectRequestsPerMinute?: number;
  } = {},
): Promise<LocalFoundationRuntime> {
  if (config.environment === "production") {
    throw new Error("local foundation adapters cannot run in production");
  }
  const now = options.now ?? Date.now;
  const initialNow = now();
  const manifest = options.manifest ?? createLocalPriceManifest(initialNow);
  const lastReconciledAt = options.lastReconciledAt ?? (() => initialNow);
  const ledger = options.ledger ?? new InMemoryCostLedger();
  const repository = new InMemoryRecipeJobRepository({ now });
  const rawMetadata = new InMemoryRawMetadataRepository({ now });
  const inMemoryTelemetrySink = new InMemoryTelemetrySink();
  const telemetrySink: TelemetrySink = options.telemetrySink ?? {
    write(event): void {
      inMemoryTelemetrySink.write(event);
      rawMetadata.create(1);
    },
  };
  const logger = new SafeLogger({
    sink: telemetrySink,
    now,
    reserve: options.telemetryReserve ?? (() => ledger.reserve({
      operationId: randomUUID(),
      requestedReservationKrw: 1,
      kind: "logging",
    }).decision === "accepted"),
    approvedDeploymentVersions: [LOCAL_DEPLOYMENT_VERSION],
    approvedManifestVersions: [LOCAL_MANIFEST_VERSION],
  });
  const provider = options.provider ?? new DeterministicMockRecipeAIProvider({
    kind: "failure",
    code: "AI_UNAVAILABLE",
  });
  const service = new RecipeJobService({
    repository,
    provider,
    auditTerminal: (facts) => logger.emit(
      "ai_job_state_changed",
      options.terminalTelemetryEvent?.(facts) ?? {
        previous_state: facts.previousState,
        next_state: facts.nextState,
        provider_attempt_count: facts.providerAttemptCount,
        deployment_version: LOCAL_DEPLOYMENT_VERSION,
      },
    ),
    admission: new RecipeJobCostAdmission({
      ledger,
      manifest,
      quantities: {
        ai_provider_input: 0.000004,
        ai_provider_output: 0.000004,
        cloud_run_requests: 0.000001,
      },
      now,
      lastReconciledAt,
      nextOperationId: randomUUID,
    }),
  });
  const tokenService = options.nowSeconds === undefined
    ? new LocalInstallationTokenService()
    : new LocalInstallationTokenService({ nowSeconds: options.nowSeconds });
  const limiter = new InMemoryRateLimiter(now);
  const limitOptions = options.projectRequestsPerMinute === undefined
    ? { limiter }
    : { limiter, projectRequestsPerMinute: options.projectRequestsPerMinute };
  const app = await buildApp(config);
  installCommonHttp(app);
  installDisabledRemoteSTTHttpBoundary(app);
  installRecipeJobRoutes(app, {
    service,
    authenticate: createAuthenticationGuard(tokenService),
    enforceReadLimits: createProtectedRateLimitGuard({
      ...limitOptions,
    }),
    enforceMutationLimits: createProtectedRateLimitGuard({
      ...limitOptions,
      mutation: true,
    }),
    idempotencyStore: new InMemoryIdempotencyStore({ now }),
  });

  return Object.freeze({
    app,
    tokenService,
    repository,
    service,
    ledger,
    logger,
    telemetrySink: inMemoryTelemetrySink,
    rawMetadata,
    issueInstallationToken(attestation: VerifiedAttestation): IssuedInstallationToken {
      return tokenService.issue(attestation);
    },
    async execute(jobId: string): Promise<"completed" | "ignored" | "telemetry_unavailable"> {
      const before = repository.getExecutionFacts(jobId);
      if (before === undefined || (before.state !== "queued" && before.state !== "processing")) {
        return "ignored";
      }
      if (repository.getPendingTerminalFacts(jobId) === undefined) {
        if (!logger.emit("ai_job_state_changed", {
          previous_state: before.state,
          next_state: "processing",
          provider_attempt_count: 0,
          deployment_version: LOCAL_DEPLOYMENT_VERSION,
        })) return "telemetry_unavailable";
      }
      return service.execute(jobId);
    },
    runMaintenance(): { readonly recipeContentDeleted: number; readonly rawMetadataDeleted: number } {
      return Object.freeze({
        recipeContentDeleted: repository.runScheduledCleanup(),
        rawMetadataDeleted: rawMetadata.runIndependentSweeper(),
      });
    },
  });
}
