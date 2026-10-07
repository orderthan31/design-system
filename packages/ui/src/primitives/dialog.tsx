import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef, useState, type ComponentPropsWithoutRef, type RefObject } from 'react';
import { cn } from '../lib/cn';
import { useTheme } from '../foundation/theme';
import { PortalContext } from './portal';
export const Dialog=DialogPrimitive.Root;
export const DialogTrigger=DialogPrimitive.Trigger;
export const DialogClose=DialogPrimitive.Close;
export const DialogTitle=forwardRef<HTMLHeadingElement,ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(function DialogTitle({className,...props},ref){return <DialogPrimitive.Title {...props} ref={ref} className={cn('text-xl font-semibold',className)}/>;});
export const DialogDescription=forwardRef<HTMLParagraphElement,ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(function DialogDescription({className,...props},ref){return <DialogPrimitive.Description {...props} ref={ref} className={cn('text-g-small text-g-soft',className)}/>;});
export type DialogContentProps=ComponentPropsWithoutRef<typeof DialogPrimitive.Content>&{returnFocusRef?:RefObject<HTMLElement|null>};
export const DialogContent=forwardRef<HTMLDivElement,DialogContentProps>(function DialogContent({className,children,returnFocusRef,onCloseAutoFocus,...props},ref){
 const mode=useTheme(),[container,setContainer]=useState<HTMLDivElement|null>(null);
 return <DialogPrimitive.Portal><DialogPrimitive.Overlay data-gyeol="" data-theme={mode} className="fixed inset-0 z-40 bg-g-overlay"/><DialogPrimitive.Content {...props} ref={ref} data-gyeol="" data-theme={mode} onCloseAutoFocus={event=>{onCloseAutoFocus?.(event);if(!event.defaultPrevented && returnFocusRef?.current){event.preventDefault();returnFocusRef.current.focus();}}} className={cn('fixed inset-x-4 top-8 z-50 mx-auto grid w-auto max-w-lg gap-5 rounded-g-panel border border-solid border-g-line bg-g-surface p-6 text-g-ink shadow-xl sm:top-24',className)}><PortalContext.Provider value={container}>{children}<div ref={setContainer}/></PortalContext.Provider></DialogPrimitive.Content></DialogPrimitive.Portal>;
});
