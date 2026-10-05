import React from "react";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => vi.unstubAllGlobals());
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { OverlayDetail } from "../src/gallery/overlay-detail";

// Functional jsdom contracts only: native top-layer modality/layout need Chromium.
test("single CTA closes the sheet, updates status, and restores its opener", () => {
  render(<OverlayDetail kind="bottom-sheet" />);
  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  const opener = screen.getByRole("button", { name: "안내 열기" });
  opener.focus();
  fireEvent.click(opener);
  const dialog = screen.getByRole("dialog", { name: "간단한 안내" });
  expect(
    within(dialog).getByText("현재 화면에서 안내를 확인해요."),
  ).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "확인" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("안내 확인됨");
  expect(opener).toHaveFocus();
});

test("choice is a draft until Apply; Cancel and close discard it", () => {
  render(<OverlayDetail kind="bottom-sheet" />);
  const opener = screen.getByRole("button", { name: "옵션 선택" });
  opener.focus();
  fireEvent.click(opener);
  fireEvent.click(screen.getByRole("radio", { name: "자세히" }));
  expect(screen.getByRole("status")).toHaveTextContent("아직 적용 전");
  fireEvent.click(screen.getByRole("button", { name: "취소" }));
  expect(opener).toHaveFocus();
  fireEvent.click(opener);
  expect(screen.getByRole("radio", { name: "간단히" })).toBeChecked();
  fireEvent.click(screen.getByRole("radio", { name: "자세히" }));
  fireEvent.click(screen.getByRole("button", { name: "적용" }));
  expect(screen.getByRole("status")).toHaveTextContent("옵션: 자세히");
  fireEvent.click(opener);
  fireEvent.click(screen.getByRole("radio", { name: "간단히" }));
  fireEvent.click(screen.getByRole("button", { name: "대화상자 닫기" }));
  fireEvent.click(opener);
  expect(screen.getByRole("radio", { name: "자세히" })).toBeChecked();
});

test("required input does not apply whitespace and Cancel discards edits", () => {
  render(<OverlayDetail kind="bottom-sheet" />);
  const opener = screen.getByRole("button", { name: "이름 입력" });
  opener.focus();
  fireEvent.click(opener);
  const input = screen.getByRole("textbox", { name: "이름 (필수)" });
  expect(input).toBeRequired();
  fireEvent.change(input, { target: { value: "   " } });
  expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
  fireEvent.change(input, { target: { value: "하늘" } });
  fireEvent.click(screen.getByRole("button", { name: "취소" }));
  fireEvent.click(opener);
  expect(screen.getByRole("textbox")).toHaveValue("");
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: " 하늘 " },
  });
  fireEvent.click(screen.getByRole("button", { name: "저장" }));
  expect(screen.getByRole("status")).toHaveTextContent("이름: 하늘");
  expect(opener).toHaveFocus();
  fireEvent.click(opener);
  expect(screen.getByRole("textbox")).toHaveValue("하늘");
});

test("long body is a labeled keyboard-scroll region with a working footer", () => {
  render(<OverlayDetail kind="bottom-sheet" />);
  fireEvent.click(screen.getByRole("button", { name: "긴 내용" }));
  const region = screen.getByRole("region", { name: "안내 내용" });
  expect(region).toHaveAttribute("tabindex", "0");
  expect(region.style.overflowY).toBe("auto");
  expect(within(region).getAllByRole("listitem")).toHaveLength(12);
  fireEvent.click(screen.getByRole("button", { name: "읽음" }));
  expect(screen.getByRole("status")).toHaveTextContent("긴 안내 확인됨");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Dialog menu owns the first Escape and menu actions update visible status", async () => {
  render(<OverlayDetail kind="dialog" />);
  const opener = screen.getByRole("button", { name: "작업 열기" });
  opener.focus();
  fireEvent.click(opener);
  const parent = screen.getByRole("dialog", { name: "작업 안내" });
  expect(parent.closest(".nr-sheet")).toBeNull();
  const menu = within(parent).getByRole("button", { name: "작업 메뉴" });
  fireEvent.click(menu);
  const item = screen.getByRole("menuitem", { name: "복제" });
  await waitFor(() => expect(item).toHaveFocus());
  fireEvent.keyDown(item, { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(parent).toHaveAttribute("open");
  expect(menu).toHaveFocus();
  fireEvent.click(menu);
  await waitFor(() =>
    expect(screen.getByRole("menuitem", { name: "복제" })).toHaveFocus(),
  );
  fireEvent.click(screen.getByRole("menuitem", { name: "복제" }));
  expect(screen.getByRole("status")).toHaveTextContent("복제 완료");
  fireEvent.keyDown(menu, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
});

test("Dialog tooltip consumes one Escape, then the parent closes", () => {
  render(<OverlayDetail kind="dialog" />);
  fireEvent.click(screen.getByRole("button", { name: "작업 열기" }));
  const help = screen.getByRole("button", { name: "도움말" });
  fireEvent.focus(help);
  expect(screen.getByRole("tooltip")).toHaveTextContent(
    "먼저 열린 도움말만 닫혀요.",
  );
  fireEvent.keyDown(help, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(screen.getByRole("dialog")).toHaveAttribute("open");
  fireEvent.keyDown(help, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("nested Confirm cancels without committing and confirms only explicitly", () => {
  render(<OverlayDetail kind="dialog" />);
  fireEvent.click(screen.getByRole("button", { name: "작업 열기" }));
  const parent = screen.getByRole("dialog", { name: "작업 안내" });
  const opener = within(parent).getByRole("button", { name: "삭제 확인" });
  opener.focus();
  fireEvent.click(opener);
  const child = screen.getByRole("dialog", { name: "삭제할까요?" });
  fireEvent.keyDown(child, { key: "Escape" });
  expect(screen.getByRole("status")).toHaveTextContent("아직 적용 전");
  expect(parent).toHaveAttribute("open");
  expect(opener).toHaveFocus();
  fireEvent.click(opener);
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "삭제할까요?" })).getByRole(
      "button",
      { name: "취소" },
    ),
  );
  expect(screen.getByRole("status")).toHaveTextContent("아직 적용 전");
  fireEvent.click(opener);
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "삭제할까요?" })).getByRole(
      "button",
      { name: "확인" },
    ),
  );
  expect(screen.getByRole("status")).toHaveTextContent("예시 삭제됨");
  expect(parent).toHaveAttribute("open");
  expect(opener).toHaveFocus();
});

