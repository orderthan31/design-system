import fs from "node:fs";
const core = JSON.parse(fs.readFileSync("public/source/tokens/core.json"));
const all = { ...core.primitive, ...core.semantic, ...core.component };
function resolve(k, seen = []) {
  if (seen.includes(k)) throw Error(`Cycle ${k}`);
  const t = all[k];
  if (!t) throw Error(`Missing ${k}`);
  return typeof t.$value === "string" && t.$value.startsWith("{")
    ? resolve(t.$value.slice(1, -1), [...seen, k])
    : `${t.$value}${t.unit || ""}`;
}
const values = Object.fromEntries(Object.keys(all).map((k) => [k, resolve(k)]));
fs.mkdirSync("src/generated", { recursive: true });
fs.copyFileSync("public/source/tokens/core.json", "src/generated/core.json");
fs.copyFileSync(
  "public/source/contracts/components.json",
  "src/generated/components.json",
);
fs.writeFileSync(
  "src/generated/tokens.css",
  ":root {\n" +
    Object.entries(values)
      .map(([k, v]) => `  --${k.replaceAll(".", "-")}: ${v};`)
      .join("\n") +
    "\n}\n",
);
// Scoped defaults are generated from the same immutable 107-token source.
fs.writeFileSync(
  "src/generated/scoped-tokens.css",
  ".ds-core {\n" +
    Object.entries(values)
      .map(([k, v]) => `  --${k.replaceAll(".", "-")}: ${v};`)
      .join("\n") +
    "\n}\n",
);
fs.writeFileSync(
  "public/source/tokens/resolved.json",
  JSON.stringify(values, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    total: Object.keys(values).length,
    layers: Object.fromEntries(
      ["primitive", "semantic", "component"].map((k) => [
        k,
        Object.keys(core[k]).length,
      ]),
    ),
  }),
);
