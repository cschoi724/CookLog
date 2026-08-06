import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import {
  canonicalSnapshotBytes,
  computeSnapshotSha256,
} from "../../src/ai/recipe-validation.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import {
  ContentCleanupPendingError,
  InMemoryRecipeJobRepository,
} from "../../src/storage/recipe-job-repository.js";

const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";

async function fixtures(): Promise<{ request: RecipeJobCreateRequest; draft: RecipeDraft }> {
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"),
    "utf8",
  )) as RecipeJobCreateRequest;
  const draft = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"),
    "utf8",
  )) as RecipeDraft;
  return {
    request,
    draft,
  };
}

test("snapshot canonical bytes match the approved fixture golden vector", async () => {
  const { request } = await fixtures();
  const expected = "[{\"order\":0,\"recorded_at\":\"2026-07-31T01:00:00Z\",\"step_id\":\"11111111-1111-4111-8111-111111111111\",\"transcript\":\"삼겹살을 팬에 넣고 볶았어\"},{\"order\":1,\"recorded_at\":\"2026-07-31T01:01:00Z\",\"step_id\":\"22222222-2222-4222-8222-222222222222\",\"transcript\":\"양파 반 개를 넣었어\"}]\n";
  const bytes = canonicalSnapshotBytes(request.steps);
  assert.equal(bytes.toString("utf8"), expected);
  assert.equal(bytes.at(-1), 0x0a);
  assert.equal(bytes.includes(0x0d), false);
  assert.equal(computeSnapshotSha256(request.steps), request.snapshot_sha256);

  const reorderedKeys = request.steps.map((step) => ({
    transcript: step.transcript,
    step_id: step.step_id,
    recorded_at: step.recorded_at,
    order: step.order,
  }));
  assert.equal(computeSnapshotSha256(reorderedKeys), request.snapshot_sha256);
  assert.notEqual(computeSnapshotSha256([...request.steps].reverse()), request.snapshot_sha256);
});

test("create atomically registers job, content, worker, cleanup, and idempotent replay", async () => {
  const { request, draft } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const service = new RecipeJobService({ repository, provider });
  const key = randomUUID();
  const first = service.createJob(installationId, key, request);
  const replay = service.createJob(installationId, key, structuredClone(request));
  assert.equal(first.kind, "accepted");
  assert.equal(replay.kind, "accepted");
  if (first.kind !== "accepted" || replay.kind !== "accepted") return;
  assert.equal(first.status.job_id, replay.status.job_id);
  assert.equal(replay.replayed, true);
  assert.deepEqual(repository.getStats(), {
    jobs: 1,
    contents: 1,
    workerOutbox: 1,
    cleanupTasks: 1,
    contentDeletes: 0,
    contentReads: 0,
    providerAttempts: 0,
    cleanupPending: 0,
    newJobsBlocked: false,
  });

  const changed = { ...request, snapshot_revision: request.snapshot_revision + 1 };
  assert.equal(service.createJob(installationId, key, changed).kind, "idempotency_reused");
  const manualRetry = service.createJob(installationId, randomUUID(), request);
  assert.equal(manualRetry.kind, "accepted");
  assert.equal(repository.getStats().jobs, 2);
});

test("duplicate workers and crash-before-provider recovery call the provider once", async () => {
  const { request, draft } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const service = new RecipeJobService({ repository, provider });
  const created = service.createJob(installationId, randomUUID(), request);
  assert.equal(created.kind, "accepted");
  if (created.kind !== "accepted") return;

  const crashedClaim = repository.claimWorker(created.status.job_id);
  assert.ok(crashedClaim);
  assert.equal(repository.releaseBeforeProvider(crashedClaim), true);
  const deliveries = await Promise.all(Array.from({ length: 20 }, () => service.execute(created.status.job_id)));
  assert.equal(deliveries.filter((result) => result === "completed").length, 1);
  assert.equal(provider.callCount, 1);
  const status = service.getStatus(installationId, created.status.job_id);
  assert.equal(status?.state, "succeeded");
  assert.equal(status?.result_version, 1);
  assert.deepEqual(status?.result, draft);
  service.getStatus(installationId, created.status.job_id);
  assert.equal(provider.callCount, 1);
});

