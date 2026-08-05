import assert from "node:assert/strict";
import test from "node:test";

import { toPublicViolations, validateJsonSchema } from "../../src/http/schema-validation.js";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["installation_id", "count"],
  properties: {
    installation_id: { type: "string", format: "uuid" },
    count: { type: "integer", minimum: 1, maximum: 3 },
  },
} as const;

test("JSON Schema subset accepts strict valid objects", () => {
  assert.deepEqual(validateJsonSchema({
    installation_id: "97882b04-fbb9-4c4b-8b71-a1c71a76a593",
    count: 2,
  }, schema), []);
});

test("JSON Schema subset rejects missing, unknown, format, and range violations without values", () => {
  const secretValue = "Bearer secret raw recipe";
  const violations = validateJsonSchema({ installation_id: secretValue, count: 9, extra: secretValue }, schema);
  assert.deepEqual(violations, [
    { path: "body.extra", reason: "UNSUPPORTED_VALUE" },
    { path: "body.installation_id", reason: "INVALID_FORMAT" },
    { path: "body.count", reason: "OUT_OF_RANGE" },
  ]);
  assert.equal(JSON.stringify(violations).includes(secretValue), false);
  assert.deepEqual(toPublicViolations(violations, {
    "body.installation_id": "installation_id",
  }), [
    { field: "body", reason: "UNSUPPORTED_VALUE" },
    { field: "installation_id", reason: "INVALID_FORMAT" },
    { field: "body", reason: "OUT_OF_RANGE" },
  ]);
});
