import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import Fastify from "fastify";

import { createAuthenticationGuard } from "../../src/auth/authentication.js";
import { LocalInstallationTokenService } from "../../src/auth/installation-token.js";
import type { VerifiedAttestation } from "../../src/auth/attestation.js";
import {
  createSuccessEnvelope,
  getRequestId,
  installCommonHttp,
  sendSuccess,
} from "../../src/http/common-http.js";
import { hashJsonBody } from "../../src/idempotency/body-hash.js";
import { claimHttpIdempotency } from "../../src/idempotency/http-idempotency.js";
import { InMemoryIdempotencyStore } from "../../src/idempotency/idempotency-store.js";
import {
  createProtectedRateLimitGuard,
  createUnauthenticatedRateLimitGuard,
} from "../../src/limits/rate-limit-guard.js";
import { InMemoryRateLimiter, IpPartitioner } from "../../src/limits/rate-limiter.js";

const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";
const attestation: VerifiedAttestation = {
  provider: "apple_app_attest",
  appId: "app.cooklog.ios",
  environment: "production",
  installationId,
  replayProtected: true,
  verifiedAt: new Date("2026-08-05T00:00:00Z"),
};

test("limiter atomically applies installation and project scopes", async () => {
  let now = 1_000;
  const limiter = new InMemoryRateLimiter(() => now);
  const checks = [
    { scope: "installation" as const, key: "install:a", limit: 2, windowMs: 60_000 },
    { scope: "project" as const, key: "project", limit: 1, windowMs: 60_000 },
  ];
  assert.deepEqual(await limiter.consume(checks), { allowed: true });
  assert.deepEqual(await limiter.consume(checks), {
    allowed: false,
    scope: "project",
    retryAfterSeconds: 60,
  });
  now += 60_000;
  assert.deepEqual(await limiter.consume(checks), { allowed: true });
  limiter.setAvailable(false);
  assert.deepEqual(await limiter.consume(checks), { allowed: false, unavailable: true });
});

test("project emergency limit zero blocks without consuming another scope", async () => {
  const limiter = new InMemoryRateLimiter();
  assert.deepEqual(await limiter.consume([
    { scope: "project", key: "project", limit: 0, windowMs: 60_000 },
  ]), { allowed: false, scope: "project", retryAfterSeconds: 60 });
});

test("IP partition keys are one-way and never contain the source IP", () => {
  const partitioner = new IpPartitioner("0123456789abcdef0123456789abcdef");
  const partition = partitioner.partition("203.0.113.7");
  assert.equal(partition.length, 64);
  assert.equal(partition.includes("203.0.113.7"), false);
  assert.equal(partition, partitioner.partition("203.0.113.7"));
});

test("protected limiter returns contract 429 before the domain handler", async () => {
  const tokenService = new LocalInstallationTokenService();
  const issued = tokenService.issue(attestation);
  const limiter = new InMemoryRateLimiter();
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  let handlerCalls = 0;
  app.post("/v1/limited", {
    preHandler: [
      createAuthenticationGuard(tokenService),
      createProtectedRateLimitGuard({
        limiter,
        mutation: true,
        projectRequestsPerMinute: 1,
      }),
    ],
  }, (request, reply) => {
    handlerCalls += 1;
    sendSuccess(request, reply, { accepted: true });
  });
  const headers = {
    authorization: `Bearer ${issued.accessToken}`,
    "cooklog-installation-id": installationId,
    "content-type": "application/json",
  };
  assert.equal((await app.inject({ method: "POST", url: "/v1/limited", headers, payload: {} })).statusCode, 200);
  const limited = await app.inject({ method: "POST", url: "/v1/limited", headers, payload: {} });
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.json().code, "RATE_LIMITED");
  assert.equal(limited.headers["retry-after"], limited.json().retry_after_seconds.toString());
  assert.equal(handlerCalls, 1);
  await app.close();
});

test("unauthenticated IP limits use ingress remote address and ignore X-Forwarded-For", async () => {
  const limiter = new InMemoryRateLimiter();
  const app = Fastify({ logger: false, trustProxy: false });
  installCommonHttp(app);
  let handlerCalls = 0;
  app.post("/v1/auth/challenges", {
    preHandler: createUnauthenticatedRateLimitGuard({
      limiter,
      ipPartitioner: new IpPartitioner("0123456789abcdef0123456789abcdef"),
      endpoint: "auth-challenge",
    }),
  }, (request, reply) => {
    handlerCalls += 1;
    sendSuccess(request, reply, { accepted: true });
  });
  for (let index = 0; index < 10; index += 1) {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/challenges",
      headers: { "x-forwarded-for": `203.0.113.${index}` },
    });
    assert.equal(response.statusCode, 200);
  }
  const limited = await app.inject({
    method: "POST",
    url: "/v1/auth/challenges",
    headers: { "x-forwarded-for": "198.51.100.250" },
  });
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.json().code, "RATE_LIMITED");
  assert.equal(handlerCalls, 10);
  await app.close();
});

test("canonical body hash ignores object key order and includes content type", () => {
  assert.equal(
    hashJsonBody("application/json", { b: 2, a: 1 }),
    hashJsonBody("application/json; charset=utf-8", { a: 1, b: 2 }),
  );
  assert.throws(() => hashJsonBody("text/plain", { a: 1 }));
});

