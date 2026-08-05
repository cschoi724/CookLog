import Fastify, { type FastifyInstance } from "fastify";

import type { RuntimeConfig } from "../config/runtime-config.js";
import { registerHealthRoute } from "../health/health-route.js";

export async function buildApp(config: RuntimeConfig): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false,
    bodyLimit: 1_048_576,
    requestTimeout: 30_000,
  });

  app.decorate("runtimeConfig", config);
  await app.register(registerHealthRoute);

  return app;
}
