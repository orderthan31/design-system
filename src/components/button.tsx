import React from "react";
import "./button.css";
export type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  "data-slot"?: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "quiet" | "ghost" | "destructive";
  size?: "small" | "medium" | "large";
};
export function Button({
  children,
  loading = false,
  variant = "primary",
  size = "medium",
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      data-slot={props["data-slot"]??"button"}
      data-variant={variant}
      data-size={size}
      type={props.type ?? "button"}
      className={`button ${variant} ${size} ${className}`}
      aria-busy={loading || undefined}
      aria-disabled={loading || props.disabled || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      {loading && <span aria-hidden="true" className="spinner" />}
      {children}
    </button>
  );
}
