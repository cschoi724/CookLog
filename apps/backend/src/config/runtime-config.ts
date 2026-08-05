export type RuntimeEnvironment = "local" | "test" | "production";

export interface RuntimeConfig {
  readonly environment: RuntimeEnvironment;
  readonly host: string;
  readonly port: number;
  readonly shutdownTimeoutMs: number;
  readonly serviceName: "cooklog-backend";
}

export class RuntimeConfigError extends Error {
  readonly code = "RUNTIME_CONFIG_INVALID";

  constructor(message: string) {
    super(message);
    this.name = "RuntimeConfigError";
  }
}

const productionRequiredKeys = [
  "PORT",
  "K_SERVICE",
  "K_REVISION",
  "K_CONFIGURATION",
] as const;

const productionForbiddenKeys = [
  "OPENAI_API_KEY",
  "GOOGLE_APPLICATION_CREDENTIALS",
  "COOKLOG_ALLOW_INSECURE_CONFIG",
] as const;

function readEnvironment(value: string | undefined): RuntimeEnvironment {
  const environment = value ?? "local";
  if (environment === "local" || environment === "test" || environment === "production") {
    return environment;
  }

  throw new RuntimeConfigError("COOKLOG_ENV must be local, test, or production");
}

function readInteger(
  key: string,
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const resolved = value ?? String(fallback);
  if (!/^\d+$/.test(resolved)) {
    throw new RuntimeConfigError(`${key} must be an integer`);
  }

  const parsed = Number(resolved);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new RuntimeConfigError(`${key} must be between ${minimum} and ${maximum}`);
  }

  return parsed;
}

function hasValue(environment: NodeJS.ProcessEnv, key: string): boolean {
  const value = environment[key];
  return value !== undefined && value.trim().length > 0;
}

function validateProductionEnvironment(environment: NodeJS.ProcessEnv): void {
  for (const key of productionRequiredKeys) {
    if (!hasValue(environment, key)) {
      throw new RuntimeConfigError(`production requires ${key}`);
    }
  }

  for (const key of productionForbiddenKeys) {
    if (hasValue(environment, key)) {
      throw new RuntimeConfigError(`production forbids ${key}`);
    }
  }
}

export function loadRuntimeConfig(environment: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const runtimeEnvironment = readEnvironment(environment["COOKLOG_ENV"]);

  if (environment["COOKLOG_REMOTE_STT_ENABLED"] === "true") {
    throw new RuntimeConfigError("remote STT cannot be enabled in the foundation runtime");
  }

  if (runtimeEnvironment === "production") {
    validateProductionEnvironment(environment);
  }

  const configuredHost = environment["HOST"];
  if (runtimeEnvironment === "production" && configuredHost !== undefined && configuredHost !== "0.0.0.0") {
    throw new RuntimeConfigError("production HOST must be 0.0.0.0");
  }

  return Object.freeze({
    environment: runtimeEnvironment,
    host: runtimeEnvironment === "production" ? "0.0.0.0" : (configuredHost ?? "127.0.0.1"),
    port: readInteger("PORT", environment["PORT"], 8080, runtimeEnvironment === "test" ? 0 : 1, 65535),
    shutdownTimeoutMs: readInteger(
      "SHUTDOWN_TIMEOUT_MS",
      environment["SHUTDOWN_TIMEOUT_MS"],
      8_000,
      1_000,
      9_000,
    ),
    serviceName: "cooklog-backend",
  });
}
