import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getAuthenticatedInstallation } from "../../auth/authentication.js";
import {
  createSuccessEnvelope,
  getRequestId,
  sendProblem,
  sendSuccess,
} from "../../http/common-http.js";
import {
  claimHttpIdempotency,
  type HttpIdempotencyClaim,
} from "../../idempotency/http-idempotency.js";
import type { InMemoryIdempotencyStore } from "../../idempotency/idempotency-store.js";
import type { RecipeJobService } from "../../jobs/recipe-job-service.js";

type RouteGuard = (request: FastifyRequest, reply: FastifyReply) => Promise<void>;

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

function composeGuards(...guards: readonly (RouteGuard | undefined)[]): RouteGuard | undefined {
  const configured = guards.filter((guard): guard is RouteGuard => guard !== undefined);
  if (configured.length === 0) return undefined;
  return async (request, reply) => {
    for (const guard of configured) {
      await guard(request, reply);
      if (reply.sent) return;
    }
  };
}

function sendIdempotentSuccess<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  claim: HttpIdempotencyClaim | undefined,
  data: T,
  statusCode = 200,
): void {
  if (claim === undefined) {
    sendSuccess(request, reply, data, statusCode);
    return;
  }
  const body = createSuccessEnvelope(request, data);
  claim.store.complete(claim.owner, {
    statusCode,
    body,
    requestId: getRequestId(request),
    contentType: "application/json",
  });
  reply.code(statusCode).type("application/json").send(body);
}

function sendIdempotentProblem(
  request: FastifyRequest,
  reply: FastifyReply,
  claim: HttpIdempotencyClaim | undefined,
  code: string,
  options: Parameters<typeof sendProblem>[3] = {},
): void {
  const body = sendProblem(request, reply, code, options);
  if (claim !== undefined) {
    claim.store.complete(claim.owner, {
      statusCode: body.status,
      body,
      requestId: getRequestId(request),
      contentType: "application/problem+json",
    });
  }
}

export function installRecipeJobRoutes(
  app: FastifyInstance,
  options: {
    readonly service: RecipeJobService;
    readonly authenticate?: RouteGuard;
    readonly enforceReadLimits?: RouteGuard;
    readonly enforceMutationLimits?: RouteGuard;
    readonly idempotencyStore?: InMemoryIdempotencyStore;
  },
): void {
  const mutationGuard = composeGuards(options.authenticate, options.enforceMutationLimits);
  const readGuard = composeGuards(options.authenticate, options.enforceReadLimits);
  const mutationRouteOptions = mutationGuard === undefined ? {} : { preHandler: mutationGuard };
  const readRouteOptions = readGuard === undefined ? {} : { preHandler: readGuard };

  app.post("/v1/ai/recipe-jobs", mutationRouteOptions, (request, reply) => {
    const owner = installationId(request, reply);
    if (owner === undefined) return;
    const claim = options.idempotencyStore === undefined
      ? undefined
      : claimHttpIdempotency(request, reply, options.idempotencyStore);
    if (options.idempotencyStore !== undefined && claim === undefined) return;
    try {
      const result = options.service.createJob(owner, singleHeader(request, "idempotency-key"), request.body);
      switch (result.kind) {
        case "accepted": sendIdempotentSuccess(request, reply, claim, result.status, 202); return;
        case "invalid_request": sendIdempotentProblem(request, reply, claim, "VALIDATION_FAILED", {
          violations: [{ field: "body", reason: "INVALID_FORMAT" }],
        }); return;
        case "invalid_idempotency_key": sendIdempotentProblem(request, reply, claim, "VALIDATION_FAILED", {
          violations: [{ field: "idempotency_key", reason: "INVALID_FORMAT" }],
        }); return;
        case "idempotency_reused": sendIdempotentProblem(request, reply, claim, "IDEMPOTENCY_KEY_REUSED"); return;
        case "quota_exceeded": sendIdempotentProblem(request, reply, claim, "QUOTA_EXCEEDED", {
          retryAfterSeconds: 3_600,
        }); return;
        case "service_disabled": sendIdempotentProblem(request, reply, claim, "SERVICE_DISABLED"); return;
        case "internal_error": sendIdempotentProblem(request, reply, claim, "INTERNAL_ERROR"); return;
      }
    } catch (error) {
      if (claim !== undefined) claim.store.markOutcomeUnknown(claim.owner);
      throw error;
    }
  });

  app.get<{ Params: { jobId: string } }>("/v1/ai/recipe-jobs/:jobId", readRouteOptions, (request, reply) => {
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
    mutationRouteOptions,
    (request, reply) => {
      const owner = installationId(request, reply);
      if (owner === undefined) return;
      const claim = options.idempotencyStore === undefined
        ? undefined
        : claimHttpIdempotency(request, reply, options.idempotencyStore);
      if (options.idempotencyStore !== undefined && claim === undefined) return;
      try {
        const result = options.service.acknowledge(
          owner,
          request.params.jobId,
          singleHeader(request, "idempotency-key"),
          request.body,
        );
        switch (result.kind) {
          case "success": sendIdempotentSuccess(request, reply, claim, result.status); return;
          case "invalid_request": sendIdempotentProblem(request, reply, claim, "VALIDATION_FAILED", {
            violations: [{ field: "body", reason: "INVALID_FORMAT" }],
          }); return;
          case "invalid_idempotency_key": sendIdempotentProblem(request, reply, claim, "VALIDATION_FAILED", {
            violations: [{ field: "idempotency_key", reason: "INVALID_FORMAT" }],
          }); return;
          case "idempotency_reused": sendIdempotentProblem(request, reply, claim, "IDEMPOTENCY_KEY_REUSED"); return;
          case "not_found": sendIdempotentProblem(request, reply, claim, "RESOURCE_NOT_FOUND"); return;
          case "version_mismatch": sendIdempotentProblem(request, reply, claim, "VALIDATION_FAILED", {
            violations: [{ field: "body", reason: "MISMATCH" }],
          }); return;
          case "internal_error": sendIdempotentProblem(request, reply, claim, "INTERNAL_ERROR"); return;
        }
      } catch (error) {
        if (claim !== undefined) claim.store.markOutcomeUnknown(claim.owner);
        throw error;
      }
    },
  );
}
