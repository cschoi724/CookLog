import type {
  InMemoryRecipeJobRepository,
  RecipeQueueTask,
} from "../storage/recipe-job-repository.js";

export const RECIPE_CONTENT_SWEEPER_INTERVAL_MS = 15 * 60 * 1_000;
export const RECIPE_CONTENT_QUEUE_RETRY_WINDOW_MS = 1.75 * 60 * 60 * 1_000;

export type CleanupTaskRunResult = {
  readonly kind: "ignored" | "not_due" | "regular" | "isolated";
  readonly deleted: number;
};

export class RecipeContentLifecycleWorker {
  readonly #repository: Pick<InMemoryRecipeJobRepository, "getCleanupHealth" | "runScheduledCleanup">;
  #lastSweepAt: number | undefined;

  constructor(repository: Pick<InMemoryRecipeJobRepository, "getCleanupHealth" | "runScheduledCleanup">) {
    this.#repository = repository;
  }

  runCleanupTask(task: RecipeQueueTask, now: number): CleanupTaskRunResult {
    if (!Number.isSafeInteger(now) || now < 0) throw new Error("cleanup task time must be a safe epoch");
    if (task.kind !== "recipe-content-cleanup") return { kind: "ignored", deleted: 0 };
    if (task.scheduledAt > now) return { kind: "not_due", deleted: 0 };
    const kind = now >= task.scheduledAt + RECIPE_CONTENT_QUEUE_RETRY_WINDOW_MS
      ? "isolated"
      : "regular";
    return { kind, deleted: this.#repository.runScheduledCleanup() };
  }

  runSweeper(now: number): { readonly kind: "ran" | "too_soon"; readonly deleted: number } {
    if (!Number.isSafeInteger(now) || now < 0) throw new Error("sweeper time must be a safe epoch");
    if (this.#lastSweepAt !== undefined && now - this.#lastSweepAt < RECIPE_CONTENT_SWEEPER_INTERVAL_MS) {
      return { kind: "too_soon", deleted: 0 };
    }
    this.#lastSweepAt = now;
    return { kind: "ran", deleted: this.#repository.runScheduledCleanup() };
  }

  getHealth(): ReturnType<InMemoryRecipeJobRepository["getCleanupHealth"]> {
    return this.#repository.getCleanupHealth();
  }
}
