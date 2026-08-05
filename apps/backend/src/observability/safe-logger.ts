import { isUuidV4 } from "../http/public-errors.js";

export type TelemetryEventName =
  | "request_completed"
  | "authentication_failed"
  | "rate_limit_blocked"
  | "ai_job_state_changed"
  | "provider_call_completed"
  | "cleanup_completed"
  | "cleanup_sla_warning"
  | "provider_gate_checked"
  | "cost_guardrail_changed"
  | "kill_switch_changed"
  | "secret_rotation_completed";

export type TelemetryDropReason =
  | "INVALID_SHAPE"
  | "UNKNOWN_FIELD"
  | "INVALID_VALUE"
  | "REDACTION_DETECTED"
  | "RESERVATION_DENIED"
  | "SINK_UNAVAILABLE";

export type SafeTelemetryEvent = Readonly<Record<string, string | number | boolean>> & {
  readonly event_name: TelemetryEventName;
  readonly occurred_at: string;
};

export interface TelemetrySink {
  write(event: SafeTelemetryEvent): void;
}

const eventFields: Readonly<Record<TelemetryEventName, ReadonlySet<string>>> = {
  request_completed: new Set(["request_id", "route_template", "http_method", "http_status", "public_error_code", "latency_ms_bucket", "request_bytes_bucket", "response_bytes_bucket"]),
  authentication_failed: new Set(["request_id", "auth_reason", "route_template"]),
  rate_limit_blocked: new Set(["quota_dimension", "quota_scope", "retry_after_bucket"]),
  ai_job_state_changed: new Set(["previous_state", "next_state", "provider_attempt_count", "deployment_version"]),
  provider_call_completed: new Set(["provider_outcome", "latency_ms_bucket", "input_tokens", "output_tokens", "estimated_cost_micros"]),
  cleanup_completed: new Set(["cleanup_outcome", "cleanup_age_seconds", "cleanup_target_kind"]),
  cleanup_sla_warning: new Set(["cleanup_target_kind", "cleanup_age_bucket", "count"]),
  provider_gate_checked: new Set(["manifest_version", "provider_gate", "gate_outcome"]),
  cost_guardrail_changed: new Set(["quota_dimension", "percentage_bucket", "quota_outcome"]),
  kill_switch_changed: new Set(["feature", "enabled", "approval_change_id"]),
  secret_rotation_completed: new Set(["secret_alias", "version_age_bucket", "rotation_outcome"]),
};

const integerFields = new Set([
  "http_status", "provider_attempt_count", "input_tokens", "output_tokens",
  "estimated_cost_micros", "cleanup_age_seconds", "count",
]);
const booleanFields = new Set(["enabled"]);
const uuidFields = new Set(["request_id"]);
const fixedValuePattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,95}$/u;
const routeTemplatePattern = /^\/v1\/[a-z0-9_/{}/-]{1,120}$/u;
const forbiddenKeyPattern = /(?:body|header|query|cookie|authorization|token|secret|transcript|prompt|recipe|provider_raw|exception|stack|audio|url)/iu;
const forbiddenValuePattern = /(?:bearer\s|sk-[A-Za-z0-9]|private[_-]?key|synthetic-secret|raw-recipe|raw-transcript)/iu;
const fixedEnums: Readonly<Record<string, ReadonlySet<string>>> = {
  public_error_code: new Set(["NONE", "INVALID_REQUEST", "AUTH_REQUIRED", "TOKEN_EXPIRED", "ATTESTATION_INVALID", "ATTESTATION_REPLAYED", "INSTALLATION_REVOKED", "RESOURCE_NOT_FOUND", "API_VERSION_UNSUPPORTED", "IDEMPOTENCY_KEY_REUSED", "REQUEST_IN_PROGRESS", "REQUEST_OUTCOME_UNKNOWN", "PAYLOAD_TOO_LARGE", "VALIDATION_FAILED", "RATE_LIMITED", "QUOTA_EXCEEDED", "UPSTREAM_UNAVAILABLE", "SERVICE_DISABLED", "LIMITER_UNAVAILABLE", "UPSTREAM_TIMEOUT", "INTERNAL_ERROR"]),
  latency_ms_bucket: new Set(["lt_100", "lt_500", "lt_1000", "lt_5000", "gte_5000"]),
  request_bytes_bucket: new Set(["zero", "lt_4096", "lt_65536", "gte_65536"]),
  response_bytes_bucket: new Set(["zero", "lt_4096", "lt_65536", "gte_65536"]),
  auth_reason: new Set(["missing", "expired", "invalid", "replayed", "revoked"]),
  quota_dimension: new Set(["installation", "project", "provider_calls", "input_tokens", "output_tokens", "external_cost"]),
  quota_scope: new Set(["request", "minute", "day", "month"]),
  retry_after_bucket: new Set(["lt_60", "lt_3600", "gte_3600"]),
  previous_state: new Set(["queued", "processing", "succeeded", "failed", "expired"]),
  next_state: new Set(["queued", "processing", "succeeded", "failed", "expired"]),
  provider_outcome: new Set(["succeeded", "failed", "timeout", "outcome_unknown"]),
  cleanup_outcome: new Set(["deleted", "pending", "delete_failed", "sla_breach"]),
  cleanup_target_kind: new Set(["ai_content", "raw_metadata", "remote_stt_audio"]),
  cleanup_age_bucket: new Set(["lt_22h", "22h_to_24h", "28d_to_29d", "29d_to_30d", "expired"]),
  provider_gate: new Set(["product", "endpoint", "storage_region", "processing_boundary", "retention", "cost", "privacy"]),
  gate_outcome: new Set(["passed", "failed"]),
  percentage_bucket: new Set(["50", "75", "90", "100"]),
  quota_outcome: new Set(["accepted", "rejected", "blocked"]),
  feature: new Set(["ai_provider", "remote_stt", "raw_metadata", "external_cost"]),
  secret_alias: new Set(["ai_provider", "token_signing", "observability_hmac"]),
  version_age_bucket: new Set(["lt_30d", "30d_to_60d", "60d_to_90d", "gte_90d"]),
  rotation_outcome: new Set(["completed", "failed_blocked"]),
};

