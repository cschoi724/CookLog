import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import Fastify from "fastify";

import {
  createSuccessEnvelope,
  installCommonHttp,
  sendProblem,
  sendSuccess,
} from "../../src/http/common-http.js";
import {
  getPublicErrorDefinition,
  publicErrorCatalog,
  renderProblem,
  type PublicErrorCode,
} from "../../src/http/public-errors.js";

test("runtime public error catalog is identical to the contract catalog", async () => {
  const catalogPath = resolve(process.cwd(), "contracts/common/public-error-catalog.json");
  const contract = JSON.parse(await readFile(catalogPath, "utf8")) as {
    errors: Array<{
      code: PublicErrorCode;
      type: string;
      title: string;
      status: number;
      detail: string;
      user_message_key: string;
      retryable: boolean;
      retry_after_policy: string;
    }>;
  };
  assert.equal(contract.errors.length, Object.keys(publicErrorCatalog).length);
  for (const expected of contract.errors) {
    const actual = getPublicErrorDefinition(expected.code);
    assert.deepEqual(actual, {
      type: expected.type,
      title: expected.title,
      status: expected.status,
      detail: expected.detail,
      userMessageKey: expected.user_message_key,
      retryable: expected.retryable,
      retryAfterPolicy: expected.retry_after_policy,
    });
  }
});

test("negative error fixtures cannot leak unsafe input into public problems", async () => {
  const fixturePath = resolve(process.cwd(), "contracts/common/fixtures/error-generation-negative.json");
  const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as {
    cases: Array<{
      public_code: PublicErrorCode;
      expected_public_fields: Record<string, unknown>;
      forbidden_substrings: string[];
    }>;
  };
  for (const fixtureCase of fixture.cases) {
    const problem = renderProblem(randomUUID(), fixtureCase.public_code);
    const serialized = JSON.stringify(problem);
    for (const [field, expected] of Object.entries(fixtureCase.expected_public_fields)) {
      assert.deepEqual(problem[field as keyof typeof problem], expected);
    }
    fixtureCase.forbidden_substrings.forEach((value) => assert.equal(serialized.includes(value), false));
  }
});

test("unknown codes and unsafe violations fail closed to INTERNAL_ERROR", () => {
  assert.equal(renderProblem(randomUUID(), "PROVIDER_PRIVATE_FAILURE").code, "INTERNAL_ERROR");
  assert.equal(renderProblem(randomUUID(), "toString").code, "INTERNAL_ERROR");
  const unsafe = renderProblem(randomUUID(), "VALIDATION_FAILED", {
    violations: [{ field: "proof", reason: "BEARER_SECRET" as never }],
  });
  assert.equal(unsafe.code, "INTERNAL_ERROR");
  assert.equal(JSON.stringify(unsafe).includes("BEARER_SECRET"), false);
});

