const RUN = "cooklog-mvp-v1-20260728";
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collection = collections.find((item) => item.name === "CookLog / Primitives");
if (!collection) throw new Error("CookLog / Primitives collection not found");
const modeId = collection.modes[0].modeId;
const existing = await figma.variables.getLocalVariablesAsync();
const names = new Set(
  existing
    .filter((item) => item.variableCollectionId === collection.id)
    .map((item) => item.name)
);
const source = [
  ["ink/900", "#2D1C14"],
  ["dark/800", "#302C35"],
  ["dark/900", "#222027"],
  ["dark/950", "#18171B"],
  ["white/1000", "#FFFFFF"],
  ["orange/300", "#FF9A7A"],
  ["orange/400", "#FF7A52"],
  ["green/300", "#7EE0B4"],
  ["green/500", "#176B4A"],
  ["red/300", "#FF8C84"],
  ["red/500", "#B42318"],
  ["violet/200", "#AA9CF7"],
  ["violet/300", "#9B8AF0"],
  ["violet/500", "#7057D9"]
];
const createdVariableIds = [];
for (const [name, hex] of source) {
  if (names.has(name)) continue;
  const value = hex.slice(1);
  const variable = figma.variables.createVariable(name, collection, "COLOR");
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
return { createdVariableIds, count: createdVariableIds.length };
