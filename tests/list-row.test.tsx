import React from "react";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { List } from "../src/components/data-display";
import { ListRow, ListHeader, ListFooter } from "../src/components/list-row";
import { ListDetail } from "../src/gallery/list-detail";

test("row exposes leading, content and trailing inside a native list item", () => {
  const { container } = render(
    <List label="작업">
      <ListRow
        title="검토"
        description="긴 설명"
        leading={<span>아이콘</span>}
        content={<span>추가 내용</span>}
        trailing={<span>오늘</span>}
      />
    </List>,
  );
  const row = screen.getByRole("listitem");
  expect(row.tagName).toBe("LI");
  expect(row.parentElement?.tagName).toBe("UL");
  expect(within(row).getByText("검토")).toBeVisible();
  expect(within(row).getByText("긴 설명")).toBeVisible();
  expect(within(row).getByText("추가 내용")).toBeVisible();
  for (const slot of ["leading", "content", "trailing"])
    expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
  expect(row).not.toHaveAttribute("role");
  expect(row).not.toHaveAttribute("tabindex");
});

test("selection is controlled and independent from the native action button", async () => {
  const selected: boolean[] = [];
  let actions = 0;
  const view = render(
    <List label="작업">
      <ListRow
        title="검토"
        selected={false}
        onSelectionChange={(value) => selected.push(value)}
        action={{
          label: "열기",
          onClick: () => {
            actions += 1;
          },
        }}
      />
    </List>,
  );
  const checkbox = screen.getByRole("checkbox", { name: "검토 선택" });
  await userEvent.click(checkbox);
  expect(selected).toEqual([true]);
  expect(checkbox).not.toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "열기" }));
  expect(actions).toBe(1);
  expect(selected).toEqual([true]);
  view.rerender(
    <List label="작업">
      <ListRow
        title="검토"
        selected
        onSelectionChange={(value) => selected.push(value)}
      />
    </List>,
  );
  expect(screen.getByRole("checkbox")).toBeChecked();
  expect(screen.getByRole("listitem")).toHaveAttribute("data-selected", "true");
  expect(view.container.querySelector("button button")).toBeNull();
});

test("disabled owned controls preserve controlled selection and suppress callbacks", async () => {
  const values: boolean[] = [];
  let actions = 0;
  render(
    <List label="작업">
      <ListRow
        title="잠금"
        disabled
        selected
        onSelectionChange={(value) => values.push(value)}
        action={{
          label: "수정",
          onClick: () => {
            actions += 1;
          },
        }}
        trailing={
          <button
            onClick={() => {
              actions += 10;
            }}
          >
            소비자 동작
          </button>
        }
      />
    </List>,
  );
  const checkbox = screen.getByRole("checkbox");
  const button = screen.getByRole("button", { name: "수정" });
  expect(checkbox).toBeDisabled();
  expect(button).toBeDisabled();
  await userEvent.click(checkbox);
  await userEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(checkbox);
  expect(checkbox).toBeChecked();
  expect(values).toEqual([]);
  expect(actions).toBe(0);
  await userEvent.click(screen.getByRole("button", { name: "소비자 동작" }));
  expect(actions).toBe(10);
});

test("header and footer compose content and actions outside the list", async () => {
  let count = 0;
  const view = render(
    <section>
      <ListHeader
        title="검토 목록"
        description="대기 작업"
        actions={
          <button
            onClick={() => {
              count += 1;
            }}
          >
            추가
          </button>
        }
      >
        <span>검색 도구</span>
      </ListHeader>
      <List label="검토">
        <ListRow title="항목" />
      </List>
      <ListFooter
        actions={
          <button
            onClick={() => {
              count += 1;
            }}
          >
            적용
          </button>
        }
      >
        <span>1개</span>
      </ListFooter>
    </section>,
  );
  expect(
    screen.getByRole("heading", { name: "검토 목록", level: 3 }),
  ).toBeVisible();
  expect(screen.getByText("검색 도구")).toBeVisible();
  expect(screen.getByText("1개")).toBeVisible();
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  expect(view.container.querySelector("ul header, ul footer")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "추가" }));
  await userEvent.click(screen.getByRole("button", { name: "적용" }));
  expect(count).toBe(2);
});

