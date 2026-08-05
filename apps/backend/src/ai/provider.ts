import type { RecipeJobCreateRequest, RecipeJobFailureCode } from "./types.js";

export type RecipeAIProviderOutcome =
  | { readonly kind: "success"; readonly draft: unknown }
  | { readonly kind: "failure"; readonly code: Extract<RecipeJobFailureCode, "AI_UNAVAILABLE" | "AI_TIMEOUT" | "OUTCOME_UNKNOWN" | "SAFETY_REJECTED" | "INTERNAL_ERROR"> };

export interface RecipeAIProviderContext {
  readonly providerIdempotencyKey: string;
  readonly promptVersion: "recipe-prompt.v1";
  readonly outputSchemaVersion: "recipe-draft.v1";
}

export interface RecipeAIProvider {
  generate(
    request: RecipeJobCreateRequest,
    context: RecipeAIProviderContext,
  ): Promise<RecipeAIProviderOutcome>;
}
