import React from "react";
import { Button } from "./button";
import { Icon } from "./icon";
import "./picker-core.css";
export type PickerTriggerProps = {
  label:string; value:string; display:string; kind:'calendar'|'clock'; open:boolean;
  onToggle:()=>void; disabled?:boolean; readOnly?:boolean; busy?:boolean;
  id?:string; required?:boolean; 'aria-describedby'?:string; 'aria-invalid'?:React.AriaAttributes['aria-invalid'];
  controls:string;
};

export function PickerTrigger({label,value,display,kind,open,onToggle,disabled,readOnly,busy,id,required,controls,...aria}:PickerTriggerProps) {
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
