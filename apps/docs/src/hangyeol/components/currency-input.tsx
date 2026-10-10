import { forwardRef } from 'react';
import { FormattedInput, type FormattedInputProps } from './formatted-input';
export type CurrencyInputProps = Omit<FormattedInputProps, 'normalize' | 'format' | 'validate' | 'min' | 'max'> & { currency?: string; fractionDigits?: number; min?: number; max?: number };
export const normalizeCurrency = (value: string) => value.replace(/[,\s]/g, '');
export function formatCurrency(raw: string) {
  if (!/^-?\d*(?:\.\d*)?$/.test(raw)) return raw;
  const [integer, decimal] = raw.split('.');
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal === undefined ? '' : '.' + decimal);
}
export function validateCurrency(raw: string, fractionDigits = 2, min?: number, max?: number) {
  if (raw === '') return undefined;
  if (!/^-?\d+(?:\.\d+)?$/.test(raw) || !Number.isFinite(Number(raw))) return '금액을 숫자로 입력하세요.';
  if ((raw.split('.')[1]?.length ?? 0) > fractionDigits) return `소수점 아래 ${fractionDigits}자리까지 입력하세요.`;
  if (min !== undefined && Number(raw) < min) return `${min} 이상의 금액을 입력하세요.`;
  if (max !== undefined && Number(raw) > max) return `${max} 이하의 금액을 입력하세요.`;
  return undefined;
}
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput({ currency, fractionDigits = 2, min, max, hint, ...props }, ref) {
  return <FormattedInput inputMode="decimal" {...props} hint={hint ?? (currency ? `금액 단위: ${currency}` : undefined)} ref={ref}
    normalize={normalizeCurrency} format={formatCurrency} validate={raw => validateCurrency(raw, fractionDigits, min, max)}/>;
});
