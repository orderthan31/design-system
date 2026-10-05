import React, { useId } from "react";
import { Input } from "./atoms";
export function FormField({
  label,
  description,
  error,
  required,
  children,
  ...props
}: {
  label: string;
  description?: string;
  error?: string;
  children?: React.ReactElement;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const uid = useId();
  const id = props.id ?? uid;
  const association = {
    id,
    "aria-describedby":
      [description && `${id}-help`, error && `${id}-error`]
        .filter(Boolean)
        .join(" ") || undefined,
    "aria-invalid": error ? true : undefined,
    required,
  };
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span> (필수)</span>}
      </label>
      {children ? (
        React.cloneElement(
          children as React.ReactElement<Record<string, unknown>>,
          association,
        )
      ) : (
        <Input {...props} {...association} />
      )}{" "}
      {description && (
        <p id={`${id}-help`} className="help">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="error">
          {error}
        </p>
      )}
    </div>
  );
}
