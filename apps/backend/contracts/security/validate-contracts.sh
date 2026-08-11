#!/bin/sh
set -eu

contract_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

jq empty "$contract_dir"/fixtures/*.json

jq -e '
  (.created_at | fromdateiso8601) as $created |
  (.delete_after | fromdateiso8601) as $delete |
  (.warning_at | fromdateiso8601) as $warning |
  (.critical_at | fromdateiso8601) as $critical |
  (.incident_at | fromdateiso8601) as $incident |
  (.cleanup_retry_stops_at | fromdateiso8601) as $retry_stop |
  (.expires_at | fromdateiso8601) as $expires |
  ($delete - $created == 2419200) and
  ($warning - $created == 2505600) and
  ($critical - $created == 2548800) and
  ($incident - $created == 2570400) and
  ($retry_stop - $created == 2591100) and
  ($expires - $created == 2592000) and
  .sweeper_interval_seconds == 900 and
  .cleanup_outbox_registered_atomically == true and
  .sweeper_independent_from_cleanup_queue == true and
  (.required_sinks | sort) ==
    ["analytics_staging", "backup", "error_tracker", "export_object",
     "incident_replica", "source"] and
  (.cases | map(.name) | sort) ==
    ["cleanup_queue_outage", "cleanup_task_missing", "cleanup_worker_crash",
     "firestore_ttl_delay", "normal_cleanup", "sink_delete_failure"] and
  all(.cases[];
    .recovered_before_expires_at == true and
    .receipts_complete_before_expires_at == true and
    (.receipt_sink_ids | sort) ==
      ["analytics_staging", "backup", "error_tracker", "export_object",
       "incident_replica", "source"] and
    .read_after_expiry == false and
    .export_after_expiry == false and
    .aggregate_input_after_expiry == false and
    .sync_delete_attempted_at_expiry == true)
' "$contract_dir/fixtures/raw-metadata-retention-cases.json" >/dev/null

jq -e '
  .hard_cutoff_krw == 50000 and
  .delayed_billing_reserve_krw == 5000 and
  .price_manifest.usd_krw == 1400 and
  .price_manifest.tax_fx_buffer_percent == 10 and
  .price_manifest.billing_reconciliation_max_delay_seconds == 21600 and
  (.price_manifest.skus | map(.service) | sort) ==
    ["ai_provider_input", "ai_provider_output",
     "artifact_registry", "cloud_build", "cloud_logging",
     "cloud_monitoring", "cloud_run_cpu_seoul_tier2",
     "cloud_run_memory_seoul_tier2", "cloud_run_requests",
     "cloud_tasks_operations_seoul", "cloud_trace",
     "firestore_deletes_seoul", "firestore_reads_seoul",
     "firestore_storage_seoul", "firestore_ttl_deletes_seoul",
     "firestore_writes_seoul", "network_egress"] and
  (.price_manifest.skus[] | select(.service == "cloud_run_cpu_seoul_tier2") |
    .catalog_sku_id == "085C-A237-027A") and
  (.price_manifest.skus[] | select(.service == "cloud_run_memory_seoul_tier2") |
    .catalog_sku_id == "600C-3782-6708") and
  (.price_manifest.skus[] | select(.service == "cloud_run_requests") |
    .catalog_sku_id == "2DA5-55D3-E679") and
  all(.price_manifest.skus[];
    (.catalog_sku_id | length) > 0 and
    (.unit | length) > 0 and .unit_price_usd > 0) and
  all(.concurrency_cases[];
    .guarded_total_krw <= 50000 and
    .hard_cutoff_exceeded == false and
    ((.accepted_krw + .rejected_krw) | sort) ==
      (.requests_krw | sort) and
    ([.operations[].operation_id] | unique | length) ==
      (.operations | length) and
    ([.operations[].requested_reservation_krw] | sort) ==
      (.requests_krw | sort) and
    ([.operations[] | select(.decision == "accepted") |
      .requested_reservation_krw] | sort) ==
      (.accepted_krw | sort) and
    ([.operations[] | select(.decision == "rejected") |
      .requested_reservation_krw] | sort) ==
      (.rejected_krw | sort) and
    all(.operations[];
      .decision == "accepted" or .decision == "rejected") and
    (.committed_actual_krw + .active_reservations_before_krw +
      5000 + ((.accepted_krw | add) // 0)) ==
      .guarded_total_krw) and
  all(.concurrency_cases[] | select(.alert_percent == 100);
    .alerts_observed_percent == [50, 75, 90, 100] and
    .kill_switch == true and (.rejected_krw | length) >= 1) and
  (.concurrency_cases[] |
    select(.name == "provider_and_nonprovider_compete") |
    .accepted_krw == [6000, 3000] and .rejected_krw == [2000] and
    .guarded_total_krw == 49000) and
  (.concurrency_cases[] |
    select(.name == "boundary_request_rejected_whole") |
    .requests_krw == [501] and .accepted_krw == [] and
    .rejected_krw == [501] and .guarded_total_krw == 49500) and
  (.settlement_cases | map(.name) | sort) ==
    ["actual_over_reservation_consumes_delayed_reserve",
     "actual_within_reservation"] and
  all(.settlement_cases[];
    .atomic_ledger_version_cas == true and
    (.committed_after_krw + .active_reservation_after_krw +
      .delayed_reserve_after_krw) <=
    (.committed_before_krw + .active_reservation_before_krw +
      .delayed_reserve_before_krw) and
    .committed_after_krw == (.committed_before_krw + .actual_krw) and
    .active_reservation_after_krw == 0) and
  (.settlement_cases[] |
    select(.name == "actual_within_reservation") |
    .actual_krw <= .requested_reservation_krw and
    .unused_reservation_released_krw ==
      (.requested_reservation_krw - .actual_krw) and
    .delayed_reserve_after_krw == .delayed_reserve_before_krw) and
  (.settlement_cases[] |
    select(.name == "actual_over_reservation_consumes_delayed_reserve") |
    .actual_krw > .requested_reservation_krw and
    .overflow_delta_krw == (.actual_krw - .requested_reservation_krw) and
    .delayed_reserve_after_krw ==
      (.delayed_reserve_before_krw - .overflow_delta_krw) and
    .price_manifest_integrity_incident == true) and
  (.fail_closed_cases | map(.name) | sort) ==
    ["billing_reconciliation_over_six_hours", "catalog_sku_missing",
     "fx_snapshot_expired", "price_snapshot_expired"] and
  all(.fail_closed_cases[]; .cost_action_allowed == false) and
  .alert_threshold_percent == [50, 75, 90, 100] and
  .firestore_ttl_free_quota_eligible == false
' "$contract_dir/fixtures/cost-ledger-cases.json" >/dev/null

jq -e '
  .contract_version == "backend-production-cost-hard-cutoff.v1" and
  .billing_month_boundary == "UTC calendar month" and
  .monthly_limits.provider_calls == 5500 and
  .monthly_limits.input_tokens == 20000000 and
  .monthly_limits.output_tokens == 8000000 and
  .monthly_limits.external_cost_krw == 50000 and
  .monthly_limits.delayed_billing_reserve_krw == 5000 and
  .per_operation_limits.input_tokens == 5000 and
  .per_operation_limits.output_tokens == 2000 and
  .per_operation_limits.provider_attempts == 1 and
  .provider_envelope == {
    "ai_provider_input": 0.005,
    "ai_provider_output": 0.002,
    "cloud_run_cpu_seoul_tier2": 60,
    "cloud_run_memory_seoul_tier2": 60,
    "cloud_run_requests": 0.000001,
    "cloud_tasks_operations_seoul": 0.000001,
    "firestore_reads_seoul": 4,
    "firestore_writes_seoul": 4,
    "firestore_deletes_seoul": 2,
    "network_egress": 0.001,
    "cloud_logging": 0.001,
    "cloud_trace": 0.000001,
    "cloud_monitoring": 0.000001
  } and
  (.operation_kind_envelopes | keys | sort) ==
    ["authentication", "build", "egress", "firestore", "logging",
     "privacy_cleanup", "runtime", "tasks", "ttl_delete"] and
  all(.operation_kind_envelopes[];
    (keys | length) > 0 and all(.[]; type == "number" and . > 0)) and
  .operation_kind_envelopes.privacy_cleanup.firestore_deletes_seoul == 2 and
  .operation_kind_envelopes.privacy_cleanup.firestore_ttl_deletes_seoul == 1 and
  .operation_kind_envelopes.authentication.firestore_reads_seoul == 1 and
  .operation_kind_envelopes.logging.cloud_logging == 0.001 and
  (.required_fail_closed_gates | sort) ==
    ["atomic_ledger", "billing_reconciliation", "fx_snapshot",
     "price_manifest", "required_telemetry"] and
  (.forbidden_telemetry_fields | sort) ==
    ["access_token", "attestation_proof", "authorization", "prompt",
     "provider_raw_response", "recipe", "transcript"] and
  .external_activation == false
' "$contract_dir/fixtures/production-cost-hard-cutoffs.json" >/dev/null

jq -e '
  (.cases | map(.name) | sort) ==
    ["openai_korea_storage_cross_border_approved",
     "openai_korea_storage_cross_border_not_approved",
     "processing_boundary_unknown", "vertex_eu_cache_enabled",
     "vertex_eu_processing_approved", "vertex_global_endpoint_forbidden"] and
  (.cases[] |
    select(.name == "openai_korea_storage_cross_border_approved") |
    .storage_region == "KR" and
    .regional_processing_supported == false and
    .processing_boundary == "outside_KR_possible" and
    .cross_border_processing_approved == true and
    .mam_or_zdr == true and .modified_retention_amendment == true and
    .activation_allowed == true) and
  (.cases[] |
    select(.name == "openai_korea_storage_cross_border_not_approved") |
    .activation_allowed == false) and
  (.cases[] | select(.processing_boundary == "unknown") |
    .activation_allowed == false) and
  (.cases[] | select(.name == "vertex_eu_processing_approved") |
    .storage_region == "EU" and
    .regional_processing_supported == true and
    .processing_boundary == "EU" and .endpoint == "eu" and
    .abuse_monitoring_exception == true and
    .cache_and_optional_storage_disabled == true and
    .activation_allowed == true) and
  (.cases[] | select(.endpoint == "global") |
    .activation_allowed == false) and
  (.cases[] | select(.cache_and_optional_storage_disabled == false) |
    .activation_allowed == false)
' "$contract_dir/fixtures/provider-region-gate-cases.json" >/dev/null

echo "security privacy observability contract validation: PASS"
