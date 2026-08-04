import type { FastifyInstance } from "fastify";

const healthResponse = Object.freeze({
  status: "ok" as const,
  service: "cooklog-backend" as const,
  contract_version: "health.v1" as const,
});

export async function registerHealthRoute(app: FastifyInstance): Promise<void> {
  app.get(
    "/healthz",
    {
      schema: {
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            required: ["status", "service", "contract_version"],
            properties: {
              status: { const: "ok" },
              service: { const: "cooklog-backend" },
              contract_version: { const: "health.v1" },
            },
          },
        },
      },
    },
    async () => healthResponse,
  );
}
