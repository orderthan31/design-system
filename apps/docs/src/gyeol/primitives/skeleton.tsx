import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type SkeletonProps = HTMLAttributes<HTMLDivElement> & { shape?: 'text' | 'circle' | 'block' };
const shapes = { text: 'h-4 w-full rounded-g-control', circle: 'h-11 w-11 rounded-full', block: 'h-24 w-full rounded-g-panel' };
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ className, shape = 'text', ...props }, ref) {
  return <div {...props} ref={ref} aria-hidden="true" className={cn('bg-g-muted', shapes[shape], className)}/>;
});