test("ACK version CAS deletes content once and replays the same success", async () => {
  const { request, draft } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  const savedAt = "2026-08-05T00:00:00Z";
  const wrong = service.acknowledge(installationId, created.status.job_id, randomUUID(), {
    result_version: 2,
    saved_locally_at: savedAt,
  });
  assert.equal(wrong.kind, "version_mismatch");
  assert.equal(repository.getStats().contentDeletes, 0);

  const acknowledgement = { result_version: 1, saved_locally_at: savedAt };
  const concurrent = await Promise.all([
    Promise.resolve(service.acknowledge(installationId, created.status.job_id, randomUUID(), acknowledgement)),
    Promise.resolve(service.acknowledge(installationId, created.status.job_id, randomUUID(), acknowledgement)),
  ]);
  assert.deepEqual(concurrent.map((result) => result.kind), ["success", "success"]);
  assert.equal(repository.getStats().contentDeletes, 1);
  const status = service.getStatus(installationId, created.status.job_id);
  assert.equal(status?.state, "succeeded");
  assert.equal(status?.result_state, "acknowledged_deleted");
  assert.equal(status?.result_version, null);
  assert.equal(status?.result, null);
});

test("delete failure does not externally confirm ACK and remains recoverable", async () => {
  const { request, draft } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  repository.failNextContentDelete();
  const body = { result_version: 1, saved_locally_at: "2026-08-05T00:00:00Z" };
  assert.equal(service.acknowledge(installationId, created.status.job_id, randomUUID(), body).kind, "internal_error");
  assert.equal(service.getStatus(installationId, created.status.job_id)?.result_state, "available");
  assert.equal(service.acknowledge(installationId, created.status.job_id, randomUUID(), body).kind, "success");
});

test("invalid provider outputs are terminal and never stored or returned", async () => {
  const { request, draft } = await fixtures();
  const invalidDrafts: unknown[] = [
    { ...draft, extra: "provider-private-output" },
    { ...draft, steps: draft.steps.map((step, index) => index === 0
      ? { ...step, evidence_step_ids: [randomUUID()] }
      : step) },
    { ...draft, steps: draft.steps.map((step, index) => ({ ...step, order: index + 1 })) },
    { ...draft, steps: draft.steps.map((step, index) => index === 0
      ? { ...step, instruction: "200도에서 익힌다" }
      : step) },
  ];
  for (const invalidDraft of invalidDrafts) {
    const repository = new InMemoryRecipeJobRepository();
    const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft: invalidDraft });
    const service = new RecipeJobService({ repository, provider });
    const created = service.createJob(installationId, randomUUID(), request);
    if (created.kind !== "accepted") return assert.fail("create failed");
    await service.execute(created.status.job_id);
    const status = service.getStatus(installationId, created.status.job_id);
    assert.equal(status?.state, "failed");
    assert.equal(status?.failure?.code, "OUTPUT_INVALID");
    assert.equal(status?.result, null);
    assert.equal(repository.getStats().contents, 0);
    assert.equal(provider.callCount, 1);
  }
});

test("timeout decisions never automatically retry provider and late results lose CAS", async () => {
  const { request, draft } = await fixtures();
  const queueRepository = new InMemoryRecipeJobRepository();
  const queueProvider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const queueService = new RecipeJobService({ repository: queueRepository, provider: queueProvider });
  const queued = queueService.createJob(installationId, randomUUID(), request);
  if (queued.kind !== "accepted") return assert.fail("create failed");
  assert.equal(queueService.failForTimeout(queued.status.job_id, { kind: "queue_start" }), true);
  assert.equal(queueService.getStatus(installationId, queued.status.job_id)?.failure?.code, "QUEUE_TIMEOUT");
  assert.equal(queueProvider.callCount, 0);
  assert.equal(await queueService.execute(queued.status.job_id), "ignored");

  let releaseProvider: ((value: { kind: "success"; draft: RecipeDraft }) => void) | undefined;
  const pending = new Promise<{ kind: "success"; draft: RecipeDraft }>((resolve) => { releaseProvider = resolve; });
  const lateRepository = new InMemoryRecipeJobRepository();
  const lateProvider = new DeterministicMockRecipeAIProvider(() => pending);
  const lateService = new RecipeJobService({ repository: lateRepository, provider: lateProvider });
  const late = lateService.createJob(installationId, randomUUID(), request);
  if (late.kind !== "accepted") return assert.fail("create failed");
  const execution = lateService.execute(late.status.job_id);
  await Promise.resolve();
  assert.equal(lateProvider.callCount, 1);
  assert.equal(lateService.failForTimeout(late.status.job_id, { kind: "connection_lost" }), true);
  releaseProvider?.({ kind: "success", draft });
  await execution;
  const lateStatus = lateService.getStatus(installationId, late.status.job_id);
  assert.equal(lateStatus?.state, "failed");
  assert.equal(lateStatus?.failure?.code, "OUTCOME_UNKNOWN");
  assert.equal(lateStatus?.result, null);
  assert.equal(lateProvider.callCount, 1);
});

