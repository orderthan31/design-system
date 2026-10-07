import React from "react";
import {useNativeFormReset} from "./native-form-reset";
import {described,type FieldProps} from "./field-frame";
import "./selection-group.css";
import type {ChoiceOption} from "./choice-option";
import {Checkbox} from "./checkbox";
import {Button} from "./button";
export type MultiSelectProps = FieldProps & {
  options: ChoiceOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  showTags?: boolean;
};
export function MultiSelect({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  hint,
  error,
  id: supplied,
  showTags = true,
  ...props
}: MultiSelectProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue);
  const root=React.useRef<HTMLFieldSetElement>(null),initial=React.useRef(defaultValue);
  useNativeFormReset(root,undefined,()=>{const next=value??initial.current;if(value===undefined)setInternal(next);root.current?.querySelectorAll<HTMLInputElement>('input').forEach(input=>{input.checked=next.includes(input.value);});});
  const selected = value ?? internal;
  const toggle = (key: string) => {
    if (
      props.disabled ||
      options.find((option) => option.value === key)?.disabled
    )
      return;
    const next = selected.includes(key)
      ? selected.filter((item) => item !== key)
      : [...selected, key];
    setInternal(next);
    onValueChange?.(next);
  };
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
      <div className="fc-tags">
        {showTags &&
          selected.map((key) => (
            <span className="fc-tag" key={key}>
              {options.find((option) => option.value === key)?.label ?? key}
              <Button
                variant="quiet"
                size="small"
                aria-label={`${options.find((option) => option.value === key)?.label ?? key} 제거`}
                disabled={
                  props.disabled ||
                  options.find((option) => option.value === key)?.disabled
                }
                onClick={() => toggle(key)}
              >
                ×
              </Button>
            </span>
          ))}
      </div>
      <div className="fc-choices">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            required={props.required && selected.length === 0}
            name={props.name}
            value={option.value}
            disabled={option.disabled || props.disabled}
            onChange={() => toggle(option.value)}
          />
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
