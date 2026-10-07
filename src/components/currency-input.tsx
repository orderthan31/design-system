import { FormattedInput, type ValidatedInputProps } from "./formatted-input";
import "./currency-input.css";
export type { ValidatedInputProps } from "./formatted-input";
export type CurrencyInputProps = ValidatedInputProps;
export function CurrencyInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="currency" />;
}
