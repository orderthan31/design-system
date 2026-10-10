import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Primitive from '@radix-ui/react-checkbox';
import { cn } from '../lib/cn';
export type CheckboxProps = ComponentPropsWithoutRef<typeof Primitive.Root>;
export const Checkbox = forwardRef<ElementRef<typeof Primitive.Root>, CheckboxProps>(function Checkbox({ className, ...props }, ref) {
  return <Primitive.Root {...props} ref={ref} className={cn('inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-g-control border border-solid border-g-line bg-g-surface text-g-on-action data-[state=checked]:border-g-focus data-[state=checked]:bg-g-action data-[state=indeterminate]:border-g-focus data-[state=indeterminate]:bg-g-action focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus disabled:cursor-not-allowed disabled:opacity-50', className)}>
    <Primitive.Indicator className="flex items-center justify-center"><svg aria-hidden="true" fill="none" viewBox="0 0 16 16" className="h-4 w-4 stroke-current" strokeWidth="2"><path className="[[data-state=indeterminate]_&]:hidden" d="m3 8 3 3 7-7"/><path className="[[data-state=checked]_&]:hidden" d="M3 8h10"/></svg></Primitive.Indicator>
  </Primitive.Root>;
});
