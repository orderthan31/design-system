import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressStepper, Result } from "../src/components/progress-result";
import { Button } from "../src/components/atoms";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ProgressResultDetail } from "../src/gallery/progress-result-detail";
import { readFileSync } from "node:fs";

test("단계 상세는 이전·다음·초기화와 실제 진행률을 조합한다", async () => {
  const { container } = render(<ProgressResultDetail kind="progress-stepper" />);
  const next = screen.getByRole("button", { name: "다음 단계" });
  expect(screen.getByRole("button", { name: "이전 단계" })).toBeDisabled();
  expect(screen.getByRole("progressbar", { name: "완료한 단계 비율" })).toHaveAttribute("aria-valuenow", "0");
  await userEvent.click(next);
  expect(container.querySelector('[aria-current="step"]')).toHaveTextContent("내용 확인");
  await userEvent.click(screen.getByRole("button", { name: "이전 단계" }));
  expect(container.querySelector('[aria-current="step"]')).toHaveTextContent("정보 입력");
  await userEvent.click(next);
  await userEvent.click(next);
  expect(next).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "처음부터" }));
  expect(container.querySelector('[aria-current="step"]')).toHaveTextContent("정보 입력");
  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
});

test("결과 상세의 재시도·추가·확인은 실제 메모리 결과를 바꾼다", async () => {
  const { container } = render(<ProgressResultDetail kind="result" />);
  await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(screen.getByRole("region", { name: "다시 불러왔습니다" })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "결과 확인" }));
  expect(screen.getByText("신청 번호 DEMO-001의 결과를 확인했습니다.")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "빈 결과 보기" }));
  await userEvent.click(screen.getByRole("button", { name: "샘플 항목 추가" }));
  expect(screen.getByRole("region", { name: "샘플 항목을 추가했습니다" })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "오류 다시 보기" }));
  expect(screen.getByRole("alert")).toHaveTextContent("입력 내용은 유지됩니다");
  expect(container.querySelector("button button, button a, a button")).toBeNull();
});

test.each(["progress-stepper", "result"] as const)("%s 상세 문서는 접힌 가져오기·코드·API·조합·접근성을 제공한다", (kind) => {
  const { container } = render(<ProgressResultDetail kind={kind} />);
  for (const name of ["가져오기", "사용 코드", "API", "조합", "접근성"]) {
    const summary = screen.getByText(name, { selector: "summary" });
    expect(summary.closest("details")).not.toHaveAttribute("open");
  }
  expect(container.textContent).toContain('./src/components/progress-result');
  expect(container.textContent).toContain('./src/components/progress-result.css');
});

test("추가 스타일은 ds-core 범위와 작은 화면의 줄바꿈·토큰 대비를 명시한다", () => {
  const css = readFileSync("src/components/progress-result.css", "utf8");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)].map(match => match[1].trim()).filter(selector => !selector.startsWith("@"));
  expect(selectors.length).toBeGreaterThan(5);
  expect(selectors.every(selector => selector.split(",").every(part => part.trim().startsWith(".ds-core ")))).toBe(true);
  expect(css).toContain("minmax(0, 1fr)");
  expect(css).toContain("overflow-wrap: anywhere");
  expect(css).toContain("flex-wrap: wrap");
  expect(css).toContain("--color-text-primary");
  expect(css).toContain("--color-bg-surface");
  expect(css).toContain("var(--font-size-caption)");
  expect(css).not.toContain("--font-size-sm");
});

test.each(["success", "empty", "info"] as const)("%s 결과는 제목·내용·독립 액션 슬롯을 조합한다", async (variant) => {
  const action = vi.fn();
  const submit = vi.fn(event => event.preventDefault());
  const { container } = render(<form onSubmit={submit}><Result variant={variant} heading="처리 결과" actions={<Button onClick={action}>결과 확인</Button>}><p>신청 내역을 확인해 주세요.</p></Result></form>);
  expect(screen.getByRole("region", { name: "처리 결과" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "처리 결과", level: 3 })).toBeVisible();
  expect(screen.getByText("신청 내역을 확인해 주세요.")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "결과 확인" }));
  expect(action).toHaveBeenCalledTimes(1);
  expect(submit).not.toHaveBeenCalled();
  expect(container.querySelector("button button, button a, a button")).toBeNull();
});

test("오류 결과는 복구 안내와 경고를 유지하고 슬롯 버튼의 로딩·비활성을 존중한다", async () => {
  const retry = vi.fn();
  const element = (loading: boolean, disabled: boolean) => <Result variant="error" heading="저장하지 못했습니다" guidance="입력 내용은 유지됩니다. 연결을 확인한 뒤 다시 시도해 주세요." actions={<Button loading={loading} disabled={disabled} onClick={retry}>다시 시도</Button>}>서버 연결에 실패했습니다.</Result>;
  const { rerender } = render(element(true, false));
  expect(screen.getByRole("alert")).toHaveTextContent("오류");
  expect(screen.getByText(/입력 내용은 유지됩니다/)).toBeVisible();
  const button = screen.getByRole("button", { name: "다시 시도" });
  expect(button).toHaveAttribute("type", "button");
  expect(button).toHaveAttribute("aria-busy", "true");
  await userEvent.click(button);
  expect(retry).not.toHaveBeenCalled();
  rerender(element(false, true));
  expect(button).toBeDisabled();
  await userEvent.click(button);
  expect(retry).not.toHaveBeenCalled();
  rerender(element(false, false));
  await userEvent.click(button);
  expect(retry).toHaveBeenCalledTimes(1);
});

test("오류의 빈 복구 안내에도 안전한 기본 안내를 제공한다", () => {
  render(<Result variant="error" heading="실패" guidance="  ">요청 실패</Result>);
  expect(screen.getByText("입력 내용을 확인한 뒤 다시 시도해 주세요. 문제가 계속되면 담당자에게 문의해 주세요.")).toBeVisible();
});

test.each([-1, 3, 4, 0.5, NaN, Infinity])("잘못된 현재 단계 %s는 모든 항목을 대기로 표시한다", (currentStep) => {
  const { container } = render(<ProgressStepper steps={["입력", "확인", "완료"]} currentStep={currentStep} />);
  expect(container.querySelectorAll("[aria-current]")).toHaveLength(0);
  expect(screen.getAllByRole("listitem").every(item => item.dataset.state === "pending")).toBe(true);
  expect(screen.getByText("현재 단계를 확인해 주세요.")).toBeVisible();
});

test("빈 단계는 빈 상태 안내만 표시한다", () => {
  render(<ProgressStepper steps={[]} currentStep={0} />);
  expect(screen.getByText("표시할 단계가 없습니다.")).toBeVisible();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

const steps = ["정보 입력", "내용 확인", "신청 완료"];

test("단계 진행은 순서 목록과 한국어 상태를 제공하며 탐색 동작을 만들지 않는다", () => {
  const { container } = render(<ProgressStepper steps={steps} currentStep={1} label="신청 단계" />);
  expect(screen.getByRole("list", { name: "신청 단계" }).tagName).toBe("OL");
  const items = screen.getAllByRole("listitem");
  expect(items[0]).toHaveTextContent("정보 입력완료");
  expect(items[1]).toHaveTextContent("내용 확인진행 중");
  expect(items[2]).toHaveTextContent("신청 완료대기");
  expect(items[1]).toHaveAttribute("aria-current", "step");
  expect(container.querySelectorAll("[aria-current]")).toHaveLength(1);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
