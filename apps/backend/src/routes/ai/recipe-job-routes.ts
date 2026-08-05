import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getAuthenticatedInstallation } from "../../auth/authentication.js";
import { sendProblem, sendSuccess } from "../../http/common-http.js";
import type { RecipeJobService } from "../../jobs/recipe-job-service.js";

function singleHeader(request: FastifyRequest, name: string): string | undefined {
  const value = request.headers[name];
  return typeof value === "string" ? value : undefined;
}

function installationId(request: FastifyRequest, reply: FastifyReply): string | undefined {
  const context = getAuthenticatedInstallation(request);
  if (context !== undefined) return context.installationId;
  sendProblem(request, reply, "AUTH_REQUIRED");
  return undefined;
}

export function installRecipeJobRoutes(
  app: FastifyInstance,
  options: {
    readonly service: RecipeJobService;
    readonly authenticate?: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  },
): void {
  const routeOptions = options.authenticate === undefined ? {} : { preHandler: options.authenticate };

  app.post("/v1/ai/recipe-jobs", routeOptions, (request, reply) => {
    const owner = installationId(request, reply);
    if (owner === undefined) return;
    const result = options.service.createJob(owner, singleHeader(request, "idempotency-key"), request.body);
    switch (result.kind) {
      case "accepted": sendSuccess(request, reply, result.status, 202); return;
      case "invalid_request": sendProblem(request, reply, "VALIDATION_FAILED", {
        violations: [{ field: "body", reason: "INVALID_FORMAT" }],
      }); return;
      case "invalid_idempotency_key": sendProblem(request, reply, "VALIDATION_FAILED", {
        violations: [{ field: "idempotency_key", reason: "INVALID_FORMAT" }],
      }); return;
      case "idempotency_reused": sendProblem(request, reply, "IDEMPOTENCY_KEY_REUSED"); return;
      case "quota_exceeded": sendProblem(request, reply, "QUOTA_EXCEEDED", { retryAfterSeconds: 3_600 }); return;
      case "service_disabled": sendProblem(request, reply, "SERVICE_DISABLED"); return;
      case "internal_error": sendProblem(request, reply, "INTERNAL_ERROR"); return;
    }
  });

  app.get<{ Params: { jobId: string } }>("/v1/ai/recipe-jobs/:jobId", routeOptions, (request, reply) => {
    const owner = installationId(request, reply);
    if (owner === undefined) return;
    const status = options.service.getStatus(owner, request.params.jobId);
    if (status === undefined) {
      sendProblem(request, reply, "RESOURCE_NOT_FOUND");
      return;
    }
    sendSuccess(request, reply, status);
  });

  app.post<{ Params: { jobId: string } }>(
    "/v1/ai/recipe-jobs/:jobId/result-acknowledgements",
    routeOptions,
    (request, reply) => {
      const owner = installationId(request, reply);
      if (owner === undefined) return;
      const result = options.service.acknowledge(
        owner,
        request.params.jobId,
        singleHeader(request, "idempotency-key"),
        request.body,
      );
      switch (result.kind) {
        case "success": sendSuccess(request, reply, result.status); return;
        case "invalid_request": sendProblem(request, reply, "VALIDATION_FAILED", {
          violations: [{ field: "body", reason: "INVALID_FORMAT" }],
        }); return;
        case "invalid_idempotency_key": sendProblem(request, reply, "VALIDATION_FAILED", {
          violations: [{ field: "idempotency_key", reason: "INVALID_FORMAT" }],
        }); return;
        case "idempotency_reused": sendProblem(request, reply, "IDEMPOTENCY_KEY_REUSED"); return;
        case "not_found": sendProblem(request, reply, "RESOURCE_NOT_FOUND"); return;
        case "version_mismatch": sendProblem(request, reply, "VALIDATION_FAILED", {
          violations: [{ field: "body", reason: "MISMATCH" }],
        }); return;
        case "internal_error": sendProblem(request, reply, "INTERNAL_ERROR"); return;
      }
    },
  );
}
