import React from "react";
import { Field, described, type FieldProps } from "./field-frame";
import { Input } from "./input";
import type { ChoiceOption } from "./choice-option";
import "./combobox.css";
export type ComboboxProps = FieldProps & {
  options: ChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
};

export function Combobox({
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  hint,
  error,
  id: supplied,
  ...props
}: ComboboxProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue),
    [query, setQuery] = React.useState(""),
    [open, setOpen] = React.useState(false),
    [active, setActive] = React.useState(-1);
  const selected = value ?? internal;
  const filtered = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const enabled = filtered
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);
  const selectionState = React.useRef({
    disabled: props.disabled,
    onValueChange,
  });
  React.useLayoutEffect(() => {
    selectionState.current = { disabled: props.disabled, onValueChange };
    if (props.disabled) {
      setOpen(false);
      setQuery("");
      setActive(-1);
    }
  }, [props.disabled, onValueChange]);
  const expanded = open && !props.disabled;
  const choose = (option: ChoiceOption) => {
    if (selectionState.current.disabled || option.disabled) return;
    setInternal(option.value);
    selectionState.current.onValueChange?.(option.value);
    setQuery("");
    setOpen(false);
    setActive(-1);
  };
  const selectedOption = options.find((option) => option.value === selected);
  const controlRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    controlRef.current
      ?.querySelector("input")
      ?.setCustomValidity(
        props.required && !selectedOption ? "항목을 선택해 주세요." : "",
      );
  }, [props.required, selectedOption]);
  const display = expanded ? query : (selectedOption?.label ?? "");
  return (
    <Field {...props} label={label} id={id} hint={hint} error={error}>
      <div className="fc-combobox" ref={controlRef}>
        <Input
          {...props}
          name={undefined}
          required={false}
          id={id}
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={`${id}-list`}
          aria-activedescendant={
            expanded && active >= 0 ? `${id}-option-${active}` : undefined
          }
          aria-required={props.required}
          aria-invalid={!!error}
          aria-describedby={described(id, hint, error)}
          value={display}
          onFocus={() => {
            if (selectionState.current.disabled) return;
            setOpen(true);
            setQuery("");
          }}
          onClick={() => {
            if (!selectionState.current.disabled) setOpen(true);
          }}
          onChange={(event) => {
            if (selectionState.current.disabled) return;
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onBlur={() => {
            setOpen(false);
            setActive(-1);
          }}
          onKeyDown={(event) => {
            if (
              selectionState.current.disabled ||
              event.nativeEvent.isComposing
            )
              return;
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              setActive(-1);
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              const position = enabled.indexOf(active);
              setActive(
                enabled[
                  (position +
                    (event.key === "ArrowDown" ? 1 : position < 0 ? 0 : -1) +
                    enabled.length) %
                    enabled.length
                ] ?? -1,
              );
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              if (active >= 0 && filtered[active]) choose(filtered[active]);
            }
          }}
        />
        {props.name && (
          <input
            type="hidden"
            name={props.name}
            value={selected}
            disabled={props.disabled}
          />
        )}
        {expanded && (
          <ul
            className="fc-options"
            role="listbox"
            id={`${id}-list`}
            aria-label={`${label} 선택`}
          >
            {filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={selected === option.value}
                aria-disabled={option.disabled}
                data-active={active === index || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                {option.label}
              </li>
            ))}
            {!filtered.length && <li role="presentation">검색 결과 없음</li>}
          </ul>
        )}
      </div>
    </Field>
  );
}
export const Autocomplete = Combobox;
export type AutocompleteProps = ComboboxProps;
