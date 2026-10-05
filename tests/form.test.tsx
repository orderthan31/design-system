import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "../src/components/molecules";
test("field composes label input help and error into a native editable control", async () => {
  render(
    <FormField
      label="Name"
      description="Public name"
      error="Required"
      required
    />,
  );
  const input = screen.getByRole("textbox", { name: /Name/ });
  expect(input).toHaveAccessibleDescription("Public name Required");
  expect(input).toHaveAttribute("aria-invalid", "true");
  await userEvent.type(input, "Austin");
  expect(input).toHaveValue("Austin");
});
