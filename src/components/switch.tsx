import React from "react";
import {useNativeFormReset} from "./native-form-reset";
import {described,type FieldProps} from "./field-frame";
import "./switch.css";
export type SwitchProps = FieldProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
export function Switch({
  label,
  checked,
  defaultChecked = false,
  onCheckedChange,
  hint,
  error,
  id: supplied,
  ...props
}: SwitchProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultChecked);
  const input=React.useRef<HTMLInputElement>(null),initial=React.useRef(defaultChecked);
  useNativeFormReset(input,undefined,()=>{const next=checked??initial.current;if(checked===undefined)setInternal(next);if(input.current)input.current.checked=next;});
  return (
    <div className="fc-field">
      <label className="fc-switch">
        <input
          {...props}
          ref={input}
          id={id}
          type="checkbox"
          role="switch"
          checked={checked ?? internal}
          aria-describedby={described(id, hint, error)}
          aria-invalid={!!error}
          onChange={(event) => {
            setInternal(event.target.checked);
            onCheckedChange?.(event.target.checked);
          }}
        />
        <span className="fc-switch-track" aria-hidden="true" />
        <span>
          {label}
          {props.required && " (필수)"}
        </span>
      </label>
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
    </div>
  );
}
