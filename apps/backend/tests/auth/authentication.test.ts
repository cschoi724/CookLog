import assert from "node:assert/strict";
import test from "node:test";
import Fastify from "fastify";

import {
  AttestationVerificationError,
  LocalAttestationVerifier,
} from "../../src/auth/attestation.js";
import {
  createAuthenticationGuard,
  getAuthenticatedInstallation,
} from "../../src/auth/authentication.js";
import {
  InstallationTokenError,
  LocalInstallationTokenService,
} from "../../src/auth/installation-token.js";
import { installCommonHttp, sendSuccess } from "../../src/http/common-http.js";

const installationId = "97882b04-fbb9-4c4b-8b71-a1c71a76a593";
const appId = "app.cooklog.ios";

async function verifiedAttestation() {
  const verifier = new LocalAttestationVerifier({
    runtimeEnvironment: "test",
    acceptedProof: "local-proof",
    allowedAppIds: [appId],
    now: () => new Date("2026-08-05T00:00:00Z"),
  });
  return verifier.verify({
    provider: "apple_app_attest",
    appId,
    environment: "production",
    installationId,
    proof: "local-proof",
  });
}

test("local attestation fake is non-production, allowlisted, and replay protected", async () => {
  const verifier = new LocalAttestationVerifier({
    runtimeEnvironment: "test",
    acceptedProof: "proof-not-for-logs",
    allowedAppIds: [appId],
  });
  const input = {
    provider: "apple_app_attest" as const,
    appId,
    environment: "production" as const,
    installationId,
    proof: "proof-not-for-logs",
  };
  assert.equal((await verifier.verify(input)).replayProtected, true);
  await assert.rejects(verifier.verify(input), (error: unknown) => {
    assert.ok(error instanceof AttestationVerificationError);
    assert.equal(error.code, "ATTESTATION_REPLAYED");
    assert.equal(error.message.includes(input.proof), false);
    return true;
  });
  assert.throws(() => new LocalAttestationVerifier({
    runtimeEnvironment: "production",
    acceptedProof: "proof-not-for-logs",
    allowedAppIds: [appId],
  }), AttestationVerificationError);
});

test("local installation tokens expire and revoke without exposing the token", async () => {
  let now = 1_786_000_000;
  const service = new LocalInstallationTokenService({ ttlSeconds: 10, nowSeconds: () => now });
  const issued = service.issue(await verifiedAttestation());
  assert.equal((await service.verify(issued.accessToken)).sub, installationId);
  now += 10;
  await assert.rejects(service.verify(issued.accessToken), (error: unknown) => {
    assert.ok(error instanceof InstallationTokenError);
    assert.equal(error.code, "TOKEN_EXPIRED");
    assert.equal(error.message.includes(issued.accessToken), false);
    return true;
  });

  now -= 10;
  const active = service.issue(await verifiedAttestation());
  service.revokeInstallation(installationId);
  await assert.rejects(service.verify(active.accessToken), (error: unknown) => {
    assert.ok(error instanceof InstallationTokenError);
    assert.equal(error.code, "INSTALLATION_REVOKED");
    return true;
  });
});

test("authentication guard rejects missing and mismatched credentials before the handler", async () => {
  const service = new LocalInstallationTokenService();
  const issued = service.issue(await verifiedAttestation());
  const app = Fastify({ logger: false });
  installCommonHttp(app);
  let handlerCalls = 0;
  app.get("/v1/protected", { preHandler: createAuthenticationGuard(service) }, (request, reply) => {
    handlerCalls += 1;
    sendSuccess(request, reply, { installation_id: getAuthenticatedInstallation(request)?.installationId });
  });

  const missing = await app.inject({ method: "GET", url: "/v1/protected" });
  assert.equal(missing.statusCode, 401);
  assert.equal(missing.json().code, "AUTH_REQUIRED");

  const mismatched = await app.inject({
    method: "GET",
    url: "/v1/protected",
    headers: {
      authorization: `Bearer ${issued.accessToken}`,
      "cooklog-installation-id": "ee674819-3908-4c91-9407-0964ca3dbd06",
    },
  });
  assert.equal(mismatched.statusCode, 401);
  assert.equal(mismatched.body.includes(issued.accessToken), false);
  assert.equal(handlerCalls, 0);

  const accepted = await app.inject({
    method: "GET",
    url: "/v1/protected",
    headers: {
      authorization: `Bearer ${issued.accessToken}`,
      "cooklog-installation-id": installationId,
    },
  });
  assert.equal(accepted.statusCode, 200);
  assert.equal(accepted.json().data.installation_id, installationId);
  assert.equal(handlerCalls, 1);
  await app.close();
});
