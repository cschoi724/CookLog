import { createHash } from "node:crypto";

function canonicalize(value: unknown, seen: Set<object>): string {
  if (value === null) return "null";
  if (typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("JSON body contains a non-finite number");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) throw new Error("JSON body contains a cycle");
    seen.add(value);
    const result = `[${value.map((item) => canonicalize(item, seen)).join(",")}]`;
    seen.delete(value);
    return result;
  }
  if (typeof value === "object") {
    if (seen.has(value)) throw new Error("JSON body contains a cycle");
    seen.add(value);
    const record = value as Record<string, unknown>;
    const result = `{${Object.keys(record).sort().map((key) => {
      const child = record[key];
      if (child === undefined) throw new Error("JSON body contains undefined");
      return `${JSON.stringify(key)}:${canonicalize(child, seen)}`;
    }).join(",")}}`;
    seen.delete(value);
    return result;
  }
  throw new Error("body is not canonical JSON");
}

export function canonicalJson(value: unknown): string {
  return canonicalize(value, new Set());
}

export function hashJsonBody(contentType: string, body: unknown): string {
  const normalizedContentType = contentType.split(";", 1)[0]?.trim().toLowerCase();
  if (normalizedContentType !== "application/json") {
    throw new Error("idempotent JSON request requires application/json");
  }
  return createHash("sha256")
    .update(normalizedContentType, "utf8")
    .update("\n", "utf8")
    .update(canonicalJson(body), "utf8")
    .digest("hex");
}
