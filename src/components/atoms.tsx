import React from "react";
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {loading?:boolean;busyLabel?:string};
export function Input({loading=false,busyLabel='입력 확인 중…',...props}:InputProps) {
  const busyId=React.useId();
  const input=<input {...props} data-slot="input" className={`control ${props.className ?? ""}`} aria-busy={loading?true:props['aria-busy']} aria-describedby={[props['aria-describedby'],loading?busyId:undefined].filter(Boolean).join(' ')||undefined}/>;
  return <>{input}{loading && <span role="status" id={busyId} className="help"><span aria-hidden="true" className="spinner"/> {busyLabel}</span>}</>;
}
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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
      data-slot="button"
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
