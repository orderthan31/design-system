import React from "react";
import type { DatePickerProps } from "./date-types";
import { DatePicker } from "./date-picker";
import { TimeInput } from "./time-input";
import { parseDate } from "./civil-date";
import { validTime } from "./valid-time";
import "./date-range-picker.css";
export type DateTimeInputProps = DatePickerProps;

function dateTimeParts(value: string): [string, string] {
  const separator = value.indexOf("T");
  return separator === -1
    ? [value, ""]
    : [value.slice(0, separator), value.slice(separator + 1)];
}

export function DateTimeInput({
  label = "날짜 및 시간",
  value,
  defaultValue = "",
  onChange,
  onValidityChange,
  min,
  max,
  error,
  ...props
}: DateTimeInputProps) {
  const [localParts, setParts] = React.useState(() =>
    dateTimeParts(defaultValue),
  );
  const [localSource, setLocalSource] = React.useState(defaultValue);
  const source = value ?? localSource;
  const parts = value === undefined ? localParts : dateTimeParts(value);
  const [dateValid, setDateValid] = React.useState<boolean>();
  const [timeValid, setTimeValid] = React.useState<boolean>();
  const date = parts[0] || "";
  const time = parts[1] || "";
  const combined = date && time ? `${date}T${time}` : "";
  const restricted =
    !!combined && !!((min && combined < min) || (max && combined > max));
  const malformed =
    source !== "" &&
    (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(source) ||
      !parseDate(date) ||
      !validTime(time));
  const valid = !!(
    dateValid &&
    timeValid &&
    !malformed &&
    !restricted &&
    !error
  );
  const validityKnown = dateValid !== undefined && timeValid !== undefined;
  React.useEffect(() => {
    if (validityKnown) onValidityChange?.(valid);
  }, [valid, validityKnown, onValidityChange]);
  const update = (index: number, next: string) => {
    const updated: [string, string] = [date, time];
    updated[index] = next;
    const result =
      updated[0] && updated[1] ? `${updated[0]}T${updated[1]}` : "";
    if (value === undefined) {
      setParts(updated);
      setLocalSource(result);
    }
    if (
      !result ||
      (parseDate(updated[0]) &&
        validTime(updated[1]) &&
        !(min && result < min) &&
        !(max && result > max))
    )
      onChange?.(result);
  };
  return (
    <fieldset className="dc-range">
      <legend>{label}</legend>
      <div className="dc-pair">
        <DatePicker
          {...props}
          label="날짜"
          onValidityChange={setDateValid}
          value={date}
          min={min?.slice(0, 10)}
          max={max?.slice(0, 10)}
          onChange={(next) => update(0, next)}
        />
        <TimeInput
          {...props}
          label="시간"
          onValidityChange={setTimeValid}
          value={time}
          min={date === min?.slice(0, 10) ? min?.slice(11) : undefined}
          max={date === max?.slice(0, 10) ? max?.slice(11) : undefined}
          error={
            error ||
            (malformed
              ? "올바른 날짜와 시간을 YYYY-MM-DDTHH:mm 형식으로 입력해 주세요."
              : restricted
                ? "선택 가능한 날짜와 시간을 입력해 주세요."
                : undefined)
          }
          onChange={(next) => update(1, next)}
        />
      </div>
      <p role="status">
        {combined && valid
          ? combined.replace("T", " ")
          : "날짜와 시간을 모두 입력해 주세요."}
      </p>
    </fieldset>
  );
}
