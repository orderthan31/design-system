import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { IconButton } from '../primitives/icon-button';
import { FormField } from './form-field';
export type PasswordInputProps = Omit<InputProps, 'type'> & { label: string; hint?: string; error?: string };
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ label, hint, error, ...props }, ref) {
  const input = useRef<HTMLInputElement>(null), selection = useRef<{start: number | null; end: number | null; direction: 'forward' | 'backward' | 'none' | null} | null>(null);
  const [visible, setVisible] = useState(false), [composing, setComposing] = useState(false);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => {
    const form = input.current?.form; if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) { selection.current = null; setVisible(false); setComposing(false); } });
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  }, []);
  useLayoutEffect(() => {
    if (!selection.current || !input.current) return;
    input.current.focus(); input.current.setSelectionRange(selection.current.start, selection.current.end, selection.current.direction ?? undefined); selection.current = null;
  }, [visible]);
  return <FormField label={label} hint={hint} error={error} inputProps={props}>{field => <div className="relative min-w-0">
    <Input {...field} ref={input} type={visible ? 'text' : 'password'} className="pr-14"
      onCompositionStart={event => { setComposing(true); props.onCompositionStart?.(event); }}
      onCompositionEnd={event => { setComposing(false); props.onCompositionEnd?.(event); }}/>
    <IconButton icon={visible ? 'eyeOff' : 'eye'} label={visible ? `${label} 숨기기` : `${label} 표시하기`} variant="quiet" className="absolute inset-y-0 right-1" aria-pressed={visible} disabled={props.disabled || props.readOnly || composing}
      onMouseDown={event => event.preventDefault()} onClick={() => { const node = input.current; if (!node) return; selection.current = { start: node.selectionStart, end: node.selectionEnd, direction: node.selectionDirection }; setVisible(current => !current); }}/>
  </div>}</FormField>;
});
