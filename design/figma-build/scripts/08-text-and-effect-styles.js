await Promise.all([
  figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
]);
const existingText = await figma.getLocalTextStylesAsync();
const existingTextNames = new Set(existingText.map((item) => item.name));
const textSource = [
  ["CookLog/Display", "Bold", 38, 46],
  ["CookLog/Title", "Bold", 28, 34],
  ["CookLog/Heading", "Bold", 20, 26],
  ["CookLog/Body", "Regular", 16, 24],
  ["CookLog/Label", "Semi Bold", 15, 20],
  ["CookLog/Caption", "Semi Bold", 12, 18]
];
const createdTextStyleIds = [];
for (const [name, style, size, lineHeight] of textSource) {
  if (existingTextNames.has(name)) continue;
  const textStyle = figma.createTextStyle();
  textStyle.name = name;
  textStyle.fontName = { family: "Inter", style };
  textStyle.fontSize = size;
  textStyle.lineHeight = { unit: "PIXELS", value: lineHeight };
  textStyle.letterSpacing = { unit: "PERCENT", value: 0 };
  createdTextStyleIds.push(textStyle.id);
}
const existingEffects = await figma.getLocalEffectStylesAsync();
const existingEffectNames = new Set(existingEffects.map((item) => item.name));
const effectSource = [
  ["CookLog/Shadow/Small", 2, 8, 0.08],
  ["CookLog/Shadow/Card", 8, 24, 0.12]
];
const createdEffectStyleIds = [];
for (const [name, y, radius, alpha] of effectSource) {
  if (existingEffectNames.has(name)) continue;
  const effectStyle = figma.createEffectStyle();
  effectStyle.name = name;
  effectStyle.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.176, g: 0.11, b: 0.078, a: alpha },
    offset: { x: 0, y },
    radius,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];
  createdEffectStyleIds.push(effectStyle.id);
}
return {
  createdTextStyleIds,
  createdEffectStyleIds,
  textStyleCount: createdTextStyleIds.length,
  effectStyleCount: createdEffectStyleIds.length
};
