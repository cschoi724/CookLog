#!/bin/sh
set -eu

contract_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
catalog="$contract_dir/public-error-catalog.json"
schema="$contract_dir/error-envelope.schema.json"
fixtures="$contract_dir/fixtures/error-generation-negative.json"

jq empty "$contract_dir"/*.json "$fixtures"

jq -e '
  (.errors | length) > 0 and
  ([.errors[].code] | length == (unique | length)) and
  all(.errors[];
    (.code | test("^[A-Z][A-Z0-9_]{2,63}$")) and
    (.type | test("^https://api\\.cooklog\\.app/problems/[a-z0-9-]+$")) and
    (.status >= 400 and .status <= 599) and
    (.user_message_key | test("^error\\.[a-z0-9_]+$")) and
    (.retry_after_policy == "required" or
     .retry_after_policy == "optional" or
     .retry_after_policy == "forbidden")
  )
' "$catalog" >/dev/null

jq -n -e \
  --slurpfile catalog "$catalog" \
  --slurpfile schema "$schema" '
    ($catalog[0].errors | map(.code) | sort) ==
      ($schema[0].properties.code.enum | sort) and
    ($catalog[0].errors | map(.title) | unique | sort) ==
      ($schema[0].properties.title.enum | sort) and
    ($catalog[0].errors | map(.detail) | unique | sort) ==
      ($schema[0].properties.detail.enum | sort) and
    ($catalog[0].errors | map(.user_message_key) | unique | sort) ==
      ($schema[0].properties.user_message_key.enum | sort)
  ' >/dev/null

jq -n -e \
  --slurpfile catalog "$catalog" \
  --slurpfile fixtures "$fixtures" '
    ($catalog[0].errors | INDEX(.code)) as $by_code |
    all($fixtures[0].cases[];
      . as $case |
      ($by_code[$case.public_code]) as $mapping |
      $mapping != null and
      $case.expected_public_fields == {
        type: $mapping.type,
        title: $mapping.title,
        status: $mapping.status,
        detail: $mapping.detail,
        code: $mapping.code,
        user_message_key: $mapping.user_message_key,
        retryable: $mapping.retryable
      } and
      ($case.expected_public_fields | tojson) as $public_json |
      all(
        $case.forbidden_substrings[];
        . as $forbidden | ($public_json | contains($forbidden) | not)
      )
    )
  ' >/dev/null

printf '%s\n' "common contract validation: PASS"
