import assert from "node:assert/strict";
import test from "node:test";

import { loadRuntimeConfig, RuntimeConfigError } from "../../src/config/runtime-config.js";

const productionEnvironment = {
  COOKLOG_ENV: "production",
  HOST: "0.0.0.0",
  PORT: "8080",
  K_SERVICE: "cooklog-test",
  K_REVISION: "cooklog-test-00001",
  K_CONFIGURATION: "cooklog-test",
};

test("local config uses loopback and contains no secret values", () => {
  const config = loadRuntimeConfig({ COOKLOG_ENV: "local" });

  assert.deepEqual(config, {
    environment: "local",
    host: "127.0.0.1",
    port: 8080,
    shutdownTimeoutMs: 8_000,
    serviceName: "cooklog-backend",
  });
});

test("production config requires Cloud Run identity and PORT before startup", () => {
  for (const requiredKey of ["PORT", "K_SERVICE", "K_REVISION", "K_CONFIGURATION"]) {
    const environment: NodeJS.ProcessEnv = { ...productionEnvironment };
    delete environment[requiredKey];

    assert.throws(
      () => loadRuntimeConfig(environment),
      (error: unknown) => error instanceof RuntimeConfigError &&
        error.message === `production requires ${requiredKey}`,
    );
  }
});

test("production binds to the Cloud Run ingress host", () => {
  const config = loadRuntimeConfig(productionEnvironment);
  assert.equal(config.host, "0.0.0.0");
  assert.equal(config.port, 8080);

  assert.throws(
    () => loadRuntimeConfig({ ...productionEnvironment, HOST: "127.0.0.1" }),
    /production HOST must be 0\.0\.0\.0/,
  );
});

test("foundation rejects remote STT activation in every environment", () => {
  assert.throws(
    () => loadRuntimeConfig({ COOKLOG_ENV: "test", COOKLOG_REMOTE_STT_ENABLED: "true" }),
    /remote STT cannot be enabled/,
  );
});

test("production rejects provider and file credential secrets", () => {
  for (const forbiddenKey of ["OPENAI_API_KEY", "GOOGLE_APPLICATION_CREDENTIALS"]) {
    assert.throws(
      () => loadRuntimeConfig({ ...productionEnvironment, [forbiddenKey]: "synthetic-do-not-use" }),
      new RegExp(`production forbids ${forbiddenKey}`),
    );
  }
});

test("invalid numeric settings fail closed", () => {
  assert.throws(
    () => loadRuntimeConfig({ COOKLOG_ENV: "local", PORT: "not-a-port" }),
    /PORT must be an integer/,
  );
  assert.throws(
    () => loadRuntimeConfig({ COOKLOG_ENV: "local", SHUTDOWN_TIMEOUT_MS: "10000" }),
    /SHUTDOWN_TIMEOUT_MS must be between 1000 and 9000/,
  );
});
