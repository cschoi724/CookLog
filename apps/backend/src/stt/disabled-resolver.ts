import {
  FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG,
  validateRemoteSTTEnvironment,
  type RemoteSTTReleaseConfig,
} from "../config/remote-stt-config.js";
import {
  evaluateRemoteSTTActivation,
  type RemoteSTTAttempt,
  type RemoteSTTDisabledDecision,
} from "./activation-gate.js";

export interface DisabledRemoteSTTAdapter {
  readonly mode: "disabled";
  evaluate(attempt: RemoteSTTAttempt): RemoteSTTDisabledDecision;
}

const disabledAdapter: DisabledRemoteSTTAdapter = Object.freeze({
  mode: "disabled",
  evaluate(attempt: RemoteSTTAttempt): RemoteSTTDisabledDecision {
    return evaluateRemoteSTTActivation(FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG, attempt);
  },
});

export function resolveRemoteSTTAdapter(
  environment: NodeJS.ProcessEnv = process.env,
): DisabledRemoteSTTAdapter {
  validateRemoteSTTEnvironment(environment);
  return disabledAdapter;
}

export function resolveRemoteSTTReleaseConfig(
  environment: NodeJS.ProcessEnv = process.env,
): RemoteSTTReleaseConfig {
  return validateRemoteSTTEnvironment(environment);
}
