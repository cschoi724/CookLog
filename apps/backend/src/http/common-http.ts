import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import {
  renderProblem,
  type PublicErrorCode,
  type PublicProblem,
  type PublicViolation,
} from "./public-errors.js";

export interface SuccessEnvelope<T> {
  readonly data: T;
  readonly meta: {
    readonly request_id: string;
    readonly api_version: "v1";
  };
}

const requestIds = new WeakMap<FastifyRequest, string>();

export function getRequestId(request: FastifyRequest): string {
  const existing = requestIds.get(request);
  if (existing !== undefined) return existing;
  const generated = randomUUID();
  requestIds.set(request, generated);
  return generated;
}

export function adoptRequestIdForReplay(request: FastifyRequest, requestId: string): void {
  requestIds.set(request, requestId);
}

export function createSuccessEnvelope<T>(request: FastifyRequest, data: T): SuccessEnvelope<T> {
  return {
    data,
    meta: { request_id: getRequestId(request), api_version: "v1" },
  };
}

export function sendSuccess<T>(
  request: FastifyRequest,
  reply: FastifyReply,
  data: T,
  statusCode = 200,
): void {
  reply
    .code(statusCode)
    .type("application/json")
    .send(createSuccessEnvelope(request, data));
}

export function sendProblem(
  request: FastifyRequest,
  reply: FastifyReply,
  code: PublicErrorCode | string,
  options: {
    readonly retryAfterSeconds?: number;
    readonly violations?: readonly PublicViolation[];
  } = {},
): PublicProblem {
  const problem = renderProblem(getRequestId(request), code, options);
  if (problem.retry_after_seconds !== undefined) {
    reply.header("Retry-After", String(problem.retry_after_seconds));
  }
  reply
    .code(problem.status)
    .type("application/problem+json")
    .send(problem);
  return problem;
}

function isFastifyValidationError(error: Error & { readonly code?: string; readonly validation?: unknown }): boolean {
  return error.code === "FST_ERR_VALIDATION" || Array.isArray(error.validation);
}

export function installCommonHttp(app: FastifyInstance): void {
  app.addHook("onRequest", (request, reply, done) => {
    const requestId = randomUUID();
    requestIds.set(request, requestId);
    reply.header("CookLog-Request-ID", requestId);
    done();
  });

  app.addHook("onSend", (request, reply, _payload, done) => {
    reply.header("CookLog-Request-ID", getRequestId(request));
    done();
  });

  app.setNotFoundHandler((request, reply) => {
    const versionMatch = /^\/v(\d+)(?:\/|$)/u.exec(request.url);
    const code = versionMatch !== null && versionMatch[1] !== "1"
      ? "API_VERSION_UNSUPPORTED"
      : "RESOURCE_NOT_FOUND";
    sendProblem(request, reply, code);
  });

  app.setErrorHandler((error, request, reply) => {
    const typedError = error as Error & {
      readonly code?: string;
      readonly statusCode?: number;
      readonly validation?: unknown;
    };
    if (typedError.code === "FST_ERR_CTP_BODY_TOO_LARGE" || typedError.statusCode === 413) {
      sendProblem(request, reply, "PAYLOAD_TOO_LARGE");
      return;
    }
    if (isFastifyValidationError(typedError)) {
      sendProblem(request, reply, "VALIDATION_FAILED", {
        violations: [{ field: "body", reason: "INVALID_FORMAT" }],
      });
      return;
    }
    if (error instanceof SyntaxError || typedError.statusCode === 400) {
      sendProblem(request, reply, "INVALID_REQUEST");
      return;
    }
    sendProblem(request, reply, "INTERNAL_ERROR");
  });
}
