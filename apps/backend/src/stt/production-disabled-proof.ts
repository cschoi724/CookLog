import { types as utilTypes } from "node:util";

export interface ProductionRemoteSTTDisabledProof {
  readonly contract_version: "remote-stt-production-disabled-proof.v1";
  readonly release_profile: "first_public_release";
  readonly activation_policy: "new_approved_policy_task_required";
  readonly runtime_capabilities: {
    readonly upload_routes_registered: 0;
    readonly audio_body_parsers_registered: 0;
    readonly queue_publishers_registered: 0;
    readonly audio_storage_adapters_registered: 0;
    readonly providers_registered: 0;
    readonly audio_egress_destinations_configured: 0;
    readonly automatic_fallbacks_registered: 0;
  };
  readonly image_contract: {
    readonly dockerfile: "Dockerfile";
    readonly runtime_base: "node:24.18.0-bookworm-slim";
    readonly runtime_user: "node";
    readonly runtime_entrypoint: "node dist/src/app/server.js";
    readonly remote_stt_environment_settings: 0;
    readonly runtime_audio_assets: 0;
  };
  readonly deployment_contract: {
    readonly manifest_policy: "absent_or_explicitly_disabled";
    readonly allowed_mode: "disabled";
    readonly upload_route_registered: false;
    readonly provider_configured: false;
    readonly audio_egress_allowed: false;
    readonly automatic_fallback: false;
  };
}

export class ProductionRemoteSTTProofError extends Error {
  readonly code = "REMOTE_STT_PRODUCTION_PROOF_INVALID";

  constructor() {
    super("production remote STT disabled proof is invalid");
    this.name = "ProductionRemoteSTTProofError";
  }
}

export const PRODUCTION_REMOTE_STT_DISABLED_PROOF: ProductionRemoteSTTDisabledProof =
  deepFreeze({
    contract_version: "remote-stt-production-disabled-proof.v1",
    release_profile: "first_public_release",
    activation_policy: "new_approved_policy_task_required",
    runtime_capabilities: {
      upload_routes_registered: 0,
      audio_body_parsers_registered: 0,
      queue_publishers_registered: 0,
      audio_storage_adapters_registered: 0,
      providers_registered: 0,
      audio_egress_destinations_configured: 0,
      automatic_fallbacks_registered: 0,
    },
    image_contract: {
      dockerfile: "Dockerfile",
      runtime_base: "node:24.18.0-bookworm-slim",
      runtime_user: "node",
      runtime_entrypoint: "node dist/src/app/server.js",
      remote_stt_environment_settings: 0,
      runtime_audio_assets: 0,
    },
    deployment_contract: {
      manifest_policy: "absent_or_explicitly_disabled",
      allowed_mode: "disabled",
      upload_route_registered: false,
      provider_configured: false,
      audio_egress_allowed: false,
      automatic_fallback: false,
    },
  });

export function validateProductionRemoteSTTDisabledProof(input: unknown):
ProductionRemoteSTTDisabledProof {
  if (!matchesExactPlainData(input, PRODUCTION_REMOTE_STT_DISABLED_PROOF)) {
    throw new ProductionRemoteSTTProofError();
  }
  return PRODUCTION_REMOTE_STT_DISABLED_PROOF;
}

function matchesExactPlainData(input: unknown, expected: unknown): boolean {
  if (typeof expected !== "object" || expected === null) return Object.is(input, expected);
  if (typeof input !== "object" || input === null || utilTypes.isProxy(input)) return false;
  try {
    if (Object.getPrototypeOf(input) !== Object.prototype) return false;
    const expectedRecord = expected as Readonly<Record<string, unknown>>;
    const expectedKeys = Object.keys(expectedRecord);
    const inputKeys = Reflect.ownKeys(input);
    if (inputKeys.length !== expectedKeys.length || inputKeys.some((key) =>
      typeof key !== "string" || !Object.hasOwn(expectedRecord, key))) return false;
    for (const key of expectedKeys) {
      const descriptor = Object.getOwnPropertyDescriptor(input, key);
      if (descriptor === undefined || !("value" in descriptor) || descriptor.enumerable !== true ||
        !matchesExactPlainData(descriptor.value, expectedRecord[key])) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function deepFreeze<T extends object>(value: T): T {
  for (const child of Object.values(value)) {
    if (typeof child === "object" && child !== null) deepFreeze(child);
  }
  return Object.freeze(value);
}
