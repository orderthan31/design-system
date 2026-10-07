import React from "react";
import { Button } from "./button";
import type { DatePickerProps } from "./date-types";
import { parseDate, localDate, formatDate } from "./civil-date";
import "./calendar-surface.css";
import "./calendar.css";
import "./input.css";
export function unavailable(value: string, props: DatePickerProps): boolean {
  return !!(
    (props.min && value < props.min) ||
    (props.max && value > props.max) ||
    props.disabledDates?.includes(value)
  );
}

export function koreanDate(date: Date) {
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
}

export function Calendar({
  value,
  onSelect,
  ...limits
}: DatePickerProps & { onSelect: (value: string) => void }) {
  const initial = () =>
    parseDate(value || "") ||
    parseDate(limits.min || "") ||
    parseDate(limits.max || "") ||
    parseDate(localDate())!;
  const [view, setView] = React.useState(initial);
  const year = view.getUTCFullYear();
  const month = view.getUTCMonth();
  const first = new Date(view);
  first.setUTCDate(1);
  const end = new Date(first);
  end.setUTCMonth(month + 1);
  end.setUTCDate(0);
  const startYear = Math.min(
    year - 100,
    parseDate(limits.min || "")?.getUTCFullYear() ?? year,
  );
  const endYear = Math.min(
    9999,
    Math.max(year + 20, parseDate(limits.max || "")?.getUTCFullYear() ?? year),
  );
  const moveMonth = (amount: number) => {
    const next = new Date(first);
    next.setUTCMonth(month + amount);
    setView(next);
  };
  const [active, setActive] = React.useState(() => formatDate(initial()));
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const focusRequested = React.useRef(true);
  React.useEffect(() => {
    if (!focusRequested.current) return;
    const target =
      calendarRef.current?.querySelector<HTMLButtonElement>(
        `[data-date="${active}"]:not(:disabled)`,
      ) ||
      calendarRef.current?.querySelector<HTMLButtonElement>(
        "[data-date]:not(:disabled)",
      );
    target?.focus();
    focusRequested.current = false;
  }, [active, view]);
  const keyboard = (event: React.KeyboardEvent, date: Date) => {
    const next = new Date(date);
    let direction = 1;
    switch (event.key) {
      case "ArrowLeft":
        next.setUTCDate(next.getUTCDate() - 1);
        direction = -1;
        break;
      case "ArrowRight":
        next.setUTCDate(next.getUTCDate() + 1);
        break;
      case "ArrowUp":
        next.setUTCDate(next.getUTCDate() - 7);
        direction = -1;
        break;
      case "ArrowDown":
        next.setUTCDate(next.getUTCDate() + 7);
        break;
      case "Home":
        next.setUTCDate(next.getUTCDate() - next.getUTCDay());
        break;
      case "End":
        next.setUTCDate(next.getUTCDate() + 6 - next.getUTCDay());
        direction = -1;
        break;
      case "PageUp":
      case "PageDown": {
        direction = event.key === "PageUp" ? -1 : 1;
        const day = next.getUTCDate();
        next.setUTCDate(1);
        next.setUTCMonth(next.getUTCMonth() + direction);
        const last = new Date(next);
        last.setUTCMonth(last.getUTCMonth() + 1);
        last.setUTCDate(0);
        next.setUTCDate(Math.min(day, last.getUTCDate()));
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    // Search at most a year; no enabled date leaves focus unchanged.
    for (let i = 0; i < 366; i++) {
      const key = formatDate(next);
      if (next.getUTCFullYear() < 1 || next.getUTCFullYear() > 9999) return;
      if (!unavailable(key, limits)) {
        focusRequested.current = true;
        setActive(key);
        setView(next);
        return;
      }
      if (
        (limits.min && key < limits.min && direction < 0) ||
        (limits.max && key > limits.max && direction > 0)
      )
        return;
      next.setUTCDate(next.getUTCDate() + direction);
    }
  };
  const firstEnabled = Array.from({ length: end.getUTCDate() }, (_, i) => {
    const date = new Date(first);
    date.setUTCDate(i + 1);
    return formatDate(date);
  }).find((key) => !unavailable(key, limits));
  const tabDate =
    active.startsWith(formatDate(first).slice(0, 7)) &&
    !unavailable(active, limits)
      ? active
      : firstEnabled;
  const today = localDate();
  return (
    <div
      ref={calendarRef}
      className="dc-calendar"
      role="group"
      aria-label="날짜 달력"
    >
      <div className="dc-calendar-heading">
        <Button
          variant="quiet"
          size="small"
          aria-label="이전 달"
          onClick={() => moveMonth(-1)}
          disabled={year === 1 && month === 0}
        >
          ‹
        </Button>
        <select
          aria-label="연도"
          className="control"
          value={year}
          onChange={(e) => {
            const next = new Date(first);
            const selected = Number(e.target.value);
            if (!Number.isInteger(selected) || selected < 1 || selected > 9999)
              return;
            next.setUTCFullYear(selected);
            setView(next);
          }}
        >
          {Array.from(
            { length: endYear - Math.max(1, startYear) + 1 },
            (_, i) => Math.max(1, startYear) + i,
          ).map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <select
          aria-label="월"
          className="control"
          value={month + 1}
          onChange={(e) => {
            const next = new Date(first);
            next.setUTCMonth(Number(e.target.value) - 1);
            setView(next);
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>
        <Button
          variant="quiet"
          size="small"
          aria-label="다음 달"
          onClick={() => moveMonth(1)}
          disabled={year === 9999 && month === 11}
        >
          ›
        </Button>
      </div>
      <p className="dc-month-title" aria-live="polite">
        {year}년 {month + 1}월
      </p>
      <div className="dc-days">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <span className="dc-weekday" key={day}>
            {day}
          </span>
        ))}
        {Array.from({ length: first.getUTCDay() }, (_, i) => (
          <span aria-hidden="true" key={`empty-${i}`} />
        ))}
        {Array.from({ length: end.getUTCDate() }, (_, i) => {
          const date = new Date(first);
          date.setUTCDate(i + 1);
          const key = formatDate(date);
          return (
            <Button
              key={key}
              variant="quiet"
              size="small"
              className="dc-day"
              data-date={key}
              tabIndex={key === tabDate ? 0 : -1}
              onFocus={() => setActive(key)}
              onKeyDown={(event) => keyboard(event, date)}
              aria-label={koreanDate(date)}
              aria-pressed={key === value}
              disabled={unavailable(key, limits)}
              onClick={() => onSelect(key)}
            >
              {i + 1}
            </Button>
          );
        })}
      </div>
      <div className="dc-actions">
        <Button
          size="small"
          variant="secondary"
          disabled={unavailable(today, limits)}
          onClick={() => onSelect(today)}
        >
          오늘
        </Button>
        <Button size="small" variant="quiet" onClick={() => onSelect("")}>
          지우기
        </Button>
      </div>
    </div>
  );
}
