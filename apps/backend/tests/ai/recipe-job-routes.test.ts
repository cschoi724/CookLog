import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import Fastify from "fastify";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import { computeSnapshotSha256 } from "../../src/ai/recipe-validation.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { createAuthenticationGuard } from "../../src/auth/authentication.js";
import { LocalInstallationTokenService } from "../../src/auth/installation-token.js";
import { installCommonHttp } from "../../src/http/common-http.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import { installRecipeJobRoutes } from "../../src/routes/ai/recipe-job-routes.js";
import { InMemoryRecipeJobRepository } from "../../src/storage/recipe-job-repository.js";

const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";

test("authenticated create, recovery GET, version ACK, and ownership normalization follow fixtures", async () => {
  const sharedFixture = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/fixtures/ai-recipe-success.json"), "utf8",
  )) as {
    request: { body: RecipeJobCreateRequest };
    poll_response: { body: { data: { result: RecipeDraft } } };
  };
  const rawRequest = sharedFixture.request.body;
  const request = { ...rawRequest, snapshot_sha256: computeSnapshotSha256(rawRequest.steps) };
  const draft = sharedFixture.poll_response.body.data.result;
  const repository = new InMemoryRecipeJobRepository({ now: () => Date.parse("2026-07-31T09:01:00Z") });
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const service = new RecipeJobService({ repository, provider });
  const tokens = new LocalInstallationTokenService();
  const issued = tokens.issue({
    provider: "apple_app_attest",
    appId: "app.cooklog.ios",
    environment: "production",
    installationId,
    replayProtected: true,
    verifiedAt: new Date(),
  });
  const authHeaders = {
    authorization: `Bearer ${issued.accessToken}`,
    "cooklog-installation-id": installationId,
  };
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  installRecipeJobRoutes(app, {
    service,
    authenticate: createAuthenticationGuard(tokens),
  });

  const unauthenticated = await app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { "idempotency-key": randomUUID() },
    payload: request,
  });
  assert.equal(unauthenticated.statusCode, 401);
  assert.equal(repository.getStats().jobs, 0);

  const createKey = randomUUID();
  const created = await app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { ...authHeaders, "idempotency-key": createKey },
    payload: request,
  });
  assert.equal(created.statusCode, 202);
  assert.equal(created.json().data.state, "queued");
  const jobId = created.json().data.job_id as string;
  const replay = await app.inject({
    method: "POST",
    url: "/v1/ai/recipe-jobs",
    headers: { ...authHeaders, "idempotency-key": createKey },
    payload: request,
  });
  assert.equal(replay.statusCode, 202);
  assert.equal(replay.json().data.job_id, jobId);
  assert.equal(repository.getStats().jobs, 1);

  await service.execute(jobId);
  const recovered = await app.inject({ method: "GET", url: `/v1/ai/recipe-jobs/${jobId}`, headers: authHeaders });
  assert.equal(recovered.statusCode, 200);
  assert.equal(recovered.json().data.result_version, 1);
  assert.deepEqual(recovered.json().data.result, draft);
  assert.equal(provider.callCount, 1);

  const otherTokens = new LocalInstallationTokenService();
  const otherId = randomUUID();
  const other = otherTokens.issue({
    provider: "apple_app_attest",
    appId: "app.cooklog.ios",
    environment: "production",
    installationId: otherId,
    replayProtected: true,
    verifiedAt: new Date(),
  });
  const otherApp = Fastify({ logger: false });
  installCommonHttp(otherApp);
  installRecipeJobRoutes(otherApp, { service, authenticate: createAuthenticationGuard(otherTokens) });
  const hidden = await otherApp.inject({
    method: "GET",
    url: `/v1/ai/recipe-jobs/${jobId}`,
    headers: { authorization: `Bearer ${other.accessToken}`, "cooklog-installation-id": otherId },
  });
  assert.equal(hidden.statusCode, 404);
  assert.equal(hidden.json().code, "RESOURCE_NOT_FOUND");

  const wrongAck = await app.inject({
    method: "POST",
    url: `/v1/ai/recipe-jobs/${jobId}/result-acknowledgements`,
    headers: { ...authHeaders, "idempotency-key": randomUUID() },
    payload: { result_version: 2, saved_locally_at: "2026-07-31T09:01:09Z" },
  });
  assert.equal(wrongAck.statusCode, 422);
  assert.deepEqual(wrongAck.json().violations, [{ field: "body", reason: "MISMATCH" }]);
  assert.equal(repository.getStats().contentDeletes, 0);

  const ackKey = randomUUID();
  const ackBody = { result_version: 1, saved_locally_at: "2026-07-31T09:01:09Z" };
  const acknowledged = await app.inject({
    method: "POST",
    url: `/v1/ai/recipe-jobs/${jobId}/result-acknowledgements`,
    headers: { ...authHeaders, "idempotency-key": ackKey },
    payload: ackBody,
  });
  const ackReplay = await app.inject({
    method: "POST",
    url: `/v1/ai/recipe-jobs/${jobId}/result-acknowledgements`,
    headers: { ...authHeaders, "idempotency-key": ackKey },
    payload: ackBody,
  });
  assert.equal(acknowledged.statusCode, 200);
  assert.equal(ackReplay.statusCode, 200);
  assert.equal(acknowledged.json().data.result_state, "acknowledged_deleted");
  assert.equal(acknowledged.json().data.result, null);
  assert.equal(repository.getStats().contentDeletes, 1);
  assert.equal(provider.callCount, 1);

  await otherApp.close();
  await app.close();
});

test("HTTP create rejects invalid input and quota before domain work", async () => {
  const raw = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  const request = { ...raw, snapshot_sha256: computeSnapshotSha256(raw.steps) };
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" });
  const service = new RecipeJobService({
    repository,
    provider,
    admission: { reserve: () => "quota_exceeded" },
  });
  const tokens = new LocalInstallationTokenService();
  const issued = tokens.issue({
    provider: "apple_app_attest", appId: "app.cooklog.ios", environment: "production",
    installationId, replayProtected: true, verifiedAt: new Date(),
  });
  const headers = {
    authorization: `Bearer ${issued.accessToken}`,
    "cooklog-installation-id": installationId,
    "idempotency-key": randomUUID(),
  };
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  installRecipeJobRoutes(app, { service, authenticate: createAuthenticationGuard(tokens) });

  const invalid = await app.inject({ method: "POST", url: "/v1/ai/recipe-jobs", headers, payload: {
    ...request, snapshot_sha256: "0".repeat(64),
  } });
  assert.equal(invalid.statusCode, 422);
  assert.equal(invalid.body.includes(request.steps[0]?.transcript ?? "missing"), false);

  const quota = await app.inject({ method: "POST", url: "/v1/ai/recipe-jobs", headers: {
    ...headers, "idempotency-key": randomUUID(),
  }, payload: request });
  assert.equal(quota.statusCode, 429);
  assert.equal(quota.json().code, "QUOTA_EXCEEDED");
  assert.equal(repository.getStats().jobs, 0);
  assert.equal(provider.callCount, 0);
  await app.close();
});
