import type { FastifyInstance } from "fastify";

import { sendProblem } from "../http/common-http.js";

function isRemoteSTTPath(rawUrl: string): boolean {
  const encodedPathname = new URL(rawUrl, "http://cooklog.invalid").pathname;
  let pathname: string;
  try {
    pathname = decodeURIComponent(encodedPathname);
  } catch {
    return encodedPathname === "/v1/stt" || encodedPathname.startsWith("/v1/stt/");
  }
  return pathname === "/v1/stt" || pathname.startsWith("/v1/stt/");
}

export function installDisabledRemoteSTTHttpBoundary(app: FastifyInstance): void {
  app.addHook("onRequest", async (request, reply) => {
    if (isRemoteSTTPath(request.url)) {
      sendProblem(request, reply, "SERVICE_DISABLED");
    }
  });
}
