import assert from "node:assert/strict";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { buildApp } from "../../src/app/build-app.js";
import { closeWithDeadline } from "../../src/app/server.js";
import { loadRuntimeConfig } from "../../src/config/runtime-config.js";

type ShutdownScenario = "normal" | "hanging" | "keep-alive" | "repeated";

interface ChildResult {
  readonly code: number | null;
  readonly elapsedMs: number;
  readonly signal: NodeJS.Signals | null;
  readonly stderr: string;
}

const childFixturePath = fileURLToPath(
  new URL("./fixtures/shutdown-child.js", import.meta.url),
);

function waitForReady(child: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise((resolve, reject) => {
    let stdout = "";
    const timeout = setTimeout(() => reject(new Error("shutdown child did not become ready")), 5_000);

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      if (stdout.includes("READY ")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      reject(new Error(`shutdown child exited before ready: ${String(code)}/${String(signal)}`));
    });
    child.once("error", reject);
  });
}

async function runShutdownScenario(
  scenario: ShutdownScenario,
  firstSignal: NodeJS.Signals = "SIGTERM",
): Promise<ChildResult> {
  const child = spawn(process.execPath, [childFixturePath, scenario], {
    env: { ...process.env, COOKLOG_ENV: "test" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk: string) => {
    stderr += chunk;
  });

  try {
    await waitForReady(child);
    const startedAt = performance.now();
    const exit = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve, reject) => {
      child.once("exit", (code, signal) => resolve({ code, signal }));
      child.once("error", reject);
    });

    child.kill(firstSignal);
    if (scenario === "repeated") {
      setTimeout(() => child.kill("SIGINT"), 100).unref();
    }

    const result = await Promise.race([
      exit,
      new Promise<never>((_resolve, reject) => {
        setTimeout(() => reject(new Error("shutdown child exceeded the 9 second process bound")), 9_000).unref();
      }),
    ]);

    return {
      ...result,
      elapsedMs: performance.now() - startedAt,
      stderr,
    };
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGKILL");
    }
  }
}

test("server can listen on the configured host and close within the deadline", async () => {
  const config = loadRuntimeConfig({ COOKLOG_ENV: "test", PORT: "0" });
  const app = await buildApp(config);

  await app.listen({ host: config.host, port: config.port });
  assert.match(app.listeningOrigin, /^http:\/\/127\.0\.0\.1:\d+$/);

  await closeWithDeadline(app, 1_000);
  assert.equal(app.server.listening, false);
});

test("SIGTERM closes the actual server process with exit code 0", async () => {
  const result = await runShutdownScenario("normal");

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.signal, null);
  assert.ok(result.elapsedMs < 9_000);
});

test("SIGINT closes the actual server process with exit code 0", async () => {
  const result = await runShutdownScenario("normal", "SIGINT");

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.signal, null);
  assert.ok(result.elapsedMs < 9_000);
});

test("an idle keep-alive connection does not prevent graceful process exit", async () => {
  const result = await runShutdownScenario("keep-alive");

  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.signal, null);
  assert.ok(result.elapsedMs < 9_000);
});

test("a hanging close is forcibly terminated after the shutdown deadline", async () => {
  const result = await runShutdownScenario("hanging");

  assert.equal(result.code, 1, result.stderr);
  assert.equal(result.signal, null);
  assert.ok(result.elapsedMs >= 900);
  assert.ok(result.elapsedMs < 9_000);
});

test("a second shutdown signal forces immediate termination", async () => {
  const result = await runShutdownScenario("repeated");

  assert.equal(result.code, 1, result.stderr);
  assert.equal(result.signal, null);
  assert.ok(result.elapsedMs < 900);
});
