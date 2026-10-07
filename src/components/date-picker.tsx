import React from "react";
import { FormField } from "./form-field";
import type { DatePickerProps } from "./date-types";
export type { DatePickerProps } from "./date-types";
import { parseDate } from "./civil-date";
import { useValue, useInputValidity, usePickerDismiss } from "./picker-state";
import { PickerTrigger } from "./picker-trigger";
import { Calendar, unavailable, koreanDate } from "./calendar";
export function DatePicker({
  label = "날짜",
  value,
  defaultValue = "",
  onChange,
  onValidityChange,
  disabled,
  readOnly,
  busy,
  required,
  error,
  ...limits
}: DatePickerProps) {
  const state = useValue(value, defaultValue, onChange);
  const [open, setOpen] = React.useState(false);
  const calendarId = React.useId();
  const locked = disabled || readOnly || busy;
  const invalid = state.draft !== "" && !parseDate(state.draft);
  const restricted =
    !!parseDate(state.draft) && unavailable(state.draft, limits);
  const containerRef = useInputValidity(
    state.draft,
    error ||
      (invalid
        ? "올바른 날짜를 YYYY-MM-DD 형식으로 입력해 주세요."
        : restricted
          ? "선택할 수 없는 날짜입니다."
          : ""),
    required,
    onValidityChange,
  );
  usePickerDismiss(containerRef,open,setOpen,locked);
  const close = () => {
    setOpen(false);
    containerRef.current
      ?.querySelector<HTMLButtonElement>("[aria-controls]")
      ?.focus();
  };
  const select = (next: string) => {
    if (!locked) {
      state.commit(next);
      close();
    }
  };
  return (
    <div
      ref={containerRef}
      className="dc-picker"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
      }}
    >
      <FormField label={label} required={required} error={error||(invalid?"올바른 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.":restricted?"선택할 수 없는 날짜입니다.":undefined)}>
       <PickerTrigger label={label} value={state.draft} display={parseDate(state.draft)?koreanDate(parseDate(state.draft)!):state.draft||'날짜 선택'} kind="calendar"
        disabled={disabled} readOnly={readOnly} busy={busy} open={open&&!locked} controls={calendarId} onToggle={()=>setOpen(!open)}/>
      </FormField>
      {open && !locked && (
        <div id={calendarId} className="dc-picker-panel" role="dialog" aria-label={`${label} 달력`}>
          <Calendar {...limits} value={state.draft} onSelect={select} />
        </div>
      )}
    </div>
  );
}
