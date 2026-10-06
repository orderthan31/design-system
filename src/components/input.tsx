import React from "react";
import "./input.css";
export type InputProps = React.ComponentPropsWithRef<"input"> & {loading?:boolean;busyLabel?:string;"data-slot"?:string};
export function Input({loading=false,busyLabel='입력 확인 중…',...props}:InputProps) {
  const busyId=React.useId();
  const input=<input {...props} data-slot={props["data-slot"]??"input"} className={`control ${props.className ?? ""}`} aria-busy={loading?true:props['aria-busy']} aria-describedby={[props['aria-describedby'],loading?busyId:undefined].filter(Boolean).join(' ')||undefined}/>;
  return <>{input}{loading && <span data-slot="input-description" role="status" id={busyId} className="help"><span data-slot="input-indicator" aria-hidden="true" className="spinner"/> {busyLabel}</span>}</>;
}
