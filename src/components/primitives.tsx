import React from "react";
export function Separator() {
  return <hr className="separator" />;
}
import { Button, type ButtonProps } from "./atoms";
export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`control textarea ${props.className ?? ""}`}
    />
  );
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select data-slot="native-select" {...props} className={`control ${props.className ?? ""}`} />;
}
export function Checkbox({
  label,
  mixed = false,
  ...props
}: {
  label: string;
  mixed?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  return (
    <label className="checkbox">
      <input {...props} ref={ref} type="checkbox" />
      <span>{label}</span>
    </label>
  );
}
export function IconButton({
  label,
  children,
  ...props
}: { label: string } & ButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant ?? "secondary"}
      className="icon-button"
      aria-label={label}
    >
      {children}
    </Button>
  );
}
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
