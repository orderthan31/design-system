import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeedbackTemplate } from "../src/components/templates";
test("FeedbackTemplate renders neutral consumer slots", () => {
  render(
    <FeedbackTemplate
      title="Neutral feedback"
      status={<p>Status slot</p>}
      content={<p>Content slot</p>}
      actions={<button>Retry</button>}
    />,
  );
  expect(screen.getByText("Status slot")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  expect(screen.getByText("피드백 템플릿")).toBeInTheDocument();
});
