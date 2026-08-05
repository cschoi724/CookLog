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
  #available = true;

  constructor(now: () => number = Date.now) {
    this.#now = now;
  }

  setAvailable(available: boolean): void {
    this.#available = available;
  }

  async consume(checks: readonly LimitCheck[]): Promise<LimitResult> {
    if (!this.#available) return { allowed: false, unavailable: true };
    const now = this.#now();
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

export const defaultLimitPolicies = Object.freeze({
  authChallengePerMinute: 10,
  installationAuthPerTenMinutes: 5,
  installationRequestsPerMinute: 60,
  installationMutationsPerMinute: 12,
  projectRequestsPerMinute: 600,
});
