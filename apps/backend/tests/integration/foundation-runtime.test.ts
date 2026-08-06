import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import {
  createLocalFoundationRuntime,
  createLocalPriceManifest,
} from "../../src/app/foundation-runtime.js";
import type { VerifiedAttestation } from "../../src/auth/attestation.js";
import { loadRuntimeConfig } from "../../src/config/runtime-config.js";
import { InMemoryCostLedger } from "../../src/cost/cost-ledger.js";

const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";
const validNow = Date.parse("2026-07-31T09:01:00Z");
const attestation: VerifiedAttestation = {
  provider: "apple_app_attest",
  appId: "app.cooklog.ios",
  environment: "production",
  installationId,
  replayProtected: true,
  verifiedAt: new Date(validNow),
};

async function fixtures(): Promise<{ readonly request: RecipeJobCreateRequest; readonly draft: RecipeDraft }> {
  const [request, draft] = await Promise.all([
    readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8"),
    readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8"),
  ]);
  return {
    request: JSON.parse(request) as RecipeJobCreateRequest,
    draft: JSON.parse(draft) as RecipeDraft,
  };
}

function config() {
  return loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" });
}

function authHeaders(accessToken: string) {
  return {
    authorization: `Bearer ${accessToken}`,
    "cooklog-installation-id": installationId,
  };
}

test("foundation composition serves fixture-equivalent authenticated create, worker, poll, and ACK", async () => {
  const { request, draft } = await fixtures();
  let now = validNow;
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const runtime = await createLocalFoundationRuntime(config(), {
    now: () => now,
    nowSeconds: () => Math.floor(now / 1_000),
    provider,
  });
  const token = runtime.issueInstallationToken(attestation);
  const headers = authHeaders(token.accessToken);

  const health = await runtime.app.inject({ method: "GET", url: "/healthz" });
  assert.equal(health.statusCode, 200);
  assert.deepEqual(health.json(), {
    status: "ok",
    service: "cooklog-backend",
    contract_version: "health.v1",
  });

  const missingAuth = await runtime.app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { "idempotency-key": randomUUID() },
    payload: request,
  });
  assert.equal(missingAuth.statusCode, 401);
  assert.equal(runtime.repository.getStats().jobs, 0);

  const createKey = randomUUID();
  const created = await runtime.app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { ...headers, "idempotency-key": createKey },
    payload: request,
  });
  const replay = await runtime.app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { ...headers, "idempotency-key": createKey },
    payload: request,
  });
  assert.equal(created.statusCode, 202);
  assert.equal(replay.statusCode, 202);
  assert.deepEqual(replay.json(), created.json());
  assert.equal(replay.headers["cooklog-idempotency-replayed"], "true");
  assert.equal(runtime.repository.getStats().jobs, 1);
  assert.ok(runtime.ledger.snapshot().activeReservationsKrw >= 1);

  const jobId = created.json().data.job_id as string;
  now += 8_000;
  assert.equal(await runtime.execute(jobId), "completed");
  const polled = await runtime.app.inject({
    method: "GET",
    url: `/v1/ai/recipe-jobs/${jobId}`,
    headers,
  });
  assert.equal(polled.statusCode, 200);
  assert.equal(polled.json().data.state, "succeeded");
  assert.equal(polled.json().data.result_state, "available");
  assert.deepEqual(polled.json().data.result, draft);

  const ackKey = randomUUID();
  const ackBody = { result_version: 1, saved_locally_at: "2026-07-31T09:01:09Z" };
  const acknowledged = await runtime.app.inject({
    method: "POST",
    url: `/v1/ai/recipe-jobs/${jobId}/result-acknowledgements`,
    headers: { ...headers, "idempotency-key": ackKey },
    payload: ackBody,
  });
  const ackReplay = await runtime.app.inject({
    method: "POST",
    url: `/v1/ai/recipe-jobs/${jobId}/result-acknowledgements`,
    headers: { ...headers, "idempotency-key": ackKey },
    payload: ackBody,
  });
  assert.equal(acknowledged.statusCode, 200);
  assert.deepEqual(ackReplay.json(), acknowledged.json());
  assert.equal(ackReplay.headers["cooklog-idempotency-replayed"], "true");
  assert.equal(acknowledged.json().data.result_state, "acknowledged_deleted");
  assert.equal(runtime.repository.getStats().contentDeletes, 1);
  assert.equal(provider.callCount, 1);

  const telemetry = JSON.stringify(runtime.telemetrySink.events());
  assert.equal(runtime.telemetrySink.events().length, 2);
  assert.equal(runtime.rawMetadata.stats().records, 2);
  for (const step of request.steps) assert.equal(telemetry.includes(step.transcript), false);
  assert.equal(telemetry.includes(draft.title), false);
  assert.equal(runtime.logger.emit("ai_job_state_changed", {
    previous_state: "queued",
    next_state: "processing",
    provider_attempt_count: 0,
    deployment_version: "grandmas_recipe_notes",
  }), false);
  assert.equal(JSON.stringify(runtime.telemetrySink.events()).includes("grandmas_recipe_notes"), false);

  await runtime.app.close();
});

