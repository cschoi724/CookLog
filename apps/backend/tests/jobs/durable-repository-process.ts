import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { DeterministicMockRecipeAIProvider } from "../../src/ai/mock-recipe-provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import {
  COOKLOG_CLOUD_REGION,
  CloudRecipeJobRepository,
  FirestoreRecipeJobDatastoreContractAdapter,
  LocalCloudTasksContractAdapter,
} from "../../src/storage/recipe-job-repository.js";

const [operation, durableFilePath, installationId, createIdempotencyKey, ackIdempotencyKey,
  barrierPath] =
  process.argv.slice(2);
if (operation === undefined || durableFilePath === undefined || installationId === undefined ||
  createIdempotencyKey === undefined || ackIdempotencyKey === undefined) {
  throw new Error("durable repository process arguments are required");
}

const request = JSON.parse(readFileSync(
  resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8",
)) as RecipeJobCreateRequest;
const draft = JSON.parse(readFileSync(
  resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8",
)) as RecipeDraft;
const datastore = new FirestoreRecipeJobDatastoreContractAdapter({
  region: COOKLOG_CLOUD_REGION,
  durableFilePath,
});
const queue = new LocalCloudTasksContractAdapter({ region: COOKLOG_CLOUD_REGION });
const repository = new CloudRecipeJobRepository({ datastore, queue });
const service = new RecipeJobService({
  repository,
  provider: new DeterministicMockRecipeAIProvider({ kind: "success", draft }),
});

const create = (): ReturnType<RecipeJobService["createJob"]> =>
  service.createJob(installationId, createIdempotencyKey, request);

const waitForBarrier = (): void => {
  if (barrierPath === undefined) throw new Error("barrier path is required");
  writeFileSync(`${barrierPath}.${process.pid}.ready`, "ready\n", { encoding: "utf8", mode: 0o600 });
  const deadline = Date.now() + 5_000;
  const waitCell = new Int32Array(new SharedArrayBuffer(4));
  while (!existsSync(barrierPath)) {
    if (Date.now() >= deadline) throw new Error("durable process barrier timeout");
    Atomics.wait(waitCell, 0, 0, 10);
  }
};

let output: unknown;
if (operation === "barrier-create") {
  waitForBarrier();
  const result = create();
  output = { result, stats: repository.getStats(), durability: repository.getDurabilityFacts() };
} else if (operation === "barrier-execute") {
  waitForBarrier();
  const result = create();
  if (result.kind !== "accepted") throw new Error("durable create replay was not accepted");
  const execution = await service.execute(result.status.job_id);
  output = { result, execution, providerCalls: execution === "completed" ? 1 : 0,
    stats: repository.getStats() };
} else if (operation === "create") {
  const result = create();
  output = { result, stats: repository.getStats(), durability: repository.getDurabilityFacts() };
} else if (operation === "recover-and-execute") {
  const result = create();
  if (result.kind !== "accepted") throw new Error("durable create replay was not accepted");
  const published = repository.publishOutbox();
  const execution = await service.execute(result.status.job_id);
  output = { result, published, execution, status: service.getStatus(installationId, result.status.job_id),
    stats: repository.getStats(), durability: repository.getDurabilityFacts() };
} else if (operation === "ack") {
  const result = create();
  if (result.kind !== "accepted") throw new Error("durable create replay was not accepted");
  const published = repository.publishOutbox();
  const ack = service.acknowledge(installationId, result.status.job_id, ackIdempotencyKey, {
    result_version: 1,
    saved_locally_at: "2026-08-10T06:00:00Z",
  });
  output = { result, published, ack, stats: repository.getStats(),
    durability: repository.getDurabilityFacts() };
} else if (operation === "verify") {
  const result = create();
  if (result.kind !== "accepted") throw new Error("durable create replay was not accepted");
  const ack = service.acknowledge(installationId, result.status.job_id, ackIdempotencyKey, {
    result_version: 1,
    saved_locally_at: "2026-08-10T06:00:00Z",
  });
  output = { result, ack, status: service.getStatus(installationId, result.status.job_id),
    stats: repository.getStats(), durability: repository.getDurabilityFacts() };
} else {
  throw new Error("unknown durable repository process operation");
}

process.stdout.write(JSON.stringify(output));
