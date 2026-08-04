import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../../src/app/build-app.js";
import { loadRuntimeConfig } from "../../src/config/runtime-config.js";

test("GET /healthz returns a fixed content-free response", async (context) => {
  const app = await buildApp(loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" }));
  context.after(async () => app.close());

  const response = await app.inject({ method: "GET", url: "/healthz" });

  assert.equal(response.statusCode, 200);
  assert.match(response.headers["content-type"] ?? "", /^application\/json/);
  assert.deepEqual(response.json(), {
    status: "ok",
    service: "cooklog-backend",
    contract_version: "health.v1",
  });
  assert.deepEqual(Object.keys(response.json()).sort(), ["contract_version", "service", "status"]);
});

test("health response never reflects environment or secret-shaped values", async (context) => {
  const app = await buildApp(loadRuntimeConfig({
    COOKLOG_ENV: "test",
    PORT: "0",
    OPENAI_API_KEY: "synthetic-secret-must-not-appear",
  }));
  context.after(async () => app.close());

  const response = await app.inject({ method: "GET", url: "/healthz" });
  assert.doesNotMatch(response.body, /synthetic-secret|OPENAI|K_REVISION|process\.env/i);
});

test("foundation exposes no remote STT route", async (context) => {
  const app = await buildApp(loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" }));
  context.after(async () => app.close());

  const response = await app.inject({
    method: "POST",
    url: "/v1/stt/transcriptions",
    payload: { audio: "must-not-be-read" },
  });

  assert.equal(response.statusCode, 404);
});
