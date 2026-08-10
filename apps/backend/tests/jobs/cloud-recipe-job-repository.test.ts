import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import {
  COOKLOG_CLOUD_REGION,
  CloudRecipeJobRepository,
  ContentCleanupPendingError,
  FirestoreRecipeJobDatastoreContractAdapter,
  LocalCloudTasksContractAdapter,
} from "../../src/storage/recipe-job-repository.js";

async function fixtures(): Promise<{ request: RecipeJobCreateRequest; draft: RecipeDraft }> {
  return {
    request: JSON.parse(await readFile(
      resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
    )) as RecipeJobCreateRequest,
    draft: JSON.parse(await readFile(
      resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8",
    )) as RecipeDraft,
  };
}

function runDurableProcess(
  operation: string,
  durableFilePath: string,
  installationId: string,
  createIdempotencyKey: string,
  ackIdempotencyKey: string,
): Record<string, any> {
  const child = spawnSync(process.execPath, [
    resolve(process.cwd(), "dist/tests/jobs/durable-repository-process.js"),
    operation,
    durableFilePath,
    installationId,
    createIdempotencyKey,
    ackIdempotencyKey,
  ], { cwd: process.cwd(), encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  return JSON.parse(child.stdout) as Record<string, any>;
}

function startBarrierProcess(
  operation: "barrier-create" | "barrier-execute",
  durableFilePath: string,
  installationId: string,
  createIdempotencyKey: string,
  ackIdempotencyKey: string,
  barrierPath: string,
): { readonly pid: number; readonly completed: Promise<Record<string, any>> } {
  const child = spawn(process.execPath, [
    resolve(process.cwd(), "dist/tests/jobs/durable-repository-process.js"),
    operation,
    durableFilePath,
    installationId,
    createIdempotencyKey,
    ackIdempotencyKey,
    barrierPath,
  ], { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"] });
  if (child.pid === undefined) throw new Error("durable child process did not start");
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk: string) => { stdout += chunk; });
  child.stderr.on("data", (chunk: string) => { stderr += chunk; });
  const completed = new Promise<Record<string, any>>((resolveResult, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code !== 0) return reject(new Error(stderr || `durable child exited ${code}`));
      try {
        resolveResult(JSON.parse(stdout) as Record<string, any>);
      } catch (error) {
        reject(error);
      }
    });
  });
  return { pid: child.pid, completed };
}

async function releaseBarrierWhenReady(barrierPath: string, pids: readonly number[]): Promise<void> {
  const deadline = Date.now() + 5_000;
  while (!pids.every((pid) => existsSync(`${barrierPath}.${pid}.ready`))) {
    if (Date.now() >= deadline) throw new Error("durable children did not reach the barrier");
    await new Promise((resolveWait) => setTimeout(resolveWait, 10));
  }
  await writeFile(barrierPath, "release\n", { encoding: "utf8", mode: 0o600 });
}

