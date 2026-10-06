import React from "react";
import { Button, Input } from "./atoms";
import { Checkbox, Select } from "./primitives";
import "./data-display.css";

export type DataColumn<T> = {
  id: string;
  header: string;
  value: (row: T) => string | number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};
export type TableProps<T> = {
  caption: string;
  rows: readonly T[];
  columns: readonly DataColumn<T>[];
  rowKey: (row: T) => React.Key;
};
export type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
};
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "페이지 탐색",
}: PaginationProps) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.max(1, Math.min(page, count));
  const visible = [...new Set([1, current - 1, current, current + 1, count])]
    .filter((value) => value >= 1 && value <= count)
    .sort((a, b) => a - b);
  return (
    <nav className="ds-pagination" aria-label={label}>
      <Button
        variant="secondary"
        disabled={current === 1}
        aria-label="이전 페이지"
        onClick={() => onPageChange(current - 1)}
      >
        이전
      </Button>
      {visible.map((value, index) => (
        <React.Fragment key={value}>
          {index > 0 && value - visible[index - 1] > 1 && (
            <span aria-hidden="true">…</span>
          )}
          <Button
            variant={value === current ? "primary" : "quiet"}
            aria-label={`${value} 페이지`}
            aria-current={value === current ? "page" : undefined}
            onClick={() => onPageChange(value)}
          >
            {value}
          </Button>
        </React.Fragment>
      ))}
      <Button
        variant="secondary"
        disabled={current === count}
        aria-label="다음 페이지"
        onClick={() => onPageChange(current + 1)}
      >
        다음
      </Button>
    </nav>
  );
}

