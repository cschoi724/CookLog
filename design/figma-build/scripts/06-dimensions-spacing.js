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
  ["spacing/2xs", 4],
  ["spacing/xs", 8],
  ["spacing/sm", 12],
  ["spacing/md", 16],
  ["spacing/lg", 24],
  ["spacing/xl", 32],
  ["spacing/2xl", 48]
];
const createdVariableIds = [];
for (const [name, value] of source) {
  if (existing.has(name)) continue;
  const variable = figma.variables.createVariable(name, collection, "FLOAT");
  variable.setValueForMode(modeId, value);
  variable.scopes = ["GAP"];
  variable.setVariableCodeSyntax("WEB", `var(--cooklog-${name.replace("/", "-")})`);
  variable.setVariableCodeSyntax("iOS", `CookLogSpacing.${name.split("/")[1].replace("2", "two")}`);
  variable.setSharedPluginData("dsb", "run_id", RUN);
  variable.setSharedPluginData("dsb", "key", name);
  createdVariableIds.push(variable.id);
}
return { createdVariableIds, count: createdVariableIds.length };