test("violation renderer projects safe fields and rejects structural data leaks", async () => {
  const secret = "qa-raw-token-and-recipe";
  const safeInput = [{ field: "body", reason: "INVALID_FORMAT" }] as const;
  const safeProblem = renderProblem(randomUUID(), "VALIDATION_FAILED", { violations: safeInput });
  assert.deepEqual(safeProblem.violations, safeInput);
  assert.notEqual(safeProblem.violations?.[0], safeInput[0]);
  assert.deepEqual(Object.keys(safeProblem.violations?.[0] ?? {}), ["field", "reason"]);

  let getterCalls = 0;
  const getterViolation = {} as Record<string, unknown>;
  Object.defineProperties(getterViolation, {
    field: { enumerable: true, get: () => { getterCalls += 1; return "body"; } },
    reason: { enumerable: true, value: "INVALID_FORMAT" },
  });
  const prototypeViolation = Object.assign(Object.create({ secret }), {
    field: "body",
    reason: "INVALID_FORMAT",
  });
  const symbolViolation = { field: "body", reason: "INVALID_FORMAT" } as Record<PropertyKey, unknown>;
  symbolViolation[Symbol("secret")] = secret;
  const customArrayPrototype = [{ field: "body", reason: "INVALID_FORMAT" }];
  Object.setPrototypeOf(customArrayPrototype, { secret });
  const unsafeCases: readonly unknown[] = [
    [{ field: "body", reason: "INVALID_FORMAT", secret }],
    [getterViolation],
    [prototypeViolation],
    [symbolViolation],
    customArrayPrototype,
    Array.from({ length: 21 }, () => ({ field: "body", reason: "INVALID_FORMAT" })),
  ];

  const app = Fastify({ logger: false });
  installCommonHttp(app);
  unsafeCases.forEach((violations, index) => {
    app.get(`/v1/unsafe-${index}`, (request, reply) => sendProblem(
      request,
      reply,
      "VALIDATION_FAILED",
      { violations: violations as never },
    ));
  });
  for (let index = 0; index < unsafeCases.length; index += 1) {
    const response = await app.inject({ method: "GET", url: `/v1/unsafe-${index}` });
    assert.equal(response.statusCode, 500);
    assert.equal(response.json().code, "INTERNAL_ERROR");
    assert.equal(response.body.includes(secret), false);
    assert.equal(JSON.stringify(response.headers).includes(secret), false);
  }
  assert.equal(getterCalls, 0);
  await app.close();
});

test("common HTTP layer keeps canonical request ID and success envelope aligned", async () => {
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  app.get("/v1/example", (request, reply) => sendSuccess(request, reply, { accepted: true }, 202));

  const response = await app.inject({ method: "GET", url: "/v1/example" });
  const body = response.json<{ meta: { request_id: string; api_version: string } }>();
  assert.equal(response.statusCode, 202);
  assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
  assert.equal(response.headers["cooklog-request-id"], body.meta.request_id);
  assert.equal(body.meta.api_version, "v1");
  await app.close();
});

test("validation, unsupported version, and raw errors use safe problem envelopes", async () => {
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  app.post("/v1/validated", {
    schema: {
      body: {
        type: "object",
        additionalProperties: false,
        required: ["value"],
        properties: { value: { type: "string" } },
      },
    },
  }, (request, reply) => sendSuccess(request, reply, { accepted: true }));
  app.get("/v1/failure", async () => {
    throw new Error("Bearer private-token user raw recipe");
  });

  const validation = await app.inject({ method: "POST", url: "/v1/validated", payload: { extra: "secret" } });
  assert.equal(validation.statusCode, 422);
  assert.equal(validation.json().code, "VALIDATION_FAILED");
  assert.equal(validation.body.includes("secret"), false);

  const unsupported = await app.inject({ method: "GET", url: "/v2/example" });
  assert.equal(unsupported.statusCode, 404);
  assert.equal(unsupported.json().code, "API_VERSION_UNSUPPORTED");

  for (const url of ["/v2?probe=1", "/v2?probe=%23fragment", "/v2/example?probe=1"]) {
    const unsupportedWithQuery = await app.inject({ method: "GET", url });
    assert.equal(unsupportedWithQuery.statusCode, 404);
    assert.equal(unsupportedWithQuery.json().code, "API_VERSION_UNSUPPORTED");
  }

  const failure = await app.inject({ method: "GET", url: "/v1/failure" });
  assert.equal(failure.statusCode, 500);
  assert.equal(failure.json().code, "INTERNAL_ERROR");
  assert.equal(failure.body.includes("private-token"), false);
  assert.equal(failure.headers["cooklog-request-id"], failure.json().request_id);
  await app.close();
});

test("success envelope contains only data and contract meta", async () => {
  const request = {} as Parameters<typeof createSuccessEnvelope>[0];
  const envelope = createSuccessEnvelope(request, { value: 1 });
  assert.deepEqual(Object.keys(envelope), ["data", "meta"]);
  assert.deepEqual(Object.keys(envelope.meta), ["request_id", "api_version"]);
});
