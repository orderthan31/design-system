import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { IconButton } from '../primitives/icon-button';
import { FormField } from './form-field';
import { useFieldState } from '../lib/use-field-state';
export type NumberInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & { label: string; hint?: string; error?: string; value?: string; defaultValue?: string; onValueChange?: (value: string) => void };
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput({ label, hint, error, value, defaultValue = '', onValueChange, onChange, ...props }, ref) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const [current, change] = useFieldState(value, defaultValue, onValueChange, input, props.form);
  const increment = (direction: number) => { const node = input.current; if (!node || props.disabled || props.readOnly || props.step === 'any') return; node.stepUp(direction); change(node.value); node.focus(); };
  const blocked = props.disabled || props.readOnly || props.step === 'any';
  return <FormField label={label} hint={hint} error={error} inputProps={props}>{field => <div className="flex min-w-0 items-center gap-2">
    <IconButton icon="minus" label={`${label} 줄이기`} variant="secondary" disabled={blocked || (current !== '' && props.min !== undefined && Number(current) <= Number(props.min))} onClick={() => increment(-1)}/>
    <Input {...field} ref={input} type="number" value={current} onChange={event => { change(event.currentTarget.value); onChange?.(event); }}/>
    <IconButton icon="plus" label={`${label} 늘리기`} variant="secondary" disabled={blocked || (current !== '' && props.max !== undefined && Number(current) >= Number(props.max))} onClick={() => increment(1)}/>
  </div>}</FormField>;
});
