import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import {
  InMemoryTelemetrySink,
  SafeLogger,
  TelemetryRedactionScanner,
  type SafeTelemetryEvent,
  type TelemetrySink,
} from "../../src/observability/safe-logger.js";

test("allowlist logger projects only fixed non-content metadata", () => {
  const sink = new InMemoryTelemetrySink();
  const logger = new SafeLogger({
    sink,
    now: () => Date.parse("2026-08-05T00:00:00Z"),
  });
  const requestId = randomUUID();

  assert.equal(logger.emit("request_completed", {
    request_id: requestId,
    route_template: "/v1/ai/recipe-jobs/{job_id}",
    http_method: "POST",
    http_status: 202,
    public_error_code: "NONE",
    latency_ms_bucket: "lt_100",
    request_bytes_bucket: "lt_4096",
    response_bytes_bucket: "lt_4096",
  }), true);

  assert.deepEqual(sink.events(), [{
    event_name: "request_completed",
    occurred_at: "2026-08-05T00:00:00.000Z",
    request_id: requestId,
    route_template: "/v1/ai/recipe-jobs/{job_id}",
    http_method: "POST",
    http_status: 202,
    public_error_code: "NONE",
    latency_ms_bucket: "lt_100",
    request_bytes_bucket: "lt_4096",
    response_bytes_bucket: "lt_4096",
  }]);
});

test("content, secret, headers, query, exceptions, and structural tricks are dropped", () => {
  const sink = new InMemoryTelemetrySink();
  const logger = new SafeLogger({ sink });
  const canaries = [
    { cleanup_outcome: "deleted", cleanup_age_seconds: 10, cleanup_target_kind: "ai_content", body: "raw-recipe" },
    { cleanup_outcome: "Bearer secret-token", cleanup_age_seconds: 10, cleanup_target_kind: "ai_content" },
    { cleanup_outcome: "deleted", cleanup_age_seconds: 10, cleanup_target_kind: "raw-transcript" },
    new Error("synthetic-secret raw-recipe"),
    Object.assign(Object.create({ token: "synthetic-secret" }), {
      cleanup_outcome: "deleted", cleanup_age_seconds: 10, cleanup_target_kind: "ai_content",
    }),
  ];
  let getterCalls = 0;
  const getter = { cleanup_age_seconds: 10, cleanup_target_kind: "ai_content" } as Record<string, unknown>;
  Object.defineProperty(getter, "cleanup_outcome", {
    enumerable: true,
    get: () => { getterCalls += 1; return "deleted"; },
  });
  canaries.push(getter);

  for (const input of canaries) assert.equal(logger.emit("cleanup_completed", input), false);
  assert.equal(getterCalls, 0);
  assert.deepEqual(sink.events(), []);
  assert.equal(JSON.stringify(logger.dropCounts()).includes("synthetic-secret"), false);
  assert.equal(Object.values(logger.dropCounts()).reduce((sum, count) => sum + count, 0), canaries.length);
});

test("reservation denial and sink failure emit only fixed drop counters", () => {
  const denied = new SafeLogger({
    sink: new InMemoryTelemetrySink(),
    reserve: () => false,
  });
  assert.equal(denied.emit("cleanup_completed", {
    cleanup_outcome: "deleted",
    cleanup_age_seconds: 10,
    cleanup_target_kind: "raw_metadata",
  }), false);
  assert.equal(denied.dropCounts().RESERVATION_DENIED, 1);

  const throwingSink: TelemetrySink = {
    write(_event: SafeTelemetryEvent): void {
      throw new Error("Bearer provider-secret raw-recipe");
    },
  };
  const failed = new SafeLogger({ sink: throwingSink });
  assert.equal(failed.emit("cleanup_completed", {
    cleanup_outcome: "deleted",
    cleanup_age_seconds: 10,
    cleanup_target_kind: "raw_metadata",
  }), false);
  assert.deepEqual(failed.dropCounts().SINK_UNAVAILABLE, 1);
  assert.equal(JSON.stringify(failed.dropCounts()).includes("provider-secret"), false);
});

test("unknown event names, free strings, and throwing proxies fail closed without fallback output", () => {
  const sink = new InMemoryTelemetrySink();
  const logger = new SafeLogger({ sink });
  assert.equal(logger.emit("unknown_event" as never, {}), false);
  assert.equal(logger.emit("cleanup_completed", {
    cleanup_outcome: "pasta_recipe_title",
    cleanup_age_seconds: 10,
    cleanup_target_kind: "raw_metadata",
  }), false);
  const proxy = new Proxy({}, {
    getPrototypeOf(): object | null {
      throw new Error("synthetic-secret raw-recipe");
    },
  });
  assert.doesNotThrow(() => logger.emit("cleanup_completed", proxy));
  assert.deepEqual(sink.events(), []);
  assert.equal(JSON.stringify(logger.dropCounts()).includes("synthetic-secret"), false);
});

test("redaction scanner rejects forbidden keys and secret-shaped values without throwing", () => {
  const scanner = new TelemetryRedactionScanner();
  assert.equal(scanner.isSafe({ cleanup_outcome: "deleted" }), true);
  assert.equal(scanner.isSafe({ request_body: "anything" }), false);
  assert.equal(scanner.isSafe({ deployment_version: "Bearer secret-token" }), false);
  const proxy = new Proxy({}, { ownKeys: () => { throw new Error("synthetic-secret"); } });
  assert.doesNotThrow(() => scanner.isSafe(proxy as Record<string, string>));
  assert.equal(scanner.isSafe(proxy as Record<string, string>), false);
});
