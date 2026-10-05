import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../src/components/primitives";
test("Textarea native runtime contract", async () => {
  render(<Textarea aria-label="Notes" defaultValue="hello" readOnly />);
  expect(screen.getByRole("textbox")).toHaveValue("hello");
  expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
});
