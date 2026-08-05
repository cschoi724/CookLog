import { randomUUID } from "node:crypto";

export type RetryAfterPolicy = "forbidden" | "optional" | "required";

interface PublicErrorDefinition {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly userMessageKey: string;
  readonly retryable: boolean;
  readonly retryAfterPolicy: RetryAfterPolicy;
}

export const publicErrorCatalog = {
  INVALID_REQUEST: ["invalid-request", "Invalid request", 400, "The request format is invalid.", "error.invalid_request", false, "forbidden"],
  AUTH_REQUIRED: ["auth-required", "Authentication required", 401, "Authentication is required.", "error.auth_required", false, "forbidden"],
  TOKEN_EXPIRED: ["token-expired", "Session expired", 401, "The installation session expired.", "error.session_expired", true, "forbidden"],
  ATTESTATION_INVALID: ["attestation-invalid", "App verification failed", 401, "App verification failed.", "error.app_verification_failed", false, "forbidden"],
  ATTESTATION_REPLAYED: ["attestation-replayed", "App verification failed", 401, "App verification failed.", "error.app_verification_failed", false, "forbidden"],
  INSTALLATION_REVOKED: ["installation-revoked", "Access denied", 403, "Access to this operation is denied.", "error.access_denied", false, "forbidden"],
  RESOURCE_NOT_FOUND: ["resource-not-found", "Resource not found", 404, "The requested resource was not found.", "error.not_found", false, "forbidden"],
  API_VERSION_UNSUPPORTED: ["api-version-unsupported", "API version unsupported", 404, "This API version is not supported.", "error.update_required", false, "forbidden"],
  IDEMPOTENCY_KEY_REUSED: ["idempotency-key-reused", "Idempotency conflict", 409, "The idempotency key was used for a different request.", "error.request_conflict", false, "forbidden"],
  REQUEST_IN_PROGRESS: ["request-in-progress", "Request in progress", 409, "The same request is still being processed.", "error.request_in_progress", true, "required"],
  REQUEST_OUTCOME_UNKNOWN: ["request-outcome-unknown", "Request outcome unknown", 409, "The request outcome is not yet known.", "error.request_status_unknown", true, "required"],
  PAYLOAD_TOO_LARGE: ["payload-too-large", "Payload too large", 413, "The request body is too large.", "error.payload_too_large", false, "forbidden"],
  VALIDATION_FAILED: ["validation-failed", "Validation failed", 422, "One or more request fields are invalid.", "error.invalid_request", false, "forbidden"],
  RATE_LIMITED: ["rate-limited", "Rate limit exceeded", 429, "The request limit was exceeded.", "error.rate_limited", true, "required"],
  QUOTA_EXCEEDED: ["quota-exceeded", "Quota exceeded", 429, "The project usage quota was exceeded.", "error.quota_exceeded", false, "required"],
  UPSTREAM_UNAVAILABLE: ["upstream-unavailable", "Upstream unavailable", 502, "A required upstream service is temporarily unavailable.", "error.service_unavailable", true, "optional"],
  SERVICE_DISABLED: ["service-disabled", "Service disabled", 503, "This service is temporarily disabled.", "error.service_unavailable", false, "optional"],
  LIMITER_UNAVAILABLE: ["limiter-unavailable", "Limiter unavailable", 503, "Request limiting is temporarily unavailable.", "error.service_unavailable", true, "optional"],
  UPSTREAM_TIMEOUT: ["upstream-timeout", "Request timed out", 504, "The request timed out before processing could start.", "error.request_timed_out", true, "optional"],
  INTERNAL_ERROR: ["internal-error", "Internal server error", 500, "An unexpected error occurred.", "error.temporary_failure", true, "optional"],
} as const;

export type PublicErrorCode = keyof typeof publicErrorCatalog;
export type ViolationField =
  | "authorization"
  | "body"
  | "headers"
  | "installation_id"
  | "challenge_id"
  | "app_version"
  | "provider"
  | "key_id"
  | "proof"
  | "proof_kind"
  | "idempotency_key";
