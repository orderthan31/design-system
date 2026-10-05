import React from "react";
import { readFileSync } from "node:fs";
import { test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as display from "../src/components/data-display";
const rows = [
  { id: "c", name: "초록", group: "차가운 색", score: 30 },
  { id: "a", name: "빨강", group: "따뜻한 색", score: 10 },
  { id: "b", name: "파랑", group: "차가운 색", score: 20 },
  { id: "d", name: "노랑", group: "따뜻한 색", score: 40 },
  { id: "e", name: "보라", group: "차가운 색", score: 50 },
];
const columns: display.DataColumn<(typeof rows)[number]>[] = [
  { id: "name", header: "이름", value: (row) => row.name },
  { id: "score", header: "순서", value: (row) => row.score, sortable: true },
];
function renderData(
  extra: Partial<display.DataTableProps<(typeof rows)[number]>> = {},
) {
  const { DataTable } = display;
  return render(
    <DataTable
      caption="색상 데이터"
      rows={rows}
      columns={columns}
      rowKey={(row: (typeof rows)[number]) => row.id}
      initialPageSize={2}
      {...extra}
    />,
  );
}
test("DataTable sorts numbers through accessible native column headers", async () => {
  renderData();
  await userEvent.click(screen.getByRole("button", { name: "순서 정렬" }));
  expect(screen.getByRole("columnheader", { name: /순서/ })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("빨강");
  await userEvent.click(screen.getByRole("button", { name: "순서 정렬" }));
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("보라");
});
test("search and column filtering compose and report an empty result", async () => {
  renderData({
    filter: {
      label: "색 계열",
      value: (row: (typeof rows)[number]) => row.group,
      options: ["따뜻한 색", "차가운 색"],
    },
  });
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "색 계열" }),
    "차가운 색",
  );
  await userEvent.type(
    screen.getByRole("searchbox", { name: "데이터 검색" }),
    "파랑",
  );
  expect(screen.getByRole("cell", { name: "파랑" })).toBeInTheDocument();
  expect(screen.queryByRole("cell", { name: "초록" })).not.toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "색 계열" }),
    "따뜻한 색",
  );
  expect(screen.getByText("검색 결과가 없습니다.")).toBeInTheDocument();
});

test("pagination and page size share the filtered sorted result", async () => {
  renderData();
  await userEvent.click(screen.getByRole("button", { name: "다음 페이지" }));
  expect(screen.getByRole("cell", { name: "파랑" })).toBeInTheDocument();
  expect(screen.queryByRole("cell", { name: "초록" })).not.toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "페이지당 행 수" }),
    "5",
  );
  expect(screen.getAllByRole("row")).toHaveLength(6);
  expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "페이지당 행 수" }),
    "2",
  );
  await userEvent.click(screen.getByRole("button", { name: "3 페이지" }));
  await userEvent.type(
    screen.getByRole("searchbox", { name: "데이터 검색" }),
    "빨강",
  );
  expect(screen.getByRole("cell", { name: "빨강" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "1 페이지" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("row selection persists across pages and select-all applies to visible rows before bulk action", async () => {
  const received: string[][] = [];
  renderData({
    bulkAction: {
      label: "선택 항목 모으기",
      onAction: (selected: typeof rows) =>
        received.push(selected.map((row) => row.id)),
    },
  });
  expect(
    screen.getByRole("button", { name: "선택 항목 모으기" }),
  ).toBeDisabled();
  await userEvent.click(screen.getByRole("checkbox", { name: "초록 선택" }));
  expect(
    (
      screen.getByRole("checkbox", {
        name: "현재 페이지 전체 선택",
      }) as HTMLInputElement
    ).indeterminate,
  ).toBe(true);
  await userEvent.click(
    screen.getByRole("checkbox", { name: "현재 페이지 전체 선택" }),
  );
  expect(screen.getByRole("checkbox", { name: "빨강 선택" })).toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "다음 페이지" }));
  await userEvent.click(screen.getByRole("checkbox", { name: "파랑 선택" }));
  expect(screen.getByText("3개 선택됨")).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "선택 항목 모으기" }),
  );
  expect(received).toEqual([["c", "a", "b"]]);
  expect(screen.getByText("0개 선택됨")).toBeInTheDocument();
});

