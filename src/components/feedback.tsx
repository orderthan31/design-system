import React from "react";
import { Button } from "./atoms";
import { Badge, type Tone } from "./primitives";
export function Alert({
  title,
  children,
  tone = "running",
}: {
  title: string;
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div
      className={`alert ${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      <Badge tone={tone}>{title}</Badge>
      <div>{children}</div>
    </div>
  );
}
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
