import React from "react";
import "./field-frame.css";
export type FieldProps = {
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  id?: string;
  name?: string;
};
export type TextControlProps = FieldProps &
  Omit<React.ComponentPropsWithRef<"input">, "size">;
export type PasswordInputProps = TextControlProps;
export function Field({
  label,
  required,
  id,
  hint,
  error,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div data-slot="field" className="field fc-field">
      <label data-slot="field-label" htmlFor={id}>
        {label}
        {required && " (필수)"}
      </label>
      {children}
      {hint && (
        <p data-slot="field-description" id={`${id}-hint`} className="help">
          {hint}
        </p>
      )}
      {error && (
        <p data-slot="field-error" id={`${id}-error`} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export function described(id: string, hint?: string, error?: string) {
  return (
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined
  );
}
