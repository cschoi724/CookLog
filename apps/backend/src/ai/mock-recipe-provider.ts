import type { RecipeAIProvider, RecipeAIProviderContext, RecipeAIProviderOutcome } from "./provider.js";
import type { RecipeJobCreateRequest } from "./types.js";

type MockOutcomeFactory = (
  request: RecipeJobCreateRequest,
  context: RecipeAIProviderContext,
) => RecipeAIProviderOutcome | Promise<RecipeAIProviderOutcome>;

export class DeterministicMockRecipeAIProvider implements RecipeAIProvider {
  readonly #factory: MockOutcomeFactory;
  #calls = 0;

  constructor(outcome: RecipeAIProviderOutcome | MockOutcomeFactory) {
    this.#factory = typeof outcome === "function" ? outcome : () => structuredClone(outcome);
  }

  get callCount(): number {
    return this.#calls;
  }

  async generate(
    request: RecipeJobCreateRequest,
    context: RecipeAIProviderContext,
  ): Promise<RecipeAIProviderOutcome> {
    this.#calls += 1;
    return structuredClone(await this.#factory(structuredClone(request), { ...context }));
  }
}
