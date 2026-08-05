import type { FastifyInstance } from "fastify";

import { buildApp } from "./build-app.js";
import { loadRuntimeConfig, type RuntimeConfig } from "../config/runtime-config.js";

export async function closeWithDeadline(
  app: FastifyInstance,
  timeoutMs: number,
): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error("server shutdown deadline exceeded"));
    }, timeoutMs);
    timer.unref();
  });

  try {
    await Promise.race([app.close(), timeout]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function forceTerminate(app: FastifyInstance, exitCode: 1): never {
  try {
    app.server.closeAllConnections();
    app.server.close();
  } catch {
    // The process exit below is the final shutdown boundary even if a handle is already closed.
  }

  process.exitCode = exitCode;
  process.exit(exitCode);
}

function terminateSuccessfully(): never {
  process.exitCode = 0;
  process.exit(0);
}

export async function startServer(config: RuntimeConfig = loadRuntimeConfig()): Promise<FastifyInstance> {
  const app = await buildApp(config);
  let shutdownStarted = false;

  const shutdown = (): void => {
    if (shutdownStarted) {
      forceTerminate(app, 1);
    }
    shutdownStarted = true;

    void closeWithDeadline(app, config.shutdownTimeoutMs)
      .then(() => {
        terminateSuccessfully();
      })
      .catch(() => {
        forceTerminate(app, 1);
      });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  try {
    await app.listen({ host: config.host, port: config.port });
    return app;
  } catch (error) {
    process.removeListener("SIGTERM", shutdown);
    process.removeListener("SIGINT", shutdown);
    await app.close();
    throw error;
  }
}

const isEntrypoint = process.argv[1] !== undefined &&
  import.meta.url === new URL(process.argv[1], "file:").href;

if (isEntrypoint) {
  await startServer();
}
