import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Confirm } from "../src/components/organisms";
test("confirmation requires explicit action inside dialog", async () => {
  let accepted = false;
  render(
    <Confirm
      open
      title="Confirm change"
      onClose={() => {}}
      onConfirm={() => (accepted = true)}
    >
      This can be undone.
    </Confirm>,
  );
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Confirm change");
  await userEvent.click(screen.getByRole("button", { name: "확인" }));
  expect(accepted).toBe(true);
});
