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

test("strict objects reject prototype-named own fields at every nesting level", () => {
  const prototypeNames = ["toString", "constructor", "prototype", "__proto__"];
  const nestedSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      nested: { type: "object", additionalProperties: false, properties: {} },
      items: {
        type: "array",
        items: { type: "object", additionalProperties: false, properties: {} },
      },
    },
  } as const;
  const secret = "Bearer secret raw recipe";
  const namedFields = Object.fromEntries(prototypeNames.map((name) => [name, secret]));
  const payload = {
    ...namedFields,
    nested: { ...namedFields },
    items: [{ ...namedFields }],
  };
  const violations = validateJsonSchema(payload, nestedSchema);

  assert.deepEqual(violations, [
    ...prototypeNames.map((name) => ({ path: `body.${name}`, reason: "UNSUPPORTED_VALUE" })),
    ...prototypeNames.map((name) => ({ path: `body.nested.${name}`, reason: "UNSUPPORTED_VALUE" })),
    ...prototypeNames.map((name) => ({ path: `body.items[0].${name}`, reason: "UNSUPPORTED_VALUE" })),
  ]);
  assert.equal(JSON.stringify(violations).includes(secret), false);
});

test("required and child validation use own payload properties only", () => {
  const inherited = Object.create({ installation_id: "not-an-own-value" }) as Record<string, unknown>;
  inherited.count = 2;
  assert.deepEqual(validateJsonSchema(inherited, schema), [
    { path: "body.installation_id", reason: "REQUIRED" },
  ]);
});
