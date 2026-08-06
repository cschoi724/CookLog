export const REQUIRED_EXTERNAL_COST_SERVICES = Object.freeze([
  "ai_provider_input",
  "ai_provider_output",
  "cloud_run_cpu_seoul_tier2",
  "cloud_run_memory_seoul_tier2",
  "cloud_run_requests",
  "cloud_tasks_operations_seoul",
  "firestore_reads_seoul",
  "firestore_writes_seoul",
  "firestore_deletes_seoul",
  "firestore_ttl_deletes_seoul",
  "firestore_storage_seoul",
  "network_egress",
  "cloud_logging",
  "cloud_trace",
  "cloud_monitoring",
  "cloud_build",
  "artifact_registry",
] as const);

export interface PriceManifestSku {
  readonly service: string;
  readonly catalog_sku_id: string;
  readonly unit: string;
  readonly unit_price_usd?: number;
  readonly unit_price_krw?: number;
}

export interface PriceManifest {
  readonly effective_at: string;
  readonly expires_at: string;
  readonly usd_krw: number;
  readonly tax_fx_buffer_percent: number;
  readonly billing_reconciliation_max_delay_seconds: number;
  readonly fixture_only?: boolean;
  readonly skus: readonly PriceManifestSku[];
}

export type PriceManifestDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: "PRICE_SNAPSHOT_EXPIRED" | "CATALOG_SKU_MISSING" | "FX_SNAPSHOT_INVALID" | "BILLING_RECONCILIATION_STALE" | "MANIFEST_INVALID" };

const MAX_SERVER_EPOCH_MS = 8_640_000_000_000_000;

function isValidServerEpoch(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0 && value <= MAX_SERVER_EPOCH_MS;
}

function timestamp(value: string): number | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/u.exec(value);
  if (match === null) return undefined;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return undefined;
  const date = new Date(parsed);
  const parts = match.slice(1).map(Number);
  return date.getUTCFullYear() === parts[0] && date.getUTCMonth() + 1 === parts[1] &&
    date.getUTCDate() === parts[2] && date.getUTCHours() === parts[3] &&
    date.getUTCMinutes() === parts[4] && date.getUTCSeconds() === parts[5]
    ? parsed
    : undefined;
}

export function validatePriceManifest(options: {
  readonly manifest: PriceManifest;
  readonly now: number;
  readonly lastReconciledAt: number;
}): PriceManifestDecision {
  if (!isValidServerEpoch(options.now)) {
    return { allowed: false, reason: "MANIFEST_INVALID" };
  }
  if (!isValidServerEpoch(options.lastReconciledAt)) {
    return { allowed: false, reason: "BILLING_RECONCILIATION_STALE" };
  }
  const effectiveAt = timestamp(options.manifest.effective_at);
  const expiresAt = timestamp(options.manifest.expires_at);
  if (effectiveAt === undefined || expiresAt === undefined || effectiveAt >= expiresAt ||
    options.now < effectiveAt) return { allowed: false, reason: "MANIFEST_INVALID" };
  if (options.now >= expiresAt) return { allowed: false, reason: "PRICE_SNAPSHOT_EXPIRED" };
  if (!Number.isFinite(options.manifest.usd_krw) || options.manifest.usd_krw <= 0 ||
    options.manifest.tax_fx_buffer_percent !== 10 || options.now - effectiveAt > 31 * 86_400_000) {
    return { allowed: false, reason: "FX_SNAPSHOT_INVALID" };
  }
  if (!Number.isSafeInteger(options.manifest.billing_reconciliation_max_delay_seconds) ||
    options.manifest.billing_reconciliation_max_delay_seconds !== 21_600 ||
    options.now - options.lastReconciledAt > 21_600_000 ||
    options.lastReconciledAt > options.now) {
    return { allowed: false, reason: "BILLING_RECONCILIATION_STALE" };
  }
  const skuByService = new Map(options.manifest.skus.map((sku) => [sku.service, sku]));
  if (skuByService.size !== options.manifest.skus.length ||
    options.manifest.skus.length !== REQUIRED_EXTERNAL_COST_SERVICES.length) {
    return { allowed: false, reason: "CATALOG_SKU_MISSING" };
  }
  for (const service of REQUIRED_EXTERNAL_COST_SERVICES) {
    const sku = skuByService.get(service);
    const usd = sku?.unit_price_usd;
    const krw = sku?.unit_price_krw;
    if (sku === undefined || sku.catalog_sku_id.trim().length === 0 || sku.unit.trim().length === 0 ||
      ((usd === undefined || !Number.isFinite(usd) || usd <= 0) &&
        (krw === undefined || !Number.isFinite(krw) || krw <= 0))) {
      return { allowed: false, reason: "CATALOG_SKU_MISSING" };
    }
  }
  return { allowed: true };
}

export function calculateReservationKrw(
  manifest: PriceManifest,
  quantities: Readonly<Record<string, number>>,
): number | undefined {
  const skuByService = new Map(manifest.skus.map((sku) => [sku.service, sku]));
  let totalKrw = 0;
  for (const [service, quantity] of Object.entries(quantities)) {
    if (!Number.isFinite(quantity) || quantity < 0) return undefined;
    const sku = skuByService.get(service);
    if (sku === undefined) return undefined;
    const baseKrw = sku.unit_price_krw !== undefined
      ? quantity * sku.unit_price_krw
      : sku.unit_price_usd !== undefined
        ? quantity * sku.unit_price_usd * manifest.usd_krw
        : undefined;
    if (baseKrw === undefined || !Number.isFinite(baseKrw)) return undefined;
    totalKrw += baseKrw;
  }
  return Math.ceil(totalKrw * (1 + manifest.tax_fx_buffer_percent / 100));
}
