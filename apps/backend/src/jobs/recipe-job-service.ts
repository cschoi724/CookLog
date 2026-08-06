import { hashJsonBody } from "../idempotency/body-hash.js";
import { isUuidV4 } from "../http/public-errors.js";
import type { RecipeAIProvider } from "../ai/provider.js";
import {
  validateRecipeDraft,
  validateRecipeJobAcknowledgement,
  validateRecipeJobCreate,
} from "../ai/recipe-validation.js";
import type { RecipeJobCreateRequest, RecipeJobStatus } from "../ai/types.js";
import {
  ContentCleanupPendingError,
  InMemoryRecipeJobRepository,
  type PendingTerminalFacts,
} from "../storage/recipe-job-repository.js";

export interface RecipeJobAdmission {
  reserve(input: {
    readonly installationId: string;
    readonly request: RecipeJobCreateRequest;
  }): "accepted" | "quota_exceeded" | "service_disabled";
}

const allowAdmission: RecipeJobAdmission = { reserve: () => "accepted" };
const providerFailureCodes = new Set([
  "AI_UNAVAILABLE", "AI_TIMEOUT", "OUTCOME_UNKNOWN", "SAFETY_REJECTED", "INTERNAL_ERROR",
]);

export type TerminalAudit = (facts: PendingTerminalFacts) => boolean;

export type CreateJobResult =
  | { readonly kind: "accepted"; readonly status: RecipeJobStatus; readonly replayed: boolean }
  | { readonly kind: "invalid_request" }
  | { readonly kind: "invalid_idempotency_key" }
  | { readonly kind: "idempotency_reused" }
  | { readonly kind: "quota_exceeded" }
  | { readonly kind: "service_disabled" }
  | { readonly kind: "internal_error" };

export type AcknowledgeJobResult =
  | { readonly kind: "success"; readonly status: RecipeJobStatus; readonly replayed: boolean }
  | { readonly kind: "invalid_request" }
  | { readonly kind: "invalid_idempotency_key" }
  | { readonly kind: "idempotency_reused" }
  | { readonly kind: "not_found" }
  | { readonly kind: "version_mismatch" }
  | { readonly kind: "internal_error" };

export type TimeoutEvent =
  | { readonly kind: "queue_start" }
  | { readonly kind: "worker_deadline"; readonly providerExecutionAbsentConfirmed: boolean }
  | { readonly kind: "provider_cancelled"; readonly providerExecutionAbsentConfirmed: true }
  | { readonly kind: "provider_response_deadline" }
  | { readonly kind: "connection_lost" };

export class RecipeJobService {
  readonly #repository: InMemoryRecipeJobRepository;
  readonly #provider: RecipeAIProvider;
  readonly #admission: RecipeJobAdmission;
  readonly #auditTerminal: TerminalAudit;

  constructor(options: {
    readonly repository: InMemoryRecipeJobRepository;
    readonly provider: RecipeAIProvider;
    readonly admission?: RecipeJobAdmission;
    readonly auditTerminal?: TerminalAudit;
  }) {
    this.#repository = options.repository;
    this.#provider = options.provider;
    this.#admission = options.admission ?? allowAdmission;
    this.#auditTerminal = options.auditTerminal ?? (() => true);
  }

