#!/bin/sh
set -eu

contract_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
common_catalog="$contract_dir/../common/public-error-catalog.json"

jq empty "$contract_dir"/*.json "$contract_dir"/fixtures/*.json

jq -e '
  .profile == "first_public_release" and
  .mode == "disabled" and
  .upload_route_registered == false and
  .provider_configured == false and
  .audio_egress_allowed == false and
  .automatic_fallback == false and
  .activation_requires_new_approval == true
' "$contract_dir/fixtures/disabled-release.json" >/dev/null

jq -e '
  (. | keys | sort) ==
    ["activation_policy", "contract_version", "deployment_contract",
     "image_contract", "release_profile", "runtime_capabilities"] and
  .contract_version == "remote-stt-production-disabled-proof.v1" and
  .release_profile == "first_public_release" and
  .activation_policy == "new_approved_policy_task_required" and
  (.runtime_capabilities | keys | sort) ==
    ["audio_body_parsers_registered", "audio_egress_destinations_configured",
     "audio_storage_adapters_registered", "automatic_fallbacks_registered",
     "providers_registered", "queue_publishers_registered", "upload_routes_registered"] and
  ([.runtime_capabilities[]] | all(. == 0)) and
  .image_contract.dockerfile == "Dockerfile" and
  .image_contract.runtime_base == "node:24.18.0-bookworm-slim" and
  .image_contract.runtime_user == "node" and
  .image_contract.runtime_entrypoint == "node dist/src/app/server.js" and
  .image_contract.remote_stt_environment_settings == 0 and
  .image_contract.runtime_audio_assets == 0 and
  .deployment_contract.manifest_policy == "absent_or_explicitly_disabled" and
  .deployment_contract.allowed_mode == "disabled" and
  .deployment_contract.upload_route_registered == false and
  .deployment_contract.provider_configured == false and
  .deployment_contract.audio_egress_allowed == false and
  .deployment_contract.automatic_fallback == false
' "$contract_dir/fixtures/production-disabled-proof.json" >/dev/null

jq -e '
  [.cases[].expected_decision] | all(. == "reject_before_body_read")
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e '
  [.cases[].missing_gate] | unique |
  . == [
    "explicit_remote_selection",
    "one_time_authorization",
    "privacy_provider_approval",
    "product_cost_approval",
    "runtime_activation",
    "unused_grant"
  ]
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e --slurpfile catalog "$common_catalog" '
  ($catalog[0].errors | map(.code)) as $public_codes |
  [.cases[].expected_public_code] | all(. as $code | $public_codes | index($code) != null)
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e '
  .register_cleanup_before_body_read == true and
  .atomic_handle_record_and_task == true and
  .delete_deadline_seconds == 3600 and
  .final_forced_delete_offset_seconds == 3300 and
  .final_forced_delete_offset_seconds < .delete_deadline_seconds and
  .retry_offsets_seconds == [0, 60, 300, 900, 1800, 2700, 3300] and
  (.retry_offsets_seconds | max) == .final_forced_delete_offset_seconds and
  .sweeper_interval_seconds <= 300 and
  .sweeper_deadline_lookahead_seconds >= 600 and
  .sweeper_checks_cleanup_records == true and
  .sweeper_checks_object_prefix == true and
  .sweeper_checks_multipart_uploads == true and
  .worker_and_sweeper_independent == true and
  .provider_physical_delete_confirmation_required == true and
  .block_activation_when_confirmation_unsupported == true and
  .block_activation_on_deadline_breach == true
' "$contract_dir/fixtures/cleanup-policy.json" >/dev/null

jq -e --slurpfile catalog "$common_catalog" '
  ($catalog[0].errors | map(.code)) as $public_codes |
  (.cases | map(.name) | sort) ==
    ["non_retryable_provider_error", "timeout_first_attempt",
     "unavailable_then_success", "unavailable_twice"] and
  all(.cases[];
    .provider_call_count >= 1 and
    .provider_call_count <= 2 and
    .same_request == true and
    .same_provider == true and
    .same_audio_handle == true and
    .same_provider_idempotency_key == true and
    .delete_started_after_terminal == true and
    (.public_code == null or
      (.public_code as $code | $public_codes | index($code) != null))
  ) and
  (.cases[] | select(.name == "unavailable_then_success") |
    .provider_call_count == 2 and .terminal_state == "succeeded" and
    .public_code == null) and
  (.cases[] | select(.name == "unavailable_twice") |
    .provider_call_count == 2 and .terminal_state == "failed" and
    .public_code == "UPSTREAM_UNAVAILABLE") and
  (.cases[] | select(.name == "timeout_first_attempt") |
    .provider_call_count == 1 and .terminal_state == "failed" and
    .public_code == "UPSTREAM_TIMEOUT") and
  (.cases[] | select(.name == "non_retryable_provider_error") |
    .provider_call_count == 1 and .terminal_state == "failed")
' "$contract_dir/fixtures/retry-terminal-cases.json" >/dev/null

jq -e --slurpfile schema "$contract_dir/remote-stt-deletion-receipt.schema.json" '
  (.cases | map(.name) | sort) ==
    ["cancelled", "delete_first_attempt_failed", "final_failure",
     "multipart_residual", "queue_delivery_failed", "success",
     "timeout", "worker_crash"] and
  all(.cases[].receipt;
    (. as $receipt |
      ($receipt | keys | sort) == ($schema[0].required | sort)) and
    ((.delete_deadline_at | fromdateiso8601) as $deadline |
     (.received_at | fromdateiso8601) as $received |
     (.terminal_at | fromdateiso8601) as $terminal |
     (.access_revoked_at | fromdateiso8601) as $revoked |
     (.deletion_completed_at | fromdateiso8601) as $deleted |
     ($deadline - $received > 0) and
     ($deadline - $received <= 3600) and
     ($terminal >= $received) and
     ($revoked >= $terminal) and
     ($deleted >= $revoked) and
     ($deleted <= $deadline)) and
    (.status == "deleted") and
    (.deletion_attempt_count >= 1) and
    (.deletion_attempt_count <= 8)
  )
' "$contract_dir/fixtures/deletion-lifecycle-cases.json" >/dev/null

jq -e '
  (.properties | has("audio")) == false and
  (.properties | has("audio_base64")) == false and
  (.properties | has("provider_url")) == false and
  .additionalProperties == false and
  .properties.duration_ms.maximum == 10000 and
  .properties.authorization.properties.explicit_remote_selection.const == true and
  .properties.authorization.properties.one_time.const == true
' "$contract_dir/remote-stt-transcription-request.schema.json" >/dev/null

jq -e '
  .properties.audio_deleted.const == true and
  .additionalProperties == false
' "$contract_dir/remote-stt-transcription-result.schema.json" >/dev/null

jq -e '
  (.properties | has("provider_request_id")) == false and
  (.properties | has("storage_uri")) == false and
  (.properties | has("transcript")) == false and
  (.required | index("terminal_reason") != null) and
  (.required | index("recovery_path") != null) and
  (.required | index("deletion_attempt_count") != null) and
  .properties.status.const == "deleted" and
  .additionalProperties == false
' "$contract_dir/remote-stt-deletion-receipt.schema.json" >/dev/null

jq -e '
  (.properties | has("provider_request_id")) == false and
  (.properties | has("storage_uri")) == false and
  (.properties | has("audio")) == false and
  .properties.attempt.maximum == 7 and
  .additionalProperties == false
' "$contract_dir/remote-stt-cleanup-task.schema.json" >/dev/null

echo "remote STT contract validation: PASS"