test("row CSS scopes every selector and contains long text and actions on narrow screens", () => {
  let css = "";
  try {
    css = readFileSync("src/components/list-row.css", "utf8");
  } catch {
    /* missing feature */
  }
  expect(css).toContain(".ds-core .ds-list-row");
  for (const match of css.matchAll(/([^{}]+)\{/g)) {
    const selector = match[1].trim();
    if (!selector.startsWith("@"))
      for (const part of selector.split(","))
        expect(part.trim()).toMatch(/^\.ds-core\s/);
  }
  expect(css).toMatch(/min-width:\s*0/);
  expect(css).toMatch(/overflow-wrap:\s*anywhere/);
  expect(css).toMatch(/@media\s*\(max-width:\s*480px\)/);
  expect(css).toMatch(/min-height:\s*44px/);
  expect(css).toContain("var(--color-selected-bg)");
  expect(css).not.toMatch(/font-family|line-clamp|text-overflow:\s*ellipsis/);
});

test("detail renders live row combinations with folded Korean API documentation and no app chrome", () => {
  const { container } = render(<ListDetail />);
  const list = screen.getByRole("list", { name: "검토 항목" });
  expect(within(list).getAllByRole("listitem")).toHaveLength(4);
  expect(
    within(list).getByRole("checkbox", { name: "화면 검토 선택" }),
  ).toBeChecked();
  expect(
    within(list).getByRole("checkbox", { name: "문서 정리 선택" }),
  ).not.toBeChecked();
  expect(
    within(list).getByRole("checkbox", { name: "잠긴 항목 선택" }),
  ).toBeDisabled();
  expect(within(list).getByText("오늘")).toBeVisible();
  expect(container.querySelector("svg")).not.toBeNull();
  expect(container.querySelector("h1, nav, aside, button button")).toBeNull();
  for (const label of [
    "가져오기",
    "속성",
    "타입",
    "기본값",
    "조합",
    "접근성",
  ]) {
    const summary = screen.getByText(label, { selector: "summary" });
    expect(summary.closest("details")).not.toHaveAttribute("open");
  }
});

test("detail selection, individual action and bulk action update real memory rows and status", async () => {
  render(<ListDetail />);
  await userEvent.click(
    screen.getByRole("checkbox", { name: "문서 정리 선택" }),
  );
  expect(
    screen.getByRole("checkbox", { name: "문서 정리 선택" }),
  ).toBeChecked();
  expect(screen.getByText("2개 선택")).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "문서 정리 열기" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "문서 정리 항목을 열었습니다.",
  );
  await userEvent.click(screen.getByRole("button", { name: "선택 완료" }));
  const rows = within(
    screen.getByRole("list", { name: "검토 항목" }),
  ).getAllByRole("listitem");
  expect(rows.filter((row) => within(row).queryByText("완료"))).toHaveLength(2);
  expect(screen.getByText("0개 선택")).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent(
    "2개 항목을 완료했습니다.",
  );
  expect(screen.getByRole("button", { name: "선택 완료" })).toBeDisabled();
  expect(
    screen.getByRole("checkbox", { name: "잠긴 항목 선택" }),
  ).not.toBeChecked();
});

test("detail search and filter compose, preserve hidden selection and recover from empty results", async () => {
  render(<ListDetail />);
  const list = screen.getByRole("list", { name: "검토 항목" });
  const search = screen.getByRole("searchbox", { name: "항목 검색" });
  await userEvent.type(search, "문서");
  expect(within(list).getAllByRole("listitem")).toHaveLength(1);
  expect(within(list).getByText("문서 정리")).toBeVisible();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "분류" }),
    "검토",
  );
  expect(screen.getByText("검색 결과 없음")).toBeVisible();
  expect(within(list).queryAllByRole("listitem")).toHaveLength(0);
  await userEvent.clear(search);
  expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  expect(
    within(list).getByRole("checkbox", { name: "화면 검토 선택" }),
  ).toBeChecked();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "분류" }),
    "전체",
  );
  expect(within(list).getAllByRole("listitem")).toHaveLength(4);
});

test("consumer trailing button is live and stays separate from row selection", async () => {
  render(<ListDetail />);
  await userEvent.click(screen.getByRole("button", { name: "안내 확인" }));
  expect(screen.getByRole("status")).toHaveTextContent("안내를 확인했습니다.");
  expect(screen.getByRole("checkbox", { name: "안내 선택" })).not.toBeChecked();
});
