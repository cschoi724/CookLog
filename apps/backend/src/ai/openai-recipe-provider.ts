import type { RecipeAIProvider, RecipeAIProviderContext, RecipeAIProviderOutcome } from "./provider.js";
import { OPENAI_RECIPE_DRAFT_SCHEMA } from "./openai-structured-output-schema.js";
import { buildRecipePrompt, RECIPE_PROMPT_VERSION } from "./recipe-prompt.js";
import type { RecipeJobCreateRequest } from "./types.js";

export const OPENAI_RECIPE_ADAPTER_VERSION = "openai-recipe-adapter.v1" as const;
export const OPENAI_RECIPE_MODEL = "gpt-5-mini-2025-08-07" as const;
export const OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT = "https://kr.api.openai.com/v1/chat/completions" as const;
export const OPENAI_RECIPE_TIMEOUT_MS = 60_000;

export interface OpenAIProviderActivation {
  readonly externalCallsEnabled: boolean;
  readonly productApproved: boolean;
  readonly zdrApproved: boolean;
  readonly modifiedRetentionApproved: boolean;
  readonly crossBorderProcessingApproved: boolean;
  readonly credential: string | undefined;
}

export interface OpenAITransportRequest {
  readonly endpoint: typeof OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
  readonly signal: AbortSignal;
}

export type OpenAITransport = (request: OpenAITransportRequest) => Promise<Response>;

export interface OpenAIRecipeProviderOptions {
  readonly activation: OpenAIProviderActivation;
  readonly transport: OpenAITransport;
  readonly timeoutMs?: number;
}

function isActivationReady(activation: OpenAIProviderActivation): activation is
  OpenAIProviderActivation & { readonly credential: string } {
  return activation.externalCallsEnabled && activation.productApproved && activation.zdrApproved &&
    activation.modifiedRetentionApproved && activation.crossBorderProcessingApproved &&
    typeof activation.credential === "string" && activation.credential.length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractDraft(response: unknown): { readonly kind: "draft"; readonly value: unknown } |
  { readonly kind: "refusal" } | { readonly kind: "invalid" } {
  if (!isRecord(response) || !Array.isArray(response.choices) || response.choices.length !== 1) {
    return { kind: "invalid" };
  }
  const choice = response.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message)) return { kind: "invalid" };
  if (typeof choice.message.refusal === "string" && choice.message.refusal.length > 0) {
    return { kind: "refusal" };
  }
  if (typeof choice.message.content !== "string" || choice.message.content.length === 0 ||
    choice.message.content.length > 1_000_000) return { kind: "invalid" };
  try {
    return { kind: "draft", value: JSON.parse(choice.message.content) as unknown };
  } catch {
    return { kind: "invalid" };
  }
}

function buildRequestBody(request: RecipeJobCreateRequest, context: RecipeAIProviderContext): string {
  const prompt = buildRecipePrompt(request);
  if (context.promptVersion !== prompt.version || context.outputSchemaVersion !== "recipe-draft.v1") {
    throw new Error("unsupported provider contract version");
  }
  return JSON.stringify({
    model: OPENAI_RECIPE_MODEL,
    store: false,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "cooklog_recipe_draft_v1",
        strict: true,
        schema: OPENAI_RECIPE_DRAFT_SCHEMA,
      },
    },
    max_completion_tokens: 2_000,
  });
}

export class OpenAIRecipeAIProvider implements RecipeAIProvider {
  readonly #activation: OpenAIProviderActivation;
  readonly #transport: OpenAITransport;
  readonly #timeoutMs: number;
  readonly #usedProviderKeys = new Set<string>();

  constructor(options: OpenAIRecipeProviderOptions) {
    this.#activation = { ...options.activation };
    this.#transport = options.transport;
    this.#timeoutMs = options.timeoutMs ?? OPENAI_RECIPE_TIMEOUT_MS;
  }

  async generate(
    request: RecipeJobCreateRequest,
    context: RecipeAIProviderContext,
  ): Promise<RecipeAIProviderOutcome> {
    if (!isActivationReady(this.#activation) || context.promptVersion !== RECIPE_PROMPT_VERSION ||
      context.outputSchemaVersion !== "recipe-draft.v1") {
      return { kind: "failure", code: "AI_UNAVAILABLE" };
    }
    if (this.#usedProviderKeys.has(context.providerIdempotencyKey)) {
      return { kind: "failure", code: "OUTCOME_UNKNOWN" };
    }
    this.#usedProviderKeys.add(context.providerIdempotencyKey);

    let response: Response;
    try {
      response = await this.#transport({
        endpoint: OPENAI_KR_CHAT_COMPLETIONS_ENDPOINT,
        headers: {
          authorization: `Bearer ${this.#activation.credential}`,
          "content-type": "application/json",
          "idempotency-key": context.providerIdempotencyKey,
        },
        body: buildRequestBody(request, context),
        signal: AbortSignal.timeout(this.#timeoutMs),
      });
    } catch {
      return { kind: "failure", code: "OUTCOME_UNKNOWN" };
    }

    if (response.status === 429 || response.status >= 500) {
      return { kind: "failure", code: "AI_UNAVAILABLE" };
    }
    if (!response.ok) return { kind: "failure", code: "INTERNAL_ERROR" };

    let body: string;
    try {
      body = await response.text();
    } catch {
      return { kind: "failure", code: "OUTCOME_UNKNOWN" };
    }
    if (body.length > 1_000_000) return { kind: "success", draft: undefined };
    let decoded: unknown;
    try {
      decoded = JSON.parse(body) as unknown;
    } catch {
      return { kind: "success", draft: undefined };
    }
    const extracted = extractDraft(decoded);
    if (extracted.kind === "refusal") return { kind: "failure", code: "SAFETY_REJECTED" };
    return extracted.kind === "draft"
      ? { kind: "success", draft: extracted.value }
      : { kind: "success", draft: undefined };
  }
}
