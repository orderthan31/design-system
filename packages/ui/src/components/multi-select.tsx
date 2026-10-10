import { useEffect, useId, useRef, useState, type HTMLAttributes } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../primitives/popover';
import { Checkbox } from '../primitives/checkbox';
import { Button } from '../primitives/button';
import { Icon } from '../primitives/icon';
import { cn } from '../lib/cn';
import { useFieldState } from '../lib/use-field-state';
export type MultiSelectOption = { value: string; label: string; disabled?: boolean };
export type MultiSelectProps = Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & { label: string; options: readonly MultiSelectOption[]; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void; name?: string; form?: string; disabled?: boolean; maxSelections?: number; showTags?: boolean; placeholder?: string; hint?: string; error?: string };
const empty: string[] = [];
export function MultiSelect({ label, options, value, defaultValue = empty, onValueChange, name, form, disabled, maxSelections, showTags = true, placeholder = '항목 선택', hint, error, className, ...props }: MultiSelectProps) {
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), id = useId();
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, form), [open, setOpen] = useState(false);
  const selected = options.filter(option => current.includes(option.value)), atLimit = maxSelections !== undefined && current.length >= Math.max(0, Math.floor(maxSelections));
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => {
    const owner = form ? document.getElementById(form) : root.current?.closest('form'); if (!(owner instanceof HTMLFormElement)) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setOpen(false); });
    owner.addEventListener('reset', reset); return () => owner.removeEventListener('reset', reset);
  }, [form]);
  const remove = (value: string) => { change(current.filter(item => item !== value)); trigger.current?.focus(); };
  return <div {...props} ref={root} className={cn('grid min-w-0 gap-2', className)}><label htmlFor={id} className="text-g-small font-medium text-g-ink">{label}</label>
    <Popover open={open && !disabled} onOpenChange={next => { if (!disabled) setOpen(next); }}>
      <PopoverTrigger asChild><Button ref={trigger} id={id} variant="secondary" disabled={disabled} aria-invalid={!!error || undefined} aria-describedby={[hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined} className="w-full justify-between">
        <span className="min-w-0 flex-1 truncate text-left">{selected.length ? selected.map(option => option.label).join(', ') : placeholder}</span><Icon name="chevronDown"/>
      </Button></PopoverTrigger>
      <PopoverContent aria-label={`${label} 선택`} className="w-(--radix-popover-trigger-width) max-w-(--radix-popover-content-available-width)"><p className="text-g-small font-medium">{label}</p>
        <div className="grid gap-2">{options.map((option, index) => <label key={option.value} htmlFor={id + '-option-' + index} className="flex min-h-11 items-center gap-3 text-g-body">
          <Checkbox id={id + '-option-' + index} checked={current.includes(option.value)} disabled={disabled || option.disabled || (atLimit && !current.includes(option.value))}
            onCheckedChange={next => { if (next === true && !atLimit) change([...new Set([...current, option.value])]); else if (next !== true) change(current.filter(item => item !== option.value)); }}/>{option.label}
        </label>)}{options.length === 0 && <p className="text-g-small text-g-soft">선택할 항목이 없습니다.</p>}</div>
        <p role="status" className="text-g-small text-g-soft">{current.length}개 선택{maxSelections !== undefined && ` · 최대 ${Math.max(0, Math.floor(maxSelections))}개`}</p>
      </PopoverContent>
    </Popover>
    {showTags && selected.length > 0 && <ul className="flex flex-wrap gap-2">{selected.map(option => <li key={option.value}><Button variant="quiet" size="small" disabled={disabled || option.disabled} aria-label={`${label} ${option.label} 선택 해제`} onClick={() => remove(option.value)}>{option.label}<Icon name="close" size="small"/></Button></li>)}</ul>}
    {current.length > 0 && <div><Button variant="quiet" size="small" disabled={disabled || selected.every(option => option.disabled)} onClick={() => { change(current.filter(value => options.find(option => option.value === value)?.disabled)); trigger.current?.focus(); }}>선택 지우기</Button></div>}
    {name && selected.map(option => <input key={option.value} type="hidden" name={name} value={option.value} disabled={disabled || option.disabled} form={form}/>)}
    {hint && <p id={id + '-hint'} className="text-g-small text-g-soft">{hint}</p>}{error && <p id={id + '-error'} role="alert" className="text-g-small text-g-danger">{error}</p>}
  </div>;
}
