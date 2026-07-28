const RUN = "cooklog-mvp-v1-20260728";
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collection = collections.find((item) => item.name === "CookLog / Dimension");
if (!collection) throw new Error("CookLog / Dimension collection not found");
const modeId = collection.modes[0].modeId;
const variables = await figma.variables.getLocalVariablesAsync();
const existing = new Set(
  variables
    .filter((item) => item.variableCollectionId === collection.id)
    .map((item) => item.name)
);
const source = [
  ["radius/xs", 8],
  ["radius/sm", 12],
  ["radius/md", 16],
  ["radius/lg", 24],
  ["radius/full", 999]
];
const createdVariableIds = [];
for (const [name, value] of source) {
  if (existing.has(name)) continue;
  const variable = figma.variables.createVariable(name, collection, "FLOAT");
  variable.setValueForMode(modeId, value);
  variable.scopes = ["CORNER_RADIUS"];
  variable.setVariableCodeSyntax("WEB", `var(--cooklog-${name.replace("/", "-")})`);
  variable.setVariableCodeSyntax("iOS", `CookLogRadius.${name.split("/")[1]}`);
  variable.setSharedPluginData("dsb", "run_id", RUN);
  variable.setSharedPluginData("dsb", "key", name);
  createdVariableIds.push(variable.id);
}
return { createdVariableIds, count: createdVariableIds.length };
