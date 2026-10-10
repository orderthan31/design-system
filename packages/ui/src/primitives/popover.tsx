import * as Primitive from '@radix-ui/react-popover';
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';
import { PortalContext, usePortalContainer, usePortalRef, usePortalTheme } from './portal';
export const Popover = Primitive.Root;
export const PopoverTrigger = Primitive.Trigger;
export const PopoverAnchor = Primitive.Anchor;
export const PopoverClose = Primitive.Close;
export const PopoverTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<typeof Primitive.Title>>(function PopoverTitle({ className, ...props }, ref) { return <Primitive.Title {...props} ref={ref} className={cn('text-g-body font-medium', className)}/>; });
export const PopoverDescription = Primitive.Description;
export type PopoverContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>;
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent({ className, children, sideOffset = 8, collisionPadding = 8, ...props }, ref) {
  const container = usePortalContainer(), theme = usePortalTheme(), contentRef = usePortalRef(ref, props.style);
  const [destination, setDestination] = useState<HTMLDivElement | null>(null);
  return <Primitive.Portal container={container ?? undefined}><Primitive.Content {...props} {...theme} ref={contentRef} sideOffset={sideOffset} collisionPadding={collisionPadding}
    className={cn('z-50 grid w-72 max-w-full max-h-(--radix-popover-content-available-height) gap-3 overflow-auto rounded-g-panel border border-solid border-g-line bg-g-surface p-4 text-g-body text-g-ink shadow-lg focus-visible:outline-3 focus-visible:outline-g-focus', className)}><PortalContext.Provider value={destination}>{children}<div ref={setDestination} className="contents"/></PortalContext.Provider></Primitive.Content></Primitive.Portal>;
});
