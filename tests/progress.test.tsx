import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Progress } from "../src/components/primitives";
test("Progress native runtime contract", async () => {
  render(<Progress value={65} label="Completion" />);
  expect(
    screen.getByRole("progressbar", { name: "Completion" }),
  ).toHaveAttribute("aria-valuenow", "65");
});
