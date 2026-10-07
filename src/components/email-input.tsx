import { FormattedInput, type ValidatedInputProps } from "./formatted-input";
export type { ValidatedInputProps } from "./formatted-input";
export type EmailInputProps = ValidatedInputProps;
export function EmailInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="email" />;
}
