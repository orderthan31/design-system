import React from "react";
import { Field, described, type FieldProps } from "./field-frame";
import { Input } from "./input";
import { Button } from "./button";
import "./numeric-input-layout.css";
export type NumberInputProps = FieldProps & {
  value?: number | "";
  defaultValue?: number | "";
  onValueChange?: (value: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
};
export function NumberInput({
  label,
  value,
  defaultValue = "",
  onValueChange,
  min,
  max,
  step = 1,
  hint,
  error,
  id: supplied,
  ...props
}: NumberInputProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState<number | "">(defaultValue);
  const [draft, setDraft] = React.useState<number | "" | undefined>();
  const [touched, setTouched] = React.useState(false);
  React.useLayoutEffect(() => setDraft(undefined), [value]);
  const current = draft ?? value ?? internal;
  const validStep = Number.isFinite(step) && step > 0;
  const base = min ?? 0;
  const alignedMax =
    max === undefined
      ? undefined
      : Number(
          (base + Math.floor((max - base) / step + 1e-8) * step).toPrecision(
            15,
          ),
        );
  const isInvalid = (next: number | "") =>
    !validStep ||
    (next === ""
      ? !!props.required
      : !Number.isFinite(next) ||
        (min !== undefined && next < min) ||
        (max !== undefined && next > max) ||
        Math.abs((next - base) / step - Math.round((next - base) / step)) >
          1e-8);
  const invalid = isInvalid(current);
  const message =
    error ||
    (touched && invalid ? "허용 범위와 입력 단위를 확인해 주세요." : undefined);
  const change = (next: number | "", manual = false) => {
    setInternal(next);
    setDraft(manual && isInvalid(next) ? next : undefined);
    if (!isInvalid(next)) onValueChange?.(next);
  };
  const controlRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    controlRef.current
      ?.querySelector("input")
      ?.setCustomValidity(
        error || (invalid ? "허용 범위와 입력 단위를 확인해 주세요." : ""),
      );
  }, [error, invalid]);
  const nextValue = (direction: number) => {
    if (!validStep || (current !== "" && !Number.isFinite(current))) return;
    const position = ((current === "" ? base : current) - base) / step;
    const rounded = Math.round(position);
    const gridPosition =
      Math.abs(position - rounded) < 1e-8 ? rounded : position;
    const index =
      direction > 0
        ? Math.floor(gridPosition) + 1
        : Math.ceil(gridPosition) - 1;
    const next = Number(
      Math.max(
        min ?? -Infinity,
        Math.min(alignedMax ?? Infinity, base + index * step),
      ).toPrecision(15),
    );
    if (
      !Number.isFinite(next) ||
      (min !== undefined && next < min) ||
      (max !== undefined && next > max) ||
      (current !== "" && (direction > 0 ? next <= current : next >= current))
    )
      return;
    return next;
  };
  const decrease = nextValue(-1);
  const increase = nextValue(1);
  const move = (next: number | undefined) => {
    if (!props.disabled && next !== undefined) change(next);
  };
  return (
    <Field {...props} label={label} id={id} hint={hint} error={message}>
      <div className="fc-inline" ref={controlRef}>
        <Button
          variant="secondary"
          aria-label={`${label} 감소`}
          disabled={props.disabled || decrease === undefined}
          onClick={() => move(decrease)}
        >
          −
        </Button>
        <Input
          {...props}
          id={id}
          type="number"
          min={min}
          max={max}
          step={validStep ? step : undefined}
          value={current === "" || Number.isFinite(current) ? current : ""}
          onChange={(event) =>
            change(
              event.target.value === "" ? "" : event.target.valueAsNumber,
              true,
            )
          }
          onBlur={() => setTouched(true)}
          aria-invalid={!!message}
          aria-describedby={described(id, hint, message)}
        />
        <Button
          variant="secondary"
          aria-label={`${label} 증가`}
          disabled={props.disabled || increase === undefined}
          onClick={() => move(increase)}
        >
          +
        </Button>
      </div>
    </Field>
  );
}
export const Stepper = NumberInput;
export type StepperProps = NumberInputProps;
