import { readFileSync } from "node:fs";
import React, { useState } from "react";
import { expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  GNB,
  LNB,
  Breadcrumb,
  Drawer,
  BottomSheet,
  Popover,
  NavigationRegionsGallery,
} from "../src/components/navigation-regions";

test("navigation gallery omits repeated demo narratives while retaining interaction controls",()=>{render(<NavigationRegionsGallery/>);expect(screen.queryByText("탐색은 현재 위치를 유지하고, 상세 영역은 필요한 순간에만 열립니다.")).toBeNull();expect(screen.queryByText("측면 · 하단 · 작은 안내 영역을 직접 비교해 보세요.")).toBeNull();expect(screen.getByRole("button",{name:"측면 영역 열기"})).toBeVisible();});

test("Breadcrumb uses native links and identifies only the current page", () => {
  render(
    <Breadcrumb
      items={[{ label: "처음", href: "#start" }, { label: "현재" }]}
    />,
  );
  const nav = screen.getByRole("navigation", { name: "현재 위치" });
  expect(within(nav).getByRole("link", { name: "처음" })).toHaveAttribute(
    "href",
    "#start",
  );
  expect(within(nav).getByText("현재")).toHaveAttribute("aria-current", "page");
  expect(
    within(nav).queryByRole("link", { name: "현재" }),
  ).not.toBeInTheDocument();
});

// jsdom has no native top layer, inert background, layout or native Escape→cancel.
// Dispatch cancel explicitly; browser modality/Tab containment are integration checks.
test.each([Drawer, BottomSheet])(
  "modal region closes on Escape/cancel and restores focus and scroll",
  async (Region) => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Region open={open} title="상세 영역" onClose={() => setOpen(false)}>
            <button>본문 작업</button>
          </Region>
        </>
      );
    }
    document.body.style.setProperty("overflow", "scroll", "important");
    const { unmount } = render(<Example />);
    const trigger = screen.getByRole("button", { name: "열기" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "상세 영역" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.body.style.getPropertyPriority("overflow")).toBe(
      "important",
    );
    await userEvent.click(trigger);
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: false, cancelable: true }),
    );
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(
      screen.getByRole("button", { name: "대화상자 닫기" }),
    );
    expect(trigger).toHaveFocus();
    unmount();
    document.body.style.removeProperty("overflow");
  },
);

test("nested regions close only the top overlay and preserve the outer scroll lock", async () => {
  function Example() {
    const [outer, setOuter] = useState(false);
    const [inner, setInner] = useState(false);
    return (
      <>
        <button onClick={() => setOuter(true)}>바깥 열기</button>
        <Drawer open={outer} title="바깥" onClose={() => setOuter(false)}>
          <button onClick={() => setInner(true)}>안쪽 열기</button>
          <BottomSheet
            open={inner}
            title="안쪽"
            onClose={() => setInner(false)}
          >
            <button>안쪽 작업</button>
          </BottomSheet>
        </Drawer>
      </>
    );
  }
  const { unmount } = render(
    <React.StrictMode>
      <Example />
    </React.StrictMode>,
  );
  await userEvent.click(screen.getByRole("button", { name: "바깥 열기" }));
  const innerTrigger = screen.getByRole("button", { name: "안쪽 열기" });
  await userEvent.click(innerTrigger);
  await userEvent.keyboard("{Escape}");
  expect(
    screen.queryByRole("dialog", { name: "안쪽" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "바깥" })).toBeInTheDocument();
  expect(innerTrigger).toHaveFocus();
  expect(document.body.style.overflow).toBe("hidden");
  await userEvent.click(innerTrigger);
  fireEvent(
    screen.getByRole("dialog", { name: "안쪽" }),
    new Event("cancel", { bubbles: false, cancelable: true }),
  );
  expect(screen.getByRole("dialog", { name: "바깥" })).toBeInTheDocument();
  unmount();
  expect(document.body.style.overflow).toBe("");
});

