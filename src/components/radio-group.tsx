import React from "react";
import {useNativeFormReset} from "./native-form-reset";
import {described,type FieldProps} from "./field-frame";
import "./selection-group.css";
import type {ChoiceOption} from "./choice-option";
export type RadioGroupProps = FieldProps & {
  options: ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
export function RadioGroup({
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  hint,
  error,
  id: supplied,
  ...props
}: RadioGroupProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue);
  const root=React.useRef<HTMLFieldSetElement>(null),initial=React.useRef(defaultValue);
  useNativeFormReset(root,undefined,()=>{const next=value??initial.current;if(value===undefined)setInternal(next);root.current?.querySelectorAll<HTMLInputElement>('input').forEach(input=>{input.checked=input.value===next;});});
  return (
    <fieldset ref={root}
      className="fc-group"
      disabled={props.disabled}
      aria-describedby={described(id, hint, error)}
      aria-invalid={!!error}
    >
      <legend>
        {label}
        {props.required && " (필수)"}
      </legend>
      <div className="fc-choices">
        {options.map((option) => (
          <label className="checkbox" key={option.value}>
            <input
              type="radio"
              name={props.name ?? id}
              value={option.value}
              checked={(value ?? internal) === option.value}
              required={props.required}
              disabled={option.disabled}
              onChange={() => {
                setInternal(option.value);
                onValueChange?.(option.value);
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {hint && (
        <p className="help" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
