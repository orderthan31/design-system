import { readFileSync } from "node:fs";
import React from "react";
import { expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DesktopWorkspaceTemplate,
  MobileWorkspaceTemplate,
  WorkspaceTemplatesGallery,
} from "../src/components/workspace-templates";

test("workspace table caption remains semantic but does not repeat its visible template heading",()=>{expect(readFileSync("src/components/workspace-templates.css","utf8")).toContain(".ds-core .wt-workspace .ds-table caption");});

const rows = [
  { id: "a", name: "가 항목", group: "첫째", order: 3 },
  { id: "b", name: "나 항목", group: "둘째", order: 1 },
  { id: "c", name: "다 항목", group: "첫째", order: 2 },
];
const columns = [
  {
    id: "name",
    header: "이름",
    value: (row: (typeof rows)[number]) => row.name,
  },
  {
    id: "order",
    header: "순서",
    value: (row: (typeof rows)[number]) => row.order,
    sortable: true,
  },
];
const navigation = {
  items: [
    { id: "all", label: "전체 항목" },
    { id: "saved", label: "보관 항목" },
  ],
  selectedId: "all",
  onSelect: vi.fn(),
};
const localNavigation = {
  groups: [
    {
      id: "group",
      label: "목록",
      items: [{ id: "recent", label: "최근 항목" }],
    },
  ],
  selectedId: "recent",
  onSelect: vi.fn(),
};

test("desktop connects search, filter, sort, paging and cross-page bulk selection", async () => {
  const onAction = vi.fn();
  render(
    <DesktopWorkspaceTemplate
      title="작업 목록"
      navigation={navigation}
      localNavigation={localNavigation}
      breadcrumbs={[{ label: "작업" }, { label: "목록" }]}
      headerActions={<button>추가 작업</button>}
      aside={<p>보조 영역</p>}
      table={{
        caption: "항목 표",
        rows,
        columns,
        rowKey: (row) => row.id,
        initialPageSize: 1,
        filter: {
          label: "분류",
          value: (row) => row.group,
          options: ["첫째", "둘째"],
        },
        bulkAction: { label: "선택 적용", onAction },
      }}
    />,
  );
  expect(screen.getByText("보조 영역")).toBeInTheDocument();
  await userEvent.type(
    screen.getByRole("searchbox", { name: "데이터 검색" }),
    "나",
  );
  expect(screen.getByText("나 항목")).toBeInTheDocument();
  expect(screen.queryByText("가 항목")).not.toBeInTheDocument();
  await userEvent.clear(screen.getByRole("searchbox", { name: "데이터 검색" }));
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "분류" }),
    "첫째",
  );
  await userEvent.click(screen.getByRole("button", { name: "순서 정렬" }));
  expect(screen.getByText("다 항목")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("checkbox", { name: "다 항목 선택" }));
  await userEvent.click(screen.getByRole("button", { name: "다음 페이지" }));
  await userEvent.click(
    screen.getByRole("checkbox", { name: "현재 페이지 전체 선택" }),
  );
  await userEvent.click(screen.getByRole("button", { name: "선택 적용" }));
  expect(onAction).toHaveBeenCalledWith([rows[0], rows[2]]);
  expect(screen.getByText("0개 선택됨")).toBeInTheDocument();
  await userEvent.click(
    within(screen.getByRole("navigation", { name: "전체 탐색" })).getByRole(
      "button",
      { name: "보관 항목" },
    ),
  );
  expect(navigation.onSelect).toHaveBeenCalledWith("saved");
  await userEvent.click(screen.getByRole("button", { name: "최근 항목" }));
  expect(localNavigation.onSelect).toHaveBeenCalledWith("recent");
});

