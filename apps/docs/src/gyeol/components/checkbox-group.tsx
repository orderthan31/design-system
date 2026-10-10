import { useId, useRef, type HTMLAttributes } from 'react';
import { Checkbox } from '../primitives/checkbox';
import { useFieldState } from '../lib/use-field-state';
import { cn } from '../lib/cn';
export type CheckboxOption = { value: string; label: string; disabled?: boolean };
export type CheckboxGroupProps = Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> & { label: string; options: readonly CheckboxOption[]; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; name?: string; disabled?: boolean; form?: string; selectAll?: boolean; hint?: string; error?: string; showTags?: false };
const empty: string[] = [];
export function CheckboxGroup({ label, options, value, defaultValue = empty, onValueChange, name, disabled, form, selectAll = false, hint, error, className, showTags: _showTags, ...props }: CheckboxGroupProps) {
  const root = useRef<HTMLFieldSetElement>(null), id = useId();
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, form);
  const available = options.filter(option => !option.disabled), chosen = available.filter(option => current.includes(option.value)).length;
  return <fieldset {...props} ref={root} disabled={disabled} form={form} aria-describedby={[hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined} className={cn('grid min-w-0 gap-3 border-0 p-0', className)}>
    <legend className="mb-3 text-g-body font-medium text-g-ink">{label}</legend>
    {selectAll && <label className="flex min-h-11 items-center gap-3"><Checkbox aria-label={`${label} 전체 선택`} checked={chosen === 0 ? false : chosen === available.length ? true : 'indeterminate'} disabled={disabled || available.length === 0}
      onCheckedChange={next => change(next === true ? [...new Set([...current, ...available.map(option => option.value)])] : current.filter(value => !available.some(option => option.value === value)))}/>전체 선택</label>}
    {options.map((option, index) => <label key={option.value} htmlFor={id + '-' + index} className="flex min-h-11 items-center gap-3 text-g-body text-g-ink">
      <Checkbox id={id + '-' + index} checked={current.includes(option.value)} disabled={disabled || option.disabled} aria-invalid={!!error || undefined}
        onCheckedChange={next => change(next === true ? [...new Set([...current, option.value])] : current.filter(value => value !== option.value))}/>{option.label}
      {name && current.includes(option.value) && <input type="hidden" name={name} value={option.value} disabled={disabled || option.disabled} form={form}/>}
    </label>)}
    {hint && <p id={id + '-hint'} className="text-g-small text-g-soft">{hint}</p>}{error && <p id={id + '-error'} role="alert" className="text-g-small text-g-danger">{error}</p>}
  </fieldset>;
}
