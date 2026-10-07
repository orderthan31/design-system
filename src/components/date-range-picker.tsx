import React from "react";
import type { DatePickerProps } from "./date-types";
import { DatePicker } from "./date-picker";
import { parseDate } from "./civil-date";
import "./date-range-picker.css";
export interface DateRangeValue {
  start: string;
  end: string;
}

export interface DateRangePickerProps
  extends Omit<DatePickerProps, "value" | "defaultValue" | "onChange"> {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
}

function dayNumber(value: string) {
  const date = parseDate(value)!;
  return date.getTime() / 86400000;
}

export function DateRangePicker({
  label = "기간",
  value,
  defaultValue = { start: "", end: "" },
  onChange,
  onValidityChange,
  error,
  ...props
}: DateRangePickerProps) {
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const reversed = !!(
    current.start &&
    current.end &&
    current.start > current.end
  );
  const update = (part: "start" | "end", next: string) => {
    const range = { ...current, [part]: next };
    if (value === undefined) setLocal(range);
    onChange?.(range);
  };
  const [startValid, setStartValid] = React.useState<boolean>();
  const [endValid, setEndValid] = React.useState<boolean>();
  const valid = !!(startValid && endValid && !reversed && !error);
  const validityKnown = startValid !== undefined && endValid !== undefined;
  React.useEffect(() => {
    if (validityKnown) onValidityChange?.(valid);
  }, [valid, validityKnown, onValidityChange]);
  const complete =
    parseDate(current.start) &&
    parseDate(current.end) &&
    !reversed &&
    startValid &&
    endValid;
  return (
    <fieldset className="dc-range">
      <legend>{label}</legend>
      <div className="dc-pair">
        <DatePicker
          {...props}
          label="시작 날짜"
          onValidityChange={setStartValid}
          value={current.start}
          onChange={(next) => update("start", next)}
        />
        <DatePicker
          {...props}
          label="종료 날짜"
          onValidityChange={setEndValid}
          value={current.end}
          onChange={(next) => update("end", next)}
          error={
            error ||
            (reversed
              ? "종료 날짜는 시작 날짜보다 빠를 수 없습니다."
              : undefined)
          }
        />
      </div>
      <p role="status">
        {complete
          ? `총 ${dayNumber(current.end) - dayNumber(current.start) + 1}일 (시작일·종료일 포함)`
          : "시작 날짜와 종료 날짜를 선택해 주세요."}
      </p>
    </fieldset>
  );
}
