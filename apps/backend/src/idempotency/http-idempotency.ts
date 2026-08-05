import type { FastifyReply, FastifyRequest } from "fastify";

import { getAuthenticatedInstallation } from "../auth/authentication.js";
import { adoptRequestIdForReplay, sendProblem } from "../http/common-http.js";
import { hashJsonBody } from "./body-hash.js";
import {
  type IdempotencyOwner,
  type InMemoryIdempotencyStore,
} from "./idempotency-store.js";

export interface HttpIdempotencyClaim {
  readonly owner: IdempotencyOwner;
  readonly store: InMemoryIdempotencyStore;
}

export function claimHttpIdempotency(
  request: FastifyRequest,
  reply: FastifyReply,
  store: InMemoryIdempotencyStore,
): HttpIdempotencyClaim | undefined {
  const authentication = getAuthenticatedInstallation(request);
  if (authentication === undefined) {
    sendProblem(request, reply, "AUTH_REQUIRED");
    return undefined;
  }
  const keyHeader = request.headers["idempotency-key"];
  const contentType = request.headers["content-type"];
  if (typeof keyHeader !== "string" || typeof contentType !== "string") {
    sendProblem(request, reply, "INVALID_REQUEST");
    return undefined;
  }

  let bodyHash: string;
  try {
    bodyHash = hashJsonBody(contentType, request.body);
  } catch {
    sendProblem(request, reply, "INVALID_REQUEST");
    return undefined;
  }
  const result = store.begin({
    installationId: authentication.installationId,
    method: request.method,
    canonicalPath: request.routeOptions.url ?? request.url.split("?", 1)[0] ?? request.url,
    key: keyHeader,
    bodyHash,
  });

  switch (result.kind) {
    case "owner": return { owner: result, store };
    case "invalid_key":
      sendProblem(request, reply, "VALIDATION_FAILED", {
        violations: [{ field: "idempotency_key", reason: "INVALID_FORMAT" }],
      });
      return undefined;
    case "reused":
      sendProblem(request, reply, "IDEMPOTENCY_KEY_REUSED");
      return undefined;
    case "in_progress":
      sendProblem(request, reply, "REQUEST_IN_PROGRESS", { retryAfterSeconds: 1 });
      return undefined;
    case "outcome_unknown":
      sendProblem(request, reply, "REQUEST_OUTCOME_UNKNOWN", { retryAfterSeconds: 1 });
      return undefined;
    case "replay":
      adoptRequestIdForReplay(request, result.response.requestId);
      reply.header("CookLog-Idempotency-Replayed", "true");
      reply
        .code(result.response.statusCode)
        .type(result.response.contentType ?? "application/json")
        .send(result.response.body);
      return undefined;
  }
}
