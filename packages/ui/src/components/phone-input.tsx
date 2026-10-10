import { forwardRef } from 'react';
import { FormattedInput, type FormattedInputProps } from './formatted-input';
export type PhoneInputProps = Omit<FormattedInputProps, 'normalize' | 'format' | 'validate'>;
export const normalizePhone = (value: string) => value.replace(/[\s()-]/g, '');
export function formatPhone(raw: string) {
  if (!/^0\d{8,10}$/.test(raw)) return raw;
  const head = raw.startsWith('02') ? 2 : 3;
  return `${raw.slice(0, head)}-${raw.slice(head, -4)}-${raw.slice(-4)}`;
}
export function validatePhone(raw: string) {
  return raw === '' || /^(?:02\d{7,8}|0[1-9]\d{8,9})$/.test(raw) ? undefined : '0으로 시작하는 국내 전화번호를 입력하세요. 국제번호는 지원하지 않습니다.';
}
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(props, ref) {
  return <FormattedInput autoComplete="tel-national" inputMode="tel" {...props} ref={ref} normalize={normalizePhone} format={formatPhone} validate={validatePhone}/>;
});
