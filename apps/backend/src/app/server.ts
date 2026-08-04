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

export async function startServer(config: RuntimeConfig = loadRuntimeConfig()): Promise<FastifyInstance> {
  const app = await buildApp(config);
  let shutdownStarted = false;

  const shutdown = (): void => {
    if (shutdownStarted) {
      return;
    }
    shutdownStarted = true;

    void closeWithDeadline(app, config.shutdownTimeoutMs)
      .then(() => {
        process.exitCode = 0;
      })
      .catch(() => {
        process.exitCode = 1;
      });
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

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
