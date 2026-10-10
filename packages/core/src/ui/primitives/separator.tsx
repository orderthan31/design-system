import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type SeparatorProps = HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean };
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator({ className, orientation = 'horizontal', decorative = true, ...props }, ref) {
  return <div {...props} ref={ref} role={decorative ? 'none' : 'separator'} aria-orientation={decorative ? undefined : orientation} className={cn('shrink-0 bg-g-line', orientation === 'horizontal' ? 'h-px w-full' : 'w-px self-stretch', className)}/>;
});
