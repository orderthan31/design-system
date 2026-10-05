import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../src/components/atoms";
test("busy primary action retains its name and blocks duplicate activation", async () => {
  let count = 0;
  render(
    <Button loading onClick={() => count++}>
      Save changes
    </Button>,
  );
  const button = screen.getByRole("button", { name: /Save changes/ });
  await userEvent.click(button);
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button).toHaveAttribute("aria-disabled", "true");
  expect(button).not.toBeDisabled();
  expect(count).toBe(0);
});
test("buttons expose independent variant and size contracts", () => {
  render(
    <Button variant="destructive" size="small">
      Delete
    </Button>,
  );
  expect(screen.getByRole("button")).toHaveClass("destructive", "small");
});
