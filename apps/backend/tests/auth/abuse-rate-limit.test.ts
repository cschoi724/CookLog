import assert from "node:assert/strict";
import test from "node:test";

import {
  createRateLimitPolicies,
  InMemoryRateLimiter,
} from "../../src/limits/rate-limiter.js";

test("production and compatibility rate policies cannot exceed approved caps", () => {
  assert.equal(createRateLimitPolicies().installationRequestsPerMinute, 60);
  const compatibility = createRateLimitPolicies({}, "development_compatibility");
  assert.deepEqual(compatibility, {
    authChallengePerMinute: 2,
    installationAuthPerTenMinutes: 2,
    installationRequestsPerMinute: 10,
    installationMutationsPerMinute: 3,
    installationAiJobsPerDay: 2,
    projectRequestsPerMinute: 30,
    projectAiJobsPerMinute: 2,
  });
  assert.throws(() => createRateLimitPolicies({ installationRequestsPerMinute: 11 },
    "development_compatibility"));
  assert.equal(createRateLimitPolicies({ projectRequestsPerMinute: 0 }).projectRequestsPerMinute, 0);
});

test("installation, IP and project checks consume atomically and fail closed on invalid time", async () => {
  let now = Date.parse("2026-08-10T00:00:00Z");
  const limiter = new InMemoryRateLimiter(() => now, { failClosedInvalidClock: true });
  const checks = [
    { scope: "installation" as const, key: "install-partition", limit: 1, windowMs: 60_000 },
    { scope: "ip" as const, key: "ip-hmac-partition", limit: 2, windowMs: 60_000 },
    { scope: "project" as const, key: "cooklog", limit: 2, windowMs: 60_000 },
  ];
  assert.deepEqual(await limiter.consume(checks), { allowed: true });
  const blocked = await limiter.consume(checks);
  assert.equal(blocked.allowed, false);
  if (!blocked.allowed && !("unavailable" in blocked)) assert.equal(blocked.scope, "installation");
  now += 60_000;
  assert.deepEqual(await limiter.consume(checks), { allowed: true });
  now = Number.NaN;
  assert.deepEqual(await limiter.consume(checks), { allowed: false, unavailable: true });
});

test("duplicate limiter dimensions are rejected before counters mutate", async () => {
  const limiter = new InMemoryRateLimiter(() => 1_786_000_000_000);
  const check = { scope: "project" as const, key: "cooklog", limit: 1, windowMs: 60_000 };
  await assert.rejects(limiter.consume([check, check]), /duplicate rate limit dimensions/);
  assert.deepEqual(await limiter.consume([check]), { allowed: true });
});
