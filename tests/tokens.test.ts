import { test, expect } from "vitest";
import { resolveTokens } from "../src/tokens";
import core from "../public/source/tokens/core.json";
test("canonical 107 tokens resolve nested aliases with dimensions preserved", () => {
  const t = resolveTokens(core);
  expect(Object.keys(t)).toHaveLength(107);
  expect(t["button.bg.default"]).toBe("#2563EB");
  expect(t["size.control.primary"]).toBe("48px");
  expect(t["font.family.base"]).toBe("Pretendard");
});
