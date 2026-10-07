import React from "react";
import "./skeleton.css";
export function Skeleton({ label = "콘텐츠 불러오는 중" }: { label?: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div className="skeleton" aria-hidden="true" />
      <div className="skeleton short" aria-hidden="true" />
    </div>
  );
}
