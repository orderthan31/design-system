import React from "react";
import {useNativeFormReset} from "./native-form-reset";
import "./rating.css";
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
