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
  ["color/bg/base", "dark/950", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/subtle", "dark/900", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/elevated", "dark/800", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent", "orange/300", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent-pressed", "orange/400", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/bg/accent-muted", "ink/700", ["FRAME_FILL", "SHAPE_FILL"]],
  ["color/text/primary", "white/1000", ["TEXT_FILL"]],
  ["color/text/secondary", "cream/200", ["TEXT_FILL"]]
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
