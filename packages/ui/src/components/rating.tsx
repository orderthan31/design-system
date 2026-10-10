import { useId, useRef, type HTMLAttributes } from 'react';
import { Icon } from '../primitives/icon';
import { cn } from '../lib/cn';
import { useFieldState } from '../lib/use-field-state';
export type RatingProps = Omit<HTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange'> & { label: string; value?: number; defaultValue?: number; onValueChange?: (value: number) => void; max?: number; name?: string; disabled?: boolean; readOnly?: boolean; required?: boolean; form?: string; step?: 1 };
export function Rating({ label, value, defaultValue = 0, onValueChange, max = 5, name, disabled, readOnly, required, form, className, step: _step, ...props }: RatingProps) {
  const root = useRef<HTMLFieldSetElement>(null), id = useId();
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, form);
  const limit = Number.isFinite(max) ? Math.max(1, Math.min(10, Math.floor(max))) : 5;
  const score = Math.min(limit, Math.max(0, Math.round(current)));
  return <fieldset {...props} ref={root} disabled={disabled} form={form} className={cn('min-w-0 border-0 p-0', className)}>
    <legend className="mb-2 text-g-body font-medium text-g-ink">{label}</legend>
    <div className="flex flex-wrap items-center gap-1">{Array.from({ length: limit }, (_, index) => index + 1).map(point => readOnly ?
      <span key={point} aria-hidden="true" className={cn('inline-flex h-11 w-11 items-center justify-center text-g-soft', point <= score && 'text-g-action')}><Icon name="star" className={point <= score ? 'fill-current' : undefined}/></span> :
      <label key={point} htmlFor={id + '-' + point} className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center">
        <input id={id + '-' + point} className="peer sr-only" type="radio" name={name} value={point} checked={score === point} disabled={disabled} required={required && (name !== undefined || (point === 1 && score === 0))} form={form} aria-label={`${limit}점 중 ${point}점`} onChange={() => change(point)} onKeyDown={event => {
          const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
          if (!direction) return; event.preventDefault(); const next = (point - 1 + direction + limit) % limit + 1;
          change(next); root.current?.querySelector<HTMLInputElement>(`input[value="${next}"]`)?.focus();
        }}/>
        <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-g-control text-g-soft peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-g-focus peer-disabled:opacity-50', point <= score && 'text-g-action')}><Icon name="star" className={point <= score ? 'fill-current' : undefined}/></span>
      </label>)}<span className="text-g-small text-g-soft" role="status">{score} / {limit}</span></div>
    {name && readOnly && score > 0 && <input type="hidden" name={name} value={score} disabled={disabled} form={form}/>}
  </fieldset>;
}