test("out-of-order closing does not unlock or steal focus from the surviving overlay", () => {
  const { rerender, unmount } = render(
    <>
      <Drawer
        open
        title="첫째"
        onClose={() => {
          throw new Error("unexpected close");
        }}
      >
        <button>첫째 작업</button>
      </Drawer>
      <BottomSheet
        open
        title="둘째"
        onClose={() => {
          throw new Error("unexpected close");
        }}
      >
        <button>둘째 작업</button>
      </BottomSheet>
    </>,
  );
  const surviving = screen.getByRole("dialog", { name: "둘째" });
  const focused = document.activeElement;
  rerender(
    <>
      <Drawer
        open={false}
        title="첫째"
        onClose={() => {
          throw new Error("unexpected close");
        }}
      >
        <button>첫째 작업</button>
      </Drawer>
      <BottomSheet
        open
        title="둘째"
        onClose={() => {
          throw new Error("unexpected close");
        }}
      >
        <button>둘째 작업</button>
      </BottomSheet>
    </>,
  );
  expect(document.body.style.overflow).toBe("hidden");
  expect(document.activeElement).toBe(focused);
  expect(surviving).toContainElement(document.activeElement as HTMLElement);
  unmount();
  expect(document.body.style.overflow).toBe("");
});

test("Popover is nonmodal, permits tabbing out, and dismisses with focus return", async () => {
  render(
    <>
      <Popover label="도움 열기" title="도움">
        <button>내용 작업</button>
      </Popover>
      <button>바깥 작업</button>
    </>,
  );
  const trigger = screen.getByRole("button", { name: "도움 열기" });
  await userEvent.click(trigger);
  const panel = screen.getByRole("dialog", { name: "도움" });
  expect(panel).toHaveAttribute("aria-modal", "false");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(document.body.style.overflow).toBe("");
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "내용 작업" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "바깥 작업" })).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await userEvent.click(trigger);
  fireEvent.pointerDown(screen.getByRole("button", { name: "바깥 작업" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole("button", { name: "내용 작업" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.click(trigger);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("initially open nested overlays keep keyboard ownership with the inner region", async () => {
  function Example() {
    const [inner, setInner] = useState(true);
    const [outer, setOuter] = useState(true);
    return (
      <Drawer open={outer} title="부모" onClose={() => setOuter(false)}>
        <BottomSheet open={inner} title="자식" onClose={() => setInner(false)}>
          <button>자식 작업</button>
        </BottomSheet>
      </Drawer>
    );
  }
  const { unmount } = render(<Example />);
  expect(screen.getByRole("dialog", { name: "자식" })).toContainElement(
    document.activeElement as HTMLElement,
  );
  await userEvent.keyboard("{Escape}");
  expect(
    screen.queryByRole("dialog", { name: "자식" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "부모" })).toBeInTheDocument();
  expect(document.body.style.overflow).toBe("hidden");
  unmount();
  expect(document.body.style.overflow).toBe("");
});

test("gallery composes working navigation, tabs, menu, tooltip and nested overlays", async () => {
  render(<NavigationRegionsGallery />);
  await userEvent.click(
    within(screen.getByRole("navigation", { name: "주요 탐색" })).getByRole(
      "button",
      { name: "사용 안내" },
    ),
  );
  expect(
    within(screen.getByRole("navigation", { name: "현재 위치" })).getByText(
      "사용 안내",
    ),
  ).toHaveAttribute("aria-current", "page");
  await userEvent.click(screen.getByRole("tab", { name: "사용 방법" }));
  expect(
    screen.getByText(
      "방향키로 탭을 이동하고 Escape로 열린 영역을 닫을 수 있습니다.",
    ),
  ).toBeVisible();
  await userEvent.click(screen.getByRole("tab", { name: "미리보기" }));
  await userEvent.click(screen.getByRole("button", { name: "추가 안내" }));
  await userEvent.click(screen.getByRole("button", { name: /안내 작업/ }));
  await userEvent.click(screen.getByRole("menuitem", { name: "안내 표시" }));
  expect(screen.getByRole("status")).toHaveTextContent("안내 표시 선택됨");
  await userEvent.keyboard("{Escape}");
  const tooltipTrigger = screen.getByRole("button", { name: "탐색 도움말" });
  await userEvent.click(tooltipTrigger);
  expect(screen.getByRole("tooltip")).toHaveTextContent(
    "선택한 항목은 현재 위치에 표시됩니다.",
  );
  await userEvent.click(screen.getByRole("button", { name: "측면 영역 열기" }));
  const drawer = screen.getByRole("dialog", { name: "측면 상세" });
  expect(
    within(drawer).getByRole("tablist", { name: "상세 보기" }),
  ).toBeInTheDocument();
  await userEvent.click(
    within(drawer).getByRole("button", { name: "하단 영역 열기" }),
  );
  await userEvent.click(
    within(screen.getByRole("dialog", { name: "하단 선택" })).getByRole(
      "button",
      { name: "선택 적용" },
    ),
  );
  expect(screen.getByRole("dialog", { name: "측면 상세" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("선택 적용됨");
  expect(document.body.style.overflow).toBe("hidden");
  await userEvent.keyboard("{Escape}");
  expect(document.body.style.overflow).toBe("");
  await userEvent.click(screen.getByRole("button", { name: "하단 영역 열기" }));
  expect(screen.getByRole("dialog", { name: "하단 선택" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
});

test("region styles are scoped, semantic-token based and responsive", () => {
  const css = readFileSync(
    "src/components/navigation-regions.css",
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((value) => !value.startsWith("@"));
  expect(selectors.length).toBeGreaterThan(10);
  selectors.forEach((value) =>
    value
      .split(",")
      .forEach((selector) => expect(selector.trim()).toMatch(/^\.ds-core\s/)),
  );
  expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(/i);
  expect(css).toContain("var(--color-selected-bg)");
  expect(css).toContain("var(--color-focus)");
  expect(css).toContain("@media (max-width: 640px)");
  expect(css).toContain("100dvh");
  expect(css).toContain("[hidden]");
});

const items = [
  { id: "home", label: "홈" },
  { id: "guide", label: "안내" },
];
test("GNB changes selection and closes its mobile disclosure", async () => {
  function Example() {
    const [selected, setSelected] = useState("home");
    return <GNB items={items} selectedId={selected} onSelect={setSelected} />;
  }
  render(<Example />);
  expect(screen.getByRole("button", { name: "홈" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "전체 탐색 펼치기" }),
  );
  expect(
    screen.getByRole("button", { name: "전체 탐색 접기" }),
  ).toHaveAttribute("aria-expanded", "true");
  await userEvent.click(screen.getByRole("button", { name: "안내" }));
  expect(screen.getByRole("button", { name: "안내" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(
    screen.getByRole("button", { name: "전체 탐색 펼치기" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("LNB collapses a group and selects an enabled destination", async () => {
  function Example() {
    const [selected, setSelected] = useState("home");
    return (
      <LNB
        groups={[
          {
            id: "start",
            label: "시작",
            items: [
              ...items,
              { id: "later", label: "준비 중", disabled: true },
            ],
          },
        ]}
        selectedId={selected}
        onSelect={setSelected}
      />
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole("button", { name: "시작" }));
  expect(screen.queryByRole("button", { name: "홈" })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "시작" }));
  await userEvent.click(screen.getByRole("button", { name: "안내" }));
  expect(screen.getByRole("button", { name: "안내" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("button", { name: "준비 중" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "영역 탐색 접기" }));
  expect(
    screen.queryByRole("button", { name: "시작" }),
  ).not.toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "영역 탐색 펼치기" }),
  );
  expect(screen.getByRole("button", { name: "시작" })).toBeVisible();
});
