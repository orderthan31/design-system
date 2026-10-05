import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormTemplate } from "../src/components/templates";
test("FormTemplate renders neutral consumer slots", () => {
  render(
    <FormTemplate
      title="Neutral form"
      fields={<input aria-label="Name" />}
      actions={<button>Submit</button>}
      aside={<p>Help slot</p>}
    />,
  );
  expect(
    screen.getByRole("heading", { name: "Neutral form" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  expect(screen.getByText("Help slot")).toBeInTheDocument();
  expect(screen.getByText("폼 템플릿")).toBeInTheDocument();
});
