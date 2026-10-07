import { FormattedInput, type ValidatedInputProps } from "./formatted-input";
export type { ValidatedInputProps } from "./formatted-input";
export type PhoneInputProps = ValidatedInputProps;
export function PhoneInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="phone" />;
}