test("all timeout decision fixtures preserve provider-at-most-once semantics", async () => {
  const { request, draft } = await fixtures();
  const cases = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/timeout-decision-cases.json"),
    "utf8",
  )) as { cases: Array<{
    name: string;
    provider_started: boolean;
    provider_execution_absent_confirmed: boolean;
    provider_calls: number;
    terminal_failure: string;
  }> };

  for (const fixtureCase of cases.cases) {
    const repository = new InMemoryRecipeJobRepository();
    let releaseProvider: ((value: { kind: "success"; draft: RecipeDraft }) => void) | undefined;
    const pending = new Promise<{ kind: "success"; draft: RecipeDraft }>((resolve) => { releaseProvider = resolve; });
    const provider = new DeterministicMockRecipeAIProvider(() => pending);
    const service = new RecipeJobService({ repository, provider });
    const created = service.createJob(installationId, randomUUID(), request);
    if (created.kind !== "accepted") return assert.fail("create failed");
    let execution: ReturnType<RecipeJobService["execute"]> | undefined;
    if (fixtureCase.provider_started) {
      execution = service.execute(created.status.job_id);
      await Promise.resolve();
    } else if (fixtureCase.name === "worker_deadline_before_provider_start") {
      const claim = repository.claimWorker(created.status.job_id);
      assert.ok(claim);
      assert.equal(repository.releaseBeforeProvider(claim), true);
    }

    const event = fixtureCase.name === "queue_start_timeout"
      ? { kind: "queue_start" as const }
      : fixtureCase.name === "provider_cancelled_before_execution"
        ? { kind: "provider_cancelled" as const, providerExecutionAbsentConfirmed: true as const }
        : fixtureCase.name === "provider_response_deadline_after_start"
          ? { kind: "provider_response_deadline" as const }
          : fixtureCase.name === "connection_lost_after_start"
            ? { kind: "connection_lost" as const }
            : {
                kind: "worker_deadline" as const,
                providerExecutionAbsentConfirmed: fixtureCase.provider_execution_absent_confirmed,
              };
    assert.equal(service.failForTimeout(created.status.job_id, event), true, fixtureCase.name);
    releaseProvider?.({ kind: "success", draft });
    if (execution !== undefined) await execution;
    const status = service.getStatus(installationId, created.status.job_id);
    assert.equal(status?.failure?.code, fixtureCase.terminal_failure, fixtureCase.name);
    assert.equal(provider.callCount, fixtureCase.provider_calls, fixtureCase.name);
    assert.equal(await service.execute(created.status.job_id), "ignored", fixtureCase.name);
    assert.equal(provider.callCount, fixtureCase.provider_calls, fixtureCase.name);
  }
});

test("provider failures are terminal and never trigger automatic retry", async () => {
  const { request } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" });
  const service = new RecipeJobService({ repository, provider });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  assert.equal(await service.execute(created.status.job_id), "completed");
  assert.equal(service.getStatus(installationId, created.status.job_id)?.failure?.code, "AI_UNAVAILABLE");
  assert.equal(await service.execute(created.status.job_id), "ignored");
  assert.equal(provider.callCount, 1);
});

test("unknown provider failure codes fail closed without exposing provider data", async () => {
  const { request } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const secretCode = "PROVIDER_SECRET_RAW_RESPONSE";
  const provider = new DeterministicMockRecipeAIProvider({
    kind: "failure",
    code: secretCode as never,
  });
  const service = new RecipeJobService({ repository, provider });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  const status = service.getStatus(installationId, created.status.job_id);
  assert.equal(status?.failure?.code, "INTERNAL_ERROR");
  assert.equal(JSON.stringify(status).includes(secretCode), false);
});

test("expiry blocks content reads before decrypt and scheduled cleanup is recoverable", async () => {
  const { request, draft } = await fixtures();
  let now = Date.parse("2026-08-05T00:00:00Z");
  const repository = new InMemoryRecipeJobRepository({ now: () => now });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  const readsBeforeExpiry = repository.getStats().contentReads;
  now += 24 * 60 * 60 * 1_000;
  const expired = service.getStatus(installationId, created.status.job_id);
  assert.equal(expired?.state, "expired");
  assert.equal(expired?.result_state, "expired_deleted");
  assert.equal(expired?.result, null);
  assert.equal(repository.getStats().contentReads, readsBeforeExpiry);
  assert.equal(repository.getStats().contents, 0);

  const cleanupCreated = service.createJob(installationId, randomUUID(), request);
  if (cleanupCreated.kind !== "accepted") return assert.fail("create failed");
  now += 22 * 60 * 60 * 1_000;
  assert.equal(repository.runScheduledCleanup(), 1);
  assert.equal(repository.getStats().contents, 0);
});

