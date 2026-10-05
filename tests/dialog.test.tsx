import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog, Confirm } from "../src/components/organisms";
test("Dialog composes labeled body and close control", async () => {
  let closed = false;
  render(
    <Dialog open title="Review" onClose={() => (closed = true)}>
      <p>Preserved information</p>
    </Dialog>,
  );
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Review");
  await userEvent.click(screen.getByRole("button", { name: "대화상자 닫기" }));
  expect(closed).toBe(true);
});
