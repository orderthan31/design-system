import { test, expect } from "vitest";
import fs from "node:fs";
test("generated build inputs retain canonical source bytes", () => {
  for (const [source, target] of [
    ["public/source/tokens/core.json", "src/generated/core.json"],
    [
      "public/source/contracts/components.json",
      "src/generated/components.json",
    ],
  ]) {
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.readFileSync(target, "utf8")).toBe(
      fs.readFileSync(source, "utf8"),
    );
  }
});
