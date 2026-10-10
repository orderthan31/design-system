import * as Primitive from '@radix-ui/react-toast';
import { createContext, forwardRef, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { Button } from '../primitives/button';
import { IconButton } from '../primitives/icon-button';
import { usePortalRef, usePortalTheme } from '../primitives/portal';
import { cn } from '../lib/cn';
export type ToastMessage={id?:string;title:string;description?:string;duration?:number;actionLabel?:string;onAction?:()=>void};
type Record=ToastMessage&{id:string;revision:number};
const Context=createContext<{notify:(message:ToastMessage)=>string;dismiss:(id:string)=>void}|null>(null);
export const Toast=forwardRef<ElementRef<typeof Primitive.Root>,ComponentPropsWithoutRef<typeof Primitive.Root>>(function Toast({className,...props},ref){const theme=usePortalTheme(),node=usePortalRef(ref,props.style);return <Primitive.Root {...props} {...theme} ref={node} className={cn('flex min-w-0 items-start gap-3 rounded-g-panel border border-solid border-g-line bg-g-surface p-4 text-g-ink shadow-md',className)}/>;});
export function ToastProvider({children,maxVisible=5,duration=5000}:{children:ReactNode;maxVisible?:number;duration?:number}){
 const [items,setItems]=useState<Record[]>([]),prefix=useId(),sequence=useRef(0);const theme=usePortalTheme(),viewportRef=usePortalRef<HTMLOListElement>();
 const dismiss=useCallback((id:string)=>setItems(current=>current.filter(item=>item.id!==id)),[]);
 const notify=useCallback((message:ToastMessage)=>{const revision=++sequence.current,id=message.id??`${prefix}-${revision}`;const max=Number.isFinite(maxVisible)?Math.max(1,Math.floor(maxVisible)):5;setItems(current=>[...current.filter(item=>item.id!==id),{...message,id,revision}].slice(-max));return id;},[prefix,maxVisible]);
 const context=useMemo(()=>({notify,dismiss}),[notify,dismiss]);
 return <Primitive.Provider duration={duration} swipeDirection="right"><Context.Provider value={context}>{children}{items.map(item=><Toast key={item.id+'-'+item.revision} open onOpenChange={open=>{if(!open)dismiss(item.id);}} duration={item.duration}><div className="grid min-w-0 flex-1 gap-2"><Primitive.Title className="break-words font-medium">{item.title}</Primitive.Title>{item.description&&<Primitive.Description className="break-words text-g-small text-g-soft">{item.description}</Primitive.Description>}{item.onAction&&item.actionLabel&&<Primitive.Action asChild altText={item.actionLabel}><Button variant="secondary" size="small" onClick={item.onAction}>{item.actionLabel}</Button></Primitive.Action>}</div><Primitive.Close asChild><IconButton variant="quiet" icon="close" label={item.title+' 알림 닫기'}/></Primitive.Close></Toast>)}<Primitive.Viewport {...theme} ref={viewportRef} label="알림 (F8)" className="fixed inset-x-4 bottom-4 z-50 grid max-h-dvh gap-3 outline-none sm:left-auto sm:w-96"/></Context.Provider></Primitive.Provider>;
}
export function useToast(){const context=useContext(Context);if(!context)throw new Error('useToast must be used within ToastProvider');return context;}
