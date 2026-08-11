import { createHmac } from "node:crypto";

export type LimitScope = "installation" | "ip" | "project";

export interface LimitCheck {
  readonly scope: LimitScope;
  readonly key: string;
  readonly limit: number;
  readonly windowMs: number;
}

export type LimitResult =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly scope: LimitScope; readonly retryAfterSeconds: number }
  | { readonly allowed: false; readonly unavailable: true };

export interface RateLimiter {
  consume(checks: readonly LimitCheck[]): Promise<LimitResult>;
}

interface WindowCounter {
  count: number;
  readonly resetAt: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  readonly #counters = new Map<string, WindowCounter>();
  readonly #now: () => number;
  readonly #failClosedInvalidClock: boolean;
  #available = true;

  constructor(now: () => number = Date.now, options: { readonly failClosedInvalidClock?: boolean } = {}) {
    this.#now = now;
    this.#failClosedInvalidClock = options.failClosedInvalidClock ?? false;
  }

  setAvailable(available: boolean): void {
    this.#available = available;
  }

  async consume(checks: readonly LimitCheck[]): Promise<LimitResult> {
    if (!this.#available) return { allowed: false, unavailable: true };
    const now = this.#now();
    if (checks.length === 0 || (this.#failClosedInvalidClock && (!Number.isSafeInteger(now) || now < 0))) {
      return { allowed: false, unavailable: true };
    }
    const uniqueChecks = new Set(checks.map((check) =>
      `${check.scope}\u0000${check.key}\u0000${check.windowMs}`));
    if (uniqueChecks.size !== checks.length) throw new Error("duplicate rate limit dimensions are invalid");
    const resolved = checks.map((check) => {
      if (!Number.isInteger(check.limit) || check.limit < 0 || !Number.isInteger(check.windowMs) || check.windowMs < 1) {
        throw new Error("rate limit policy is invalid");
      }
      const counterKey = `${check.scope}:${check.key}:${check.windowMs}`;
      const existing = this.#counters.get(counterKey);
      const counter = existing === undefined || existing.resetAt <= now
        ? { count: 0, resetAt: now + check.windowMs }
        : existing;
      return { check, counter, counterKey };
    });

    for (const { check, counter } of resolved) {
      if (counter.count >= check.limit) {
        return {
          allowed: false,
          scope: check.scope,
          retryAfterSeconds: Math.max(1, Math.ceil((counter.resetAt - now) / 1_000)),
        };
      }
    }
    for (const { counter, counterKey } of resolved) {
      counter.count += 1;
      this.#counters.set(counterKey, counter);
    }
    return { allowed: true };
  }
}

export class IpPartitioner {
  readonly #secret: string;

  constructor(secret: string) {
    if (secret.length < 32) throw new Error("IP partition HMAC secret must contain at least 32 characters");
    this.#secret = secret;
  }

  partition(remoteAddress: string): string {
    return createHmac("sha256", this.#secret).update(remoteAddress, "utf8").digest("hex");
  }
}

export interface RateLimitPolicies {
  readonly authChallengePerMinute: number;
  readonly installationAuthPerTenMinutes: number;
  readonly installationRequestsPerMinute: number;
  readonly installationMutationsPerMinute: number;
  readonly installationAiJobsPerDay: number;
  readonly projectRequestsPerMinute: number;
  readonly projectAiJobsPerMinute: number;
}

export const defaultLimitPolicies: RateLimitPolicies = Object.freeze({
  authChallengePerMinute: 10,
  installationAuthPerTenMinutes: 5,
  installationRequestsPerMinute: 60,
  installationMutationsPerMinute: 12,
  installationAiJobsPerDay: 20,
  projectRequestsPerMinute: 600,
  projectAiJobsPerMinute: 100,
});

export function createRateLimitPolicies(
  overrides: Partial<RateLimitPolicies> = {},
  mode: "production" | "development_compatibility" = "production",
): RateLimitPolicies {
  const compatibilityCaps: RateLimitPolicies = {
    authChallengePerMinute: 2,
    installationAuthPerTenMinutes: 2,
    installationRequestsPerMinute: 10,
    installationMutationsPerMinute: 3,
    installationAiJobsPerDay: 2,
    projectRequestsPerMinute: 30,
    projectAiJobsPerMinute: 2,
  };
  const caps = mode === "production" ? defaultLimitPolicies : compatibilityCaps;
  const resolved = { ...caps, ...overrides };
  for (const key of Object.keys(caps) as Array<keyof RateLimitPolicies>) {
    if (!Number.isInteger(resolved[key]) || resolved[key] < 0 || resolved[key] > caps[key]) {
      throw new Error("rate limit policy cannot exceed the approved cap");
    }
  }
  return Object.freeze(resolved);
}
