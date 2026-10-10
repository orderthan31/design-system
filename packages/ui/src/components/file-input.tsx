import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { Button } from '../primitives/button';
import { FormField } from './form-field';
export type FileInputProps = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & { label: string; hint?: string; error?: string; maxSize?: number; onFilesChange?: (files: File[]) => void };
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput({ label, hint, error, maxSize, onFilesChange, onChange, ...props }, ref) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]), [problem, setProblem] = useState<string>();
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => {
    const form = input.current?.form; if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) { setFiles([]); setProblem(undefined); if (input.current) { input.current.value = ''; input.current.setCustomValidity(''); } } });
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  }, []);
  return <FormField label={label} hint={hint} error={error ?? problem} inputProps={props}>{field => <div className="grid min-w-0 gap-2">
    <Input {...field} ref={input} type="file" onChange={event => {
      const next = Array.from(event.currentTarget.files ?? []), tooLarge = next.find(file => maxSize !== undefined && file.size > maxSize);
      const message = tooLarge ? `${tooLarge.name}: 허용 크기 ${maxSize}바이트를 초과했습니다.` : undefined;
      event.currentTarget.setCustomValidity(message ?? ''); setFiles(next); setProblem(message); onFilesChange?.(next); onChange?.(event);
    }}/>
    {files.length > 0 && <><ul className="grid gap-1 text-g-small text-g-soft">{files.map((file, index) => <li key={index} className="break-all">{file.name} · {file.size}바이트</li>)}</ul>
      <div><Button variant="quiet" disabled={props.disabled || props.readOnly} onClick={() => { if (input.current) { input.current.value = ''; input.current.setCustomValidity(''); input.current.focus(); } setFiles([]); setProblem(undefined); onFilesChange?.([]); }}>선택 지우기</Button></div></>}
  </div>}</FormField>;
});