export type ViolationReason =
  | "REQUIRED"
  | "INVALID_FORMAT"
  | "OUT_OF_RANGE"
  | "UNSUPPORTED_VALUE"
  | "TOO_LARGE"
  | "TOO_MANY_ITEMS"
  | "MISMATCH";

export interface PublicViolation {
  readonly field: ViolationField;
  readonly reason: ViolationReason;
}

export interface PublicProblem {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly detail: string;
  readonly instance: string;
  readonly request_id: string;
  readonly code: PublicErrorCode;
  readonly user_message_key: string;
  readonly retryable: boolean;
  readonly retry_after_seconds?: number;
  readonly violations?: readonly PublicViolation[];
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const violationFields = new Set<ViolationField>([
  "authorization", "body", "headers", "installation_id", "challenge_id", "app_version",
  "provider", "key_id", "proof", "proof_kind", "idempotency_key",
]);
const violationReasons = new Set<ViolationReason>([
  "REQUIRED", "INVALID_FORMAT", "OUT_OF_RANGE", "UNSUPPORTED_VALUE", "TOO_LARGE",
  "TOO_MANY_ITEMS", "MISMATCH",
]);

function toDefinition(value: readonly [string, string, number, string, string, boolean, RetryAfterPolicy]): PublicErrorDefinition {
  return {
    type: `https://api.cooklog.app/problems/${value[0]}`,
    title: value[1],
    status: value[2],
    detail: value[3],
    userMessageKey: value[4],
    retryable: value[5],
    retryAfterPolicy: value[6],
  };
}

export function isUuidV4(value: string): boolean {
  return uuidPattern.test(value);
}

export function getPublicErrorDefinition(code: PublicErrorCode): PublicErrorDefinition {
  return toDefinition(publicErrorCatalog[code]);
}

function areViolationsSafe(violations: unknown): violations is readonly PublicViolation[] {
  return Array.isArray(violations) && violations.length <= 20 && violations.every((violation: unknown) => {
    if (typeof violation !== "object" || violation === null) return false;
    const candidate = violation as { readonly field?: unknown; readonly reason?: unknown };
    return typeof candidate.field === "string" && typeof candidate.reason === "string" &&
      violationFields.has(candidate.field as ViolationField) &&
      violationReasons.has(candidate.reason as ViolationReason);
  });
}

export function renderProblem(
  requestId: string,
  requestedCode: string,
  options: {
    readonly retryAfterSeconds?: number;
    readonly violations?: readonly PublicViolation[];
  } = {},
): PublicProblem {
  const safeRequestId = isUuidV4(requestId) ? requestId : randomUUID();
  const knownCode = Object.hasOwn(publicErrorCatalog, requestedCode)
    ? requestedCode as PublicErrorCode
    : "INTERNAL_ERROR";
  let code = knownCode;
  let definition = getPublicErrorDefinition(code);
  const hasValidRetryAfter = Number.isInteger(options.retryAfterSeconds) &&
    options.retryAfterSeconds !== undefined && options.retryAfterSeconds >= 1 &&
    options.retryAfterSeconds <= 2_678_400;
  const invalidRetryPolicy =
    (definition.retryAfterPolicy === "required" && !hasValidRetryAfter) ||
    (definition.retryAfterPolicy === "forbidden" && options.retryAfterSeconds !== undefined);
  const invalidViolations = options.violations !== undefined &&
    (code !== "VALIDATION_FAILED" || !areViolationsSafe(options.violations));

  if (invalidRetryPolicy || invalidViolations) {
    code = "INTERNAL_ERROR";
    definition = getPublicErrorDefinition(code);
  }

  return {
    type: definition.type,
    title: definition.title,
    status: definition.status,
    detail: definition.detail,
    instance: `urn:cooklog:request:${safeRequestId}`,
    request_id: safeRequestId,
    code,
    user_message_key: definition.userMessageKey,
    retryable: definition.retryable,
    ...(code === knownCode && hasValidRetryAfter
      ? { retry_after_seconds: options.retryAfterSeconds }
      : {}),
    ...(code === "VALIDATION_FAILED" && options.violations !== undefined
      ? { violations: options.violations }
      : {}),
  };
}
