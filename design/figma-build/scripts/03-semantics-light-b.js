const RUN = "cooklog-mvp-v1-20260728";
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const target = collections.find((item) => item.name === "CookLog / Color Light");
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
  ["color/text/on-accent", "white/1000", ["TEXT_FILL"]],
  ["color/border/default", "cream/200", ["STROKE_COLOR"]],
  ["color/border/strong", "ink/500", ["STROKE_COLOR"]],
  ["color/icon/primary", "ink/900", ["SHAPE_FILL", "STROKE_COLOR"]],
  ["color/status/success", "green/500", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/status/warning", "orange/600", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/status/info", "violet/500", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/status/error", "red/500", ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"]],
  ["color/focus", "violet/500", ["STROKE_COLOR"]]
];
const createdVariableIds = [];
for (const [name, primitiveName, scopes] of source) {
  if (existing.has(name)) continue;
  const primitive = primitiveByName.get(primitiveName);
  if (!primitive) throw new Error(`Primitive missing: ${primitiveName}`);
  const variable = figma.variables.createVariable(name, target, "COLOR");
  variable.setValueForMode(modeId, figma.variables.createVariableAlias(primitive));
  variable.scopes = scopes;
  variable.setVariableCodeSyntax("WEB", `var(--cooklog-${name.replaceAll("/", "-")})`);
  variable.setVariableCodeSyntax("iOS", `CookLogColor.${name.split("/").slice(1).join("")}`);
  variable.setSharedPluginData("dsb", "run_id", RUN);
  variable.setSharedPluginData("dsb", "key", `semantic/light/${name}`);
  createdVariableIds.push(variable.id);
}
return { createdVariableIds, count: createdVariableIds.length };
