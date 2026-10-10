import { forwardRef } from 'react';
import { TextField, type TextFieldProps } from './text-field';
export type EmailInputProps = Omit<TextFieldProps, 'type'>;
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(function EmailInput(props, ref) {
  return <TextField autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} {...props} type="email" ref={ref}/>;
});
