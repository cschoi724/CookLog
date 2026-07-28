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
  ["color/bg/base", "cream/50", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/subtle", "cream/100", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/elevated", "white/1000", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent", "orange/500", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent-pressed", "orange/600", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent-muted", "orange/100", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/text/primary", "ink/900", ["TEXT_FILL"]],
  ["color/text/secondary", "ink/700", ["TEXT_FILL"]]
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
