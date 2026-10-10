import * as Primitive from '@radix-ui/react-dropdown-menu';
import { forwardRef, useState, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../lib/cn';
import { PortalContext, usePortalContainer, usePortalRef, usePortalTheme } from './portal';
export const Menu=Primitive.Root;
export const MenuTrigger=Primitive.Trigger;
export const MenuGroup=Primitive.Group;
export const MenuLabel=Primitive.Label;
export const MenuContent=forwardRef<ElementRef<typeof Primitive.Content>,Omit<ComponentPropsWithoutRef<typeof Primitive.Content>,'asChild'>>(function MenuContent({className,children,sideOffset=8,collisionPadding=8,...props},ref){
 const container=usePortalContainer(),theme=usePortalTheme(),contentRef=usePortalRef(ref,props.style);const [destination,setDestination]=useState<HTMLDivElement|null>(null);
 return <Primitive.Portal container={container??undefined}><Primitive.Content {...props} {...theme} ref={contentRef} sideOffset={sideOffset} collisionPadding={collisionPadding} className={cn('z-50 min-w-44 max-w-full max-h-(--radix-dropdown-menu-content-available-height) overflow-auto rounded-g-panel border border-solid border-g-line bg-g-surface p-1 text-g-small text-g-ink shadow-md',className)}><PortalContext.Provider value={destination}>{children}<div ref={setDestination} className="contents"/></PortalContext.Provider></Primitive.Content></Primitive.Portal>;
});
export const MenuItem=forwardRef<ElementRef<typeof Primitive.Item>,ComponentPropsWithoutRef<typeof Primitive.Item>>(function MenuItem({className,...props},ref){return <Primitive.Item {...props} ref={ref} className={cn('flex min-h-11 cursor-default items-center gap-2 rounded-g-control px-3 py-2 outline-none data-highlighted:bg-g-muted data-disabled:opacity-50 data-disabled:pointer-events-none',className)}/>;});
export const MenuSeparator=forwardRef<ElementRef<typeof Primitive.Separator>,ComponentPropsWithoutRef<typeof Primitive.Separator>>(function MenuSeparator({className,...props},ref){return <Primitive.Separator {...props} ref={ref} className={cn('my-1 h-px bg-g-line',className)}/>;});