  createJob(
    installationId: string,
    idempotencyKey: string | undefined,
    body: unknown,
  ): CreateJobResult {
    if (idempotencyKey === undefined || !isUuidV4(idempotencyKey)) {
      return { kind: "invalid_idempotency_key" };
    }
    const request = validateRecipeJobCreate(body);
    if (request === undefined) return { kind: "invalid_request" };
    const bodyHash = hashJsonBody("application/json", request);
    const existing = this.#repository.inspectCreate(installationId, idempotencyKey, bodyHash);
    if (existing?.kind === "reused") return { kind: "idempotency_reused" };
    if (existing?.kind === "replay") {
      let status;
      try {
        status = this.#repository.getStatus(installationId, existing.jobId);
      } catch (error) {
        if (error instanceof ContentCleanupPendingError) return { kind: "internal_error" };
        throw error;
      }
      return status === undefined
        ? { kind: "invalid_request" }
        : { kind: "accepted", status, replayed: true };
    }
    if (this.#repository.isNewJobBlocked()) return { kind: "service_disabled" };
    const admission = this.#admission.reserve({ installationId, request: structuredClone(request) });
    if (admission !== "accepted") return { kind: admission };
    const created = this.#repository.create(installationId, idempotencyKey, bodyHash, request);
    if (created.kind === "reused") return { kind: "idempotency_reused" };
    const status = this.#repository.getStatus(installationId, created.jobId);
    if (status === undefined) return { kind: "invalid_request" };
    return { kind: "accepted", status, replayed: created.kind === "replay" };
  }

  getStatus(installationId: string, jobId: string): RecipeJobStatus | undefined {
    if (!isUuidV4(jobId)) return undefined;
    return this.#repository.getStatus(installationId, jobId);
  }

  async execute(
    jobId: string,
    executionGeneration = 1,
  ): Promise<"completed" | "ignored" | "telemetry_unavailable"> {
    if (this.#repository.getPendingTerminalFacts(jobId) !== undefined) {
      return this.#auditAndFinalize(jobId);
    }
    const claim = this.#repository.claimWorker(jobId, executionGeneration);
    if (claim === undefined) return "ignored";
    const providerIdempotencyKey = this.#repository.beginProvider(claim);
    if (providerIdempotencyKey === undefined) return "ignored";
    let outcome;
    try {
      outcome = await this.#provider.generate(claim.input, {
        providerIdempotencyKey,
        promptVersion: "recipe-prompt.v1",
        outputSchemaVersion: "recipe-draft.v1",
      });
    } catch {
      if (!this.#repository.stageFailure(jobId, "AI_UNAVAILABLE")) return "ignored";
      return this.#auditAndFinalize(jobId);
    }
    if (outcome.kind === "failure") {
      const code = providerFailureCodes.has(outcome.code) ? outcome.code : "INTERNAL_ERROR";
      if (!this.#repository.stageFailure(jobId, code)) return "ignored";
      return this.#auditAndFinalize(jobId);
    }
    const draft = validateRecipeDraft(outcome.draft, claim.input);
    if (draft === undefined) {
      if (!this.#repository.stageFailure(jobId, "OUTPUT_INVALID")) return "ignored";
      return this.#auditAndFinalize(jobId);
    }
    if (!this.#repository.stageSuccess(claim, draft)) return "ignored";
    return this.#auditAndFinalize(jobId);
  }

  #auditAndFinalize(jobId: string): "completed" | "ignored" | "telemetry_unavailable" {
    const facts = this.#repository.getPendingTerminalFacts(jobId);
    if (facts === undefined) return "ignored";
    if (!this.#auditTerminal(facts)) return "telemetry_unavailable";
    return this.#repository.finalizePendingTerminal(jobId) ? "completed" : "ignored";
  }

  failForTimeout(jobId: string, event: TimeoutEvent): boolean {
    const facts = this.#repository.getExecutionFacts(jobId);
    if (facts === undefined || !["queued", "processing"].includes(facts.state)) return false;
    if (event.kind === "queue_start" && !facts.providerStarted) {
      return this.#repository.completeFailure(jobId, "QUEUE_TIMEOUT");
    }
    const absentConfirmed = (event.kind === "worker_deadline" || event.kind === "provider_cancelled") &&
      event.providerExecutionAbsentConfirmed;
    const code = !facts.providerStarted || absentConfirmed ? "AI_TIMEOUT" : "OUTCOME_UNKNOWN";
    return this.#repository.completeFailure(jobId, code);
  }

  acknowledge(
    installationId: string,
    jobId: string,
    idempotencyKey: string | undefined,
    body: unknown,
  ): AcknowledgeJobResult {
    if (!isUuidV4(jobId)) return { kind: "not_found" };
    if (idempotencyKey === undefined || !isUuidV4(idempotencyKey)) {
      return { kind: "invalid_idempotency_key" };
    }
    const acknowledgement = validateRecipeJobAcknowledgement(body);
    if (acknowledgement === undefined) return { kind: "invalid_request" };
    const result = this.#repository.acknowledge(
      installationId,
      jobId,
      idempotencyKey,
      hashJsonBody("application/json", acknowledgement),
      acknowledgement.result_version,
    );
    if (result.kind === "not_found") return { kind: "not_found" };
    if (result.kind === "mismatch") return { kind: "version_mismatch" };
    if (result.kind === "reused") return { kind: "idempotency_reused" };
    if (result.kind === "delete_failed") return { kind: "internal_error" };
    const status = this.#repository.getStatus(installationId, jobId);
    return status === undefined
      ? { kind: "internal_error" }
      : { kind: "success", status, replayed: result.replayed };
  }
}
