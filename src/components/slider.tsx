import React from "react";
import {useNativeFormReset} from "./native-form-reset";
import "./slider.css";
export type SliderProps = {
  label: string;
  id?: string;
  name?: string;
  form?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  disabled?: boolean;
};
export function Slider({
  label,
  id: supplied,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const generated = React.useId();
  const id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue ?? min);
  const initial = React.useRef(defaultValue ?? min);
  const inputRef = React.useRef<HTMLInputElement>(null);
  useNativeFormReset(inputRef, props.form, () => {
    const restored = value ?? initial.current;
    if (value === undefined) setInternal(restored);
    if (inputRef.current) inputRef.current.value = String(restored);
  });
  const current = value ?? internal;
  // Invalid application props are programmer errors, not silently clamped form data.
  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max) ||
    min > max ||
    (step !== "any" && (!Number.isFinite(step) || step <= 0)) ||
    !Number.isFinite(current) ||
    current < min ||
    current > max ||
    (step !== "any" &&
      Math.abs((current - min) / step - Math.round((current - min) / step)) >
        1e-8)
  ) {
    throw new RangeError(
      "Slider: 유한한 범위와 양수 step(또는 any), 범위 안의 min 기준 단위에 맞는 값이 필요합니다.",
    );
  }
  return (
    <div className="rs-slider">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        ref={inputRef}
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? internal}
        onChange={(event) => {
          if (event.currentTarget.matches(":disabled")) {
            event.currentTarget.value = String(current);
            return;
          }
          const next = event.currentTarget.valueAsNumber;
          if (!Number.isFinite(next) || !event.currentTarget.validity.valid) {
            event.currentTarget.value = String(current);
            return;
          }
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
      />
    </div>
  );
}
