import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../src/components/feedback";
test("EmptyState composes semantic feedback with reusable atoms", async () => {
  let n = 0;
  render(
    <EmptyState title="Nothing here" action="Add item" onAction={() => n++}>
      Choose an action
    </EmptyState>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Add item" }));
  expect(n).toBe(1);
});
