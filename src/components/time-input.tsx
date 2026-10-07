import React from "react";
import type { DatePickerProps } from "./date-types";
import { useValue, useInputValidity, usePickerDismiss } from "./picker-state";
import { PickerTrigger } from "./picker-trigger";
import { FormField } from "./form-field";
import { Button } from "./button";
import { Select } from "./select";
import { validTime } from "./valid-time";
import "./calendar-surface.css";
import "./time-input.css";
export type TimeInputProps = Omit<DatePickerProps, "disabledDates">;

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
