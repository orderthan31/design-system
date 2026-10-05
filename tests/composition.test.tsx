import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { CompositionExample } from "../src/components/composition";
test("neutral composition exposes field, section, actions and detail slots", async () => {
  render(<CompositionExample />);
  expect(
    screen.getByRole("region", { name: "공통 폼 섹션" }),
  ).toBeVisible();
  expect(screen.getByLabelText("표시 이름")).toBeVisible();
  expect(screen.getByRole("searchbox", { name: "항목 검색" })).toBeVisible();
  expect(
    screen.getByRole("region", { name: "범용 상세" }),
  ).toHaveTextContent("선택 정보");
  await userEvent.click(screen.getByRole("button", { name: "예시 저장" }));
  expect(screen.getByRole("status")).toHaveTextContent("예시를 메모리에만 저장했습니다.");
  await userEvent.type(screen.getByRole("searchbox", { name: "항목 검색" }), "두 번째");
  expect(screen.queryByText("첫 번째 항목")).not.toBeInTheDocument();
  expect(screen.getByText("두 번째 항목")).toBeVisible();
});
