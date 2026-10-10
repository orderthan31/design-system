import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { FormField } from './form-field';
import { useFieldState } from '../lib/use-field-state';
export type FormattedInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'type'> & {
  label: string; hint?: string; error?: string; value?: string; defaultValue?: string; onValueChange?: (raw: string) => void;
  normalize: (display: string) => string; format: (raw: string) => string; validate: (raw: string) => string | undefined;
};
export const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(function FormattedInput({ label, hint, error, value, defaultValue = '', onValueChange, onChange, normalize, format, validate, name, ...props }, ref) {
  const input = useRef<HTMLInputElement>(null), composing = useRef(false), caret = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null), [current, change] = useFieldState(value, defaultValue, onValueChange, input, props.form);
  const problem = validate(current), display = draft ?? format(current);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => { input.current?.setCustomValidity(problem ?? ''); }, [problem]);
  useEffect(() => {
    const form = input.current?.form; if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) { composing.current = false; caret.current = null; setDraft(null); } });
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  }, []);
  useLayoutEffect(() => {
    if (caret.current === null || composing.current || document.activeElement !== input.current) return;
    let remaining = caret.current, position = 0;
    while (remaining > 0 && position < display.length) { if (/[0-9.+-]/.test(display[position])) remaining--; position++; }
    input.current?.setSelectionRange(position, position); caret.current = null;
  });
  const commit = (node: HTMLInputElement) => { caret.current = (node.value.slice(0, node.selectionStart ?? node.value.length).match(/[0-9.+-]/g) ?? []).length; change(normalize(node.value)); setDraft(null); };
  const edit = (event: ChangeEvent<HTMLInputElement>) => { if (composing.current) setDraft(event.currentTarget.value); else commit(event.currentTarget); onChange?.(event); };
  return <FormField label={label} hint={hint} error={error ?? problem} inputProps={props}>{field => <>
    <Input {...field} ref={input} type="text" value={display} onChange={edit}
      onCompositionStart={event => { composing.current = true; setDraft(event.currentTarget.value); props.onCompositionStart?.(event); }}
      onCompositionEnd={event => { composing.current = false; commit(event.currentTarget); props.onCompositionEnd?.(event); }}/>
    {name && <input type="hidden" name={name} value={current} disabled={props.disabled} form={props.form}/>}
  </>}</FormField>;
});
