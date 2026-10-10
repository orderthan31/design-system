import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Primitive from '@radix-ui/react-progress';
import { cn } from '../lib/cn';
export type ProgressProps = ComponentPropsWithoutRef<typeof Primitive.Root> & { label: string };
export const Progress = forwardRef<ElementRef<typeof Primitive.Root>, ProgressProps>(function Progress({ className, label, value = null, max = 100, ...props }, ref) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = value !== null && Number.isFinite(value) && value >= 0 && value <= limit ? value : null;
  return <Primitive.Root {...props} ref={ref} value={current} max={limit} aria-label={label} className={cn('overflow-hidden rounded-full bg-g-muted', className)}><Primitive.Indicator asChild><svg aria-hidden="true" viewBox="0 0 100 8" preserveAspectRatio="none" className="block h-2 w-full"><rect width={current === null ? 35 : current / limit * 100} height="8" rx="4" className={cn('fill-g-action', current === null && 'motion-safe:animate-pulse')}/></svg></Primitive.Indicator></Primitive.Root>;
});
