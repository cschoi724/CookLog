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
  (.provider_call_cases[] |
    select(.name == "provider_response_deadline_after_start") |
    .provider_calls == 1 and .failure == "OUTCOME_UNKNOWN") and
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
  .available_status.state == "succeeded" and
  .available_status.result_state == "available" and
  .available_status.result_version >= 1 and
  .available_status.result_present == true and
  all(.non_available_statuses[]; .result_version == null) and
  (.ack_cases | map(.name) | sort) ==
    ["ack_replay_after_delete", "concurrent_ack", "get_version_then_ack",
     "wrong_version"] and
  (.ack_cases[] | select(.name == "get_version_then_ack") |
    .submitted_result_version == .stored_result_version and
    .content_delete_count == 1 and .result == "success") and
  (.ack_cases[] | select(.name == "wrong_version") |
    .submitted_result_version != .stored_result_version and
    .content_delete_count == 0 and
    .result == "VALIDATION_FAILED:MISMATCH") and
  (.ack_cases[] | select(.name == "concurrent_ack") |
    .concurrent_requests == 2 and .content_delete_count == 1 and
    .result == "same_success") and
  (.ack_cases[] | select(.name == "ack_replay_after_delete") |
    .stored_result_version == null and
    .submitted_result_version == .acknowledged_result_version and
    .content_delete_count == 0 and .result == "success_replayed")
' "$contract_dir/fixtures/result-version-ack-cases.json" >/dev/null

jq -e '
  (.cases | map(.name) | sort) ==
    ["connection_lost_after_start", "provider_cancelled_before_execution",
     "provider_response_deadline_after_start", "queue_start_timeout",
     "worker_deadline_after_provider_start",
     "worker_deadline_before_provider_start"] and
  all(.cases[];
    .provider_calls <= 1 and
    .new_job_allowed == "after_terminal_state_observed_and_user_confirms") and
  all(.cases[] | select(.provider_started == false);
    .provider_calls == 0 and
    (.terminal_failure == "QUEUE_TIMEOUT" or
     .terminal_failure == "AI_TIMEOUT")) and
  all(.cases[] |
      select(.provider_started == true and
             .provider_execution_absent_confirmed == false);
    .provider_calls == 1 and .terminal_failure == "OUTCOME_UNKNOWN" and
    .late_response_action == "discard_on_state_version_cas_failure") and
  (.cases[] | select(.name == "provider_cancelled_before_execution") |
    .provider_calls == 1 and
    .provider_execution_absent_confirmed == true and
    .terminal_failure == "AI_TIMEOUT")
' "$contract_dir/fixtures/timeout-decision-cases.json" >/dev/null

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
    ["acknowledged_deleted", "available", "expired_deleted", "none"] and
  (.required | index("result_version") != null) and
  (.properties.failure.oneOf[1].properties.code.enum |
    index("QUOTA_EXCEEDED") == null) and
  .allOf[3].if.properties.result_state.const == "available" and
  .allOf[3].then.properties.result_version.type == "integer" and
  .allOf[4].if.properties.result_state.const == "acknowledged_deleted" and
  .allOf[4].then.properties.result_version.type == "null"
' "$contract_dir/recipe-job-status.schema.json" >/dev/null

jq -e '
  .manifest_version == "openai-recipe-provider.v1" and
  .adapter_config_version == "openai-recipe-adapter.v1" and
  .provider == "openai" and
  .endpoint == "https://kr.api.openai.com/v1/chat/completions" and
  .model == "gpt-5-mini-2025-08-07" and
  .prompt_version == "recipe-prompt.v1" and
  .output_schema_version == "recipe-draft.v1" and
  .storage_region == "KR" and
  .regional_processing_supported == false and
  .processing_boundary == "outside-KR-approved-only" and
  .store == false and
  .external_tools_enabled == false and
  .automatic_fallback_enabled == false and
  .automatic_retry_enabled == false and
  .timeout_ms == 60000 and
  (.structured_output_keyword_allowlist | sort) ==
    (["$defs", "$ref", "additionalProperties", "anyOf", "description", "enum",
      "exclusiveMaximum", "exclusiveMinimum", "format", "items", "maximum", "maxItems",
      "minimum", "minItems", "multipleOf", "pattern", "properties", "required", "type"] | sort) and
  (.runtime_only_schema_keywords | sort) ==
    (["const", "maxLength", "minLength", "uniqueItems"] | sort) and
  (.activation_gates | sort) ==
    (["product_approval", "zdr_approval", "modified_retention_amendment",
      "cross_border_processing_approval", "dedicated_credential"] | sort)
' "$contract_dir/openai-provider-manifest.v1.json" >/dev/null

echo "AI recipe contract validation: PASS"
