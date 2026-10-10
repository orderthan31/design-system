import * as Primitive from '@radix-ui/react-radio-group';
import { forwardRef, useId, useImperativeHandle, useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';
import { useFieldState } from '../lib/use-field-state';
export type RadioOption = { value: string; label: string; disabled?: boolean };
export type RadioGroupProps = Omit<ComponentPropsWithoutRef<typeof Primitive.Root>, 'children' | 'value' | 'defaultValue'> & { label: string; options: readonly RadioOption[]; value?: string; defaultValue?: string; hint?: string; error?: string };
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({ label, options, value, defaultValue = '', onValueChange, hint, error, className, orientation = 'vertical', ...props }, ref) {
  const root = useRef<HTMLDivElement>(null), id = useId();
  useImperativeHandle(ref, () => root.current!, []);
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, props.form);
  return <div className="grid min-w-0 gap-2"><p id={id + '-label'} className="text-g-small font-medium text-g-ink">{label}{props.required && ' (필수)'}</p>
    <Primitive.Root {...props} ref={root} value={current} onValueChange={change} orientation={orientation} aria-labelledby={id + '-label'}
      aria-describedby={[props['aria-describedby'], hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined} aria-invalid={!!error || props['aria-invalid']}
      className={cn(orientation === 'horizontal' ? 'flex min-w-0 flex-wrap gap-4' : 'grid min-w-0 gap-2', className)}>
      {options.map((option, index) => <label key={option.value} htmlFor={id + '-' + index} className="flex min-h-11 items-center gap-3 text-g-body text-g-ink">
        <Primitive.Item id={id + '-' + index} value={option.value} disabled={props.disabled || option.disabled}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-solid border-g-line bg-g-surface data-[state=unchecked]:enabled:hover:border-g-line-hover transition-colors motion-reduce:transition-none text-g-action data-[state=checked]:border-g-focus focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus disabled:opacity-50">
          <Primitive.Indicator className="h-3 w-3 rounded-full bg-current"/>
        </Primitive.Item>{option.label}
      </label>)}
    </Primitive.Root>{hint && <p id={id + '-hint'} className="text-g-small text-g-soft">{hint}</p>}{error && <p id={id + '-error'} role="alert" className="text-g-small text-g-danger">{error}</p>}
  </div>;
});
