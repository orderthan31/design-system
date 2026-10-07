export interface DatePickerProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValidityChange?: (valid: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  busy?: boolean;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
  disabledDates?: readonly string[];
}
