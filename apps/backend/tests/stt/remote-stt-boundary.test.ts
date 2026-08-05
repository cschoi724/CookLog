import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import test from "node:test";
import Fastify from "fastify";

import { buildApp } from "../../src/app/build-app.js";
import {
  FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG,
  RemoteSTTConfigError,
  validateRemoteSTTEnvironment,
  type RemoteSTTReleaseConfig,
} from "../../src/config/remote-stt-config.js";
import { loadRuntimeConfig, RuntimeConfigError } from "../../src/config/runtime-config.js";
import { installCommonHttp } from "../../src/http/common-http.js";
import { evaluateRemoteSTTActivation } from "../../src/stt/activation-gate.js";
import { installDisabledRemoteSTTHttpBoundary } from "../../src/stt/disabled-http-boundary.js";
import {
  resolveRemoteSTTAdapter,
  resolveRemoteSTTReleaseConfig,
} from "../../src/stt/disabled-resolver.js";

interface SharedDisabledFixture {
  readonly release_config: RemoteSTTReleaseConfig;
  readonly scenarios: readonly {
    readonly name: string;
    readonly backend_action?: string;
    readonly public_error_code?: string;
    readonly remote_requests: number;
    readonly audio_bytes_read_by_backend: number;
    readonly audio_bytes_egressed: number;
  }[];
}

async function readJson<T>(relativePath: string): Promise<T> {
  const contents = await readFile(new URL(relativePath, `file://${process.cwd()}/`), "utf8");
  return JSON.parse(contents) as T;
}

test("first public release config exactly matches the approved disabled fixture", async () => {
  const fixture = await readJson<RemoteSTTReleaseConfig>(
    "contracts/stt/fixtures/disabled-release.json",
  );

  assert.deepEqual(FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG, fixture);
  assert.deepEqual(resolveRemoteSTTReleaseConfig({}), fixture);
  assert.ok(Object.isFrozen(FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG));
});

test("explicit disabled settings are accepted without creating an activation path", () => {
  const config = validateRemoteSTTEnvironment({
    COOKLOG_REMOTE_STT_MODE: "disabled",
    COOKLOG_REMOTE_STT_ENABLED: "false",
    COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED: "false",
    COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED: "false",
    COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED: "false",
    COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK: "false",
    COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL: "true",
  });

  assert.strictEqual(config, FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG);
});

test("every activation mutation fails closed before startup", () => {
  const mutations: ReadonlyArray<readonly [string, string]> = [
    ["COOKLOG_REMOTE_STT_MODE", "enabled"],
    ["COOKLOG_REMOTE_STT_ENABLED", "true"],
    ["COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED", "true"],
    ["COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED", "true"],
    ["COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED", "true"],
    ["COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK", "true"],
    ["COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL", "false"],
  ];

  for (const [key, value] of mutations) {
    assert.throws(
      () => validateRemoteSTTEnvironment({ [key]: value }),
      (error: unknown) => error instanceof RemoteSTTConfigError &&
        error.code === "REMOTE_STT_CONFIG_INVALID" &&
        error.message.includes(key),
      key,
    );
  }
});

test("local, test, and production runtime entry points reject every unapproved setting", () => {
  const mutations: ReadonlyArray<readonly [string, string]> = [
    ["COOKLOG_REMOTE_STT_ENABLED", "true"],
    ["COOKLOG_REMOTE_STT_MODE", "enabled"],
    ["COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED", "true"],
    ["COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED", "true"],
    ["COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED", "true"],
    ["COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK", "true"],
    ["COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL", "false"],
    ["COOKLOG_REMOTE_STT_ENDPOINT", "https://unapproved.invalid/stt"],
    ["COOKLOG_REMOTE_STT_API_KEY", "synthetic-must-not-be-used"],
    ["COOKLOG_REMOTE_STT_UNAPPROVED_FLAG", "true"],
  ];
  const environments: ReadonlyArray<readonly [string, NodeJS.ProcessEnv]> = [
    ["local", { COOKLOG_ENV: "local" }],
    ["test", { COOKLOG_ENV: "test", PORT: "0" }],
    ["production", {
      COOKLOG_ENV: "production",
      HOST: "0.0.0.0",
      PORT: "8080",
      K_SERVICE: "cooklog-test",
      K_REVISION: "cooklog-test-00001",
      K_CONFIGURATION: "cooklog-test",
    }],
  ];

  for (const [environmentName, baseEnvironment] of environments) {
    for (const [key, value] of mutations) {
      assert.throws(
        () => loadRuntimeConfig({ ...baseEnvironment, [key]: value }),
        (error: unknown) => key === "COOKLOG_REMOTE_STT_ENABLED"
          ? error instanceof RuntimeConfigError &&
            error.message === "remote STT cannot be enabled in the foundation runtime"
          : error instanceof RemoteSTTConfigError &&
            error.code === "REMOTE_STT_CONFIG_INVALID" &&
            error.message.includes(key),
        `${environmentName}:${key}`,
      );
    }
  }
});

