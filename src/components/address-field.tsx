import React from "react";
import { Field, described, type FieldProps } from "./field-frame";
import { Input } from "./input";
import { Button } from "./button";
import "./address-field.css";
import "./field-group.css";
export type AddressValue = {
  road: string;
  jibun: string;
  postal: string;
  detail: string;
};

export type AddressFieldProps = FieldProps & {
  value?: AddressValue;
  defaultValue?: AddressValue;
  onValueChange?: (value: AddressValue) => void;
  onSearch?: (select: (value: AddressValue) => void) => void;
  searchSlot?:
    | React.ReactNode
    | ((select: (value: AddressValue) => void) => React.ReactNode);
};

export function AddressField({
  label = "주소",
  value,
  defaultValue = { road: "", jibun: "", postal: "", detail: "" },
  onValueChange,
  onSearch,
  searchSlot,
  hint,
  error,
  id: supplied,
  ...props
}: AddressFieldProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue),
    [touched, setTouched] = React.useState(false);
  const current = value ?? internal;
  const selectionState = React.useRef({
    disabled: props.disabled,
    onValueChange,
  });
  React.useLayoutEffect(() => {
    selectionState.current = { disabled: props.disabled, onValueChange };
  }, [props.disabled, onValueChange]);
  // External search providers may retain this callback across disabled renders.
  // Accept results only when currently enabled, using the latest change handler.
  const select = React.useCallback((next: AddressValue) => {
    if (selectionState.current.disabled) return;
    setInternal(next);
    selectionState.current.onValueChange?.(next);
  }, []);
  const message =
    error ||
    (touched && current.postal && !/^\d{5}$/.test(current.postal)
      ? "우편번호는 5자리 숫자로 입력해 주세요."
      : undefined);
  return (
    <fieldset className="fc-group fc-address" disabled={props.disabled}>
      <legend>
        {label}
        {props.required && " (필수)"}
      </legend>
      {onSearch && (
        <Button
          variant="secondary"
          disabled={props.disabled}
          onClick={() => onSearch(select)}
        >
          주소 검색
        </Button>
      )}
      {typeof searchSlot === "function" ? searchSlot(select) : searchSlot}
      {(["postal", "road", "jibun", "detail"] as const).map((key) => (
        <Field
          key={key}
          id={`${id}-${key}`}
          label={
            {
              postal: "우편번호",
              road: "도로명 주소",
              jibun: "지번 주소",
              detail: "상세 주소",
            }[key]
          }
          required={props.required && (key === "postal" || key === "road")}
        >
          <Input
            id={`${id}-${key}`}
            name={props.name ? `${props.name}.${key}` : undefined}
            value={current[key]}
            required={props.required && (key === "postal" || key === "road")}
            disabled={props.disabled}
            inputMode={key === "postal" ? "numeric" : undefined}
            pattern={key === "postal" ? "[0-9]{5}" : undefined}
            autoComplete={
              {
                postal: "postal-code",
                road: "address-line1",
                jibun: "off",
                detail: "address-line2",
              }[key]
            }
            aria-invalid={key === "postal" && !!message}
            aria-describedby={described(id, hint, message)}
            onBlur={() => setTouched(true)}
            onChange={(event) =>
              select({ ...current, [key]: event.target.value })
            }
          />
        </Field>
      ))}
      {hint && (
        <p id={`${id}-hint`} className="help">
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} role="alert" className="error">
          {message}
        </p>
      )}
    </fieldset>
  );
}
