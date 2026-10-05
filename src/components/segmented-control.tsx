import React from 'react';
export type SegmentedOption={value:string;label:string;disabled?:boolean};
export type SegmentedControlProps={label:string;options:readonly SegmentedOption[];name?:string;id?:string;value?:string;defaultValue?:string;onValueChange?:(value:string,event:React.ChangeEvent<HTMLInputElement>)=>void;disabled?:boolean;required?:boolean;form?:string;description?:string;error?:string;className?:string;'aria-describedby'?:string};
export function SegmentedControl({label,options,name,id,value,defaultValue,onValueChange,disabled=false,required=false,form,description,error,className='', 'aria-describedby':externalDescription}:SegmentedControlProps){
 const generated=React.useId();const groupId=id??generated;
 const described=[externalDescription,description?`${groupId}-help`:undefined,error?`${groupId}-error`:undefined].filter(Boolean).join(' ')||undefined;
 return <fieldset id={groupId} form={form} className={`ds-segmented ${className}`} disabled={disabled} aria-describedby={described} aria-invalid={error?true:undefined}>
  <legend>{label}{required&&<span aria-hidden="true"> *</span>}</legend>
  <div className="ds-segmented-options">{options.map((option,index)=><label key={option.value} className="ds-segmented-option">
   <input type="radio" name={name??`${groupId}-choice`} id={`${groupId}-${index}`} form={form} value={option.value} required={required} disabled={option.disabled}
    checked={value!==undefined?value===option.value:undefined} defaultChecked={value===undefined?defaultValue===option.value:undefined}
    aria-describedby={described} aria-invalid={error?true:undefined} onChange={event=>{if(event.currentTarget.checked)onValueChange?.(option.value,event);}}/>
   <span>{option.label}</span><span data-segmented-mark aria-hidden="true" className="ds-segmented-mark">✓</span>
  </label>)}</div>
  {description&&<p id={`${groupId}-help`} className="help">{description}</p>}
  {error&&<p id={`${groupId}-error`} className="help" role="alert">{error}</p>}
 </fieldset>;
}
