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
  [.cases[].expected_decision] | all(. == "reject_before_body_read")
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e '
  [.cases[].missing_gate] | unique |
  . == [
    "explicit_remote_selection",
    "one_time_authorization",
    "product_cost_privacy_approval",
    "runtime_activation",
    "unused_grant"
  ]
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e --slurpfile catalog "$common_catalog" '
  ($catalog[0].errors | map(.code)) as $public_codes |
  [.cases[].expected_public_code] | all(. as $code | $public_codes | index($code) != null)
' "$contract_dir/fixtures/activation-negative.json" >/dev/null

jq -e '
  (.delete_deadline_at | fromdateiso8601) as $deadline |
  (.received_at | fromdateiso8601) as $received |
  (.terminal_at | fromdateiso8601) as $terminal |
  (.access_revoked_at | fromdateiso8601) as $revoked |
  (.deletion_completed_at | fromdateiso8601) as $deleted |
  ($deadline - $received <= 3600) and
  ($deadline - $received > 0) and
  ($terminal >= $received) and
  ($revoked >= $terminal) and
  ($deleted >= $revoked) and
  ($deleted <= $deadline) and
  (.status == "deleted")
' "$contract_dir/fixtures/deletion-receipt.json" >/dev/null

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
  .properties.status.const == "deleted" and
  .additionalProperties == false
' "$contract_dir/remote-stt-deletion-receipt.schema.json" >/dev/null

echo "remote STT contract validation: PASS"
