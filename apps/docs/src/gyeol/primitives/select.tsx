import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './icon';
import { usePortalContainer, usePortalTheme, usePortalRef } from './portal';
export type SelectProps=Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,'children'> & {
 options:readonly {value:string;label:string;disabled?:boolean}[];
 label:string; placeholder?:string; className?:string; id?:string;
};
// The public ref is the actual trigger HTMLButtonElement, never HTMLSelectElement.
export const Select=forwardRef<HTMLButtonElement,SelectProps>(function Select({options,label,placeholder='선택',className,value,defaultValue,onValueChange,id,...props},ref){
 const [local,setLocal]=useState(defaultValue ?? ''),trigger=useRef<HTMLButtonElement|null>(null),theme=usePortalTheme(),container=usePortalContainer(),portalRef=usePortalRef<HTMLDivElement>();
 const controlled=value!==undefined,resetting=useRef(false),initial=useRef(defaultValue ?? value ?? '');
 useEffect(()=>{const form=props.form ? document.getElementById(props.form) as HTMLFormElement|null : trigger.current?.form;if(!form)return;const reset=(event:Event)=>{resetting.current=true;queueMicrotask(()=>{if(!event.defaultPrevented){if(controlled)onValueChange?.(initial.current);else setLocal(initial.current);}resetting.current=false;});};form.addEventListener('reset',reset,true);return()=>form.removeEventListener('reset',reset,true);},[controlled,onValueChange,props.form]);
 return <SelectPrimitive.Root {...props} value={controlled?value:local} onValueChange={next=>{if(resetting.current)return;if(!controlled)setLocal(next);onValueChange?.(next);}}>
  <SelectPrimitive.Trigger id={id} ref={node=>{trigger.current=node;if(typeof ref==='function')ref(node);else if(ref)ref.current=node;}} aria-label={label} className={cn('inline-flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-g-control border border-solid border-g-line bg-g-surface px-3 py-2 text-g-body text-g-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus disabled:opacity-50',className)}><span className="min-w-0 flex-1 whitespace-normal break-keep wrap-anywhere text-left"><SelectPrimitive.Value placeholder={placeholder}/></span><SelectPrimitive.Icon asChild><Icon name="chevronDown" size="small" className="block"/></SelectPrimitive.Icon></SelectPrimitive.Trigger>
  {/* Radix 2.3.8 caches Item search text on mount. Relabeling re-registers only that Item; the Root/Trigger and uncontrolled value stay mounted. */}
  <SelectPrimitive.Portal container={container ?? undefined}><SelectPrimitive.Content {...theme} ref={portalRef} position="popper" sideOffset={6} className="z-50 min-w-40 max-h-64 overflow-auto rounded-g-control border border-solid border-g-line bg-g-surface p-1 text-g-body text-g-ink shadow-lg"><SelectPrimitive.Viewport>{options.map(option=><SelectPrimitive.Item key={JSON.stringify([option.value,option.label])} value={option.value} textValue={option.label} disabled={option.disabled} className="relative flex min-h-11 cursor-default items-center gap-3 rounded-g-control px-3 py-2 outline-none data-[highlighted]:bg-g-muted data-[disabled]:opacity-40"><span className="min-w-0 flex-1 break-keep wrap-anywhere"><SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText></span><SelectPrimitive.ItemIndicator asChild><Icon name="check" size="small" className="block"/></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>)}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>
 </SelectPrimitive.Root>;
});
