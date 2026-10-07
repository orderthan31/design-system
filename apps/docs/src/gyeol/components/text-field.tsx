import { forwardRef, useId, useRef, useState, useImperativeHandle, type HTMLAttributes } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { Button } from '../primitives/button';
import { cn } from '../lib/cn';
export type TextFieldProps = Omit<InputProps, 'onChange'> & { label: string; hint?: string; error?: string; clearable?: boolean; onValueChange?: (value:string)=>void; onChange?: InputProps['onChange']; wrapperProps?: HTMLAttributes<HTMLDivElement> };
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({label,hint,error,clearable,onValueChange,onChange,value,defaultValue,id:providedId,wrapperProps,...props},ref) {
 const generated=useId(),id=providedId || generated,inner=useRef<HTMLInputElement>(null);
 const [local,setLocal]=useState(defaultValue ?? '');
 const controlled=value!==undefined,current=controlled?value:local;
 useImperativeHandle(ref,()=>inner.current!,[]);
 const resetDefault=useRef(defaultValue ?? '');
 // An uncontrolled wrapper owns state; native form reset restores its original default.
 const attach=(node:HTMLInputElement|null)=>{inner.current=node;};
 const [form,setForm]=useState<HTMLFormElement|null>(null);
 // Ref callback tracks form ownership without DOM queries or value mutation.
 const inputRef=(node:HTMLInputElement|null)=>{attach(node);if(node && node.form!==form)setForm(node.form);};
 useNativeReset(form,()=>{if(!controlled)setLocal(resetDefault.current);});
 return <div {...wrapperProps} className={cn('grid gap-2 min-w-0',wrapperProps?.className)}>
  <label htmlFor={id} className="text-g-small font-medium">{label}</label>
  <div className="flex items-start gap-2"><Input {...props} id={id} ref={inputRef} value={current} invalid={!!error || props.invalid} aria-describedby={error||hint?`${id}-help`:props['aria-describedby']} onChange={event=>{if(!controlled)setLocal(event.target.value);onValueChange?.(event.target.value);onChange?.(event);}} />
   {clearable && <Button variant="quiet" size="small" className="shrink-0 whitespace-nowrap" disabled={props.disabled || props.readOnly || !String(current)} aria-label={`${label} 지우기`} onClick={()=>{if(!controlled)setLocal('');onValueChange?.('');inner.current?.focus();}}>지우기</Button>}
  </div>{(error||hint) && <p id={`${id}-help`} role={error?'alert':undefined} className={cn('text-g-small',error?'text-g-danger':'text-g-soft')}>{error||hint}</p>}
 </div>;
});
import { useEffect } from 'react';
function useNativeReset(form:HTMLFormElement|null,reset:()=>void){useEffect(()=>{if(!form)return;const listener=(event:Event)=>queueMicrotask(()=>{if(!event.defaultPrevented)reset();});form.addEventListener('reset',listener);return()=>form.removeEventListener('reset',listener);},[form,reset]);}