test("expiry delete failure stays pending, blocks new jobs, and sweeper confirms deletion", async () => {
  const { request, draft } = await fixtures();
  let now = Date.parse("2026-08-05T00:00:00Z");
  const repository = new InMemoryRecipeJobRepository({ now: () => now });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(installationId, randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  const readsBeforeExpiry = repository.getStats().contentReads;
  repository.failContentDeletes(2);
  now += 24 * 60 * 60 * 1_000;

  assert.throws(
    () => service.getStatus(installationId, created.status.job_id),
    ContentCleanupPendingError,
  );
  assert.equal(repository.getStats().contents, 1);
  assert.equal(repository.getStats().cleanupPending, 1);
  assert.equal(repository.getStats().contentReads, readsBeforeExpiry);
  assert.equal(repository.getStats().newJobsBlocked, true);
  assert.equal(service.createJob(installationId, randomUUID(), request).kind, "service_disabled");

  assert.equal(repository.runScheduledCleanup(), 0);
  assert.equal(repository.getStats().cleanupPending, 1);
  assert.equal(repository.runScheduledCleanup(), 1);
  const expired = service.getStatus(installationId, created.status.job_id);
  assert.equal(expired?.state, "expired");
  assert.equal(expired?.result_state, "expired_deleted");
  assert.equal(repository.getStats().contents, 0);
  assert.equal(repository.getStats().cleanupPending, 0);
  assert.equal(repository.getStats().newJobsBlocked, false);
  assert.equal(service.createJob(installationId, randomUUID(), request).kind, "accepted");
});

test("RFC 3339 validation rejects impossible dates and accepts leap day", async () => {
  const { request, draft } = await fixtures();
  const invalidDates = [
    "2026-02-30T00:00:00Z",
    "2025-02-29T00:00:00Z",
    "2026-01-01T24:00:00Z",
    "2026-01-01T00:00:00+24:00",
  ];
  for (const recordedAt of invalidDates) {
    const steps = request.steps.map((step, index) => index === 0
      ? { ...step, recorded_at: recordedAt }
      : step);
    const invalidRequest = { ...request, steps, snapshot_sha256: computeSnapshotSha256(steps) };
    const service = new RecipeJobService({
      repository: new InMemoryRecipeJobRepository(),
      provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
    });
    assert.equal(service.createJob(installationId, randomUUID(), invalidRequest).kind, "invalid_request");
  }

  const leapSteps = request.steps.map((step, index) => index === 0
    ? { ...step, recorded_at: "2024-02-29T00:00:00+09:00" }
    : step);
  const leapRequest = { ...request, steps: leapSteps, snapshot_sha256: computeSnapshotSha256(leapSteps) };
  const repository = new InMemoryRecipeJobRepository();
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(installationId, randomUUID(), leapRequest);
  assert.equal(created.kind, "accepted");
  if (created.kind !== "accepted") return;
  await service.execute(created.status.job_id);
  assert.equal(service.acknowledge(installationId, created.status.job_id, randomUUID(), {
    result_version: 1,
    saved_locally_at: "2026-02-30T00:00:00Z",
  }).kind, "invalid_request");
  assert.equal(repository.getStats().contentDeletes, 0);
  assert.equal(service.acknowledge(installationId, created.status.job_id, randomUUID(), {
    result_version: 1,
    saved_locally_at: "2024-02-29T00:00:00-00:00",
  }).kind, "success");
});

test("quota and snapshot integrity fail before any job or provider call", async () => {
  const { request, draft } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const service = new RecipeJobService({
    repository,
    provider,
    admission: { reserve: () => "quota_exceeded" },
  });
  assert.equal(service.createJob(installationId, randomUUID(), request).kind, "quota_exceeded");
  assert.equal(service.createJob(installationId, randomUUID(), {
    ...request,
    snapshot_sha256: "0".repeat(64),
  }).kind, "invalid_request");
  assert.equal(repository.getStats().jobs, 0);
  assert.equal(provider.callCount, 0);
});
