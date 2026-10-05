import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "../src/components/primitives";
test("Badge native runtime contract", async () => {
  render(<Badge tone="success">Saved</Badge>);
  expect(screen.getByText("Saved")).toHaveClass("success");
});
