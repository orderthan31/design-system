import React from "react";
import { test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";
test("Korean documentation preserves hierarchy and interactive component playground", async () => {
  window.location.hash = "";
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("함께 쓰는 언어");
  expect(screen.getByText("준비 완료")).toBeVisible();
  const nav = screen.getByRole("navigation", { name: "문서 탐색" });
  for (const name of ["개요", "기초", "아톰", "몰리큘", "오가니즘", "템플릿"]) {
    expect(within(nav).getByRole("link", { name: new RegExp(name) })).toBeInTheDocument();
  }
  await userEvent.click(within(nav).getByRole("link", { name: /아톰/ }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("아톰");
  expect(screen.getByRole("button", { name: "사용할 수 없는 동작" })).toBeDisabled();
  expect(screen.getByRole("checkbox", { name: "사용할 수 없는 선택" })).toBeDisabled();
  expect(screen.getByText("예시가 잠겨 있는 동안 사용할 수 없습니다.")).toBeVisible();
  const card = screen.getByRole("heading", { name: "Button" }).closest("article")!;
  await userEvent.click(within(card).getByRole("button", { name: "변경 사항 저장" }));
  expect(within(card).getByRole("button", { name: "변경 사항 저장" })).toHaveAttribute("aria-busy", "true");
  expect(await within(card).findByRole("status")).toHaveTextContent("변경 사항을 저장했습니다.");
  await userEvent.click(within(nav).getByRole("link", { name: /템플릿/ }));
  expect(screen.getByRole("heading", { name: "템플릿 미리보기" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "재사용 가능한 섹션과 실제 슬롯." })).toBeInTheDocument();
});