test("mobile controls navigation, searchable selection, details apply and focus return", async () => {
  const onApply = vi.fn();
  const onSelectedAction = vi.fn();
  function Example() {
    const [selectedId, onSelect] = React.useState("all");
    const [selectedKeys, onSelectionChange] = React.useState<React.Key[]>([]);
    return (
      <MobileWorkspaceTemplate
        title="모바일 목록"
        navigation={{ ...navigation, selectedId, onSelect }}
        rows={rows}
        rowKey={(row) => row.id}
        itemTitle={(row) => row.name}
        itemDescription={(row) => row.group}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        selectedAction={{ label: "선택 실행", onAction: onSelectedAction }}
        renderDetail={(row) => <p>{row.name} 상세 내용</p>}
        onApply={onApply}
      />
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole("button", { name: "보관 항목" }));
  expect(screen.getByRole("button", { name: "보관 항목" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  expect(screen.getByRole("button", { name: "선택 실행" })).toBeDisabled();
  await userEvent.click(screen.getByRole("checkbox", { name: "가 항목 선택" }));
  await userEvent.click(screen.getByRole("button", { name: "선택 실행" }));
  expect(onSelectedAction).toHaveBeenCalledWith([rows[0]]);
  expect(
    screen.getByRole("checkbox", { name: "가 항목 선택" }),
  ).not.toBeChecked();
  await userEvent.type(
    screen.getByRole("searchbox", { name: "항목 검색" }),
    "나",
  );
  expect(screen.queryByText("가 항목")).not.toBeInTheDocument();
  const trigger = screen.getByRole("button", { name: "나 항목 상세" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "나 항목" })).toHaveTextContent(
    "나 항목 상세 내용",
  );
  await userEvent.click(screen.getByRole("button", { name: "적용" }));
  expect(onApply).toHaveBeenCalledWith(rows[1]);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  await userEvent.click(trigger);
  await userEvent.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
  expect(onApply).toHaveBeenCalledTimes(1);
  await userEvent.clear(screen.getByRole("searchbox", { name: "항목 검색" }));
  await userEvent.type(
    screen.getByRole("searchbox", { name: "항목 검색" }),
    "없는 항목",
  );
  expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
});

test("gallery shares real mutations between desktop and mobile and resets its data", async () => {
  render(<WorkspaceTemplatesGallery />);
  const desktop = within(screen.getByRole("region", { name: "PC 작업 공간" }));
  const mobile = within(
    screen.getByRole("region", { name: "모바일 작업 공간" }),
  );
  await userEvent.click(
    desktop.getByRole("checkbox", { name: "항목 01 선택" }),
  );
  await userEvent.click(desktop.getByRole("button", { name: "선택 적용" }));
  await userEvent.click(mobile.getByRole("button", { name: "적용한 항목" }));
  expect(mobile.getByText("항목 01")).toBeInTheDocument();
  expect(mobile.queryByText("항목 02")).not.toBeInTheDocument();
  await userEvent.click(mobile.getByRole("button", { name: "전체 항목" }));
  await userEvent.click(mobile.getByRole("button", { name: "항목 02 상세" }));
  await userEvent.click(screen.getByRole("button", { name: "적용" }));
  await userEvent.click(desktop.getByRole("button", { name: "적용한 항목" }));
  expect(desktop.getByText("항목 02")).toBeInTheDocument();
  expect(desktop.queryByText("항목 03")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "예시 초기화" }));
  expect(mobile.getByText("항목 03")).toBeInTheDocument();
  expect(screen.getByText("예시 초기화됨")).toBeInTheDocument();
});

test("workspace styles stay scoped and use inherited neutral tokens at compact and wide sizes", () => {
  const css = readFileSync("src/components/workspace-templates.css", "utf8");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((value) => !value.startsWith("@"));
  expect(selectors.length).toBeGreaterThan(12);
  selectors.forEach((value) =>
    value
      .split(",")
      .forEach((selector) => expect(selector.trim()).toMatch(/^\.ds-core\s/)),
  );
  expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(|font-family\s*:/i);
  expect(css).toContain("var(--color-bg-surface)");
  expect(css).toContain("var(--color-border-subtle)");
  expect(css).toContain("minmax(0, 1fr)");
  expect(css).toContain("@media (max-width: 768px)");
  expect(css).toContain("@media (max-width: 390px)");
  expect(css).toContain('.wt-mobile .nr-gnb[data-expanded="false"] ul');
  expect(
    readFileSync("src/components/workspace-templates.tsx", "utf8"),
  ).toContain('import "./workspace-templates.css"');
});