test("provider, credential, endpoint, and egress destination injection is rejected", () => {
  for (const key of [
    "COOKLOG_REMOTE_STT_PROVIDER",
    "COOKLOG_REMOTE_STT_ENDPOINT",
    "COOKLOG_REMOTE_STT_EGRESS_DESTINATION",
    "COOKLOG_REMOTE_STT_API_KEY",
    "REMOTE_STT_PROVIDER",
    "REMOTE_STT_ENDPOINT",
    "REMOTE_STT_API_KEY",
  ]) {
    assert.throws(
      () => validateRemoteSTTEnvironment({ [key]: "synthetic-must-not-be-used" }),
      (error: unknown) => error instanceof RemoteSTTConfigError &&
        error.message === `${key} is forbidden while remote STT is disabled`,
      key,
    );
  }

  assert.throws(
    () => validateRemoteSTTEnvironment({
      COOKLOG_REMOTE_STT_APPROVAL_REVISION: "unapproved-revision",
    }),
    /is not an approved remote STT setting/,
  );
});

test("resolver exposes only a disabled decision surface", () => {
  const adapter = resolveRemoteSTTAdapter({ COOKLOG_REMOTE_STT_MODE: "disabled" });

  assert.equal(adapter.mode, "disabled");
  assert.deepEqual(Object.keys(adapter).sort(), ["evaluate", "mode"]);
  assert.equal("transcribe" in adapter, false);
  assert.strictEqual(adapter, resolveRemoteSTTAdapter({}));
});

test("direct attempts and local failure fallback stop before every side effect", () => {
  const adapter = resolveRemoteSTTAdapter({});

  for (const attempt of ["direct_upload", "automatic_remote_fallback"] as const) {
    assert.deepEqual(adapter.evaluate(attempt), {
      allowed: false,
      decision: "reject_before_body_read",
      publicCode: "SERVICE_DISABLED",
      retryable: false,
      effects: {
        routesRegistered: 0,
        bodyReads: 0,
        temporaryObjectsCreated: 0,
        queueMessagesCreated: 0,
        providerCalls: 0,
        egressCalls: 0,
      },
    });
  }
});

test("a mutated release object cannot bypass the activation gate", () => {
  const mutated = {
    ...FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG,
    provider_configured: true,
  } as unknown as RemoteSTTReleaseConfig;

  assert.throws(
    () => evaluateRemoteSTTActivation(mutated, "direct_upload"),
    /violated the disabled boundary/,
  );
});

test("runtime registers no remote STT route and reflects no attempted audio", async (context) => {
  const app = await buildApp(loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" }));
  context.after(async () => app.close());

  assert.equal(existsSync(new URL("src/routes/stt", `file://${process.cwd()}/`)), false);
  assert.doesNotMatch(app.printRoutes(), /stt|transcription|audio/i);

  const response = await app.inject({
    method: "POST",
    url: "/v1/stt/transcriptions",
  });

  assert.equal(response.statusCode, 404);
});

test("disabled HTTP boundary sends SERVICE_DISABLED before its audio parser runs", async () => {
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  installDisabledRemoteSTTHttpBoundary(app);

  let audioBytesRead = 0;
  app.addContentTypeParser(
    "application/x-cooklog-audio",
    { parseAs: "buffer" },
    (_request, body, done) => {
      audioBytesRead += body.length;
      done(null, body);
    },
  );

  const marker = "synthetic-audio-must-not-be-reflected";
  for (const url of [
    "/v1/stt/transcriptions?attempt=unapproved",
    "/v1/%73tt/transcriptions",
  ]) {
    const response = await app.inject({
      method: "POST",
      url,
      payload: marker,
      headers: { "content-type": "application/x-cooklog-audio" },
    });

    assert.equal(response.statusCode, 503, url);
    assert.equal(response.json().code, "SERVICE_DISABLED", url);
    assert.equal(audioBytesRead, 0, url);
    assert.doesNotMatch(response.body, new RegExp(marker), url);
  }
  assert.doesNotMatch(app.printRoutes(), /stt|transcription|audio/i);
  await app.close();
});

test("shared iOS/backend disabled scenarios remain zero-effect", async () => {
  const fixture = await readJson<SharedDisabledFixture>(
    "contracts/fixtures/remote-stt-disabled.json",
  );

  assert.deepEqual(fixture.release_config, FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG);
  for (const scenario of fixture.scenarios) {
    assert.equal(scenario.remote_requests, 0, scenario.name);
    assert.equal(scenario.audio_bytes_read_by_backend, 0, scenario.name);
    assert.equal(scenario.audio_bytes_egressed, 0, scenario.name);
  }

  const rejected = fixture.scenarios.find(
    (scenario) => scenario.name === "unapproved_remote_upload_attempt",
  );
  assert.equal(rejected?.backend_action, "reject_before_body_read");
  assert.equal(rejected?.public_error_code, "SERVICE_DISABLED");
});
