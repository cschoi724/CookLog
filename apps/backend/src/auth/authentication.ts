import type { FastifyReply, FastifyRequest } from "fastify";

import { sendProblem } from "../http/common-http.js";
import { isUuidV4, type PublicErrorCode } from "../http/public-errors.js";
import {
  InstallationTokenError,
  type InstallationTokenClaims,
  type InstallationTokenService,
} from "./installation-token.js";

export interface AuthenticatedInstallation {
  readonly installationId: string;
  readonly tokenClaims: InstallationTokenClaims;
}

const authenticationContexts = new WeakMap<FastifyRequest, AuthenticatedInstallation>();

export function getAuthenticatedInstallation(request: FastifyRequest): AuthenticatedInstallation | undefined {
  return authenticationContexts.get(request);
}

function readSingleHeader(request: FastifyRequest, name: string): string | undefined {
  const value = request.headers[name];
  return typeof value === "string" ? value : undefined;
}

function readBearerToken(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const match = /^Bearer ([^\s]+)$/u.exec(value);
  return match?.[1];
}

export function createAuthenticationGuard(tokenService: InstallationTokenService) {
  return async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const installationId = readSingleHeader(request, "cooklog-installation-id");
    const token = readBearerToken(readSingleHeader(request, "authorization"));
    if (installationId === undefined || !isUuidV4(installationId) || token === undefined) {
      sendProblem(request, reply, "AUTH_REQUIRED");
      return;
    }

    try {
      const tokenClaims = await tokenService.verify(token);
      if (tokenClaims.sub !== installationId) {
        sendProblem(request, reply, "AUTH_REQUIRED");
        return;
      }
      authenticationContexts.set(request, { installationId, tokenClaims });
    } catch (error) {
      const code: PublicErrorCode = error instanceof InstallationTokenError
        ? error.code
        : "AUTH_REQUIRED";
      sendProblem(request, reply, code);
    }
  };
}
