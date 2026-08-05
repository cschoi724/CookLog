import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import {
  InMemoryRawMetadataRepository,
  RAW_METADATA_CRITICAL_AT_MS,
  RAW_METADATA_DELETE_AFTER_MS,
  RAW_METADATA_EXPIRES_AT_MS,
  RAW_METADATA_INCIDENT_AT_MS,
  RAW_METADATA_RETRY_STOPS_AT_MS,
  RAW_METADATA_SWEEPER_INTERVAL_MS,
  RAW_METADATA_WARNING_AT_MS,
  REQUIRED_RAW_METADATA_SINKS,
  type RawMetadataSinkId,
} from "../../src/cleanup/raw-metadata-cleanup.js";

interface RetentionFixture {
  readonly created_at: string;
  readonly delete_after: string;
  readonly warning_at: string;
  readonly critical_at: string;
  readonly incident_at: string;
  readonly cleanup_retry_stops_at: string;
  readonly expires_at: string;
  readonly sweeper_interval_seconds: number;
  readonly required_sinks: readonly RawMetadataSinkId[];
  readonly cases: readonly {
    readonly name: string;
    readonly fault: string;
    readonly receipt_sink_ids: readonly RawMetadataSinkId[];
    readonly read_after_expiry: boolean;
    readonly export_after_expiry: boolean;
    readonly aggregate_input_after_expiry: boolean;
    readonly sync_delete_attempted_at_expiry: boolean;
  }[];
}

async function retentionFixture(): Promise<RetentionFixture> {
  return JSON.parse(await readFile(
    resolve(process.cwd(), "contracts/security/fixtures/raw-metadata-retention-cases.json"),
    "utf8",
  )) as RetentionFixture;
}

test("raw metadata deadlines and required sinks exactly match the approved fixture", async () => {
  const fixture = await retentionFixture();
  const createdAt = Date.parse(fixture.created_at);
  assert.equal(Date.parse(fixture.delete_after) - createdAt, RAW_METADATA_DELETE_AFTER_MS);
  assert.equal(Date.parse(fixture.warning_at) - createdAt, RAW_METADATA_WARNING_AT_MS);
  assert.equal(Date.parse(fixture.critical_at) - createdAt, RAW_METADATA_CRITICAL_AT_MS);
  assert.equal(Date.parse(fixture.incident_at) - createdAt, RAW_METADATA_INCIDENT_AT_MS);
  assert.equal(Date.parse(fixture.cleanup_retry_stops_at) - createdAt, RAW_METADATA_RETRY_STOPS_AT_MS);
  assert.equal(Date.parse(fixture.expires_at) - createdAt, RAW_METADATA_EXPIRES_AT_MS);
  assert.equal(fixture.sweeper_interval_seconds * 1_000, RAW_METADATA_SWEEPER_INTERVAL_MS);
  assert.deepEqual(REQUIRED_RAW_METADATA_SINKS, fixture.required_sinks);
});

test("normal, missing task, worker crash, queue outage, sink failure, and TTL delay all recover through explicit cleanup", async () => {
  const fixture = await retentionFixture();
  for (const fixtureCase of fixture.cases) {
    let now = Date.parse(fixture.created_at);
    const repository = new InMemoryRawMetadataRepository({ now: () => now });
    const recordId = repository.create(7);
    assert.ok(recordId, fixtureCase.name);
    if (recordId === undefined) continue;

    if (fixtureCase.fault === "outbox_delivery_missing") repository.dropOutbox(recordId);
    if (fixtureCase.fault === "cleanup_queue_unavailable") repository.setQueueAvailable(false);
    if (fixtureCase.fault === "one_sink_transient_delete_failure") {
      repository.failSinkDeletes("error_tracker", 1);
    }
    now += RAW_METADATA_DELETE_AFTER_MS;

    if (fixtureCase.fault === "worker_crash_after_partial_receipts") {
      assert.equal(repository.runDueCleanup(2), 0);
      assert.equal(repository.snapshot(recordId)?.receiptSinkIds.length, 2);
    } else {
      repository.runDueCleanup();
    }
    if (repository.snapshot(recordId)?.deleted !== true) repository.runIndependentSweeper();

    assert.equal(repository.snapshot(recordId)?.deleted, true, fixtureCase.name);
    assert.equal(repository.snapshot(recordId)?.receiptsComplete, true, fixtureCase.name);
    assert.deepEqual(repository.snapshot(recordId)?.receiptSinkIds, fixtureCase.receipt_sink_ids, fixtureCase.name);
    assert.deepEqual(repository.receipts(recordId).map((receipt) => receipt.sink_id), fixtureCase.receipt_sink_ids);

    now = Date.parse(fixture.expires_at);
    assert.equal(repository.access(recordId, "read") !== undefined, fixtureCase.read_after_expiry);
    assert.equal(repository.access(recordId, "export") !== undefined, fixtureCase.export_after_expiry);
    assert.equal(repository.access(recordId, "aggregate") !== undefined, fixtureCase.aggregate_input_after_expiry);
    assert.equal((repository.snapshot(recordId)?.syncDeleteAttempts ?? 0) > 0,
      fixtureCase.sync_delete_attempted_at_expiry);
  }
});

test("30-day access gate denies data even while a required sink keeps failing", async () => {
  const fixture = await retentionFixture();
  let now = Date.parse(fixture.created_at);
  const repository = new InMemoryRawMetadataRepository({ now: () => now });
  const recordId = repository.create(11);
  assert.ok(recordId);
  if (recordId === undefined) return;
  repository.failSinkDeletes("backup", 20);

  now += RAW_METADATA_EXPIRES_AT_MS;
  assert.equal(repository.access(recordId, "read"), undefined);
  assert.equal(repository.access(recordId, "export"), undefined);
  assert.equal(repository.access(recordId, "aggregate"), undefined);
  assert.equal(repository.snapshot(recordId)?.deleted, false);
  assert.equal(repository.snapshot(recordId)?.receiptsComplete, false);
  assert.equal(repository.snapshot(recordId)?.state, "expired");
  assert.equal(repository.newRawEventsBlocked(), true);
});

test("warning, critical, incident, and final cleanup states use injected server time", async () => {
  const fixture = await retentionFixture();
  let now = Date.parse(fixture.created_at);
  const repository = new InMemoryRawMetadataRepository({ now: () => now });
  const recordId = repository.create();
  assert.ok(recordId);
  if (recordId === undefined) return;

  const states: readonly [number, string, boolean][] = [
    [0, "active", false],
    [RAW_METADATA_DELETE_AFTER_MS, "cleanup_due", false],
    [RAW_METADATA_WARNING_AT_MS, "warning", false],
    [RAW_METADATA_CRITICAL_AT_MS, "critical", true],
    [RAW_METADATA_INCIDENT_AT_MS, "incident", true],
    [RAW_METADATA_RETRY_STOPS_AT_MS, "final_cleanup", true],
    [RAW_METADATA_EXPIRES_AT_MS, "expired", true],
  ];
  const createdAt = now;
  for (const [offset, state, blocked] of states) {
    now = createdAt + offset;
    assert.equal(repository.snapshot(recordId)?.state, state);
    assert.equal(repository.newRawEventsBlocked(), blocked);
  }
  assert.equal(repository.create(), undefined);
});
