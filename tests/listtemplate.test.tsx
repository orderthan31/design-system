import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ListTemplate } from "../src/components/templates";
test("ListTemplate renders neutral consumer slots", () => {
  render(
    <ListTemplate
      title="Neutral list"
      toolbar={<button>Filter</button>}
      rows={<p>Row content</p>}
      footer={<p>Summary slot</p>}
    />,
  );
  expect(screen.getByText("Row content")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  expect(screen.getByText("Summary slot")).toBeInTheDocument();
  expect(screen.getByText("목록 템플릿")).toBeInTheDocument();
});
