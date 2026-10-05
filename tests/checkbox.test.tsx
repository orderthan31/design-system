import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../src/components/primitives";
test("Checkbox native runtime contract", async () => {
  render(<Checkbox label="Accept" mixed />);
  const box = screen.getByRole("checkbox", { name: "Accept" });
  expect((box as HTMLInputElement).indeterminate).toBe(true);
  await userEvent.click(box);
  expect(box).toBeChecked();
});