test("idempotency store has one concurrent owner and rejects body or path reuse", async () => {
  const store = new InMemoryIdempotencyStore();
  const key = randomUUID();
  const input = {
    installationId,
    method: "POST",
    canonicalPath: "/v1/jobs",
    key,
    bodyHash: hashJsonBody("application/json", { value: 1 }),
  };
  const attempts = await Promise.all(Array.from({ length: 20 }, async () => store.begin(input)));
  assert.equal(attempts.filter(({ kind }) => kind === "owner").length, 1);
  assert.equal(attempts.filter(({ kind }) => kind === "in_progress").length, 19);
  assert.equal(store.begin({ ...input, bodyHash: hashJsonBody("application/json", { value: 2 }) }).kind, "reused");
  assert.equal(store.begin({ ...input, canonicalPath: "/v1/other" }).kind, "reused");

  const owner = attempts.find((candidate) => candidate.kind === "owner");
  assert.ok(owner?.kind === "owner");
  const requestId = randomUUID();
  store.complete(owner, { statusCode: 202, requestId, body: { accepted: true } });
  const replay = store.begin(input);
  assert.equal(replay.kind, "replay");
  if (replay.kind === "replay") {
    assert.deepEqual(replay.response, { statusCode: 202, requestId, body: { accepted: true } });
  }
});

test("idempotency outcome unknown remains recoverable only with the same key", () => {
  const store = new InMemoryIdempotencyStore();
  const input = {
    installationId,
    method: "POST",
    canonicalPath: "/v1/jobs",
    key: randomUUID(),
    bodyHash: hashJsonBody("application/json", { value: 1 }),
  };
  const owner = store.begin(input);
  assert.ok(owner.kind === "owner");
  store.markOutcomeUnknown(owner);
  assert.equal(store.begin(input).kind, "outcome_unknown");
  assert.equal(store.begin({ ...input, key: randomUUID() }).kind, "owner");
});

test("HTTP idempotency replays the exact response with aligned request IDs", async () => {
  const tokenService = new LocalInstallationTokenService();
  const issued = tokenService.issue(attestation);
  const store = new InMemoryIdempotencyStore();
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  let domainCalls = 0;
  app.post("/v1/idempotent", { preHandler: createAuthenticationGuard(tokenService) }, (request, reply) => {
    const claim = claimHttpIdempotency(request, reply, store);
    if (claim === undefined) return;
    domainCalls += 1;
    const responseBody = createSuccessEnvelope(request, { accepted: true });
    claim.store.complete(claim.owner, {
      statusCode: 202,
      requestId: getRequestId(request),
      body: responseBody,
    });
    reply.code(202).type("application/json").send(responseBody);
  });
  const key = randomUUID();
  const headers = {
    authorization: `Bearer ${issued.accessToken}`,
    "cooklog-installation-id": installationId,
    "idempotency-key": key,
    "content-type": "application/json",
  };
  const first = await app.inject({ method: "POST", url: "/v1/idempotent", headers, payload: { b: 2, a: 1 } });
  const replay = await app.inject({ method: "POST", url: "/v1/idempotent", headers, payload: { a: 1, b: 2 } });
  assert.equal(first.statusCode, 202);
  assert.equal(replay.statusCode, 202);
  assert.equal(replay.headers["cooklog-idempotency-replayed"], "true");
  assert.deepEqual(replay.json(), first.json());
  assert.equal(replay.headers["cooklog-request-id"], replay.json().meta.request_id);
  assert.equal(domainCalls, 1);

  const conflict = await app.inject({ method: "POST", url: "/v1/idempotent", headers, payload: { a: 9 } });
  assert.equal(conflict.statusCode, 409);
  assert.equal(conflict.json().code, "IDEMPOTENCY_KEY_REUSED");
  assert.equal(domainCalls, 1);
  await app.close();
});

test("HTTP idempotency rejects invalid and in-progress keys before domain work", async () => {
  const tokenService = new LocalInstallationTokenService();
  const issued = tokenService.issue(attestation);
  const store = new InMemoryIdempotencyStore();
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  let domainCalls = 0;
  app.post("/v1/idempotent-pending", { preHandler: createAuthenticationGuard(tokenService) }, (request, reply) => {
    const claim = claimHttpIdempotency(request, reply, store);
    if (claim !== undefined) domainCalls += 1;
  });
  const baseHeaders = {
    authorization: `Bearer ${issued.accessToken}`,
    "cooklog-installation-id": installationId,
    "content-type": "application/json",
  };
  const invalid = await app.inject({
    method: "POST",
    url: "/v1/idempotent-pending",
    headers: { ...baseHeaders, "idempotency-key": "not-a-uuid" },
    payload: { value: 1 },
  });
  assert.equal(invalid.statusCode, 422);
  assert.equal(invalid.json().code, "VALIDATION_FAILED");

  const key = randomUUID();
  const bodyHash = hashJsonBody("application/json", { value: 1 });
  assert.equal(store.begin({
    installationId,
    method: "POST",
    canonicalPath: "/v1/idempotent-pending",
    key,
    bodyHash,
  }).kind, "owner");
  const pending = await app.inject({
    method: "POST",
    url: "/v1/idempotent-pending",
    headers: { ...baseHeaders, "idempotency-key": key },
    payload: { value: 1 },
  });
  assert.equal(pending.statusCode, 409);
  assert.equal(pending.json().code, "REQUEST_IN_PROGRESS");
  assert.equal(pending.headers["retry-after"], "1");
  assert.equal(domainCalls, 0);
  await app.close();
});
