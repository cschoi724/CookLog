import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import {
  OPENAI_RECIPE_ADAPTER_VERSION,
  OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT,
  OPENAI_RECIPE_MODEL,
  OpenAIRecipeAIProvider,
  type OpenAIProviderActivation,
  type OpenAITransport,
} from "../../src/ai/openai-recipe-provider.js";
import {
  OPENAI_RECIPE_DRAFT_SCHEMA,
  OPENAI_STRUCTURED_OUTPUT_KEYWORD_ALLOWLIST,
  validateOpenAIStructuredOutputSchema,
} from "../../src/ai/openai-structured-output-schema.js";
import type { RecipeAIProviderContext } from "../../src/ai/provider.js";
import type { RecipeDraft, RecipeJobCreateRequest } from "../../src/ai/types.js";
import { RecipeJobService } from "../../src/jobs/recipe-job-service.js";
import { InMemoryRecipeJobRepository } from "../../src/storage/recipe-job-repository.js";

const enabledActivation: OpenAIProviderActivation = {
  externalCallsEnabled: true,
  productApproved: true,
  zdrApproved: true,
  modifiedRetentionApproved: true,
  crossBorderProcessingApproved: true,
  credential: "synthetic-test-credential",
};

const context: RecipeAIProviderContext = {
  providerIdempotencyKey: "provider-attempt-test-key",
  promptVersion: "recipe-prompt.v1",
  outputSchemaVersion: "recipe-draft.v1",
};

async function fixtures(): Promise<{ request: RecipeJobCreateRequest; draft: RecipeDraft }> {
  const [request, draft] = await Promise.all([
    readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-job-create.json"), "utf8"),
    readFile(resolve(process.cwd(), "contracts/ai/fixtures/recipe-draft.json"), "utf8"),
  ]);
  return {
    request: JSON.parse(request) as RecipeJobCreateRequest,
    draft: JSON.parse(draft) as RecipeDraft,
  };
}

function completion(content: unknown): Response {
  return new Response(JSON.stringify({
    choices: [{ message: { content: JSON.stringify(content), refusal: null } }],
  }), { status: 200, headers: { "content-type": "application/json" } });
}

test("activation gates fail closed before credential or transport use", async () => {
  const { request } = await fixtures();
  let calls = 0;
  const provider = new OpenAIRecipeAIProvider({
    activation: { ...enabledActivation, zdrApproved: false, credential: undefined },
    transport: async () => {
      calls += 1;
      return completion({});
    },
  });
  assert.deepEqual(await provider.generate(request, context), {
    kind: "failure", code: "AI_UNAVAILABLE",
  });
  assert.equal(calls, 0);
});

test("adapter pins endpoint, model, prompt, strict schema and store=false", async () => {
  const { request, draft } = await fixtures();
  let captured: Parameters<OpenAITransport>[0] | undefined;
  const provider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async (transportRequest) => {
      captured = transportRequest;
      return completion(draft);
    },
  });
  assert.deepEqual(await provider.generate(request, context), { kind: "success", draft });
  assert.equal(captured?.endpoint, OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT);
  assert.equal(captured?.headers.authorization, "Bearer synthetic-test-credential");
  assert.equal(captured?.headers["idempotency-key"], context.providerIdempotencyKey);
  const body = JSON.parse(captured?.body ?? "{}") as Record<string, any>;
  assert.equal(body.model, OPENAI_RECIPE_MODEL);
  assert.equal(body.store, false);
  assert.equal(body.response_format.type, "json_schema");
  assert.equal(body.response_format.json_schema.strict, true);
  assert.deepEqual(body.response_format.json_schema.schema.properties.schema_version.enum, ["recipe-draft.v1"]);
  assert.equal(JSON.stringify(body.response_format.json_schema.schema).includes("uniqueItems"), false);
  assert.equal(JSON.stringify(body.response_format.json_schema.schema).includes("minLength"), false);
  assert.equal(JSON.stringify(body.response_format.json_schema.schema).includes("maxLength"), false);
  assert.equal(body.messages.length, 2);
  assert.equal(body.messages[1].content.includes(request.steps[0]?.transcript), true);
  assert.equal(JSON.stringify(body).includes("background"), false);
  assert.equal(JSON.stringify(body).includes("tools"), false);
});

test("checked-in provider manifest matches immutable adapter decisions", async () => {
  const manifest = JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/ai/openai-provider-manifest.v1.json"), "utf8",
  )) as Record<string, unknown>;
  assert.equal(manifest.adapter_config_version, OPENAI_RECIPE_ADAPTER_VERSION);
  assert.equal(manifest.endpoint, OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT);
  assert.equal(manifest.model, OPENAI_RECIPE_MODEL);
  assert.equal(manifest.prompt_version, context.promptVersion);
  assert.equal(manifest.output_schema_version, context.outputSchemaVersion);
  assert.equal(manifest.store, false);
  assert.equal(manifest.automatic_retry_enabled, false);
  assert.equal(manifest.automatic_fallback_enabled, false);
  assert.deepEqual(manifest.structured_output_keyword_allowlist,
    [...OPENAI_STRUCTURED_OUTPUT_KEYWORD_ALLOWLIST]);
});

