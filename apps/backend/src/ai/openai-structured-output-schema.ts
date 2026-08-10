import recipeDraftSchema from "../../contracts/ai/recipe-draft.schema.json" with { type: "json" };

export const OPENAI_STRUCTURED_OUTPUT_KEYWORD_ALLOWLIST = [
  "$defs", "$ref", "additionalProperties", "anyOf", "description", "enum",
  "exclusiveMaximum", "exclusiveMinimum", "format", "items", "maximum", "maxItems",
  "minimum", "minItems", "multipleOf", "pattern", "properties", "required", "type",
] as const;

const allowedKeywords = new Set<string>(OPENAI_STRUCTURED_OUTPUT_KEYWORD_ALLOWLIST);
const metadataKeywords = new Set(["$id", "$schema", "title"]);
const runtimeOnlyKeywords = new Set(["maxLength", "minLength", "uniqueItems"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function projectSchema(value: unknown): unknown {
  if (!isRecord(value)) throw new Error("provider schema node must be an object");
  const projected: Record<string, unknown> = {};
  for (const [keyword, child] of Object.entries(value)) {
    if (metadataKeywords.has(keyword) || runtimeOnlyKeywords.has(keyword)) continue;
    if (keyword === "const") {
      projected.enum = [structuredClone(child)];
      continue;
    }
    if (!allowedKeywords.has(keyword)) throw new Error("unsupported provider schema keyword");
    if (keyword === "properties" || keyword === "$defs") {
      if (!isRecord(child)) throw new Error("provider schema map must be an object");
      projected[keyword] = Object.fromEntries(Object.entries(child)
        .map(([name, schema]) => [name, projectSchema(schema)]));
    } else if (keyword === "items") {
      projected.items = projectSchema(child);
    } else if (keyword === "anyOf") {
      if (!Array.isArray(child)) throw new Error("provider anyOf must be an array");
      projected.anyOf = child.map(projectSchema);
    } else {
      projected[keyword] = structuredClone(child);
    }
  }
  return projected;
}

function validateSchemaNode(value: unknown, isRoot: boolean): boolean {
  if (!isRecord(value)) return false;
  if (isRoot && value.type !== "object") return false;
  if (isRoot && Object.hasOwn(value, "anyOf")) return false;
  if (Object.keys(value).some((keyword) => !allowedKeywords.has(keyword))) return false;

  if (value.type === "object") {
    const required = value.required;
    if (!isRecord(value.properties) || value.additionalProperties !== false ||
      !Array.isArray(required)) return false;
    const propertyNames = Object.keys(value.properties);
    if (required.length !== propertyNames.length ||
      !propertyNames.every((name) => required.includes(name))) return false;
    if (!Object.values(value.properties).every((child) => validateSchemaNode(child, false))) return false;
  }
  if (Object.hasOwn(value, "items") && !validateSchemaNode(value.items, false)) return false;
  if (Object.hasOwn(value, "anyOf") && (!Array.isArray(value.anyOf) ||
    !value.anyOf.every((child) => validateSchemaNode(child, false)))) return false;
  if (Object.hasOwn(value, "$defs") && (!isRecord(value.$defs) ||
    !Object.values(value.$defs).every((child) => validateSchemaNode(child, false)))) return false;
  return true;
}

export function validateOpenAIStructuredOutputSchema(value: unknown): boolean {
  return validateSchemaNode(value, true);
}

export const OPENAI_RECIPE_DRAFT_SCHEMA: unknown = projectSchema(recipeDraftSchema);

if (!validateOpenAIStructuredOutputSchema(OPENAI_RECIPE_DRAFT_SCHEMA)) {
  throw new Error("OpenAI recipe schema is outside the supported Structured Outputs subset");
}
