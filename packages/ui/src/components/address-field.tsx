import { useId, useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { TextField } from './text-field';
import { Button } from '../primitives/button';
import { useFieldState } from '../lib/use-field-state';
import { cn } from '../lib/cn';
export type AddressValue = { postalCode: string; address: string; detail: string };
export type AddressFieldProps = Omit<HTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange'> & { label?: string; value?: AddressValue; defaultValue?: AddressValue; onValueChange?: (value: AddressValue) => void; onSearch?: (select: (address: Pick<AddressValue, 'postalCode' | 'address'>) => void) => void; searchSlot?: ReactNode; name?: string; disabled?: boolean; readOnly?: boolean; required?: boolean; error?: string; form?: string };
const empty: AddressValue = { postalCode: '', address: '', detail: '' };
export function AddressField({ label = '주소', value, defaultValue = empty, onValueChange, onSearch, searchSlot, name, disabled, readOnly, required, error, form, className, ...props }: AddressFieldProps) {
  const root = useRef<HTMLFieldSetElement>(null), detail = useRef<HTMLInputElement>(null), pending = useRef(false), id = useId();
  const [current, change] = useFieldState(value, defaultValue, onValueChange, root, form);
  const latest = useRef({ current, disabled, readOnly }); latest.current = { current, disabled, readOnly };
  useLayoutEffect(() => { if (pending.current) { if (!disabled && !readOnly) detail.current?.focus(); pending.current = false; } });
  const edit = (field: keyof AddressValue, next: string) => change({ ...current, [field]: next });
  return <fieldset {...props} ref={root} form={form} disabled={disabled} className={cn('grid min-w-0 gap-4 border-0 p-0', className)}>
    <legend className="mb-3 text-g-body font-medium text-g-ink">{label}</legend>
    <div className="flex flex-wrap items-end gap-2"><div className="min-w-0 flex-1"><TextField id={id + '-postal'} label="우편번호" name={name && name + '.postalCode'} value={current.postalCode} onValueChange={next => edit('postalCode', next)} autoComplete="postal-code" form={form} disabled={disabled} readOnly={readOnly}/></div>
      {onSearch && <Button variant="secondary" disabled={disabled || readOnly} onClick={() => onSearch(address => { if (latest.current.disabled || latest.current.readOnly || !root.current?.isConnected) return; pending.current = true; change({ ...latest.current.current, ...address }); })}>주소 검색</Button>}{searchSlot}</div>
    <TextField id={id + '-address'} label="기본 주소" name={name && name + '.address'} value={current.address} onValueChange={next => edit('address', next)} autoComplete="address-line1" form={form} disabled={disabled} readOnly={readOnly} required={required} error={error}/>
    <TextField ref={detail} id={id + '-detail'} label="상세 주소" name={name && name + '.detail'} value={current.detail} onValueChange={next => edit('detail', next)} autoComplete="address-line2" form={form} disabled={disabled} readOnly={readOnly}/>
  </fieldset>;
}
