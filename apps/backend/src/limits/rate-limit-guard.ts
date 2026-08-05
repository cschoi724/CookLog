import type { FastifyReply, FastifyRequest } from "fastify";

import { getAuthenticatedInstallation } from "../auth/authentication.js";
import { sendProblem } from "../http/common-http.js";
import {
  defaultLimitPolicies,
  type IpPartitioner,
  type LimitCheck,
  type RateLimiter,
} from "./rate-limiter.js";

export interface RateLimitGuardOptions {
  readonly limiter: RateLimiter;
  readonly projectKey?: string;
  readonly projectRequestsPerMinute?: number;
}

export function createProtectedRateLimitGuard(
  options: RateLimitGuardOptions & { readonly mutation?: boolean },
) {
  return async function enforceProtectedLimits(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authentication = getAuthenticatedInstallation(request);
    if (authentication === undefined) {
      sendProblem(request, reply, "AUTH_REQUIRED");
      return;
    }
    const checks: LimitCheck[] = [
      {
        scope: "installation",
        key: `${authentication.installationId}:all`,
        limit: defaultLimitPolicies.installationRequestsPerMinute,
        windowMs: 60_000,
      },
    ];
    if (options.mutation === true) {
      checks.push({
        scope: "installation",
        key: `${authentication.installationId}:mutation`,
        limit: defaultLimitPolicies.installationMutationsPerMinute,
        windowMs: 60_000,
      });
    }
    checks.push({
      scope: "project",
      key: options.projectKey ?? "cooklog-backend",
      limit: options.projectRequestsPerMinute ?? defaultLimitPolicies.projectRequestsPerMinute,
      windowMs: 60_000,
    });
    await enforce(options.limiter, checks, request, reply);
  };
}

export function createUnauthenticatedRateLimitGuard(
  options: RateLimitGuardOptions & {
    readonly endpoint: "auth-challenge" | "installation";
    readonly ipPartitioner: IpPartitioner;
  },
) {
  return async function enforceUnauthenticatedLimits(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const ipKey = options.ipPartitioner.partition(request.ip);
    const isChallenge = options.endpoint === "auth-challenge";
    const checks: LimitCheck[] = [
      {
        scope: "ip",
        key: `${ipKey}:${options.endpoint}`,
        limit: isChallenge
          ? defaultLimitPolicies.authChallengePerMinute
          : defaultLimitPolicies.installationAuthPerTenMinutes,
        windowMs: isChallenge ? 60_000 : 600_000,
      },
      {
        scope: "project",
        key: options.projectKey ?? "cooklog-backend",
        limit: options.projectRequestsPerMinute ?? defaultLimitPolicies.projectRequestsPerMinute,
        windowMs: 60_000,
      },
    ];
    await enforce(options.limiter, checks, request, reply);
  };
}

async function enforce(
  limiter: RateLimiter,
  checks: readonly LimitCheck[],
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const result = await limiter.consume(checks);
  if (result.allowed) return;
  if ("unavailable" in result) {
    sendProblem(request, reply, "LIMITER_UNAVAILABLE");
    return;
  }
  sendProblem(request, reply, "RATE_LIMITED", { retryAfterSeconds: result.retryAfterSeconds });
}