test("loading and error states suppress stale rows and retry can recover", async () => {
  let retries = 0;
  const view = renderData({ loading: true });
  expect(screen.getByText("데이터를 불러오는 중…")).toBeInTheDocument();
  expect(screen.queryByRole("cell", { name: "초록" })).not.toBeInTheDocument();
  view.rerender(
    <display.DataTable
      caption="색상 데이터"
      rows={rows}
      columns={columns}
      rowKey={(row) => row.id}
      error="연결을 확인해 주세요."
      onRetry={() => {
        retries += 1;
      }}
    />,
  );
  expect(screen.getByRole("alert")).toHaveTextContent("연결을 확인해 주세요.");
  await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(retries).toBe(1);
  view.rerender(
    <display.DataTable
      caption="색상 데이터"
      rows={[]}
      columns={columns}
      rowKey={(row) => row.id}
    />,
  );
  expect(screen.getByText("표시할 데이터가 없습니다.")).toBeInTheDocument();
});

test("ListItem keeps native list semantics with controlled selection and action handlers", async () => {
  expect(display).toHaveProperty("List", expect.any(Function));
  expect(display).toHaveProperty("ListItem", expect.any(Function));
  let actions = 0;
  const { List, ListItem } = display;
  function Example() {
    const [selected, setSelected] = React.useState(false);
    return (
      <List label="견본 목록">
        <ListItem title="기본 항목" description="간단한 설명" />
        <ListItem
          title="선택 항목"
          selected={selected}
          onSelectionChange={setSelected}
        />
        <ListItem
          title="미리 보기"
          thumbnail={
            <span role="img" aria-label="도형 미리 보기">
              ◈
            </span>
          }
          action={{
            label: "항목 열기",
            onClick: () => {
              actions += 1;
            },
          }}
        />
      </List>
    );
  }
  render(<Example />);
  expect(screen.getByRole("list", { name: "견본 목록" })).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  await userEvent.click(
    screen.getByRole("checkbox", { name: "선택 항목 선택" }),
  );
  expect(
    screen.getByRole("checkbox", { name: "선택 항목 선택" }),
  ).toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "항목 열기" }));
  expect(actions).toBe(1);
  expect(
    screen.getByRole("img", { name: "도형 미리 보기" }),
  ).toBeInTheDocument();
});

test("gallery demonstrates live bulk removal, list actions, loading completion and error retry", async () => {
  expect(display).toHaveProperty("DataDisplayGallery", expect.any(Function));
  const Gallery = display.DataDisplayGallery;
  render(<Gallery />);
  const table = screen.getByRole("table", { name: "색상 데이터 탐색" });
  await userEvent.click(
    within(table).getByRole("checkbox", { name: "파랑 선택" }),
  );
  await userEvent.click(screen.getByRole("button", { name: "선택 항목 제외" }));
  expect(
    within(table).queryByRole("cell", { name: "파랑" }),
  ).not.toBeInTheDocument();
  expect(screen.getByText("1개 항목을 제외했습니다.")).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("checkbox", { name: "선택 가능한 항목 선택" }),
  );
  expect(screen.getByText("목록에서 1개 선택됨")).toBeInTheDocument();
  await userEvent.click(
    screen.getByRole("button", { name: "항목 자세히 보기" }),
  );
  expect(screen.getByText("작업 항목을 열었습니다.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "미리 보기 열기" }));
  expect(screen.getByText("도형 미리 보기를 열었습니다.")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "불러오기 완료" }));
  expect(screen.queryByText("데이터를 불러오는 중…")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(
    screen.getByRole("table", { name: "오류 복구 예시" }),
  ).toBeInTheDocument();
});

test("data display styles scope every selector and preserve narrow-screen overflow containment", () => {
  const css = (() => {
    try {
      return readFileSync("src/components/data-display.css", "utf8");
    } catch {
      return "";
    }
  })();
  expect(css).toContain(".ds-core .ds-table-scroll");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((selector) => !selector.startsWith("@"));
  for (const selector of selectors)
    for (const part of selector.split(","))
      expect(part.trim()).toMatch(/^\.ds-core\s/);
  expect(css).toMatch(/overflow-x:\s*auto/);
  expect(css).toMatch(/@media\s*\(max-width:\s*480px\)/);
  expect(css).toContain("var(--color-selected-bg)");
});

test("Table renders generic rows with native column headers and a caption", async () => {
  const { Table } = display;
  render(
    <Table
      caption="색상 표"
      rows={[{ key: "a", name: "파랑" }]}
      rowKey={(row: { key: string }) => row.key}
      columns={[
        {
          id: "name",
          header: "이름",
          value: (row: { name: string }) => row.name,
        },
      ]}
    />,
  );
  expect(screen.getByRole("table", { name: "색상 표" })).toBeInTheDocument();
  expect(screen.getByRole("columnheader", { name: "이름" })).toHaveAttribute(
    "scope",
    "col",
  );
  expect(screen.getByRole("cell", { name: "파랑" })).toBeInTheDocument();
});
