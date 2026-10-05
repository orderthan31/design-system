import { test, expect } from "vitest";
import * as library from "../src";
test("library exports all eighteen independently reusable families", () => {
  expect(library.componentFamilies).toHaveLength(18);
  for (const name of library.componentFamilies)
    expect(typeof (library as Record<string, unknown>)[name]).toBe("function");
});
