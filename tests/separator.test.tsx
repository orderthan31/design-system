import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Separator } from "../src/components/primitives";
test("Separator native runtime contract", async () => {
  render(<Separator />);
  expect(screen.getByRole("separator")).toBeInTheDocument();
});
