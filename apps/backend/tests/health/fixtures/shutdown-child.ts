import { Agent, get } from "node:http";

import { startServer } from "../../../src/app/server.js";
import { loadRuntimeConfig } from "../../../src/config/runtime-config.js";

type Scenario = "normal" | "hanging" | "keep-alive" | "repeated";

function readScenario(value: string | undefined): Scenario {
  if (value === "normal" || value === "hanging" || value === "keep-alive" || value === "repeated") {
    return value;
  }

  throw new Error("shutdown child requires a known scenario");
}

async function openKeepAliveConnection(origin: string): Promise<Agent> {
  const agent = new Agent({ keepAlive: true, maxSockets: 1 });

  await new Promise<void>((resolve, reject) => {
    const request = get(`${origin}/healthz`, { agent }, (response) => {
      response.resume();
      response.once("end", resolve);
    });
    request.once("error", reject);
  });

  return agent;
}

const scenario = readScenario(process.argv[2]);
const config = loadRuntimeConfig({
  COOKLOG_ENV: "test",
  PORT: "0",
  SHUTDOWN_TIMEOUT_MS: "1000",
});
const app = await startServer(config);

if (scenario === "hanging" || scenario === "repeated") {
  Object.defineProperty(app, "close", {
    configurable: true,
    value: () => new Promise<undefined>(() => undefined),
  });
}

let keepAliveAgent: Agent | undefined;
if (scenario === "keep-alive") {
  keepAliveAgent = await openKeepAliveConnection(app.listeningOrigin);
}

process.stdout.write(`READY ${scenario}\n`);

// Keep the agent strongly referenced until the signal handler terminates the process.
void keepAliveAgent;
