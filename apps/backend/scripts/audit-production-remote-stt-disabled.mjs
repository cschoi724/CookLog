import { readFile, readdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const backendDirectory = resolve(scriptDirectory, "..");
const repositoryDirectory = resolve(backendDirectory, "../..");

function fail(message) {
  process.stderr.write(`production remote STT audit failed: ${message}\n`);
  process.exit(1);
}

function requireMatch(contents, pattern, message) {
  if (!pattern.test(contents)) fail(message);
}

function forbidMatch(contents, pattern, message) {
  if (pattern.test(contents)) fail(message);
}

async function filesBelow(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && [".git", "dist", "node_modules"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await filesBelow(path));
    else if (entry.isFile()) found.push(path);
  }
  return found;
}

const [dockerfile, packageJsonText, buildAppSource, serverSource, remoteConfigSource, proofText] =
  await Promise.all([
    readFile(join(backendDirectory, "Dockerfile"), "utf8"),
    readFile(join(backendDirectory, "package.json"), "utf8"),
    readFile(join(backendDirectory, "src/app/build-app.ts"), "utf8"),
    readFile(join(backendDirectory, "src/app/server.ts"), "utf8"),
    readFile(join(backendDirectory, "src/config/remote-stt-config.ts"), "utf8"),
    readFile(join(backendDirectory, "contracts/stt/fixtures/production-disabled-proof.json"), "utf8"),
  ]);

requireMatch(dockerfile, /FROM node:24\.18\.0-bookworm-slim AS runtime/u,
  "runtime image must remain pinned to Node.js 24.18.0");
const runtimeStage = dockerfile.slice(dockerfile.indexOf(
  "FROM node:24.18.0-bookworm-slim AS runtime",
));
requireMatch(runtimeStage, /^USER node$/mu, "runtime image must use the non-root node user");
requireMatch(runtimeStage, /CMD \["node", "dist\/src\/app\/server\.js"\]/u,
  "runtime entrypoint must remain the production server");
requireMatch(runtimeStage,
  /COPY --from=build --chown=node:node \/app\/dist\/src \.\/dist\/src/u,
  "runtime image must copy only compiled application source");
forbidMatch(runtimeStage, /(?:COOKLOG_)?REMOTE_STT_/iu,
  "container image must not inject a remote STT setting");
forbidMatch(runtimeStage, /COPY[^\n]*(?:audio|recording|fixture|contracts|tests)/iu,
  "runtime image must not copy audio, fixture, contract, or test assets");

const packageJson = JSON.parse(packageJsonText);
const dependencies = Object.keys(packageJson.dependencies ?? {});
if (dependencies.length !== 1 || dependencies[0] !== "fastify") {
  fail("runtime dependency set contains a provider, upload, storage, queue, or egress client");
}

requireMatch(buildAppSource, /await app\.register\(registerHealthRoute\)/u,
  "production app must retain its fixed health route");
forbidMatch(buildAppSource,
  /(?:installRecipeJobRoutes|installDisabledRemoteSTTHttpBoundary|remote.?stt|audio|multipart)/iu,
  "production app composition contains a non-health or audio capability");
requireMatch(serverSource, /buildApp\(config\)/u,
  "production server must build the health-only production app");
requireMatch(serverSource,
  /config\.environment === "production"\s*\? await buildApp\(config\)\s*:\s*\(await createLocalFoundationRuntime\(config\)\)\.app/su,
  "production branch must select the health-only app before local/mock composition");

const sourcePaths = (await filesBelow(join(backendDirectory, "src")))
  .filter((path) => extname(path) === ".ts");
const sourcePairs = await Promise.all(sourcePaths.map(async (path) =>
  [path, await readFile(path, "utf8")]));
const allSource = sourcePairs.map(([, contents]) => contents).join("\n");
const sttSource = sourcePairs
  .filter(([path]) => path.includes(`${join("src", "stt")}/`) ||
    path.includes(`${join("src", "stt")}\\`))
  .map(([, contents]) => contents)
  .join("\n");

