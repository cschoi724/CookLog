import assert from "node:assert/strict";
import test from "node:test";

import { buildApp } from "../../src/app/build-app.js";
import { closeWithDeadline } from "../../src/app/server.js";
import { loadRuntimeConfig } from "../../src/config/runtime-config.js";

test("server can listen on the configured host and close within the deadline", async () => {
  const config = loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" });
  const app = await buildApp(config);

  await app.listen({ host: config.host, port: config.port });
  assert.match(app.listeningOrigin, /^http:\/\/127\.0\.0\.1:\d+$/);

  await closeWithDeadline(app, 1_000);
  assert.equal(app.server.listening, false);
});
