import type { FastifyReply, FastifyRequest } from "fastify";

import { getAuthenticatedInstallation } from "../auth/authentication.js";
import { sendProblem } from "../http/common-http.js";
import {
  defaultLimitPolicies,
  type RateLimitPolicies,
  type IpPartitioner,
  type LimitCheck,
  type RateLimiter,
} from "./rate-limiter.js";

export interface RateLimitGuardOptions {
  readonly limiter: RateLimiter;
  readonly projectKey?: string;
  readonly projectRequestsPerMinute?: number;
  readonly policies?: RateLimitPolicies;
}

export function createProtectedRateLimitGuard(
  options: RateLimitGuardOptions & { readonly mutation?: boolean; readonly aiJob?: boolean },
) {
  return async function enforceProtectedLimits(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const authentication = getAuthenticatedInstallation(request);
    if (authentication === undefined) {
      sendProblem(request, reply, "AUTH_REQUIRED");
      return;
    }
    const policies = options.policies ?? defaultLimitPolicies;
    const projectLimit = resolveProjectLimit(options.projectRequestsPerMinute, policies);
    const checks: LimitCheck[] = [
      {
        scope: "installation",
        key: `${authentication.installationId}:all`,
        limit: policies.installationRequestsPerMinute,
        windowMs: 60_000,
      },
    ];
    if (options.mutation === true) {
      checks.push({
        scope: "installation",
        key: `${authentication.installationId}:mutation`,
        limit: policies.installationMutationsPerMinute,
        windowMs: 60_000,
      });
    }
    if (options.aiJob === true) {
      checks.push({
        scope: "installation",
        key: `${authentication.installationId}:ai-job`,
        limit: policies.installationAiJobsPerDay,
        windowMs: 86_400_000,
      });
      checks.push({
        scope: "project",
        key: `${options.projectKey ?? "cooklog-backend"}:ai-job`,
        limit: policies.projectAiJobsPerMinute,
        windowMs: 60_000,
      });
    }
    checks.push({
      scope: "project",
      key: options.projectKey ?? "cooklog-backend",
      limit: projectLimit,
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
    const policies = options.policies ?? defaultLimitPolicies;
    const projectLimit = resolveProjectLimit(options.projectRequestsPerMinute, policies);
    const isChallenge = options.endpoint === "auth-challenge";
    const checks: LimitCheck[] = [
      {
        scope: "ip",
        key: `${ipKey}:${options.endpoint}`,
        limit: isChallenge
          ? policies.authChallengePerMinute
          : policies.installationAuthPerTenMinutes,
        windowMs: isChallenge ? 60_000 : 600_000,
      },
      {
        scope: "project",
        key: options.projectKey ?? "cooklog-backend",
        limit: projectLimit,
        windowMs: 60_000,
      },
    ];
    await enforce(options.limiter, checks, request, reply);
  };
}

function resolveProjectLimit(requested: number | undefined, policies: RateLimitPolicies): number {
  const limit = requested ?? policies.projectRequestsPerMinute;
  if (!Number.isInteger(limit) || limit < 0 || limit > policies.projectRequestsPerMinute) {
    throw new Error("project request limit cannot exceed the approved policy");
  }
  return limit;
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
