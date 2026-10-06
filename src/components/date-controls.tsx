import React from "react";
import { Button, Input } from "./atoms";
import { FormField } from "./molecules";
import { Icon } from "./icons";
import { Select } from "./primitives";
import "./date-controls.css";

export function DateControlsGallery() {
  return (
    <div className="dc-gallery">
      <section aria-label="날짜 선택">
        <h3>날짜 선택</h3>
        <DatePicker defaultValue="2024-02-28" />
      </section>
      <section aria-label="기간 선택">
        <h3>기간 선택</h3>
        <DateRangePicker
          defaultValue={{ start: "2024-02-28", end: "2024-03-01" }}
        />
      </section>
      <section aria-label="월 선택">
        <h3>월 선택</h3>
        <MonthPicker defaultValue="2024-02" />
      </section>
      <section aria-label="시간 입력">
        <h3>시간 입력</h3>
        <TimeInput defaultValue="09:30" />
      </section>
      <section aria-label="날짜와 시간">
        <h3>날짜와 시간</h3>
        <DateTimeInput defaultValue="2024-02-29T09:30" />
      </section>
      <section aria-label="입력 상태">
        <h3>입력 상태</h3>
        <div className="dc-state-stack">
          <DatePicker
            label="읽기 전용 날짜"
            defaultValue="2024-02-29"
            readOnly
          />
          <TimeInput label="비활성 시간" defaultValue="09:30" disabled />
          <MonthPicker label="확인 중인 월" defaultValue="2024-02" busy />
          <DatePicker label="날짜 오류" defaultValue="2023-02-29" />
        </div>
      </section>
    </div>
  );
}

