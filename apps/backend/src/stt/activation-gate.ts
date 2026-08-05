import type { RemoteSTTReleaseConfig } from "../config/remote-stt-config.js";

export type RemoteSTTAttempt = "direct_upload" | "automatic_remote_fallback";

export interface DisabledRemoteSTTEffects {
  readonly routesRegistered: 0;
  readonly bodyReads: 0;
  readonly temporaryObjectsCreated: 0;
  readonly queueMessagesCreated: 0;
  readonly providerCalls: 0;
  readonly egressCalls: 0;
}

export interface RemoteSTTDisabledDecision {
  readonly allowed: false;
  readonly decision: "reject_before_body_read";
  readonly publicCode: "SERVICE_DISABLED";
  readonly retryable: false;
  readonly effects: DisabledRemoteSTTEffects;
}

const ZERO_EFFECTS: DisabledRemoteSTTEffects = Object.freeze({
  routesRegistered: 0,
  bodyReads: 0,
  temporaryObjectsCreated: 0,
  queueMessagesCreated: 0,
  providerCalls: 0,
  egressCalls: 0,
});

const DISABLED_DECISION: RemoteSTTDisabledDecision = Object.freeze({
  allowed: false,
  decision: "reject_before_body_read",
  publicCode: "SERVICE_DISABLED",
  retryable: false,
  effects: ZERO_EFFECTS,
});

export function evaluateRemoteSTTActivation(
  config: RemoteSTTReleaseConfig,
  _attempt: RemoteSTTAttempt,
): RemoteSTTDisabledDecision {
  if (
    config.profile !== "first_public_release" ||
    config.mode !== "disabled" ||
    config.upload_route_registered !== false ||
    config.provider_configured !== false ||
    config.audio_egress_allowed !== false ||
    config.automatic_fallback !== false ||
    config.activation_requires_new_approval !== true
  ) {
    throw new Error("remote STT release config violated the disabled boundary");
  }

  return DISABLED_DECISION;
}
