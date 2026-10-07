import { Table, type TableProps, type DataColumn } from "./table";
export { Table } from "./table";
export type { TableProps, DataColumn } from "./table";
import React from "react";
import { Button, Input } from "./atoms";
import { Checkbox, Select } from "./primitives";
import "./data-display.css";

import { Pagination } from "./pagination";
export { Pagination, type PaginationProps } from "./pagination";

import { DataTable } from "./data-table";
export { DataTable, type DataTableProps } from "./data-table";

import { List } from "./list";
export { List, type ListProps } from "./list";
import { ListItem } from "./list-item";
export { ListItem, type ListItemProps } from "./list-item";

type SampleRow = { id: string; name: string; group: string; order: number };
const sampleRows: SampleRow[] = [
  { id: "blue", name: "파랑", group: "차가운 색", order: 3 },
  { id: "red", name: "빨강", group: "따뜻한 색", order: 1 },
  { id: "green", name: "초록", group: "차가운 색", order: 4 },
  { id: "yellow", name: "노랑", group: "따뜻한 색", order: 2 },
  { id: "purple", name: "보라", group: "차가운 색", order: 5 },
  { id: "orange", name: "주황", group: "따뜻한 색", order: 6 },
];
const sampleColumns: DataColumn<SampleRow>[] = [
  { id: "name", header: "이름", value: (row) => row.name, sortable: true },
  { id: "group", header: "계열", value: (row) => row.group },
  { id: "order", header: "순서", value: (row) => row.order, sortable: true },
];
const sampleKey = (row: SampleRow) => row.id;
export function DataDisplayGallery() {
  const [data, setData] = React.useState(sampleRows);
  const [message, setMessage] = React.useState("");
  const [listSelected, setListSelected] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(true);
  return (
    <section className="ds-data-gallery" aria-label="데이터 표시 컴포넌트">
      <h2>데이터 표시</h2>
      <section className="ds-data-example">
        <h3>기본 표</h3>
        <p>읽기 전용 표는 데이터를 간결하게 비교합니다.</p>
        <Table
          caption="색상 기본 표"
          rows={sampleRows.slice(0, 3)}
          columns={sampleColumns}
          rowKey={sampleKey}
        />
      </section>
      <section className="ds-data-example">
        <h3>데이터 테이블</h3>
        <p>
          검색과 필터는 함께 적용됩니다. 선택은 페이지를 이동해도 유지되며, 전체
          선택은 현재 페이지에만 적용됩니다.
        </p>
        <DataTable
          caption="색상 데이터 탐색"
          rows={data}
          columns={sampleColumns}
          rowKey={sampleKey}
          initialPageSize={2}
          filter={{
            label: "색 계열",
            value: (row) => row.group,
            options: ["따뜻한 색", "차가운 색"],
          }}
          bulkAction={{
            label: "선택 항목 제외",
            onAction: (selected) => {
              const keys = new Set(selected.map(sampleKey));
              setData((previous) =>
                previous.filter((row) => !keys.has(row.id)),
              );
              setMessage(`${selected.length}개 항목을 제외했습니다.`);
            },
          }}
        />
        <p role="status">{message}</p>
      </section>
      <section className="ds-data-example">
        <h3>목록</h3>
        <List label="목록 변형">
          <ListItem
            title="기본 항목"
            description="텍스트와 설명을 담은 일반 목록입니다."
          />
          <ListItem
            title="선택 가능한 항목"
            description="체크박스로 선택 상태를 변경합니다."
            selected={listSelected}
            onSelectionChange={setListSelected}
          />
          <ListItem
            title="작업 항목"
            description="버튼으로 항목을 열어 봅니다."
            action={{
              label: "항목 자세히 보기",
              onClick: () => setMessage("작업 항목을 열었습니다."),
            }}
          />
          <ListItem
            title="도형 미리 보기"
            description="썸네일과 동작을 함께 제공합니다."
            thumbnail={
              <span role="img" aria-label="도형 썸네일">
                ◈
              </span>
            }
            action={{
              label: "미리 보기 열기",
              onClick: () => setMessage("도형 미리 보기를 열었습니다."),
            }}
          />
        </List>
        <p role="status">목록에서 {listSelected ? 1 : 0}개 선택됨</p>
      </section>
      <div className="ds-data-examples">
        <section className="ds-data-example">
          <h3>빈 상태</h3>
          <DataTable
            caption="빈 데이터 예시"
            rows={[]}
            columns={sampleColumns}
            rowKey={sampleKey}
          />
        </section>
        <section className="ds-data-example">
          <h3>불러오는 상태</h3>
          <DataTable
            caption="불러오기 예시"
            rows={sampleRows.slice(0, 1)}
            columns={sampleColumns}
            rowKey={sampleKey}
            loading={loading}
          />
          {loading && (
            <Button variant="secondary" onClick={() => setLoading(false)}>
              불러오기 완료
            </Button>
          )}
        </section>
        <section className="ds-data-example">
          <h3>오류와 복구</h3>
          <DataTable
            caption="오류 복구 예시"
            rows={sampleRows.slice(0, 1)}
            columns={sampleColumns}
            rowKey={sampleKey}
            error={failed ? "데이터를 불러오지 못했습니다." : undefined}
            onRetry={() => setFailed(false)}
          />
        </section>
      </div>
    </section>
  );
}