test("nested Drawer closes before Dialog and retains scroll priority until the last owner", () => {
  document.body.style.setProperty("overflow", "auto", "important");
  render(<OverlayDetail kind="dialog" />);
  const pageOpener = screen.getByRole("button", { name: "작업 열기" });
  pageOpener.focus();
  fireEvent.click(pageOpener);
  const parent = screen.getByRole("dialog", { name: "작업 안내" });
  const opener = within(parent).getByRole("button", { name: "측면 열기" });
  opener.focus();
  fireEvent.click(opener);
  const drawer = screen.getByRole("dialog", { name: "측면 상세" });
  expect(drawer.closest(".nr-drawer")).not.toBeNull();
  fireEvent.keyDown(drawer, { key: "Escape" });
  expect(
    screen.queryByRole("dialog", { name: "측면 상세" }),
  ).not.toBeInTheDocument();
  expect(parent).toHaveAttribute("open");
  expect(opener).toHaveFocus();
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.keyDown(opener, { key: "Escape" });
  expect(pageOpener).toHaveFocus();
  expect(document.body.style.overflow).toBe("auto");
  expect(document.body.style.getPropertyPriority("overflow")).toBe("important");
  document.body.style.removeProperty("overflow");
});

test.each(["bottom-sheet", "dialog"] as const)(
  "%s keeps accurate usage and ownership docs folded after the live demo",
  (kind) => {
    const { container } = render(<OverlayDetail kind={kind} />);
    const folds = Array.from(container.querySelectorAll("details"));
    expect(
      folds.map((node) => node.querySelector("summary")?.textContent),
    ).toEqual(["코드", "Props", "구성", "접근성·주의"]);
    expect(folds.every((node) => !node.open)).toBe(true);
    const source = container.querySelector("pre")?.textContent;
    expect(source).toContain('from "./src/index"');
    expect(source).toContain(kind === "dialog" ? "<Dialog" : "<BottomSheet");
    expect(source).not.toContain("UNSAFE_");
    expect(container.textContent).toContain("React.ReactNode");
    expect(container.textContent).toContain("onClose");
    expect(container.textContent).toContain("loading = false");
    expect(container.textContent).toContain("취소는 반영하지 않아요");
    expect(container.textContent).toContain(
      "jsdom은 native modality를 인증하지 않아요",
    );
    const link = screen.getByText("라이브 회귀 예시").closest("a");
    expect(link).toHaveAttribute("href");
    expect(
      container.querySelector(`[id="${link!.getAttribute("href")!.slice(1)}"]`),
    ).not.toBeNull();
    expect(container.textContent).toContain("tests/modal-ownership.test.tsx");
  },
);

test.each([false, true])(
  "sheet route opens the real responsive primitive (PC=%s)",
  (desktop) => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: desktop }));
    render(<OverlayDetail kind="bottom-sheet" />);
    fireEvent.click(screen.getByRole("button", { name: "안내 열기" }));
    const dialog = screen.getByRole("dialog", { name: "간단한 안내" });
    expect(Boolean(dialog.closest(".nr-sheet"))).toBe(!desktop);
  },
);
