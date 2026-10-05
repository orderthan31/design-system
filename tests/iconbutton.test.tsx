import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "../src/components/primitives";
test("IconButton native runtime contract", async () => {
  render(<IconButton label="Close">×</IconButton>);
  expect(screen.getByRole("button", { name: "Close" })).toHaveTextContent("×");
});
