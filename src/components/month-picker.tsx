import React from "react";
import { FormField } from "./form-field";
import type { DatePickerProps } from "./date-types";
import { parseDate, localDate } from "./civil-date";
import { useValue, useInputValidity, usePickerDismiss } from "./picker-state";
import { PickerTrigger } from "./picker-trigger";
import { Button } from "./button";
import { Icon } from "./icon";
import "./calendar-surface.css";
import "./month-picker.css";
import "./input.css";
export type MonthPickerProps = Omit<DatePickerProps, "disabledDates">;

export function MonthPicker({
  label = "월",
  value,
  defaultValue = "",
  onChange,
  onValidityChange,
  disabled,
  readOnly,
  busy,
  required,
  error,
  min,
  max,
}: MonthPickerProps) {
  const state = useValue(value, defaultValue, onChange);
  const [open, setOpen] = React.useState(false);
  const valid = (text: string) =>
    /^\d{4}-\d{2}$/.test(text) && !!parseDate(`${text}-01`);
  const [year, setYear] = React.useState(() =>
    Number(
      (valid(state.draft)
        ? state.draft
        : valid(min || "")
          ? min!
          : localDate()
      ).slice(0, 4),
    ),
  );
  const locked = disabled || readOnly || busy;
  const restricted = (text: string) =>
    !!((min && text < min) || (max && text > max));
  const invalid =
    state.draft && (!valid(state.draft) || restricted(state.draft));
  const id = React.useId();
  const root = useInputValidity(
    state.draft,
    error ||
      (invalid ? "선택 가능한 월을 YYYY-MM 형식으로 입력해 주세요." : ""),
    required,
    onValidityChange,
  );
  usePickerDismiss(root,open,setOpen,locked);
  const close = () => {
    setOpen(false);
    root.current?.querySelector<HTMLButtonElement>("[aria-controls]")?.focus();
  };
  const select = (text: string) => {
    if (!locked) {
      state.commit(text);
      close();
    }
  };
  const start = Math.max(
    1,
    Math.min(year - 100, Number(min?.slice(0, 4) || year)),
  );
  const end = Math.min(
    9999,
    Math.max(year + 20, Number(max?.slice(0, 4) || year)),
  );
  return (
    <div
      className="dc-picker"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {event.preventDefault();event.stopPropagation();close();}
      }}
    >
      <FormField label={label} required={required} error={error||(invalid?"선택 가능한 월을 YYYY-MM 형식으로 입력해 주세요.":undefined)}>
       <PickerTrigger label={label} value={state.draft} display={valid(state.draft)?`${state.draft.slice(0,4)}년 ${Number(state.draft.slice(5))}월`:state.draft||'월 선택'} kind="calendar"
        disabled={disabled} readOnly={readOnly} busy={busy} open={open&&!locked} controls={id}
        onToggle={()=>{if(valid(state.draft))setYear(Number(state.draft.slice(0,4)));setOpen(!open);}}/>
      </FormField>
      {open && !locked && (
        <div id={id} className="dc-picker-panel dc-calendar" role="dialog" aria-label="월 선택">
          <div className="dc-calendar-heading"><Button variant="quiet" size="small" aria-label="이전 연도" disabled={year<=1} onClick={()=>setYear(y=>y-1)}><Icon name="chevron-left"/></Button>
          <select
            aria-label="연도"
            className="control"
            autoFocus
            value={year}
            onChange={(event) => {
              const selected = Number(event.target.value);
              if (
                Number.isInteger(selected) &&
                selected >= 1 &&
                selected <= 9999
              )
                setYear(selected);
            }}
          >
            {Array.from({ length: end - start + 1 }, (_, i) => (
              <option value={start + i} key={i}>
                {start + i}년
              </option>
            ))}
          </select><Button variant="quiet" size="small" aria-label="다음 연도" disabled={year>=9999} onClick={()=>setYear(y=>y+1)}><Icon name="chevron-right"/></Button></div>
          <div className="dc-months">
            {Array.from({ length: 12 }, (_, i) => {
              const key = `${String(year).padStart(4, "0")}-${String(i + 1).padStart(2, "0")}`;
              return (
                <Button
                  size="small"
                  variant="quiet"
                  key={key}
                  aria-label={`${year}년 ${i + 1}월`}
                  aria-pressed={key === state.draft}
                  aria-current={key===localDate().slice(0,7)?"date":undefined}
                  disabled={restricted(key)}
                  onClick={() => select(key)}
                >
                  {i + 1}월
                </Button>
              );
            })}
          </div>
          <Button variant="quiet" size="small" onClick={() => select("")}>
            지우기
          </Button>
        </div>
      )}
    </div>
  );
}
