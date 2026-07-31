#!/bin/sh
set -eu

test_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
backend_dir=$(CDPATH= cd -- "$test_dir/../.." && pwd)
repo_dir=$(CDPATH= cd -- "$backend_dir/../.." && pwd)
contracts_dir="$backend_dir/contracts"
fixture_dir="$contracts_dir/fixtures"

sh "$contracts_dir/common/validate-contracts.sh"
sh "$contracts_dir/stt/validate-contracts.sh"
sh "$contracts_dir/ai/validate-contracts.sh"
sh "$contracts_dir/security/validate-contracts.sh"

jq empty "$fixture_dir"/*.json

jq -e '
  .fixture_version == "ios-backend-fixture.v1" and
  .synthetic_only == true and
  (.consumers | sort) == ["backend_contract_tests", "ios_mock_client_tests"] and
  (.cases | map(.case_id) | sort) ==
    ["ai_recipe_expired", "ai_recipe_public_errors", "ai_recipe_success",
     "ai_recipe_timeout_recovery", "negative_contract_cases",
     "remote_stt_disabled"] and
  ([.cases[].file] | unique | length) == (.cases | length) and
  all(.cases[];
    (.source_contracts | length) >= 1 and
    (.ios_assertion | length) >= 1 and
    (.sensitivity == "content_free" or
     .sensitivity == "synthetic_content_no_secret"))
' "$fixture_dir/manifest.json" >/dev/null

for fixture_file in $(jq -r '.cases[].file' "$fixture_dir/manifest.json"); do
  test -f "$fixture_dir/$fixture_file"
done

for source_file in $(jq -r '.cases[].source_contracts[]' \
  "$fixture_dir/manifest.json" | sort -u); do
  test -f "$repo_dir/$source_file"
done

computed_snapshot_sha256=$(
  jq -cS '.request.body.steps' "$fixture_dir/ai-recipe-success.json" |
    shasum -a 256 |
    awk '{print $1}'
)
declared_snapshot_sha256=$(
  jq -r '.request.body.snapshot_sha256' "$fixture_dir/ai-recipe-success.json"
)
test "$computed_snapshot_sha256" = "$declared_snapshot_sha256"

jq -e --slurpfile canonical_request "$contracts_dir/ai/fixtures/recipe-job-create.json" \
      --slurpfile canonical_draft "$contracts_dir/ai/fixtures/recipe-draft.json" '
  .fixture_version == "ios-backend-fixture.v1" and
  .case_id == "ai_recipe_success" and
  .synthetic_content == true and
  .request.body == $canonical_request[0] and
  .create_response.http_status == 202 and
  (.create_response.body | keys | sort) == ["data", "meta"] and
  (.create_response.body.meta | keys | sort) == ["api_version", "request_id"] and
  .create_response.body.meta.api_version == "v1" and
  (.create_response.body.data | keys | sort) ==
    ["contract_version", "created_at", "expires_at", "failure", "job_id",
     "poll_after_seconds", "result", "result_state", "result_version", "state",
     "state_version", "updated_at"] and
  .create_response.body.data.state == "queued" and
  .create_response.body.data.result == null and
  .poll_response.http_status == 200 and
  .poll_response.body.data.state == "succeeded" and
  .poll_response.body.data.result_state == "available" and
  .poll_response.body.data.result_version == 1 and
  .poll_response.body.data.result == $canonical_draft[0] and
  .acknowledgement_request.body.result_version ==
    .poll_response.body.data.result_version and
  .expectation.provider_calls_max == 1 and
  .expectation.save_locally_before_ack == true and
  .expectation.content_delete_after_ack == true and
  .expectation.automatic_retry == false
' "$fixture_dir/ai-recipe-success.json" >/dev/null

jq -e --slurpfile catalog "$contracts_dir/common/public-error-catalog.json" '
  .fixture_version == "ios-backend-fixture.v1" and
  (.cases | map(.name) | sort) ==
    ["idempotency_key_reused", "quota_exceeded_before_job_creation",
     "result_version_mismatch", "service_disabled", "token_expired"] and
  all(.cases[];
    . as $case |
    .http_status == .body.status and
    ((.body | keys) -
      ["code", "detail", "instance", "request_id", "retry_after_seconds",
       "retryable", "status", "title", "type", "user_message_key",
       "violations"]) == [] and
    all(["type", "title", "status", "detail", "instance", "request_id",
         "code", "user_message_key", "retryable"][];
      . as $required | $case.body | has($required)) and
    .body.code as $code |
    ($catalog[0].errors[] | select(.code == $code)) as $mapping |
    .body.type == $mapping.type and
    .body.title == $mapping.title and
    .body.status == $mapping.status and
    .body.detail == $mapping.detail and
    .body.user_message_key == $mapping.user_message_key and
    .body.retryable == $mapping.retryable and
    (if $mapping.retry_after_policy == "required"
     then (.body | has("retry_after_seconds"))
     elif $mapping.retry_after_policy == "forbidden"
     then (.body | has("retry_after_seconds") | not)
     else true end)) and
  (.cases[] | select(.name == "quota_exceeded_before_job_creation") |
    .job_created == false) and
  (.cases[] | select(.name == "result_version_mismatch") |
    .body.violations == [{"field":"body","reason":"MISMATCH"}])
' "$fixture_dir/ai-recipe-error-cases.json" >/dev/null

jq -e '
  .fixture_version == "ios-backend-fixture.v1" and
  (.cases | map(.name) | sort) ==
    ["provider_not_executed_timeout", "provider_outcome_unknown",
     "queue_start_timeout"] and
  all(.cases[];
    .provider_calls <= 1 and
    (.status | keys | sort) ==
      ["contract_version", "created_at", "expires_at", "failure", "job_id",
       "poll_after_seconds", "result", "result_state", "result_version", "state",
       "state_version", "updated_at"] and
    .status.state == "failed" and
    .status.result_state == "none" and
    .status.result_version == null and
    .status.result == null and
    .ios_expectation.preserve_snapshot == true and
    .ios_expectation.automatic_retry == false and
    .ios_expectation.new_job_requires_user_action == true) and
  (.cases[] | select(.name == "queue_start_timeout") |
    .provider_started == false and .provider_calls == 0 and
    .status.failure.code == "QUEUE_TIMEOUT") and
  (.cases[] | select(.name == "provider_not_executed_timeout") |
    .provider_execution_absent_confirmed == true and
    .status.failure.code == "AI_TIMEOUT") and
  (.cases[] | select(.name == "provider_outcome_unknown") |
    .provider_execution_absent_confirmed == false and
    .status.failure.code == "OUTCOME_UNKNOWN" and
    .ios_expectation.late_result_ignored == true)
' "$fixture_dir/ai-recipe-timeout-recovery.json" >/dev/null

jq -e '
  .fixture_version == "ios-backend-fixture.v1" and
  (.status | keys | sort) ==
    ["contract_version", "created_at", "expires_at", "failure", "job_id",
     "poll_after_seconds", "result", "result_state", "result_version", "state",
     "state_version", "updated_at"] and
  .status.state == "expired" and
  .status.result_state == "expired_deleted" and
  .status.result_version == null and .status.result == null and
  ((.server_now | fromdateiso8601) >=
   (.status.expires_at | fromdateiso8601)) and
  .expectation.decrypt_attempts == 0 and
  .expectation.draft_returned == false and
  .expectation.provider_calls == 0 and
  .expectation.preserve_local_snapshot == true and
  .expectation.automatic_retry == false
' "$fixture_dir/ai-recipe-expired.json" >/dev/null

jq -e --slurpfile canonical "$contracts_dir/stt/fixtures/disabled-release.json" '
  .fixture_version == "ios-backend-fixture.v1" and
  .release_config == $canonical[0] and
  all(.scenarios[];
    .remote_requests == 0 and
    .audio_bytes_read_by_backend == 0 and
    .audio_bytes_egressed == 0 and
    .step_created == false) and
  (.scenarios[] | select(.name == "unapproved_remote_upload_attempt") |
    .backend_action == "reject_before_body_read" and
    .public_error_code == "SERVICE_DISABLED")
' "$fixture_dir/remote-stt-disabled.json" >/dev/null

jq -e '
  .fixture_version == "ios-backend-fixture.v1" and
  (.cases | map(.name) | sort) ==
    ["ack_result_version_mismatch", "remote_stt_enabled_without_approval",
     "same_idempotency_key_different_body", "unexpected_status_field",
     "unknown_public_error_code", "unsupported_ai_contract_version",
     "unsupported_fixture_version"] and
  (.cases[] | select(.name == "ack_result_version_mismatch") |
    .content_delete_count == 0 and
    .expected == "VALIDATION_FAILED:MISMATCH") and
  (.cases[] | select(.name == "same_idempotency_key_different_body") |
    .expected == "IDEMPOTENCY_KEY_REUSED") and
  (.cases[] | select(.name == "remote_stt_enabled_without_approval") |
    .expected == "deployment_gate_fail")
' "$fixture_dir/negative-contract-cases.json" >/dev/null

if rg -n -i \
  'bearer[[:space:]]+[a-z0-9._-]+|sk-[a-z0-9]{8,}|-----begin [a-z ]*private key-----|eyJ[a-zA-Z0-9_-]{8,}\\.[a-zA-Z0-9_-]{8,}\\.|[[:alnum:]._%+-]+@[[:alnum:].-]+\\.[a-z]{2,}|audio/(wav|m4a)|base64_audio' \
  "$fixture_dir"/*.json; then
  echo "shared fixture sensitive-data scan: FAIL" >&2
  exit 1
fi

echo "iOS Backend shared fixture contract validation: PASS"
