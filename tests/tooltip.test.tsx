import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "../src/components/navigation";
test("tooltip describes named trigger on focus and Escape dismisses it", async () => {
  render(<Tooltip label="Help" text="Extra information" />);
  const button = screen.getByRole("button", { name: "Help" });
  await userEvent.tab();
  expect(button).toHaveAccessibleDescription("Extra information");
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});
