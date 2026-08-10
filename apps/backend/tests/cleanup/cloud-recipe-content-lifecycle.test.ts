import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import {
  RECIPE_CONTENT_QUEUE_RETRY_WINDOW_MS,
  RECIPE_CONTENT_SWEEPER_INTERVAL_MS,
  RecipeContentLifecycleWorker,
} from "../../src/cleanup/recipe-content-lifecycle-worker.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import {
  COOKLOG_CLOUD_REGION,
  CloudRecipeJobRepository,
  FirestoreRecipeJobDatastoreContractAdapter,
  LocalCloudTasksContractAdapter,
} from "../../src/storage/recipe-job-repository.js";

test("missing cleanup task is recovered by the 15-minute sweeper after 22 hours", async () => {
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  const draft = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8",
  )) as RecipeDraft;
  let now = Date.parse("2026-08-10T00:00:00Z");
  const repository = new CloudRecipeJobRepository({
    datastore: new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    now: () => now,
  });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = service.createJob(randomUUID(), randomUUID(), request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  await service.execute(created.status.job_id);
  const worker = new RecipeContentLifecycleWorker(repository);

  now += 22 * 60 * 60 * 1_000 - 1;
  assert.deepEqual(worker.runSweeper(now), { kind: "ran", deleted: 0 });
  now += 1;
  assert.deepEqual(worker.runSweeper(now), { kind: "too_soon", deleted: 0 });
  now += RECIPE_CONTENT_SWEEPER_INTERVAL_MS;
  assert.deepEqual(worker.runSweeper(now), { kind: "ran", deleted: 1 });
  assert.equal(repository.getStats().contents, 0);
});

test("cleanup health escalates at 22.5h, 23h and 23.5h without reading content", async () => {
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  let now = Date.parse("2026-08-10T00:00:00Z");
  const repository = new CloudRecipeJobRepository({
    datastore: new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    now: () => now,
  });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
  });
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "accepted");
  const reads = repository.getStats().contentReads;
  now += 22.5 * 60 * 60 * 1_000;
  assert.deepEqual(repository.getCleanupHealth(), { warning: 1, critical: 0, incident: 0, expired: 0 });
  now += 0.5 * 60 * 60 * 1_000;
  assert.deepEqual(repository.getCleanupHealth(), { warning: 1, critical: 1, incident: 0, expired: 0 });
  assert.equal(repository.isNewJobBlocked(), true);
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "service_disabled");
  now += 0.5 * 60 * 60 * 1_000;
  assert.deepEqual(repository.getCleanupHealth(), { warning: 1, critical: 1, incident: 1, expired: 0 });
  assert.equal(repository.getStats().contentReads, reads);
});

test("invalid datastore and sweeper clocks fail closed without content access", async () => {
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  let now = Number.NaN;
  const repository = new CloudRecipeJobRepository({
    datastore: new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    now: () => now,
  });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
  });
  assert.throws(() => repository.isNewJobBlocked());
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "service_disabled");
  const worker = new RecipeContentLifecycleWorker(repository);
  assert.throws(() => worker.runSweeper(Number.POSITIVE_INFINITY));
  now = Date.parse("2026-08-10T00:00:00Z");
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "accepted");
});

test("cleanup queue switches to isolated deletion at the 23h45 boundary", async () => {
  const request = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
  )) as RecipeJobCreateRequest;
  let now = Date.parse("2026-08-10T00:00:00Z");
  const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const repository = new CloudRecipeJobRepository({
    datastore: new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    queue,
    now: () => now,
  });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
  });
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "accepted");
  repository.publishOutbox();
  const cleanupTask = queue.listTasks().find((task) => task.kind === "recipe-content-cleanup");
  if (cleanupTask?.kind !== "recipe-content-cleanup") return assert.fail("cleanup task missing");
  const worker = new RecipeContentLifecycleWorker(repository);
  now = cleanupTask.scheduledAt + RECIPE_CONTENT_QUEUE_RETRY_WINDOW_MS;
  assert.deepEqual(worker.runCleanupTask(cleanupTask, now), { kind: "isolated", deleted: 1 });
  assert.equal(repository.getStats().contents, 0);
});