export class InMemoryTelemetrySink implements TelemetrySink {
  readonly #events: SafeTelemetryEvent[] = [];

  write(event: SafeTelemetryEvent): void {
    this.#events.push(Object.freeze({ ...event }));
  }

  events(): readonly SafeTelemetryEvent[] {
    return structuredClone(this.#events);
  }
}

function ownPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Object.getPrototypeOf(value) !== Object.prototype) return false;
  return Reflect.ownKeys(value).every((key) => typeof key === "string" &&
    Object.getOwnPropertyDescriptor(value, key)?.enumerable === true &&
    Object.hasOwn(Object.getOwnPropertyDescriptor(value, key) ?? {}, "value"));
}

function validValue(field: string, value: unknown): value is string | number | boolean {
  if (integerFields.has(field)) return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000;
  if (booleanFields.has(field)) return typeof value === "boolean";
  if (uuidFields.has(field)) return typeof value === "string" && isUuidV4(value);
  if (field === "route_template") return typeof value === "string" && routeTemplatePattern.test(value) && !value.includes("?");
  if (field === "http_method") return typeof value === "string" && ["GET", "POST", "DELETE", "PATCH"].includes(value);
  const allowedValues = fixedEnums[field];
  if (allowedValues !== undefined) return typeof value === "string" && allowedValues.has(value);
  if (field === "approval_change_id") return typeof value === "string" && /^CHG-[0-9]{1,12}$/u.test(value);
  return typeof value === "string" && fixedValuePattern.test(value);
}

function containsForbiddenTelemetry(event: Record<string, string | number | boolean>): boolean {
  return Object.entries(event).some(([key, value]) =>
    forbiddenKeyPattern.test(key) || (typeof value === "string" && forbiddenValuePattern.test(value)));
}

export class TelemetryRedactionScanner {
  isSafe(event: Readonly<Record<string, string | number | boolean>>): boolean {
    try {
      return !containsForbiddenTelemetry({ ...event });
    } catch {
      return false;
    }
  }
}

export class SafeLogger {
  readonly #sink: TelemetrySink;
  readonly #now: () => number;
  readonly #reserve: (eventName: TelemetryEventName) => boolean;
  readonly #scanner: TelemetryRedactionScanner;
  readonly #drops = new Map<TelemetryDropReason, number>();

  constructor(options: {
    readonly sink: TelemetrySink;
    readonly now?: () => number;
    readonly reserve?: (eventName: TelemetryEventName) => boolean;
    readonly scanner?: TelemetryRedactionScanner;
  }) {
    this.#sink = options.sink;
    this.#now = options.now ?? Date.now;
    this.#reserve = options.reserve ?? (() => true);
    this.#scanner = options.scanner ?? new TelemetryRedactionScanner();
  }

  emit(eventName: TelemetryEventName, input: unknown): boolean {
    let event: SafeTelemetryEvent;
    try {
      if (!Object.hasOwn(eventFields, eventName)) return this.#drop("INVALID_VALUE");
      if (!ownPlainRecord(input)) return this.#drop("INVALID_SHAPE");
      const allowed = eventFields[eventName];
      const keys = Reflect.ownKeys(input) as string[];
      if (keys.some((key) => !allowed.has(key))) return this.#drop("UNKNOWN_FIELD");
      if (keys.length !== allowed.size || [...allowed].some((key) => !Object.hasOwn(input, key))) {
        return this.#drop("INVALID_SHAPE");
      }
      const projected: Record<string, string | number | boolean> = {};
      for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(input, key);
        if (descriptor === undefined || !("value" in descriptor) || !validValue(key, descriptor.value)) {
          return this.#drop("INVALID_VALUE");
        }
        projected[key] = descriptor.value;
      }
      if (!this.#scanner.isSafe(projected)) return this.#drop("REDACTION_DETECTED");
      if (!this.#reserve(eventName)) return this.#drop("RESERVATION_DENIED");
      event = Object.freeze({
        event_name: eventName,
        occurred_at: new Date(this.#now()).toISOString(),
        ...projected,
      }) as SafeTelemetryEvent;
    } catch {
      return this.#drop("INVALID_SHAPE");
    }
    try {
      this.#sink.write(event);
      return true;
    } catch {
      return this.#drop("SINK_UNAVAILABLE");
    }
  }

  dropCounts(): Readonly<Record<TelemetryDropReason, number>> {
    return Object.freeze({
      INVALID_SHAPE: this.#drops.get("INVALID_SHAPE") ?? 0,
      UNKNOWN_FIELD: this.#drops.get("UNKNOWN_FIELD") ?? 0,
      INVALID_VALUE: this.#drops.get("INVALID_VALUE") ?? 0,
      REDACTION_DETECTED: this.#drops.get("REDACTION_DETECTED") ?? 0,
      RESERVATION_DENIED: this.#drops.get("RESERVATION_DENIED") ?? 0,
      SINK_UNAVAILABLE: this.#drops.get("SINK_UNAVAILABLE") ?? 0,
    });
  }

  #drop(reason: TelemetryDropReason): false {
    this.#drops.set(reason, (this.#drops.get(reason) ?? 0) + 1);
    return false;
  }
}
