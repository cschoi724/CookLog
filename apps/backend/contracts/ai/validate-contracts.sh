#!/bin/sh
set -eu

contract_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

jq empty "$contract_dir"/*.json "$contract_dir"/fixtures/*.json

computed_snapshot_sha256=$(
  jq -cS '.steps' "$contract_dir/fixtures/recipe-job-create.json" |
    shasum -a 256 |
    awk '{print $1}'
)
declared_snapshot_sha256=$(
  jq -r '.snapshot_sha256' "$contract_dir/fixtures/recipe-job-create.json"
)
test "$computed_snapshot_sha256" = "$declared_snapshot_sha256"

jq -e '
  .contract_version == "ai-recipe-job.v1" and
  .snapshot_revision >= 1 and
  (.snapshot_sha256 | test("^[a-f0-9]{64}$")) and
  (.steps | length) >= 1 and
  ([.steps[].step_id] | unique | length) == (.steps | length) and
  ([.steps[].order] == [range(0; (.steps | length))])
' "$contract_dir/fixtures/recipe-job-create.json" >/dev/null

jq -e --slurpfile request "$contract_dir/fixtures/recipe-job-create.json" '
  ($request[0].steps | map(.step_id)) as $source_ids |
  .schema_version == "recipe-draft.v1" and
  ([.steps[].order] == [range(0; (.steps | length))]) and
  all(.ingredients[].evidence_step_ids[];
    . as $evidence_id | $source_ids | index($evidence_id) != null) and
  all(.steps[].evidence_step_ids[];
    . as $evidence_id | $source_ids | index($evidence_id) != null) and
  all(.review_flags[]; .review_required == true)
' "$contract_dir/fixtures/recipe-draft.json" >/dev/null

jq -e '
  .allowed as $allowed |
  ($allowed | unique | length) == ($allowed | length) and
  (.forbidden | unique | length) == (.forbidden | length) and
  all(.forbidden[];
    . as $transition | $allowed | index($transition) == null) and
  all(.provider_call_cases[];
    .provider_calls <= 1 and .lease_winners >= 1 and
    (.terminal_state == "succeeded" or .terminal_state == "failed")) and
  (.provider_call_cases[] | select(.name == "worker_crash_after_provider_start") |
    .provider_calls == 1 and .failure == "OUTCOME_UNKNOWN") and
  (.provider_call_cases[] | select(.name == "provider_timeout") |
    .provider_calls == 1 and .failure == "AI_TIMEOUT") and
  .timeouts_seconds.create_accept == 5 and
  .timeouts_seconds.queue_start == 120 and
  .timeouts_seconds.worker_execution == 90 and
  .timeouts_seconds.provider_call == 60 and
  .timeouts_seconds.validate_and_commit == 10
' "$contract_dir/fixtures/state-transitions.json" >/dev/null

jq -e '
  (.cases | map(.name) | sort) ==
    ["concurrent_ack", "concurrent_same_key_same_body", "manual_retry",
     "repeated_get", "same_key_different_body"] and
  (.cases[] | select(.name == "concurrent_same_key_same_body") |
    .jobs_created == 1 and .outbox_records == 1 and .provider_calls_max == 1) and
  (.cases[] | select(.name == "same_key_different_body") |
    .jobs_created == 1 and .result == "IDEMPOTENCY_KEY_REUSED") and
  (.cases[] | select(.name == "repeated_get") |
    .provider_calls_max == 0) and
  (.cases[] | select(.name == "concurrent_ack") |
    .content_delete_max == 1 and .provider_calls_max == 0) and
  (.cases[] | select(.name == "manual_retry") |
    .keys == 2 and .jobs_created == 2)
' "$contract_dir/fixtures/idempotency-cases.json" >/dev/null

jq -e '
  (.created_at | fromdateiso8601) as $created |
  (.delete_after | fromdateiso8601) as $delete |
  (.warning_at | fromdateiso8601) as $warning |
  (.critical_at | fromdateiso8601) as $critical |
  (.incident_at | fromdateiso8601) as $incident |
  (.cleanup_retry_stops_at | fromdateiso8601) as $retry_stop |
  (.expires_at | fromdateiso8601) as $expires |
  ($delete - $created == 79200) and
  ($warning - $created == 81000) and
  ($critical - $created == 82800) and
  ($incident - $created == 84600) and
  ($retry_stop - $created == 85500) and
  ($expires - $created == 86400) and
  .ttl_safety_at == .expires_at and
  .sweeper_interval_seconds == 900 and
  .cleanup_registered_atomically == true and
  all(.paths[]; .content_returned_after_delete == false and .provider_calls == 0) and
  .firestore_ttl_is_safety_net_only == true and
  .firestore_ttl_free_quota_eligible == false
' "$contract_dir/fixtures/recovery-lifecycle.json" >/dev/null

jq -e '
  (.cases | length) == 4 and
  all(.cases[];
    .expected_state == "failed" and
    .expected_failure == "OUTPUT_INVALID" and
    .result_stored == false and
    .result_returned == false)
' "$contract_dir/fixtures/output-negative.json" >/dev/null

jq -e '
  .additionalProperties == false and
  .properties.contract_version.const == "ai-recipe-job.v1" and
  .properties.steps.minItems == 1 and
  .properties.steps.items.additionalProperties == false
' "$contract_dir/recipe-job-create.schema.json" >/dev/null

jq -e '
  .additionalProperties == false and
  .properties.schema_version.const == "recipe-draft.v1" and
  .properties.ingredients.items.properties.evidence_step_ids.minItems == 1 and
  .properties.steps.items.properties.evidence_step_ids.minItems == 1 and
  .properties.review_flags.items.properties.review_required.const == true
' "$contract_dir/recipe-draft.schema.json" >/dev/null

jq -e '
  .additionalProperties == false and
  (.properties.state.enum | sort) ==
    ["expired", "failed", "processing", "queued", "succeeded"] and
  (.properties.result_state.enum | sort) ==
    ["acknowledged_deleted", "available", "expired_deleted", "none"]
' "$contract_dir/recipe-job-status.schema.json" >/dev/null

echo "AI recipe contract validation: PASS"