test("integrated rate and cost guards reject before repository and provider side effects", async () => {
  const { request, draft } = await fixtures();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const limited = await createLocalFoundationRuntime(config(), {
    now: () => validNow,
    nowSeconds: () => Math.floor(validNow / 1_000),
    provider,
    projectRequestsPerMinute: 1,
  });
  const limitedHeaders = authHeaders(limited.issueInstallationToken(attestation).accessToken);
  assert.equal((await limited.app.inject({
    method: "POST", url: "/v1/ai/recipe-jobs",
    headers: { ...limitedHeaders, "idempotency-key": randomUUID() }, payload: request,
  })).statusCode, 202);
  const rateBlocked = await limited.app.inject({
    method: "POST", url: "/v1/ai/recipe-jobs",
    headers: { ...limitedHeaders, "idempotency-key": randomUUID() }, payload: request,
  });
  assert.equal(rateBlocked.statusCode, 429);
  assert.equal(rateBlocked.json().code, "RATE_LIMITED");
  assert.equal(limited.repository.getStats().jobs, 1);
  assert.equal(provider.callCount, 0);
  await limited.app.close();

  const cutoffProvider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const cutoff = await createLocalFoundationRuntime(config(), {
    now: () => validNow,
    nowSeconds: () => Math.floor(validNow / 1_000),
    provider: cutoffProvider,
    ledger: new InMemoryCostLedger({ committedActualKrw: 45_000 }),
  });
  const cutoffHeaders = authHeaders(cutoff.issueInstallationToken(attestation).accessToken);
  const costBlocked = await cutoff.app.inject({
    method: "POST", url: "/v1/ai/recipe-jobs",
    headers: { ...cutoffHeaders, "idempotency-key": randomUUID() }, payload: request,
  });
  assert.equal(costBlocked.statusCode, 429);
  assert.equal(costBlocked.json().code, "QUOTA_EXCEEDED");
  assert.equal(cutoff.repository.getStats().jobs, 0);
  assert.equal(cutoffProvider.callCount, 0);
  await cutoff.app.close();
});

test("invalid clocks and remote STT attempts remain fail closed in the integrated app", async () => {
  const { request, draft } = await fixtures();
  let now = validNow;
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const runtime = await createLocalFoundationRuntime(config(), {
    now: () => now,
    nowSeconds: () => Math.floor(validNow / 1_000),
    provider,
    manifest: createLocalPriceManifest(validNow),
    lastReconciledAt: () => validNow,
  });
  const headers = authHeaders(runtime.issueInstallationToken(attestation).accessToken);

  now = Number.NaN;
  const invalidClock = await runtime.app.inject({
    method: "POST", url: "/v1/ai/recipe-jobs",
    headers: { ...headers, "idempotency-key": randomUUID() }, payload: request,
  });
  assert.equal(invalidClock.statusCode, 503);
  assert.equal(invalidClock.json().code, "SERVICE_DISABLED");
  assert.equal(runtime.repository.getStats().jobs, 0);
  assert.equal(provider.callCount, 0);
  assert.equal(runtime.rawMetadata.newRawEventsBlocked(), true);

  const remote = await runtime.app.inject({
    method: "POST",
    url: "/v1/stt/transcriptions?token=synthetic-secret",
    payload: "synthetic-audio-bytes",
  });
  assert.equal(remote.statusCode, 503);
  assert.equal(remote.json().code, "SERVICE_DISABLED");
  assert.equal(remote.body.includes("synthetic-audio-bytes"), false);
  assert.equal(remote.body.includes("synthetic-secret"), false);
  assert.equal(provider.callCount, 0);

  await runtime.app.close();
});

test("production cannot instantiate local token, provider, or storage adapters", async () => {
  const production = loadRuntimeConfig({
    COOKLOG_ENV: "production",
    HOST: "0.0.0.0",
    PORT: "8080",
    K_SERVICE: "cooklog-local",
    K_REVISION: "cooklog-local-00001",
    K_CONFIGURATION: "cooklog-local",
  });
  await assert.rejects(createLocalFoundationRuntime(production), /cannot run in production/);
});
