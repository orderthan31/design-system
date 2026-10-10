import * as Primitive from '@radix-ui/react-toggle-group';
import { forwardRef, useImperativeHandle, useRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { useFieldState } from '../lib/use-field-state';
export type SegmentOption = { value: string; label: string; disabled?: boolean };
export type SegmentedControlProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & { label: string; options: readonly SegmentOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; disabled?: boolean; allowEmpty?: boolean; name?: string; form?: string; orientation?: 'horizontal' | 'vertical'; dir?: 'ltr' | 'rtl' };
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl({ label, options, value, defaultValue = '', onValueChange, disabled, allowEmpty = false, name, form, className, orientation = 'horizontal', ...props }, ref) {
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!, []);
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, form);
  const selected = options.find(option => option.value === current);
  return <><Primitive.Root {...props} type="single" ref={root} aria-label={label} value={current} onValueChange={next => { if (next || allowEmpty) change(next); }} disabled={disabled} orientation={orientation}
    className={cn('inline-flex min-w-0 flex-wrap gap-1 rounded-g-control bg-g-muted p-1', orientation === 'vertical' && 'flex-col', className)}>
    {options.map(option => <Primitive.Item key={option.value} type="button" value={option.value} disabled={option.disabled}
      className="min-h-11 min-w-0 rounded-g-control border-0 bg-transparent px-3 py-2 text-g-body text-g-soft data-[state=on]:bg-g-surface data-[state=on]:text-g-action data-[state=on]:shadow-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus disabled:opacity-50">{option.label}</Primitive.Item>)}
  </Primitive.Root>{name && selected && <input type="hidden" name={name} value={current} disabled={disabled || selected.disabled} form={form}/>}</>;
});