forbidMatch(allSource,
  /\bapp\s*\.\s*(?:post|put|patch|delete|route)\s*\(\s*["'`][^"'`]*(?:stt|speech|transcription|audio)/iu,
  "an upload or transcription route is registered");
forbidMatch(allSource,
  /\bapp\s*\.\s*route\s*\(\s*\{[\s\S]{0,600}?\burl\s*:\s*["'`][^"'`]*(?:stt|speech|transcription|audio)/iu,
  "an object-style upload or transcription route is registered");
forbidMatch(allSource, /addContentTypeParser\s*\(/iu,
  "a custom body parser is registered in production source");
forbidMatch(sttSource,
  /(?:\bfetch\s*\(|\baxios\b|\bundici\b|node:(?:http|https|net|tls)|@google-cloud\/storage|CloudTasksClient|S3Client|createWriteStream)/iu,
  "the STT boundary contains network, storage, or queue implementation");
forbidMatch(sttSource,
  /(?:\btranscribe\s*\(|\bupload\s*\(|\bpublish\s*\(|\benqueue\s*\()/iu,
  "the STT boundary contains an executable provider, upload, or queue method");

for (const requiredSetting of [
  "COOKLOG_REMOTE_STT_MODE",
  "COOKLOG_REMOTE_STT_ENABLED",
  "COOKLOG_REMOTE_STT_UPLOAD_ROUTE_REGISTERED",
  "COOKLOG_REMOTE_STT_PROVIDER_CONFIGURED",
  "COOKLOG_REMOTE_STT_AUDIO_EGRESS_ALLOWED",
  "COOKLOG_REMOTE_STT_AUTOMATIC_FALLBACK",
  "COOKLOG_REMOTE_STT_ACTIVATION_REQUIRES_NEW_APPROVAL",
  "COOKLOG_REMOTE_STT_ENDPOINT",
  "COOKLOG_REMOTE_STT_API_KEY",
]) {
  if (!remoteConfigSource.includes(`"${requiredSetting}"`)) {
    fail(`startup config does not recognize or forbid ${requiredSetting}`);
  }
}

const manifestRoots = [join(repositoryDirectory, ".github/workflows"), backendDirectory];
const manifestPaths = [];
for (const root of manifestRoots) {
  for (const path of await filesBelow(root)) {
    const name = path.toLowerCase();
    if (/\.(?:yaml|yml)$/u.test(name) &&
      /(?:backend|cloud.?run|deploy|deployment|service|cloudbuild|compose|k8s)/u.test(name)) {
      manifestPaths.push(path);
    }
  }
}
for (const path of manifestPaths) {
  const manifest = await readFile(path, "utf8");
  forbidMatch(manifest,
    /COOKLOG_REMOTE_STT_(?:ENABLED|UPLOAD_ROUTE_REGISTERED|PROVIDER_CONFIGURED|AUDIO_EGRESS_ALLOWED|AUTOMATIC_FALLBACK)\s*[:=]\s*["']?true/iu,
    `${relative(repositoryDirectory, path)} enables a remote STT capability`);
  forbidMatch(manifest, /COOKLOG_REMOTE_STT_MODE\s*[:=]\s*["']?enabled/iu,
    `${relative(repositoryDirectory, path)} selects enabled remote STT mode`);
  forbidMatch(manifest,
    /(?:COOKLOG_)?REMOTE_STT_(?:PROVIDER|ENDPOINT|EGRESS_DESTINATION|API_KEY)\s*[:=]/iu,
    `${relative(repositoryDirectory, path)} injects a provider, endpoint, egress, or credential`);
  forbidMatch(manifest, /\/(?:v\d+\/)?(?:remote[-_/]?)?(?:stt|speech|transcription|audio)(?:\/|$)/iu,
    `${relative(repositoryDirectory, path)} exposes an audio upload route`);
}

const proof = JSON.parse(proofText);
if (proof.contract_version !== "remote-stt-production-disabled-proof.v1" ||
  proof.release_profile !== "first_public_release" ||
  proof.activation_policy !== "new_approved_policy_task_required" ||
  Object.values(proof.runtime_capabilities ?? {}).some((value) => value !== 0) ||
  proof.image_contract?.runtime_base !== "node:24.18.0-bookworm-slim" ||
  proof.image_contract?.runtime_user !== "node" ||
  proof.image_contract?.runtime_entrypoint !== "node dist/src/app/server.js" ||
  proof.image_contract?.remote_stt_environment_settings !== 0 ||
  proof.image_contract?.runtime_audio_assets !== 0 ||
  proof.deployment_contract?.manifest_policy !== "absent_or_explicitly_disabled" ||
  proof.deployment_contract?.allowed_mode !== "disabled" ||
  proof.deployment_contract?.upload_route_registered !== false ||
  proof.deployment_contract?.provider_configured !== false ||
  proof.deployment_contract?.audio_egress_allowed !== false ||
  proof.deployment_contract?.automatic_fallback !== false) {
  fail("checked-in production disabled proof does not match the enforced boundary");
}

process.stdout.write(
  `production remote STT disabled audit: PASS (${sourcePaths.length} source files, ` +
  `${manifestPaths.length} deployment manifests)\n`,
);
