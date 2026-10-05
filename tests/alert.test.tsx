import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "../src/components/feedback";
test("Alert composes semantic feedback with reusable atoms", async () => {
  render(
    <Alert title="Attention" tone="error">
      Please try again
    </Alert>,
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "AttentionPlease try again",
  );
});
