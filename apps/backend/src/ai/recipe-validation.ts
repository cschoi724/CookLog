import { createHash } from "node:crypto";

import { canonicalJson } from "../idempotency/body-hash.js";
import type {
  RecipeDraft,
  RecipeJobAcknowledgement,
  RecipeJobCreateRequest,
  RecipeStepSnapshot,
} from "./types.js";

const sha256Pattern = /^[a-f0-9]{64}$/u;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const rfc3339Pattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/u;
const reviewFlagPathPattern = /^(ingredients|steps|estimated_total_minutes)(\[[0-9]+\])?(\.[a-z_]+)?$/u;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isRfc3339(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = rfc3339Pattern.exec(value);
  if (match === null) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
  const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59 ||
    offsetHour > 23 || offsetMinute > 59) return false;
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= (daysInMonth[month - 1] ?? 0);
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

function isIntegerInRange(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isInteger(value) && (value as number) >= minimum && (value as number) <= maximum;
}

export function canonicalSnapshotBytes(steps: readonly RecipeStepSnapshot[]): Buffer {
  return Buffer.from(`${canonicalJson(steps)}\n`, "utf8");
}

export function computeSnapshotSha256(steps: readonly RecipeStepSnapshot[]): string {
  return createHash("sha256").update(canonicalSnapshotBytes(steps)).digest("hex");
}

export function validateRecipeJobCreate(value: unknown): RecipeJobCreateRequest | undefined {
  if (!isRecord(value) || !hasExactKeys(value, [
    "contract_version", "snapshot_id", "snapshot_revision", "snapshot_sha256", "locale", "steps",
  ])) return undefined;
  if (value.contract_version !== "ai-recipe-job.v1" || value.locale !== "ko-KR" ||
    !isUuid(value.snapshot_id) ||
    !isIntegerInRange(value.snapshot_revision, 1, Number.MAX_SAFE_INTEGER) ||
    typeof value.snapshot_sha256 !== "string" || !sha256Pattern.test(value.snapshot_sha256) ||
    !Array.isArray(value.steps) || value.steps.length < 1 || value.steps.length > 100) return undefined;

  const stepIds = new Set<string>();
  for (let index = 0; index < value.steps.length; index += 1) {
    const step = value.steps[index];
    if (!isRecord(step) || !hasExactKeys(step, ["step_id", "order", "recorded_at", "transcript"]) ||
      !isUuid(step.step_id) || stepIds.has(step.step_id) ||
      step.order !== index || !isRfc3339(step.recorded_at) || typeof step.transcript !== "string" ||
      step.transcript.length < 1 || step.transcript.length > 4_000) return undefined;
    stepIds.add(step.step_id);
  }
  const request = structuredClone(value) as unknown as RecipeJobCreateRequest;
  return computeSnapshotSha256(request.steps) === request.snapshot_sha256 ? request : undefined;
}

export function validateRecipeJobAcknowledgement(value: unknown): RecipeJobAcknowledgement | undefined {
  if (!isRecord(value) || !hasExactKeys(value, ["result_version", "saved_locally_at"]) ||
    !isIntegerInRange(value.result_version, 1, Number.MAX_SAFE_INTEGER) ||
    !isRfc3339(value.saved_locally_at)) return undefined;
  return structuredClone(value) as unknown as RecipeJobAcknowledgement;
}

function isUniqueStringArray(value: unknown, allowed?: ReadonlySet<string>): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" &&
    (allowed === undefined || allowed.has(item))) && new Set(value).size === value.length;
}

function hasUncitedSafetyValue(instruction: string, source: string): boolean {
  const safetyValues = instruction.match(/\d{1,4}\s*(?:°\s*[CF]|℃|℉|도)/giu) ?? [];
  return safetyValues.some((value) => !source.includes(value));
}

