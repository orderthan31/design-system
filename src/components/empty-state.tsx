import React from "react";
import {Button} from "./button";
import "./empty-state.css";
export function EmptyState({
  title,
  children,
  action = "항목 추가",
  onAction,
  loading = false,
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="empty">
      <span className="empty-icon" aria-hidden="true">
        ◇
      </span>
      <h3>{title}</h3>
      <div>{children}</div>
      <Button loading={loading} onClick={onAction}>
        {action}
      </Button>
    </div>
  );
}