export interface DatePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValidityChange?: (valid: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  busy?: boolean;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
  disabledDates?: readonly string[];
}
function parseDate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(12, 0, 0, 0);
  if (
    year < 1 ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return;
  return date;
}
// Internal Dates represent Gregorian civil days in UTC, not local instants.
// Only "today" reads the user's local clock.
function localDate(): string {
  const date = new Date();
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatDate(date: Date): string {
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function useValue(
  value: string | undefined,
  defaultValue: string,
  onChange?: (value: string) => void,
) {
  const [local, setLocal] = React.useState(defaultValue);
  const current = value ?? local;
  const [draft, setDraft] = React.useState(current);
  React.useEffect(() => setDraft(current), [current]);
  return {
    draft,
    setDraft,
    commit: (next: string) => {
      setDraft(value ?? next);
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  };
}
function useInputValidity(
  draft: string,
  message: string,
  required: boolean | undefined,
  onValidityChange?: (valid: boolean) => void,
) {
  const root = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    root.current
      ?.querySelector<HTMLInputElement>("input")
      ?.setCustomValidity(message);
  }, [message]);
  const valid = !message && !(required && !draft);
  React.useEffect(() => {
    onValidityChange?.(valid);
  }, [valid, onValidityChange]);
  return root;
}
type PickerTriggerProps = {
  label:string; value:string; display:string; kind:'calendar'|'clock'; open:boolean;
  onToggle:()=>void; disabled?:boolean; readOnly?:boolean; busy?:boolean;
  id?:string; required?:boolean; 'aria-describedby'?:string; 'aria-invalid'?:React.AriaAttributes['aria-invalid'];
  controls:string;
};
function PickerTrigger({label,value,display,kind,open,onToggle,disabled,readOnly,busy,id,required,controls,...aria}:PickerTriggerProps) {
 const generated=React.useId(),fieldId=id??generated;
 return <span className="dc-trigger-frame">
  <Button id={fieldId} variant="secondary" disabled={disabled||readOnly||busy} loading={busy}
   data-picker-trigger aria-label={`${label}: ${display}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={controls}
   {...aria} onClick={onToggle}>
   <Icon name={kind}/><span>{display}</span><Icon name="chevron-down"/>
  </Button>
  <input className="dc-value-input" type="text" value={value} onChange={()=>{}} required={required} disabled={disabled} readOnly={readOnly||busy}
   aria-hidden="true" tabIndex={-1} onInvalid={event=>{event.preventDefault();event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-picker-trigger]')?.focus();if(!disabled&&!readOnly&&!busy&&!open)onToggle();}}/>
 </span>;
}
function usePickerDismiss(root:React.RefObject<HTMLDivElement|null>,open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>>,locked:boolean|undefined) {
 React.useEffect(()=>{if(locked)setOpen(false);},[locked,setOpen]);
 React.useEffect(()=>{
  if(!open)return;
  const outside=(event:Event)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(false);};
  document.addEventListener('pointerdown',outside,true);document.addEventListener('focusin',outside);
  return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('focusin',outside);};
 },[open,root,setOpen]);
}
function unavailable(value: string, props: DatePickerProps): boolean {
  return !!(
    (props.min && value < props.min) ||
    (props.max && value > props.max) ||
    props.disabledDates?.includes(value)
  );
}
function koreanDate(date: Date) {
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
}
function Calendar({
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

export type TimeInputProps = Omit<DatePickerProps, "disabledDates">;
function validTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
export function TimeInput({
  label = "시간",
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
}: TimeInputProps) {
  const state = useValue(value, defaultValue, onChange);
  const valid = (text: string) =>
    validTime(text) && !(min && text < min) && !(max && text > max);
  const invalid = state.draft && !valid(state.draft);
  const root = useInputValidity(
    state.draft,
    error ||
      (invalid ? "선택 가능한 시간을 HH:mm 형식으로 입력해 주세요." : ""),
    required,
    onValidityChange,
  );
  const [open,setOpen]=React.useState(false),[pending,setPending]=React.useState('09:00'),[mode,setMode]=React.useState<'hour'|'minute'>('hour');
  const locked=disabled||readOnly||busy,id=React.useId();
  usePickerDismiss(root,open,setOpen,locked);
  const close=()=>{setOpen(false);root.current?.querySelector<HTMLButtonElement>('[data-picker-trigger]')?.focus();};
  const [hour,minute]=pending.split(':').map(Number);
  const candidate=(h:number,m:number)=>`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  const chooseHour=(h:number)=>{const minutes=Array.from({length:60},(_,m)=>m).filter(m=>valid(candidate(h,m)));if(!minutes.length)return;setPending(candidate(h,minutes.includes(minute)?minute:minutes[0]));};
  const toggle=()=>{if(!open){setPending(validTime(state.draft)?state.draft:validTime(min??'')?min!:'09:00');setMode('hour');}setOpen(!open);};
  return <div className="dc-picker" ref={root} onKeyDown={event=>{if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();close();}}}>
   <FormField label={label} required={required} error={error||(invalid?'선택 가능한 시간을 HH:mm 형식으로 입력해 주세요.':undefined)}>
    <PickerTrigger label={label} value={state.draft} display={state.draft||'시간 선택'} kind="clock" disabled={disabled} readOnly={readOnly} busy={busy} open={open&&!locked} controls={id} onToggle={toggle}/>
   </FormField>
   {open&&!locked&&<div id={id} className="dc-picker-panel dc-calendar dc-time-panel" role="dialog" aria-label={`${label} 선택`}>
    <div className="dc-clock-mode"><Button variant={mode==='hour'?'secondary':'quiet'} aria-pressed={mode==='hour'} onClick={()=>setMode('hour')}>시</Button><Button variant={mode==='minute'?'secondary':'quiet'} aria-pressed={mode==='minute'} onClick={()=>setMode('minute')}>분</Button></div>
    <svg className="dc-clock" viewBox="0 0 240 240" role="group" aria-label={`${pending} ${mode==='hour'?'시':'분'} 선택 시계`}>
     <circle className="dc-clock-face" cx="120" cy="120" r="108"/>
     <line className="dc-clock-hand" x1="120" y1="120" x2="120" y2="68" transform={`rotate(${(hour%12+minute/60)*30} 120 120)`}/>
     <line className="dc-clock-hand dc-clock-minute" x1="120" y1="120" x2="120" y2="45" transform={`rotate(${minute*6} 120 120)`}/>
     {Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6,x=120+84*Math.sin(angle),y=120-84*Math.cos(angle),h=i+(hour>=12?12:0),m=i*5,enabled=mode==='hour'?Array.from({length:60},(_,n)=>n).some(n=>valid(candidate(h,n))):valid(candidate(hour,m)),selected=mode==='hour'?hour===h:minute===m;
      const choose=()=>{if(!enabled)return;if(mode==='hour'){chooseHour(h);setMode('minute');}else setPending(candidate(hour,m));};
      return <g key={i} className="dc-clock-choice" data-selected={selected} role="button" aria-label={mode==='hour'?`${h}시 선택`:`${m}분 선택`} aria-pressed={selected} aria-disabled={!enabled} tabIndex={enabled?0:-1} onClick={choose} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose();}}}><circle cx={x} cy={y} r="22"/><text x={x} y={y} dominantBaseline="middle" textAnchor="middle">{mode==='hour'?i||12:String(m).padStart(2,'0')}</text></g>;
     })}<circle className="dc-clock-center" cx="120" cy="120" r="4"/>
    </svg>
    <div className="dc-time-fields"><label><span>시 · 24시간</span><Select autoFocus aria-label="시 선택" value={hour} onChange={event=>chooseHour(Number(event.target.value))}>{Array.from({length:24},(_,h)=><option key={h} value={h} disabled={!Array.from({length:60},(_,m)=>m).some(m=>valid(candidate(h,m)))}>{String(h).padStart(2,'0')}</option>)}</Select></label><label><span>분</span><Select aria-label="분 선택" value={minute} onChange={event=>setPending(candidate(hour,Number(event.target.value)))}>{Array.from({length:60},(_,m)=><option key={m} value={m} disabled={!valid(candidate(hour,m))}>{String(m).padStart(2,'0')}</option>)}</Select></label></div>
    <p className="dc-time-value" role="status">{pending}</p>
    {(min||max)&&<p className="help">{min||'00:00'}–{max||'23:59'} 사이에서 선택하세요.</p>}
    <div className="dc-actions"><Button disabled={!valid(pending)} onClick={()=>{state.commit(pending);close();}}>확인</Button><Button variant="quiet" onClick={()=>{state.commit('');close();}}>지우기</Button><Button variant="quiet" onClick={close}>취소</Button></div>
   </div>}
  </div>;
}

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