test("durable backing restores job, idempotency, outbox, result and ACK across processes", () => {
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-durable-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    const installationId = randomUUID();
    const createIdempotencyKey = randomUUID();
    const ackIdempotencyKey = randomUUID();
    const created = runDurableProcess("create", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey);
    assert.equal(created.result.kind, "accepted");
    assert.equal(created.result.replayed, false);
    assert.deepEqual({
      jobs: created.stats.jobs,
      contents: created.stats.contents,
      workerOutbox: created.stats.workerOutbox,
      cleanupTasks: created.stats.cleanupTasks,
      publishedTasks: created.durability.publishedTasks,
    }, { jobs: 1, contents: 1, workerOutbox: 1, cleanupTasks: 1, publishedTasks: 0 });

    const recovered = runDurableProcess("recover-and-execute", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey);
    assert.equal(recovered.result.replayed, true);
    assert.equal(recovered.result.status.job_id, created.result.status.job_id);
    assert.equal(recovered.published, 2);
    assert.equal(recovered.execution, "completed");
    assert.equal(recovered.status.result_state, "available");
    assert.equal(recovered.durability.publishedTasks, 2);

    const acknowledged = runDurableProcess("ack", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey);
    assert.equal(acknowledged.result.replayed, true);
    assert.equal(acknowledged.published, 0);
    assert.equal(acknowledged.ack.kind, "success");
    assert.equal(acknowledged.ack.replayed, false);
    assert.equal(acknowledged.stats.contents, 0);

    const verified = runDurableProcess("verify", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey);
    assert.equal(verified.result.replayed, true);
    assert.equal(verified.ack.kind, "success");
    assert.equal(verified.ack.replayed, true);
    assert.equal(verified.status.result_state, "acknowledged_deleted");
    assert.equal(verified.stats.jobs, 1);
    assert.equal(verified.durability.publishedTasks, 2);
    assert.equal(verified.stats.contentDeletes, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("durable backing fails closed on a corrupt state file", async () => {
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-corrupt-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    await writeFile(durableFilePath, "{}", { encoding: "utf8", mode: 0o600 });
    const datastore = new FirestoreRecipeJobDatastoreContractAdapter({
      region: COOKLOG_CLOUD_REGION,
      durableFilePath,
    });
    assert.throws(() => new CloudRecipeJobRepository({
      datastore,
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    }), /schema is invalid/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("stale durable adapters serialize create, outbox, worker and ACK ownership", async () => {
  const { request, draft } = await fixtures();
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-transaction-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    const installationId = randomUUID();
    const createIdempotencyKey = randomUUID();
    const queueA = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
    const queueB = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
    const repositoryA = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: queueA,
    });
    const repositoryB = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: queueB,
    });
    const providerA = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
    const providerB = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
    const serviceA = new RecipeJobService({ repository: repositoryA, provider: providerA });
    const serviceB = new RecipeJobService({ repository: repositoryB, provider: providerB });

    const createdA = serviceA.createJob(installationId, createIdempotencyKey, request);
    const createdB = serviceB.createJob(installationId, createIdempotencyKey, request);
    if (createdA.kind !== "accepted" || createdB.kind !== "accepted") {
      return assert.fail("create failed");
    }
    assert.equal(createdA.replayed, false);
    assert.equal(createdB.replayed, true);
    assert.equal(createdB.status.job_id, createdA.status.job_id);
    assert.equal(repositoryA.publishOutbox(), 2);
    assert.equal(repositoryB.publishOutbox(), 0);
    assert.equal(queueA.listTasks().length, 2);
    assert.equal(queueB.listTasks().length, 0);

    const executions = await Promise.all([
      serviceA.execute(createdA.status.job_id),
      serviceB.execute(createdA.status.job_id),
    ]);
    assert.deepEqual(executions.sort(), ["completed", "ignored"]);
    assert.equal(providerA.callCount + providerB.callCount, 1);

    const ackA = serviceA.acknowledge(installationId, createdA.status.job_id, randomUUID(), {
      result_version: 1, saved_locally_at: "2026-08-10T06:00:00Z",
    });
    const ackB = serviceB.acknowledge(installationId, createdA.status.job_id, randomUUID(), {
      result_version: 1, saved_locally_at: "2026-08-10T06:00:00Z",
    });
    assert.equal(ackA.kind, "success");
    assert.equal(ackB.kind, "success");
    if (ackA.kind === "success" && ackB.kind === "success") {
      assert.equal(ackA.replayed, false);
      assert.equal(ackB.replayed, true);
    }
    const finalRepository = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
    });
    assert.equal(finalRepository.getStats().jobs, 1);
    assert.equal(finalRepository.getStats().contents, 0);
    assert.equal(finalRepository.getStats().contentDeletes, 1);
    assert.equal(finalRepository.getStats().providerAttempts, 1);
    assert.equal(finalRepository.getDurabilityFacts().publishedTasks, 2);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("stale durable cleanup adapters preserve pending state and delete once", async () => {
  const { request } = await fixtures();
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-cleanup-transaction-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    let now = Date.parse("2026-08-10T00:00:00Z");
    const seed = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    const service = new RecipeJobService({
      repository: seed,
      provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
    });
    assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "accepted");
    seed.failNextContentDelete();
    now += 24 * 60 * 60 * 1_000;
    const cleanupA = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    const cleanupB = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION, durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    assert.equal(cleanupA.runScheduledCleanup(), 0);
    assert.equal(cleanupB.runScheduledCleanup(), 1);
    assert.equal(cleanupA.runScheduledCleanup(), 0);
    assert.equal(cleanupB.getStats().cleanupPending, 0);
    assert.equal(cleanupB.getStats().contents, 0);
    assert.equal(cleanupB.getStats().contentDeletes, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("cross-process transactions admit one create and one worker owner", async () => {
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-cross-process-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    const installationId = randomUUID();
    const createIdempotencyKey = randomUUID();
    const ackIdempotencyKey = randomUUID();
    const createBarrier = join(directory, "create.release");
    const createA = startBarrierProcess("barrier-create", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey, createBarrier);
    const createB = startBarrierProcess("barrier-create", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey, createBarrier);
    await releaseBarrierWhenReady(createBarrier, [createA.pid, createB.pid]);
    const creates = await Promise.all([createA.completed, createB.completed]);
    assert.deepEqual(creates.map((value) => value.result.replayed).sort(), [false, true]);
    assert.equal(creates[0]?.result.status.job_id, creates[1]?.result.status.job_id);

    const workerBarrier = join(directory, "worker.release");
    const workerA = startBarrierProcess("barrier-execute", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey, workerBarrier);
    const workerB = startBarrierProcess("barrier-execute", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey, workerBarrier);
    await releaseBarrierWhenReady(workerBarrier, [workerA.pid, workerB.pid]);
    const workers = await Promise.all([workerA.completed, workerB.completed]);
    assert.deepEqual(workers.map((value) => value.execution).sort(), ["completed", "ignored"]);
    assert.equal(workers.reduce((sum, value) => sum + value.providerCalls, 0), 1);
    const final = runDurableProcess("verify", durableFilePath, installationId,
      createIdempotencyKey, ackIdempotencyKey);
    assert.equal(final.result.replayed, true);
    assert.equal(final.stats.jobs, 1);
    assert.equal(final.stats.providerAttempts, 1);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("cloud adapters pin Seoul and queue payloads contain no recipe content", async () => {
  assert.throws(() => new FirestoreRecipeJobDatastoreContractAdapter({
    region: "us-central1" as never,
  }));
  assert.throws(() => new LocalCloudTasksContractAdapter({ region: "us-central1" as never }));

  const { request } = await fixtures();
  const datastore = new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const repository = new CloudRecipeJobRepository({ datastore, queue });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
  });
  const created = service.createJob(randomUUID(), randomUUID(), request);
  assert.equal(created.kind, "accepted");
  assert.equal(repository.publishOutbox(), 2);
  assert.equal(repository.publishOutbox(), 0);
  const tasks = queue.listTasks();
  assert.equal(tasks.length, 2);
  const serialized = JSON.stringify(tasks);
  assert.equal(serialized.includes(request.steps[0]?.transcript ?? "missing"), false);
  assert.equal(serialized.includes("snapshot_sha256"), false);
  assert.deepEqual(tasks.map((task) => task.kind).sort(),
    ["recipe-content-cleanup", "recipe-worker"]);
});

test("job, idempotency, outbox, result and ACK survive repository restart", async () => {
  const { request, draft } = await fixtures();
  const datastore = new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const installationId = randomUUID();
  const idempotencyKey = randomUUID();

  const firstRepository = new CloudRecipeJobRepository({ datastore, queue });
  const firstService = new RecipeJobService({
    repository: firstRepository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const created = firstService.createJob(installationId, idempotencyKey, request);
  if (created.kind !== "accepted") return assert.fail("create failed");
  assert.equal(firstRepository.publishOutbox(), 2);

  const provider = new DeterministicMockRecipeAIProvider({ kind: "success", draft });
  const restartedRepository = new CloudRecipeJobRepository({ datastore, queue });
  const restartedService = new RecipeJobService({ repository: restartedRepository, provider });
  const replay = restartedService.createJob(installationId, idempotencyKey, request);
  assert.equal(replay.kind, "accepted");
  if (replay.kind !== "accepted") return;
  assert.equal(replay.status.job_id, created.status.job_id);
  assert.equal(replay.replayed, true);
  assert.equal(restartedRepository.publishOutbox(), 0);
  assert.equal(await restartedService.execute(created.status.job_id), "completed");
  assert.equal(provider.callCount, 1);

  const afterWorkerRestart = new CloudRecipeJobRepository({ datastore, queue });
  const recoveryService = new RecipeJobService({
    repository: afterWorkerRestart,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "INTERNAL_ERROR" }),
  });
  assert.deepEqual(recoveryService.getStatus(installationId, created.status.job_id)?.result, draft);
  assert.equal(recoveryService.acknowledge(installationId, created.status.job_id, randomUUID(), {
    result_version: 1,
    saved_locally_at: "2026-08-10T06:00:00Z",
  }).kind, "success");
  const finalRepository = new CloudRecipeJobRepository({ datastore, queue });
  const finalStatus = finalRepository.getStatus(installationId, created.status.job_id);
  assert.equal(finalStatus?.result_state, "acknowledged_deleted");
  assert.equal(finalStatus?.result, null);
  assert.equal(finalRepository.getStats().contentDeletes, 1);
});

test("queue outage retains atomic outbox and restart publishes exactly once", async () => {
  const { request } = await fixtures();
  const datastore = new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const repository = new CloudRecipeJobRepository({ datastore, queue });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "failure", code: "AI_UNAVAILABLE" }),
  });
  assert.equal(service.createJob(randomUUID(), randomUUID(), request).kind, "accepted");
  queue.failNextEnqueues();
  assert.throws(() => repository.publishOutbox());
  assert.equal(queue.listTasks().length, 0);

  const restarted = new CloudRecipeJobRepository({ datastore, queue });
  assert.equal(restarted.publishOutbox(), 2);
  assert.equal(restarted.publishOutbox(), 0);
  assert.equal(queue.listTasks().length, 2);
  assert.equal(restarted.getStats().jobs, 1);
});

