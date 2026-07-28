const RUN = "cooklog-mvp-v1-20260728";
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const target = collections.find((item) => item.name === "CookLog / Color Dark");
const primitives = collections.find((item) => item.name === "CookLog / Primitives");
if (!target || !primitives) throw new Error("Required collections not found");
const modeId = target.modes[0].modeId;
const variables = await figma.variables.getLocalVariablesAsync();
const primitiveByName = new Map(
  variables
    .filter((item) => item.variableCollectionId === primitives.id)
    .map((item) => [item.name, item])
);
const existing = new Set(
  variables
    .filter((item) => item.variableCollectionId === target.id)
    .map((item) => item.name)
);
const source = [
  ["color/text/on-accent", "ink/900", ["TEXT_FILL"]],
  ["color/border/default", "dark/800", ["STROKE_COLOR"]],
  ["color/border/strong", "ink/500", ["STROKE_COLOR"]],
  ["color/icon/primary", "cream/50", ["SHAPE_FILL", "STROKE_COLOR"]],
  ["color/status/success", "green/300", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/status/error", "red/300", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/focus", "violet/300", ["STROKE_COLOR"]]
];
const createdVariableIds = [];
for (const [name, primitiveName, scopes] of source) {
  if (existing.has(name)) continue;
  const primitive = primitiveByName.get(primitiveName);
  if (!primitive) throw new Error(`Primitive missing: ${primitiveName}`);
  const variable = figma.variables.createVariable(name, target, "COLOR");
  variable.setValueForMode(modeId, figma.variables.createVariableAlias(primitive));
  variable.scopes = scopes;
  variable.setVariableCodeSyntax("WEB", `var(--cooklog-dark-${name.replaceAll("/", "-")})`);
  variable.setVariableCodeSyntax("iOS", `CookLogColorDark.${name.split("/").slice(1).join("")}`);
  variable.setSharedPluginData("dsb", "run_id", RUN);
  variable.setSharedPluginData("dsb", "key", `semantic/dark/${name}`);
  createdVariableIds.push(variable.id);
}
return { createdVariableIds, count: createdVariableIds.length };
