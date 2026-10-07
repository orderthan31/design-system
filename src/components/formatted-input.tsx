import React from "react";
import { Field, described, type FieldProps } from "./field-frame";
import { Input } from "./input";
import "./numeric-input-layout.css";
export type ValidatedInputProps = FieldProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};
type FormattedInputProps = ValidatedInputProps & {
  kind: "currency" | "phone" | "email";
};
export function FormattedInput({
  kind,
  label,
  value,
  defaultValue = "",
  onValueChange,
  error,
  hint,
  id: supplied,
  ...props
}: FormattedInputProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue),
    [touched, setTouched] = React.useState(false),
    [editing, setEditing] = React.useState(false);
  const current = value ?? internal;
  const raw = kind === "currency" ? current.replaceAll(",", "") : current;
  const valid =
    kind === "currency"
      ? /^\d+$/.test(raw) && Number.isSafeInteger(Number(raw))
      : kind === "phone"
        ? /^(?:02-?\d{3,4}-?\d{4}|0(?:1[016789]|[3-6][1-5]|70)-?\d{3,4}-?\d{4})$/.test(
            raw,
          )
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  const message =
    error ||
    (touched && (raw ? !valid : props.required)
      ? kind === "currency"
        ? "0 이상의 정수 금액을 입력해 주세요."
        : kind === "phone"
          ? "올바른 전화번호를 입력해 주세요."
          : "올바른 이메일 주소를 입력해 주세요."
      : undefined);
  const controlRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    controlRef.current
      ?.querySelector("input")
      ?.setCustomValidity(
        error ||
          (raw && !valid
            ? kind === "currency"
              ? "0 이상의 정수 금액을 입력해 주세요."
              : kind === "phone"
                ? "올바른 전화번호를 입력해 주세요."
                : "올바른 이메일 주소를 입력해 주세요."
            : ""),
      );
  }, [error, raw, valid, kind]);
  const displayed =
    kind === "currency" && !editing && valid
      ? Number(raw).toLocaleString("ko-KR")
      : current;
  const change = (next: string) => {
    setEditing(true);
    setInternal(next);
    onValueChange?.(next);
  };
  return (
    <Field {...props} label={label} id={id} hint={hint} error={message}>
      <div className="fc-inline" ref={controlRef}>
        <Input
          {...props}
          id={id}
          type={kind === "phone" ? "tel" : kind === "email" ? "email" : "text"}
          inputMode={kind === "currency" ? "numeric" : undefined}
          value={displayed}
          onBlur={() => {
            setEditing(false);
            setTouched(true);
          }}
          onChange={(event) =>
            change(
              kind === "currency"
                ? event.target.value.replaceAll(",", "")
                : event.target.value,
            )
          }
          aria-invalid={!!message}
          aria-describedby={described(id, hint, message)}
        />
        {kind === "currency" && <span className="fc-unit">원</span>}
      </div>
    </Field>
  );
}
