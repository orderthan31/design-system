import React from "react";
import "./checkbox.css";
export function Checkbox({label,mixed=false,ref:callerRef,...props}:{label:string;mixed?:boolean}&React.ComponentPropsWithRef<"input">){
 const ref=React.useRef<HTMLInputElement>(null);
 const mergeRef=React.useCallback((node:HTMLInputElement|null)=>{
  ref.current=node;
  if(typeof callerRef==="function"){const cleanup=callerRef(node);if(typeof cleanup==="function")return()=>{ref.current=null;cleanup();};}
  else if(callerRef)callerRef.current=node;
 },[callerRef]);
 React.useEffect(()=>{if(ref.current)ref.current.indeterminate=mixed;},[mixed]);
 return <label className="checkbox" data-slot="checkbox-root"><input data-slot="checkbox-input" {...props} ref={mergeRef} type="checkbox"/><span>{label}</span></label>;
}
