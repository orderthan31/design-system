import React from "react";
import type { TableProps } from "./table";
import { Input } from "./input";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Select } from "./select";
import { Pagination } from "./pagination";
import "./table.css";
import "./data-table.css";
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
