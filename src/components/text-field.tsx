import React from 'react';
import './text-field.css';
import type { InputProps } from './input';
export type TextFieldProps = Omit<InputProps, 'prefix' | 'children'> & {
  label: string;
  description?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  trailingAction?: React.ReactNode;
  clearable?: boolean;
  clearLabel?: string;
};
import { Input } from './input';
import { Button } from './button';
import { Icon } from './icon';
import { FormField } from './form-field';

type FieldInputProps = Omit<TextFieldProps, 'label' | 'description' | 'error'> & { externalDescription?: string; externalInvalid?: InputProps['aria-invalid'] };
function FieldInput({ externalDescription, externalInvalid, prefix, suffix, trailingAction, clearable = false, clearLabel = '입력 지우기', ...props }: FieldInputProps) {
  const inputHost = React.useRef<HTMLDivElement>(null);
  const clear = () => {
    const input = inputHost.current?.querySelector('input');
    if (!input || input.matches(':disabled') || input.readOnly) return;
    // Input은 ref를 전달하지 않으므로 소유한 행의 네이티브 입력만 조회한다.
    const view = input.ownerDocument.defaultView;
    const setter = view && Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value')?.set;
    if (!setter || !view) return;
    setter.call(input, '');
    input.dispatchEvent(new view.Event('input', { bubbles: true }));
    input.focus();
  };
  return <div className="tf-row">
    {prefix != null && <div className="tf-affix">{prefix}</div>}
    <div className="tf-input" ref={inputHost}><Input {...props} aria-invalid={props['aria-invalid'] ?? externalInvalid} aria-describedby={[externalDescription, props['aria-describedby']].filter(Boolean).join(' ') || undefined} /></div>
    {suffix != null && <div className="tf-affix">{suffix}</div>}
    {clearable && <Button type="button" variant="ghost" className="tf-clear" aria-label={clearLabel} disabled={props.disabled || props.readOnly} onClick={clear}><Icon name="close" size={18} /></Button>}
    {trailingAction != null && <div className="tf-action">{trailingAction}</div>}
  </div>;
}

export function TextField({ label, description, error, required, 'aria-describedby': externalDescription, 'aria-invalid': externalInvalid, ...props }: TextFieldProps) {
  return <FormField label={label} description={description} error={error} required={required} id={props.id}>
    <FieldInput {...props} externalDescription={externalDescription} externalInvalid={externalInvalid} />
  </FormField>;
}
