import React from "react";
import { Button } from "./button";
import "./pagination.css";
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
