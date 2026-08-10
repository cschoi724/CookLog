#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const iosRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(iosRoot, "VisualRegression", "visual-regression-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const resultsPath = path.join(iosRoot, "VisualRegression", "visual-regression-results.json");
const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));

const failures = [];
const integratedTotal = Object.values(manifest.integratedStateCounts).reduce((sum, count) => sum + count, 0);
if (integratedTotal !== 82) failures.push(`integrated states: expected 82, got ${integratedTotal}`);

const coreIDs = manifest.coreLoopStateIDs;
if (coreIDs.length !== 23) failures.push(`core loop states: expected 23, got ${coreIDs.length}`);
if (new Set(coreIDs).size !== coreIDs.length) failures.push("core loop state IDs must be unique");

const requiredPrefixes = {
  "HOME-": 4,
  "LOG-": 5,
  "REVIEW-": 5,
  "DETAIL-": 4,
  "PLAYER-": 5
};
for (const [prefix, expected] of Object.entries(requiredPrefixes)) {
  const count = coreIDs.filter((id) => id.startsWith(prefix)).length;
  if (count !== expected) failures.push(`${prefix} states: expected ${expected}, got ${count}`);
}

const viewportKeys = new Set(manifest.viewports.map(({ width, height }) => `${width}x${height}`));
for (const required of ["390x844", "375x667"]) {
  if (!viewportKeys.has(required)) failures.push(`missing viewport ${required}`);
}
for (const theme of ["light", "dark"]) {
  if (!manifest.themes.includes(theme)) failures.push(`missing theme ${theme}`);
}
for (const size of ["default", "accessibility3"]) {
  if (!manifest.contentSizes.includes(size)) failures.push(`missing content size ${size}`);
}
if (manifest.minimumInteractiveTargetPoints !== 44) failures.push("minimum target must be 44pt");
if (!manifest.evidencePolicy.independentVerificationRequired) failures.push("independent QA must be required");

const expectedEvidenceCounts = { appInfo: 4, homeNetworkError: 2 };
for (const [group, expected] of Object.entries(expectedEvidenceCounts)) {
  const evidence = results.current[group] ?? [];
  if (evidence.length !== expected) {
    failures.push(`${group} evidence: expected ${expected}, got ${evidence.length}`);
  }
  for (const relativePath of evidence) {
    if (!fs.existsSync(path.join(iosRoot, relativePath))) {
      failures.push(`${group} evidence missing: ${relativePath}`);
    }
  }
}
if (results.coverage.integratedFunctionalTests !== "82/82") {
  failures.push("integrated functional test result must be 82/82");
}
if (!results.independentVerificationRequired) failures.push("results must require independent QA");

const sourceAssertions = {
  "CookLog/Features/Home/HomeView.swift": [
    "frame(minWidth: 44, minHeight: 44)",
    "automaticallyRetriesFailedAction = false"
  ],
  "CookLog/Features/CookingLog/CookingLogView.swift": [
    "accessibilityLabel(\"남은 시간",
    ".controlSize(.large)"
  ],
  "CookLog/Features/AIReview/RecipeStepEditorRowView.swift": [
    "accessibilityLabel(\"STEP \\(step.order) 위로 이동\")",
    "accessibilityLabel(\"STEP \\(step.order) 삭제\")"
  ],
  "CookLog/Features/RecipeDetail/RecipeDetailView.swift": [
    "accessibilityLabel(\"레시피 메뉴\")"
  ],
  "CookLog/Features/AudioPlayer/AudioPlayerControlBarView.swift": [
    "accessibilityLabel: \"이전 단계\"",
    "accessibilityLabel: \"현재 단계 다시 듣기\"",
    "accessibilityLabel: \"다음 단계\""
  ],
  "CookLog/App/AppRoute.swift": [
    "frame(minHeight: 44)",
    "accessibilityElement(children: .combine)"
  ]
};
for (const [relativePath, snippets] of Object.entries(sourceAssertions)) {
  const source = fs.readFileSync(path.join(iosRoot, relativePath), "utf8");
  for (const snippet of snippets) {
    if (!source.includes(snippet)) failures.push(`${relativePath}: missing ${snippet}`);
  }
  if (source.includes(".font(.system(size:")) failures.push(`${relativePath}: fixed system font size is forbidden`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`visual regression contract valid: ${integratedTotal} integrated / ${coreIDs.length} core states`);
