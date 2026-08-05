export type RemoteSTTReleaseMode = "disabled";

export interface RemoteSTTReleaseConfig {
  readonly profile: "first_public_release";
  readonly mode: RemoteSTTReleaseMode;
  readonly upload_route_registered: false;
  readonly provider_configured: false;
  readonly audio_egress_allowed: false;
  readonly automatic_fallback: false;
  readonly activation_requires_new_approval: true;
}

export class RemoteSTTConfigError extends Error {
  readonly code = "REMOTE_STT_CONFIG_INVALID";

  constructor(message: string) {
    super(message);
    this.name = "RemoteSTTConfigError";
  }
}

const disabledBooleanSettings = [
  "COOKLOG_REMOTE_STT_ENABLED",
  "COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED",
  "COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED",
  "COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED",
  "COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK",
] as const;

const forbiddenConnectionSettings = [
  "COOKLOG_REMOTE_STT_PROVIDER",
  "COOKLOG_REMOTE_STT_ENDPOINT",
  "COOKLOG_REMOTE_STT_EGRESS_DESTINATION",
  "COOKLOG_REMOTE_STT_API_KEY",
  "REMOTE_STT_PROVIDER",
  "REMOTE_STT_ENDPOINT",
  "REMOTE_STT_API_KEY",
] as const;

const recognizedSettings = new Set<string>([
  "COOKLOG_REMOTE_STT_MODE",
  ...disabledBooleanSettings,
  "COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL",
  ...forbiddenConnectionSettings,
]);

export const FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG: RemoteSTTReleaseConfig = Object.freeze({
  profile: "first_public_release",
  mode: "disabled",
  upload_route_registered: false,
  provider_configured: false,
  audio_egress_allowed: false,
  automatic_fallback: false,
  activation_requires_new_approval: true,
});

function configuredValue(environment: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = environment[key]?.trim();
  return value === undefined || value.length === 0 ? undefined : value;
}

export function validateRemoteSTTEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
): RemoteSTTReleaseConfig {
  for (const [key, rawValue] of Object.entries(environment)) {
    if (
      rawValue !== undefined &&
      rawValue.trim().length > 0 &&
      (key.startsWith("COOKLOG_REMOTE_STT_") || key.startsWith("REMOTE_STT_")) &&
      !recognizedSettings.has(key)
    ) {
      throw new RemoteSTTConfigError(`${key} is not an approved remote STT setting`);
    }
  }

  const mode = configuredValue(environment, "COOKLOG_REMOTE_STT_MODE");
  if (mode !== undefined && mode !== "disabled") {
    throw new RemoteSTTConfigError("COOKLOG_REMOTE_STT_MODE must remain disabled");
  }

  for (const key of disabledBooleanSettings) {
    const value = configuredValue(environment, key);
    if (value !== undefined && value !== "false") {
      throw new RemoteSTTConfigError(`${key} must remain false`);
    }
  }

  const approvalRequired = configuredValue(
    environment,
    "COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL",
  );
  if (approvalRequired !== undefined && approvalRequired !== "true") {
    throw new RemoteSTTConfigError(
      "COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL must remain true",
    );
  }

  for (const key of forbiddenConnectionSettings) {
    if (configuredValue(environment, key) !== undefined) {
      throw new RemoteSTTConfigError(`${key} is forbidden while remote STT is disabled`);
    }
  }

  return FIRST_PUBLIC_RELEASE_REMOTE_STT_CONFIG;
}
