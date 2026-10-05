import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../src/components/atoms";
test("loading submit action blocks the native form default without removing focusability", async () => {
  let submissions = 0;
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submissions++;
      }}
    >
      <Button type="submit" loading>
        Submit
      </Button>
    </form>,
  );
  await userEvent.click(screen.getByRole("button"));
  expect(submissions).toBe(0);
  expect(screen.getByRole("button")).not.toBeDisabled();
});
