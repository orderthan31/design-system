import React from "react";
import "./range-selection.css";

// Reset after the native default action; cancelled resets and controlled owners remain authoritative.
function useNativeFormReset<T extends HTMLElement>(ref: React.RefObject<T | null>, formId: string | undefined, reset: () => void) {
  const latest = React.useRef(reset);
  latest.current = reset;
  React.useEffect(() => {
    const node = ref.current;
    const input = node instanceof HTMLInputElement ? node : node?.querySelector('input');
    const form = input?.form;
    if (!form) return;
    const onReset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && node?.isConnected) latest.current();
    });
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [ref, formId]);
}


export type RatingProps = {
  label: string;
  id?: string;
  name?: string;
  form?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  clearLabel?: string;
};
export function Rating({
  label,
  id: supplied,
  name,
  form,
  value,
  defaultValue = 0,
  onValueChange,
  required,
  disabled,
  clearable = false,
  clearLabel = `${label} 지우기`,
}: RatingProps) {
  const generated = React.useId();
  const id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue);
  const initial = React.useRef(defaultValue);
  const root = React.useRef<HTMLFieldSetElement>(null);
  useNativeFormReset(root, form, () => {
    const restored = value ?? initial.current;
    if (value === undefined) setInternal(restored);
    // Native reset restores defaultChecked, which may predate the latest controlled owner.
    root.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(input => {
      input.checked = Number(input.value) === restored;
    });
  });
  const current = value ?? internal;
  if (!Number.isInteger(current) || current < 0 || current > 5) {
    throw new RangeError(
      "Rating: 0(미선택)부터 5까지의 정수 점수가 필요합니다.",
    );
  }
  return (
    <fieldset ref={root} id={id} className="rs-rating" disabled={disabled}>
      <legend>
        {label}
        {required && " (필수)"}
      </legend>
      <div className="rs-scores">
        {[1, 2, 3, 4, 5].map((score) => (
          <label key={score} className="rs-score" data-filled={score <= current}>
            <input
              type="radio"
              name={name ?? id}
              form={form}
              value={score}
              checked={current === score}
              required={required}
              onChange={(event) => {
                if (event.currentTarget.matches(":disabled")) return;
                if (value === undefined) setInternal(score);
                onValueChange?.(score);
              }}
            />
            <span className="rs-star" aria-hidden="true">{score <= current ? '★' : '☆'}</span>
            <span className="sr-only">{score}점</span>
          </label>
        ))}
      </div>
      {clearable && (
        <button
          className="rs-clear"
          type="button"
          disabled={disabled}
          onClick={(event) => {
            if (event.currentTarget.matches(":disabled")) return;
            if (value === undefined) setInternal(0);
            onValueChange?.(0);
          }}
        >
          {clearLabel}
        </button>
      )}
    </fieldset>
  );
}

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
