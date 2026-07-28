const RUN = "cooklog-mvp-v1-20260728";
const collectionNames = [
  "CookLog / Color Light",
  "CookLog / Color Dark",
  "CookLog / Primitives",
  "CookLog / Dimension"
];
const existingCollections = await figma.variables.getLocalVariableCollectionsAsync();
const collectionByName = new Map(existingCollections.map((item) => [item.name, item]));
const createdCollectionIds = [];
for (const name of collectionNames) {
  if (collectionByName.has(name)) continue;
  const collection = figma.variables.createVariableCollection(name);
  collection.renameMode(collection.defaultModeId, name.includes("Color Light") ? "Light" : name.includes("Color Dark") ? "Dark" : "Value");
  collectionByName.set(name, collection);
  createdCollectionIds.push(collection.id);
}

const primitives = collectionByName.get("CookLog / Primitives");
const modeId = primitives.modes[0].modeId;
const existingVariables = await figma.variables.getLocalVariablesAsync();
const names = new Set(
  existingVariables
    .filter((item) => item.variableCollectionId === primitives.id)
    .map((item) => item.name)
);
const source = [
  ["cream/50", "#FFFDF8"],
  ["cream/100", "#FAF3E7"],
  ["cream/200", "#F2E3CE"],
  ["orange/100", "#FFE1CF"],
  ["orange/500", "#C93610"],
  ["orange/600", "#A92B0C"],
  ["ink/500", "#847064"],
  ["ink/700", "#5C4638"]
];
const createdVariableIds = [];
for (const [name, hex] of source) {
  if (names.has(name)) continue;
  const value = hex.slice(1);
  const variable = figma.variables.createVariable(name, primitives, "COLOR");
  variable.setValueForMode(modeId, {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
    a: 1
  });
  variable.scopes = [];
  variable.setVariableCodeSyntax("WEB", `var(--cooklog-${name.replace("/", "-")})`);
  variable.setVariableCodeSyntax("iOS", `CookLogPrimitive.${name.replace("/", "")}`);
  variable.setSharedPluginData("dsb", "run_id", RUN);
  variable.setSharedPluginData("dsb", "key", `primitive/${name}`);
  createdVariableIds.push(variable.id);
}

return {
  createdCollectionIds,
  createdVariableIds,
  collectionCount: createdCollectionIds.length,
  variableCount: createdVariableIds.length
};