test("provider schema uses only the supported keyword allowlist and exact required objects", () => {
  assert.equal(validateOpenAIStructuredOutputSchema(OPENAI_RECIPE_DRAFT_SCHEMA), true);
  assert.equal(validateOpenAIStructuredOutputSchema({
    ...(OPENAI_RECIPE_DRAFT_SCHEMA as Record<string, unknown>), uniqueItems: true,
  }), false);
  const serialized = JSON.stringify(OPENAI_RECIPE_DRAFT_SCHEMA);
  for (const runtimeOnly of ["const", "maxLength", "minLength", "uniqueItems"]) {
    assert.equal(serialized.includes(`\"${runtimeOnly}\"`), false);
  }
});

test("429, timeout uncertainty, refusal and duplicate attempt map without retry", async () => {
  const { request } = await fixtures();
  let calls = 0;
  const statusProvider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => {
      calls += 1;
      return new Response("rate limited", { status: 429 });
    },
  });
  assert.deepEqual(await statusProvider.generate(request, context), {
    kind: "failure", code: "AI_UNAVAILABLE",
  });
  assert.deepEqual(await statusProvider.generate(request, context), {
    kind: "failure", code: "OUTCOME_UNKNOWN",
  });
  assert.equal(calls, 1);

  const timeoutProvider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => { throw new Error("synthetic connection loss"); },
  });
  assert.deepEqual(await timeoutProvider.generate(request, { ...context, providerIdempotencyKey: "timeout" }), {
    kind: "failure", code: "OUTCOME_UNKNOWN",
  });

  const refusalProvider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => new Response(JSON.stringify({
      choices: [{ message: { content: null, refusal: "synthetic refusal" } }],
    }), { status: 200 }),
  });
  assert.deepEqual(await refusalProvider.generate(request, { ...context, providerIdempotencyKey: "refusal" }), {
    kind: "failure", code: "SAFETY_REJECTED",
  });
});

test("response body read failure is OUTCOME_UNKNOWN while read invalid JSON is OUTPUT_INVALID", async () => {
  const { request } = await fixtures();
  const bodyReadFailure = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => ({
      ok: true,
      status: 200,
      text: async () => { throw new Error("synthetic body connection loss"); },
    }) as unknown as Response,
  });
  assert.deepEqual(await bodyReadFailure.generate(request, {
    ...context, providerIdempotencyKey: "body-read-failure",
  }), { kind: "failure", code: "OUTCOME_UNKNOWN" });

  const repository = new InMemoryRecipeJobRepository();
  const invalidJson = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => new Response("not-json", { status: 200 }),
  });
  const service = new RecipeJobService({ repository, provider: invalidJson });
  const installationId = randomUUID();
  const created = service.createJob(installationId, randomUUID(), request);
  assert.equal(created.kind, "accepted");
  if (created.kind !== "accepted") return;
  assert.equal(await service.execute(created.status.job_id), "completed");
  assert.equal(service.getStatus(installationId, created.status.job_id)?.failure?.code, "OUTPUT_INVALID");
});

test("runtime semantic validator retains uniqueness removed from provider schema", async () => {
  const { request, draft } = await fixtures();
  const duplicateEvidence = structuredClone(draft);
  const firstIngredient = duplicateEvidence.ingredients[0];
  assert.notEqual(firstIngredient, undefined);
  if (firstIngredient === undefined) return;
  const invalidDraft = {
    ...duplicateEvidence,
    ingredients: [{
      ...firstIngredient,
      evidence_step_ids: [firstIngredient.evidence_step_ids[0], firstIngredient.evidence_step_ids[0]],
    }, ...duplicateEvidence.ingredients.slice(1)],
  };
  const repository = new InMemoryRecipeJobRepository();
  const provider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => completion(invalidDraft),
  });
  const service = new RecipeJobService({ repository, provider });
  const installationId = randomUUID();
  const created = service.createJob(installationId, randomUUID(), request);
  assert.equal(created.kind, "accepted");
  if (created.kind !== "accepted") return;
  assert.equal(await service.execute(created.status.job_id), "completed");
  assert.equal(service.getStatus(installationId, created.status.job_id)?.failure?.code, "OUTPUT_INVALID");
});

test("invalid structured output becomes OUTPUT_INVALID before result storage", async () => {
  const { request } = await fixtures();
  const repository = new InMemoryRecipeJobRepository();
  const provider = new OpenAIRecipeAIProvider({
    activation: enabledActivation,
    transport: async () => completion({ schema_version: "recipe-draft.v2" }),
  });
  const service = new RecipeJobService({ repository, provider });
  const installationId = randomUUID();
  const created = service.createJob(installationId, randomUUID(), request);
  assert.equal(created.kind, "accepted");
  if (created.kind !== "accepted") return;
  assert.equal(await service.execute(created.status.job_id), "completed");
  const status = service.getStatus(installationId, created.status.job_id);
  assert.equal(status?.state, "failed");
  assert.equal(status?.failure?.code, "OUTPUT_INVALID");
  assert.equal(status?.result, null);
});
