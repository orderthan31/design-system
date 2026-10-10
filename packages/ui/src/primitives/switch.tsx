import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Primitive from '@radix-ui/react-switch';
import { cn } from '../lib/cn';
export type SwitchProps = ComponentPropsWithoutRef<typeof Primitive.Root>;
export const Switch = forwardRef<ElementRef<typeof Primitive.Root>, SwitchProps>(function Switch({ className, ...props }, ref) {
  return <Primitive.Root {...props} ref={ref} className={cn('inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-solid border-g-line bg-g-muted px-1 transition-colors data-[state=checked]:border-g-focus data-[state=checked]:bg-g-action focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none', className)}><Primitive.Thumb className="block h-5 w-5 rounded-full bg-g-surface shadow-sm transition-transform data-[state=checked]:translate-x-5 motion-reduce:transition-none"/></Primitive.Root>;
});