export function validateRecipeDraft(
  value: unknown,
  request: RecipeJobCreateRequest,
): RecipeDraft | undefined {
  if (!isRecord(value) || !hasExactKeys(value, [
    "schema_version", "title", "ingredients", "steps", "estimated_total_minutes",
    "estimated_time_provenance", "notes", "review_flags",
  ]) || value.schema_version !== "recipe-draft.v1" || typeof value.title !== "string" ||
    value.title.length < 1 || value.title.length > 120 || !Array.isArray(value.ingredients) ||
    value.ingredients.length > 100 || !Array.isArray(value.steps) || value.steps.length < 1 ||
    value.steps.length > 100 || !Array.isArray(value.notes) || value.notes.length > 50 ||
    !value.notes.every((note) => typeof note === "string" && note.length >= 1 && note.length <= 500) ||
    !Array.isArray(value.review_flags) || value.review_flags.length > 100) return undefined;

  const evidence = new Set(request.steps.map((step) => step.step_id));
  const sourceById = new Map(request.steps.map((step) => [step.step_id, step.transcript]));
  const inferredFields = new Set(["name", "quantity", "unit"]);
  for (const ingredient of value.ingredients) {
    if (!isRecord(ingredient) || !hasExactKeys(ingredient, [
      "name", "quantity", "unit", "evidence_step_ids", "inferred_fields",
    ]) || typeof ingredient.name !== "string" || ingredient.name.length < 1 || ingredient.name.length > 120 ||
      !(ingredient.quantity === null || (typeof ingredient.quantity === "string" && ingredient.quantity.length <= 40)) ||
      !(ingredient.unit === null || (typeof ingredient.unit === "string" && ingredient.unit.length <= 30)) ||
      !isUniqueStringArray(ingredient.evidence_step_ids, evidence) || ingredient.evidence_step_ids.length < 1 ||
      !isUniqueStringArray(ingredient.inferred_fields, inferredFields)) return undefined;
  }
  for (let index = 0; index < value.steps.length; index += 1) {
    const step = value.steps[index];
    if (!isRecord(step) || !hasExactKeys(step, [
      "order", "instruction", "evidence_step_ids", "estimated_duration_minutes", "duration_provenance",
    ]) || step.order !== index || typeof step.instruction !== "string" || step.instruction.length < 1 ||
      step.instruction.length > 1_000 || !isUniqueStringArray(step.evidence_step_ids, evidence) ||
      step.evidence_step_ids.length < 1 || !(step.estimated_duration_minutes === null ||
        isIntegerInRange(step.estimated_duration_minutes, 1, 1_440)) ||
      !["recorded", "ai_inferred", "unknown"].includes(step.duration_provenance as string)) return undefined;
    const citedSource = step.evidence_step_ids.map((id) => sourceById.get(id) ?? "").join(" ");
    if (hasUncitedSafetyValue(step.instruction, citedSource)) return undefined;
  }
  if (!(value.estimated_total_minutes === null || isIntegerInRange(value.estimated_total_minutes, 1, 1_440)) ||
    !["recorded", "ai_inferred", "unknown"].includes(value.estimated_time_provenance as string)) return undefined;
  for (const flag of value.review_flags) {
    if (!isRecord(flag) || !hasExactKeys(flag, ["field_path", "reason", "review_required"]) ||
      typeof flag.field_path !== "string" || !reviewFlagPathPattern.test(flag.field_path) ||
      !["ai_inferred", "missing_source", "safety_review"].includes(flag.reason as string) ||
      flag.review_required !== true) return undefined;
  }
  const inferredReviewPaths = new Set(value.review_flags
    .filter((flag) => isRecord(flag) && flag.reason === "ai_inferred" && flag.review_required === true)
    .map((flag) => flag.field_path));
  for (let index = 0; index < value.ingredients.length; index += 1) {
    const ingredient = value.ingredients[index] as Record<string, unknown>;
    for (const field of ingredient.inferred_fields as string[]) {
      if (!inferredReviewPaths.has(`ingredients[${index}].${field}`)) return undefined;
    }
  }
  for (let index = 0; index < value.steps.length; index += 1) {
    const step = value.steps[index] as Record<string, unknown>;
    if (step.duration_provenance === "ai_inferred" &&
      !inferredReviewPaths.has(`steps[${index}].estimated_duration_minutes`)) return undefined;
  }
  if (value.estimated_time_provenance === "ai_inferred" &&
    !inferredReviewPaths.has("estimated_total_minutes")) return undefined;
  return structuredClone(value) as unknown as RecipeDraft;
}
