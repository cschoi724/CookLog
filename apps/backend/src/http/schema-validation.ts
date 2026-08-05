import type { PublicViolation, ViolationField, ViolationReason } from "./public-errors.js";

export type JsonSchema = boolean | {
  readonly type?: "object" | "array" | "string" | "integer" | "number" | "boolean" | "null";
  readonly additionalProperties?: boolean;
  readonly required?: readonly string[];
  readonly properties?: Readonly<Record<string, JsonSchema>>;
  readonly items?: JsonSchema;
  readonly enum?: readonly unknown[];
  readonly const?: unknown;
  readonly pattern?: string;
  readonly format?: "uuid";
  readonly minimum?: number;
  readonly maximum?: number;
  readonly minItems?: number;
  readonly maxItems?: number;
};

export interface SchemaViolation {
  readonly path: string;
  readonly reason: ViolationReason;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function matchesType(value: unknown, type: Exclude<JsonSchema, boolean>["type"]): boolean {
  switch (type) {
    case "object": return isRecord(value);
    case "array": return Array.isArray(value);
    case "string": return typeof value === "string";
    case "integer": return Number.isInteger(value);
    case "number": return typeof value === "number" && Number.isFinite(value);
    case "boolean": return typeof value === "boolean";
    case "null": return value === null;
    case undefined: return true;
  }
}

export function validateJsonSchema(value: unknown, schema: JsonSchema, path = "body"): readonly SchemaViolation[] {
  if (schema === true) return [];
  if (schema === false) return [{ path, reason: "UNSUPPORTED_VALUE" }];
  if (!matchesType(value, schema.type)) return [{ path, reason: "INVALID_FORMAT" }];
  if (schema.const !== undefined && !Object.is(value, schema.const)) {
    return [{ path, reason: "UNSUPPORTED_VALUE" }];
  }
  if (schema.enum !== undefined && !schema.enum.some((candidate) => Object.is(candidate, value))) {
    return [{ path, reason: "UNSUPPORTED_VALUE" }];
  }

  const violations: SchemaViolation[] = [];
  if (typeof value === "string") {
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, "u").test(value)) {
      violations.push({ path, reason: "INVALID_FORMAT" });
    }
    if (schema.format === "uuid" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
      violations.push({ path, reason: "INVALID_FORMAT" });
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) violations.push({ path, reason: "OUT_OF_RANGE" });
    if (schema.maximum !== undefined && value > schema.maximum) violations.push({ path, reason: "OUT_OF_RANGE" });
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) violations.push({ path, reason: "OUT_OF_RANGE" });
    if (schema.maxItems !== undefined && value.length > schema.maxItems) violations.push({ path, reason: "TOO_MANY_ITEMS" });
    if (schema.items !== undefined) {
      value.forEach((item, index) => violations.push(...validateJsonSchema(item, schema.items!, `${path}[${index}]`)));
    }
  }
  if (isRecord(value)) {
    const properties = schema.properties ?? {};
    for (const required of schema.required ?? []) {
      if (!(required in value)) violations.push({ path: `${path}.${required}`, reason: "REQUIRED" });
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) violations.push({ path: `${path}.${key}`, reason: "UNSUPPORTED_VALUE" });
      }
    }
    for (const [key, childSchema] of Object.entries(properties)) {
      if (key in value) violations.push(...validateJsonSchema(value[key], childSchema, `${path}.${key}`));
    }
  }
  return violations;
}

export function toPublicViolations(
  violations: readonly SchemaViolation[],
  fieldMap: Readonly<Record<string, ViolationField>> = {},
): readonly PublicViolation[] {
  return violations.slice(0, 20).map(({ path, reason }) => ({
    field: fieldMap[path] ?? "body",
    reason,
  }));
}
