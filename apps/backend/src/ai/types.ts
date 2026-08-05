export interface RecipeStepSnapshot {
  readonly step_id: string;
  readonly order: number;
  readonly recorded_at: string;
  readonly transcript: string;
}

export interface RecipeJobCreateRequest {
  readonly contract_version: "ai-recipe-job.v1";
  readonly snapshot_id: string;
  readonly snapshot_revision: number;
  readonly snapshot_sha256: string;
  readonly locale: "ko-KR";
  readonly steps: readonly RecipeStepSnapshot[];
}

export interface RecipeIngredient {
  readonly name: string;
  readonly quantity: string | null;
  readonly unit: string | null;
  readonly evidence_step_ids: readonly string[];
  readonly inferred_fields: readonly ("name" | "quantity" | "unit")[];
}

export interface RecipeDraftStep {
  readonly order: number;
  readonly instruction: string;
  readonly evidence_step_ids: readonly string[];
  readonly estimated_duration_minutes: number | null;
  readonly duration_provenance: "recorded" | "ai_inferred" | "unknown";
}

export interface RecipeReviewFlag {
  readonly field_path: string;
  readonly reason: "ai_inferred" | "missing_source" | "safety_review";
  readonly review_required: true;
}

export interface RecipeDraft {
  readonly schema_version: "recipe-draft.v1";
  readonly title: string;
  readonly ingredients: readonly RecipeIngredient[];
  readonly steps: readonly RecipeDraftStep[];
  readonly estimated_total_minutes: number | null;
  readonly estimated_time_provenance: "recorded" | "ai_inferred" | "unknown";
  readonly notes: readonly string[];
  readonly review_flags: readonly RecipeReviewFlag[];
}

export type RecipeJobFailureCode =
  | "QUEUE_TIMEOUT"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "OUTCOME_UNKNOWN"
  | "OUTPUT_INVALID"
  | "SAFETY_REJECTED"
  | "INTERNAL_ERROR";

export interface RecipeJobFailure {
  readonly code: RecipeJobFailureCode;
  readonly user_action: "retry_manually" | "review_steps_then_retry";
}

export type RecipeJobState = "queued" | "processing" | "succeeded" | "failed" | "expired";
export type RecipeResultState = "none" | "available" | "acknowledged_deleted" | "expired_deleted";

export interface RecipeJobStatus {
  readonly job_id: string;
  readonly contract_version: "ai-recipe-job.v1";
  readonly state: RecipeJobState;
  readonly state_version: number;
  readonly result_state: RecipeResultState;
  readonly result_version: number | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly poll_after_seconds: number | null;
  readonly failure: RecipeJobFailure | null;
  readonly result: RecipeDraft | null;
}

export interface RecipeJobAcknowledgement {
  readonly result_version: number;
  readonly saved_locally_at: string;
}