test("24-hour read gate and cleanup failure remain fail closed across restart", async () => {
  const { request, draft } = await fixtures();
  let now = Date.parse("2026-08-10T00:00:00Z");
  const datastore = new FirestoreRecipeJobDatastoreContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
  const installationId = randomUUID();
  const repository = new CloudRecipeJobRepository({ datastore, queue, now: () => now });
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
  assert.throws(() => service.getStatus(installationId, created.status.job_id),
    ContentCleanupPendingError);
  assert.equal(repository.getStats().contentReads, readsBeforeExpiry);

  const restarted = new CloudRecipeJobRepository({ datastore, queue, now: () => now });
  assert.equal(restarted.isNewJobBlocked(), true);
  assert.equal(restarted.runScheduledCleanup(), 0);
  const recovered = new CloudRecipeJobRepository({ datastore, queue, now: () => now });
  assert.equal(recovered.runScheduledCleanup(), 1);
  assert.equal(recovered.getStatus(installationId, created.status.job_id)?.result_state,
    "expired_deleted");
  assert.equal(recovered.getStats().contents, 0);
});

test("durable cleanup pending and delete failure recover through new datastore adapters", async () => {
  const { request, draft } = await fixtures();
  const directory = mkdtempSync(join(tmpdir(), "cooklog-recipe-job-cleanup-"));
  try {
    const durableFilePath = join(directory, "firestore-emulator.json");
    let now = Date.parse("2026-08-10T00:00:00Z");
    const installationId = randomUUID();
    const first = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION,
        durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    const service = new RecipeJobService({
      repository: first,
      provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
    });
    const created = service.createJob(installationId, randomUUID(), request);
    if (created.kind !== "accepted") return assert.fail("create failed");
    await service.execute(created.status.job_id);
    first.failContentDeletes(2);
    now += 24 * 60 * 60 * 1_000;
    assert.throws(() => service.getStatus(installationId, created.status.job_id),
      ContentCleanupPendingError);

    const pending = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION,
        durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    assert.equal(pending.getStats().cleanupPending, 1);
    assert.equal(pending.runScheduledCleanup(), 0);

    const recovered = new CloudRecipeJobRepository({
      datastore: new FirestoreRecipeJobDatastoreContractAdapter({
        region: COOKLOG_CLOUD_REGION,
        durableFilePath,
      }),
      queue: new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION }),
      now: () => now,
    });
    assert.equal(recovered.runScheduledCleanup(), 1);
    assert.equal(recovered.getStats().cleanupPending, 0);
    assert.equal(recovered.getStats().contents, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
