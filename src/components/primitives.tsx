import React from "react";
import "./input.css";
export function Separator() {
  return <hr className="separator" />;
}
export {Textarea} from "./textarea";
export {Select} from "./select";
export {Checkbox} from "./checkbox";
export {IconButton} from "./icon-button";
export type Tone = "neutral" | "running" | "success" | "review" | "error";
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Progress({
  value,
  label = "진행률",
}: {
  value?: number;
  label?: string;
}) {
  return (
    <div className="progress-group">
      <div className="row">
        <span>{label}</span>
        <span>
          {value === undefined
            ? "진행 중"
            : `${Math.max(0, Math.min(100, value))}%`}
        </span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={
          value === undefined ? undefined : Math.max(0, Math.min(100, value))
        }
      >
        <span
          className={value === undefined ? "indeterminate" : ""}
          style={{
            width:
              value === undefined
                ? "35%"
                : `${Math.max(0, Math.min(100, value))}%`,
          }}
        />
      </div>
    </div>
  );
}
export function Skeleton({ label = "콘텐츠 불러오는 중" }: { label?: string }) {
  return (
    <div role="status">
      <span className="sr-only">{label}</span>
      <div className="skeleton" aria-hidden="true" />
      <div className="skeleton short" aria-hidden="true" />
    </div>
  );
}
