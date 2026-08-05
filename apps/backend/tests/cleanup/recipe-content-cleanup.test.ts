import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import {
  ContentCleanupPendingError,
  InMemoryRecipeJobRepository,
} from "../../src/storage/recipe-job-repository.js";

async function fixtures(): Promise<{ request: RecipeJobCreateRequest; draft: RecipeDraft }> {
  return {
    request: JSON.parse(await readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8")) as RecipeJobCreateRequest,
    draft: JSON.parse(await readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8")) as RecipeDraft,
  };
}

test("ACK deletes content immediately and +22 hours explicit cleanup removes unacknowledged content", async () => {
  const { request, draft } = await fixtures();
  let now = Date.parse("2026-08-05T00:00:00Z");
  const repository = new InMemoryRecipeJobRepository({ now: () => now });
  const service = new RecipeJobService({
    repository,
    provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
  });
  const ackInstallationId = randomUUID();
  const ackJob = service.createJob(ackInstallationId, randomUUID(), request);
  if (ackJob.kind !== "accepted") return assert.fail("create failed");
  await service.execute(ackJob.status.job_id);
  assert.equal(repository.getStats().contents, 1);
  assert.equal(service.acknowledge(ackInstallationId, ackJob.status.job_id, randomUUID(), {
    result_version: 1,
    saved_locally_at: "2026-08-05T00:00:00Z",
  }).kind, "success");
  assert.equal(repository.getStats().contents, 0);

  const cleanupInstallationId = randomUUID();
  const cleanupJob = service.createJob(cleanupInstallationId, randomUUID(), request);
  if (cleanupJob.kind !== "accepted") return assert.fail("create failed");
  await service.execute(cleanupJob.status.job_id);
  assert.equal(repository.getStats().contents, 1);

  now += 22 * 60 * 60 * 1_000;
  assert.equal(repository.runScheduledCleanup(), 1);
  assert.equal(repository.getStats().contents, 0);
});

test("+24 hours blocks content reads before delete and cleanup failure remains fail closed", async () => {
  const { request, draft } = await fixtures();
  let now = Date.parse("2026-08-05T00:00:00Z");
  const installationId = randomUUID();
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

  assert.throws(() => service.getStatus(installationId, created.status.job_id), ContentCleanupPendingError);
  assert.equal(repository.getStats().contentReads, readsBeforeExpiry);
  assert.equal(repository.getStats().newJobsBlocked, true);
  assert.equal(repository.runScheduledCleanup(), 0);
  assert.equal(repository.runScheduledCleanup(), 1);
  assert.equal(repository.getStats().contents, 0);
});
