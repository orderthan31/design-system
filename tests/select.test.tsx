import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../src/components/primitives";
test("Select native runtime contract", async () => {
  render(
    <Select aria-label="Category">
      <option>General</option>
      <option>Other</option>
    </Select>,
  );
  await userEvent.selectOptions(screen.getByRole("combobox"), "Other");
  expect(screen.getByRole("combobox")).toHaveValue("Other");
});
