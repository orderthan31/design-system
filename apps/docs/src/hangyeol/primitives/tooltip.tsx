import * as Primitive from '@radix-ui/react-tooltip';
import { forwardRef, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { usePortalContainer, usePortalRef, usePortalTheme } from './portal';
export const TooltipProvider = Primitive.Provider;
export const TooltipRoot = Primitive.Root;
export const TooltipTrigger = Primitive.Trigger;
export type TooltipContentProps = ComponentPropsWithoutRef<typeof Primitive.Content>;
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent({ className, sideOffset = 8, collisionPadding = 8, ...props }, ref) {
  const container = usePortalContainer(), theme = usePortalTheme(), contentRef = usePortalRef(ref, props.style);
  return <Primitive.Portal container={container ?? undefined}><Primitive.Content {...props} {...theme} ref={contentRef} sideOffset={sideOffset} collisionPadding={collisionPadding}
    className={cn('z-50 max-w-xs break-words rounded-g-control border border-solid border-g-line bg-g-surface px-3 py-2 text-g-small text-g-ink shadow-md', className)}/></Primitive.Portal>;
});
export type TooltipProps = Omit<ComponentPropsWithoutRef<typeof Primitive.Root>, 'children'> & { children: ReactElement; content: ReactNode; side?: TooltipContentProps['side']; align?: TooltipContentProps['align'] };
export function Tooltip({ children, content, side, align, ...props }: TooltipProps) {
  return <TooltipProvider><TooltipRoot {...props}><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent side={side} align={align}>{content}</TooltipContent></TooltipRoot></TooltipProvider>;
}
