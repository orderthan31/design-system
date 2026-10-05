import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Skeleton } from "../src/components/primitives";
test("Skeleton native runtime contract", async () => {
  render(<Skeleton label="Loading content" />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading content");
});