export type DataTableProps<T> = TableProps<T> & {
  initialPageSize?: number;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  bulkAction?: { label: string; onAction: (rows: T[]) => void };
  rowLabel?: (row: T) => string;
  filter?: {
    label: string;
    value: (row: T) => string;
    options: readonly string[];
  };
};
export function DataTable<T>({
  caption,
  rows,
  columns,
  rowKey,
  initialPageSize = 5,
  filter,
  bulkAction,
  rowLabel,
  loading = false,
  error,
  onRetry,
}: DataTableProps<T>) {
  const [selection, setSelection] = React.useState<Set<React.Key>>(new Set());
  const selectedRows = rows.filter((row) => selection.has(rowKey(row)));
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(
    Math.max(1, Math.floor(initialPageSize)),
  );
  const [query, setQuery] = React.useState("");
  const [filterValue, setFilterValue] = React.useState("");
  const [sort, setSort] = React.useState<{
    id: string;
    direction: "ascending" | "descending";
  }>();
  const sorted = rows.filter(
    (row) =>
      (!filter || !filterValue || filter.value(row) === filterValue) &&
      columns.some((item) =>
        String(item.value(row))
          .toLocaleLowerCase("ko")
          .includes(query.trim().toLocaleLowerCase("ko")),
      ),
  );
  const column = columns.find((item) => item.id === sort?.id);
  if (column && sort)
    sorted.sort((a, b) => {
      const left = column.value(a),
        right = column.value(b);
      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), "ko");
      return comparison * (sort.direction === "ascending" ? 1 : -1);
    });
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const selectedVisible = visibleRows.filter((row) =>
    selection.has(rowKey(row)),
  ).length;
  function toggle(key: React.Key) {
    setSelection((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  if (loading)
    return (
      <div className="ds-data-state" aria-busy="true">
        <p role="status">데이터를 불러오는 중…</p>
      </div>
    );
  if (error)
    return (
      <div className="ds-data-state">
        <p role="alert">{error}</p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            다시 시도
          </Button>
        )}
      </div>
    );
  return (
    <div className="ds-data-table">
      <div className="ds-data-toolbar">
        <label>
          데이터 검색
          <Input
            type="search"
            aria-label="데이터 검색"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        {filter && (
          <label>
            {filter.label}
            <Select
              aria-label={filter.label}
              value={filterValue}
              onChange={(event) => {
                setFilterValue(event.target.value);
                setPage(1);
              }}
            >
              <option value="">전체</option>
              {filter.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </Select>
          </label>
        )}
      </div>
      <div className="ds-data-selection">
        <span role="status">{selectedRows.length}개 선택됨</span>
        {bulkAction && (
          <Button
            variant="secondary"
            disabled={!selectedRows.length}
            onClick={() => {
              bulkAction.onAction(selectedRows);
              setSelection(new Set());
            }}
          >
            {bulkAction.label}
          </Button>
        )}
      </div>
      {sorted.length === 0 && (
        <p role="status">
          {query || filterValue
            ? "검색 결과가 없습니다."
            : "표시할 데이터가 없습니다."}
        </p>
      )}
      <div
        className="ds-table-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${caption} 스크롤 영역`}
      >
        <table className="ds-table">
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">
                <Checkbox
                  label="현재 페이지 전체 선택"
                  checked={
                    visibleRows.length > 0 &&
                    selectedVisible === visibleRows.length
                  }
                  mixed={
                    selectedVisible > 0 && selectedVisible < visibleRows.length
                  }
                  disabled={!visibleRows.length}
                  onChange={() =>
                    setSelection((previous) => {
                      const next = new Set(previous);
                      visibleRows.forEach((row) => {
                        if (selectedVisible === visibleRows.length)
                          next.delete(rowKey(row));
                        else next.add(rowKey(row));
                      });
                      return next;
                    })
                  }
                />
              </th>
              {columns.map((item) => (
                <th
                  key={item.id}
                  scope="col"
                  aria-sort={
                    item.sortable
                      ? sort?.id === item.id
                        ? sort.direction
                        : "none"
                      : undefined
                  }
                >
                  {item.sortable ? (
                    <Button
                      variant="quiet"
                      aria-label={`${item.header} 정렬`}
                      onClick={() =>
                        setSort({
                          id: item.id,
                          direction:
                            sort?.id === item.id &&
                            sort.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        })
                      }
                    >
                      {item.header} ↕
                    </Button>
                  ) : (
                    item.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={rowKey(row)}
                data-selected={selection.has(rowKey(row)) || undefined}
              >
                <td>
                  <Checkbox
                    label={`${rowLabel?.(row) ?? columns[0]?.value(row) ?? rowKey(row)} 선택`}
                    checked={selection.has(rowKey(row))}
                    onChange={() => toggle(rowKey(row))}
                  />
                </td>
                {columns.map((item) => (
                  <td key={item.id}>{item.render?.(row) ?? item.value(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ds-data-footer">
        <label>
          페이지당 행 수
          <Select
            aria-label="페이지당 행 수"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[...new Set([pageSize, Math.max(1, Math.floor(initialPageSize)), 5, 10, 20])]
              .sort((a, b) => a - b)
              .map((size) => (
                <option key={size} value={size}>
                  {size}개
                </option>
              ))}
          </Select>
        </label>
        <span role="status">
          총 {sorted.length}개 · {currentPage} / {pageCount} 페이지
        </span>
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  label: string;
};
export function List({ label, className = "", ...props }: ListProps) {
  return (
    <ul {...props} aria-label={label} className={`ds-list ${className}`} />
  );
}
export type ListItemProps = {
  title: string;
  description?: React.ReactNode;
  thumbnail?: React.ReactNode;
  selected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  action?: { label: string; onClick: () => void };
};
export function ListItem({
  title,
  description,
  thumbnail,
  selected = false,
  onSelectionChange,
  action,
}: ListItemProps) {
  return (
    <li className="ds-list-item" data-selected={selected || undefined}>
      {onSelectionChange && (
        <Checkbox
          label={`${title} 선택`}
          checked={selected}
          onChange={(event) => onSelectionChange(event.target.checked)}
        />
      )}
      {thumbnail && <div className="ds-list-thumbnail">{thumbnail}</div>}
      <div className="ds-list-content">
        <strong>{title}</strong>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Button variant="secondary" size="small" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </li>
  );
}

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

export function Table<T>({ caption, rows, columns, rowKey }: TableProps<T>) {
  return (
    <div
      className="ds-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={`${caption} 스크롤 영역`}
    >
      <table className="ds-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.id}>
                  {column.render?.(row) ?? column.value(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
