import React from "react";
import "./form-controls.css";
import { Input, Button } from "./atoms";
import { Checkbox, Select, Textarea } from "./primitives";

export function FormControlsGallery() {
  const galleryId = React.useId();
  const choices = [
    { value: "design", label: "디자인" },
    { value: "development", label: "개발" },
    { value: "research", label: "리서치" },
  ];
  return (
    <section className="fc-gallery" aria-label="확장 폼 컨트롤">
      <h3>폼 컨트롤</h3>
      <p className="help">(필수) 항목을 입력해 주세요.</p>
      <div className="fc-grid">
        <Field label="표시 이름" id={`${galleryId}-text`}>
          <Input id={`${galleryId}-text`} placeholder="이름 입력" />
        </Field>
        <Field label="검색" id={`${galleryId}-search`}>
          <Input
            id={`${galleryId}-search`}
            type="search"
            placeholder="검색어 입력"
          />
        </Field>
        <Field label="메모" id={`${galleryId}-memo`}>
          <Textarea id={`${galleryId}-memo`} placeholder="메모 입력" />
        </Field>
        <Field label="언어" id={`${galleryId}-language`}>
          <Select id={`${galleryId}-language`} defaultValue="ko">
            <option value="ko">한국어</option>
            <option value="en">영어</option>
          </Select>
        </Field>
        <PasswordInput
          label="비밀번호"
          required
          hint="8자 이상 입력해 주세요."
        />
        <NumberInput label="수량" defaultValue={1} min={0} max={10} step={1} />
        <CurrencyInput
          label="금액"
          defaultValue="12000"
          required
          hint="원 단위 정수로 입력해 주세요."
        />
        <PhoneInput label="전화번호" hint="예: 010-1234-5678" />
        <EmailInput label="이메일" required placeholder="name@example.kr" />
        <Combobox label="담당 분야" options={choices} />
        <MultiSelect label="관심 분야" options={choices} />
        <RadioGroup
          label="수령 방법"
          options={[
            { value: "delivery", label: "배송" },
            { value: "visit", label: "방문" },
          ]}
          defaultValue="delivery"
        />
        <CheckboxGroup
          label="알림 채널"
          options={[
            { value: "sms", label: "문자" },
            { value: "mail", label: "메일" },
          ]}
        />
        <Switch label="자동 저장" />
        <FileInput
          label="첨부 파일"
          accept=".pdf,image/*"
          hint="PDF 또는 이미지 파일"
        />
        <AddressField
          label="주소"
          hint="주소 검색은 서비스에서 연결해 주세요."
          searchSlot={(select) => (
            <>
              <p className="help">
                데모 데이터이며 실제 주소 검색 서비스가 아닙니다.
              </p>
              <Button
                variant="secondary"
                onClick={() =>
                  select({
                    road: "예시로 123",
                    jibun: "예시동 123-4",
                    postal: "12345",
                    detail: "101호",
                  })
                }
              >
                예시 주소 선택 (데모 데이터)
              </Button>
            </>
          )}
        />
      </div>
    </section>
  );
}

export type AddressValue = {
  road: string;
  jibun: string;
  postal: string;
  detail: string;
};
export type AddressFieldProps = FieldProps & {
  value?: AddressValue;
  defaultValue?: AddressValue;
  onValueChange?: (value: AddressValue) => void;
  onSearch?: (select: (value: AddressValue) => void) => void;
  searchSlot?:
    | React.ReactNode
    | ((select: (value: AddressValue) => void) => React.ReactNode);
};
export function AddressField({
  label = "주소",
  value,
  defaultValue = { road: "", jibun: "", postal: "", detail: "" },
  onValueChange,
  onSearch,
  searchSlot,
  hint,
  error,
  id: supplied,
  ...props
}: AddressFieldProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue),
    [touched, setTouched] = React.useState(false);
  const current = value ?? internal;
  const selectionState = React.useRef({
    disabled: props.disabled,
    onValueChange,
  });
  React.useLayoutEffect(() => {
    selectionState.current = { disabled: props.disabled, onValueChange };
  }, [props.disabled, onValueChange]);
  // External search providers may retain this callback across disabled renders.
  // Accept results only when currently enabled, using the latest change handler.
  const select = React.useCallback((next: AddressValue) => {
    if (selectionState.current.disabled) return;
    setInternal(next);
    selectionState.current.onValueChange?.(next);
  }, []);
  const message =
    error ||
    (touched && current.postal && !/^\d{5}$/.test(current.postal)
      ? "우편번호는 5자리 숫자로 입력해 주세요."
      : undefined);
  return (
    <fieldset className="fc-group fc-address" disabled={props.disabled}>
      <legend>
        {label}
        {props.required && " (필수)"}
      </legend>
      {onSearch && (
        <Button
          variant="secondary"
          disabled={props.disabled}
          onClick={() => onSearch(select)}
        >
          주소 검색
        </Button>
      )}
      {typeof searchSlot === "function" ? searchSlot(select) : searchSlot}
      {(["postal", "road", "jibun", "detail"] as const).map((key) => (
        <Field
          key={key}
          id={`${id}-${key}`}
          label={
            {
              postal: "우편번호",
              road: "도로명 주소",
              jibun: "지번 주소",
              detail: "상세 주소",
            }[key]
          }
          required={props.required && (key === "postal" || key === "road")}
        >
          <Input
            id={`${id}-${key}`}
            name={props.name ? `${props.name}.${key}` : undefined}
            value={current[key]}
            required={props.required && (key === "postal" || key === "road")}
            disabled={props.disabled}
            inputMode={key === "postal" ? "numeric" : undefined}
            pattern={key === "postal" ? "[0-9]{5}" : undefined}
            autoComplete={
              {
                postal: "postal-code",
                road: "address-line1",
                jibun: "off",
                detail: "address-line2",
              }[key]
            }
            aria-invalid={key === "postal" && !!message}
            aria-describedby={described(id, hint, message)}
            onBlur={() => setTouched(true)}
            onChange={(event) =>
              select({ ...current, [key]: event.target.value })
            }
          />
        </Field>
      ))}
      {hint && (
        <p id={`${id}-hint`} className="help">
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} role="alert" className="error">
          {message}
        </p>
      )}
    </fieldset>
  );
}

export type FileInputProps = FieldProps & {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
};
export function FileInput({
  label,
  accept,
  multiple,
  onFilesChange,
  hint,
  error,
  id: supplied,
  ...props
}: FileInputProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [files, setFiles] = React.useState<File[]>([]),
    [invalid, setInvalid] = React.useState(false);
  const message =
    error || (invalid ? "허용된 파일 형식을 선택해 주세요." : undefined);
  const allowed = (file: File) =>
    !accept ||
    accept.split(",").some((entry) => {
      const rule = entry.trim().toLowerCase();
      return rule.startsWith(".")
        ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith("/*")
          ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
          : file.type.toLowerCase() === rule;
    });
  return (
    <Field {...props} label={label} id={id} hint={hint} error={message}>
      <Input
        {...props}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        aria-invalid={!!message}
        aria-describedby={described(id, hint, message)}
        onChange={(event) => {
          const next = Array.from(event.target.files ?? []);
          const rejected = next.some((file) => !allowed(file));
          event.target.setCustomValidity(
            rejected ? "허용된 파일 형식을 선택해 주세요." : "",
          );
          setInvalid(rejected);
          setFiles(rejected ? [] : next);
          onFilesChange?.(rejected ? [] : next);
          if (rejected) event.target.value = "";
        }}
      />
      <span role="status" className="help">
        {files.length
          ? files.map((file) => file.name).join(", ")
          : "선택한 파일 없음"}
      </span>
    </Field>
  );
}

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
  return (
    <div className="fc-field">
      <label className="fc-switch">
        <input
          {...props}
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

export type CheckboxGroupProps = MultiSelectProps;
export function CheckboxGroup(props: CheckboxGroupProps) {
  return <MultiSelect {...props} showTags={false} />;
}

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
  return (
    <fieldset
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

export type MultiSelectProps = FieldProps & {
  options: ChoiceOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
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
}: MultiSelectProps & { showTags?: boolean }) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue);
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
    <fieldset
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

export type ChoiceOption = { value: string; label: string; disabled?: boolean };
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

export function EmailInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="email" />;
}
export function PhoneInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="phone" />;
}

export type ValidatedInputProps = FieldProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};
type FormattedInputProps = ValidatedInputProps & {
  kind: "currency" | "phone" | "email";
};
function FormattedInput({
  kind,
  label,
  value,
  defaultValue = "",
  onValueChange,
  error,
  hint,
  id: supplied,
  ...props
}: FormattedInputProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState(defaultValue),
    [touched, setTouched] = React.useState(false),
    [editing, setEditing] = React.useState(false);
  const current = value ?? internal;
  const raw = kind === "currency" ? current.replaceAll(",", "") : current;
  const valid =
    kind === "currency"
      ? /^\d+$/.test(raw) && Number.isSafeInteger(Number(raw))
      : kind === "phone"
        ? /^(?:02-?\d{3,4}-?\d{4}|0(?:1[016789]|[3-6][1-5]|70)-?\d{3,4}-?\d{4})$/.test(
            raw,
          )
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
  const message =
    error ||
    (touched && (raw ? !valid : props.required)
      ? kind === "currency"
        ? "0 이상의 정수 금액을 입력해 주세요."
        : kind === "phone"
          ? "올바른 전화번호를 입력해 주세요."
          : "올바른 이메일 주소를 입력해 주세요."
      : undefined);
  const controlRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    controlRef.current
      ?.querySelector("input")
      ?.setCustomValidity(
        error ||
          (raw && !valid
            ? kind === "currency"
              ? "0 이상의 정수 금액을 입력해 주세요."
              : kind === "phone"
                ? "올바른 전화번호를 입력해 주세요."
                : "올바른 이메일 주소를 입력해 주세요."
            : ""),
      );
  }, [error, raw, valid, kind]);
  const displayed =
    kind === "currency" && !editing && valid
      ? Number(raw).toLocaleString("ko-KR")
      : current;
  const change = (next: string) => {
    setEditing(true);
    setInternal(next);
    onValueChange?.(next);
  };
  return (
    <Field {...props} label={label} id={id} hint={hint} error={message}>
      <div className="fc-inline" ref={controlRef}>
        <Input
          {...props}
          id={id}
          type={kind === "phone" ? "tel" : kind === "email" ? "email" : "text"}
          inputMode={kind === "currency" ? "numeric" : undefined}
          value={displayed}
          onBlur={() => {
            setEditing(false);
            setTouched(true);
          }}
          onChange={(event) =>
            change(
              kind === "currency"
                ? event.target.value.replaceAll(",", "")
                : event.target.value,
            )
          }
          aria-invalid={!!message}
          aria-describedby={described(id, hint, message)}
        />
        {kind === "currency" && <span className="fc-unit">원</span>}
      </div>
    </Field>
  );
}
export function CurrencyInput(props: ValidatedInputProps) {
  return <FormattedInput {...props} kind="currency" />;
}

export type NumberInputProps = FieldProps & {
  value?: number | "";
  defaultValue?: number | "";
  onValueChange?: (value: number | "") => void;
  min?: number;
  max?: number;
  step?: number;
};
export function NumberInput({
  label,
  value,
  defaultValue = "",
  onValueChange,
  min,
  max,
  step = 1,
  hint,
  error,
  id: supplied,
  ...props
}: NumberInputProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [internal, setInternal] = React.useState<number | "">(defaultValue);
  const [draft, setDraft] = React.useState<number | "" | undefined>();
  const [touched, setTouched] = React.useState(false);
  React.useLayoutEffect(() => setDraft(undefined), [value]);
  const current = draft ?? value ?? internal;
  const validStep = Number.isFinite(step) && step > 0;
  const base = min ?? 0;
  const alignedMax =
    max === undefined
      ? undefined
      : Number(
          (base + Math.floor((max - base) / step + 1e-8) * step).toPrecision(
            15,
          ),
        );
  const isInvalid = (next: number | "") =>
    !validStep ||
    (next === ""
      ? !!props.required
      : !Number.isFinite(next) ||
        (min !== undefined && next < min) ||
        (max !== undefined && next > max) ||
        Math.abs((next - base) / step - Math.round((next - base) / step)) >
          1e-8);
  const invalid = isInvalid(current);
  const message =
    error ||
    (touched && invalid ? "허용 범위와 입력 단위를 확인해 주세요." : undefined);
  const change = (next: number | "", manual = false) => {
    setInternal(next);
    setDraft(manual && isInvalid(next) ? next : undefined);
    if (!isInvalid(next)) onValueChange?.(next);
  };
  const controlRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    controlRef.current
      ?.querySelector("input")
      ?.setCustomValidity(
        error || (invalid ? "허용 범위와 입력 단위를 확인해 주세요." : ""),
      );
  }, [error, invalid]);
  const nextValue = (direction: number) => {
    if (!validStep || (current !== "" && !Number.isFinite(current))) return;
    const position = ((current === "" ? base : current) - base) / step;
    const rounded = Math.round(position);
    const gridPosition =
      Math.abs(position - rounded) < 1e-8 ? rounded : position;
    const index =
      direction > 0
        ? Math.floor(gridPosition) + 1
        : Math.ceil(gridPosition) - 1;
    const next = Number(
      Math.max(
        min ?? -Infinity,
        Math.min(alignedMax ?? Infinity, base + index * step),
      ).toPrecision(15),
    );
    if (
      !Number.isFinite(next) ||
      (min !== undefined && next < min) ||
      (max !== undefined && next > max) ||
      (current !== "" && (direction > 0 ? next <= current : next >= current))
    )
      return;
    return next;
  };
  const decrease = nextValue(-1);
  const increase = nextValue(1);
  const move = (next: number | undefined) => {
    if (!props.disabled && next !== undefined) change(next);
  };
  return (
    <Field {...props} label={label} id={id} hint={hint} error={message}>
      <div className="fc-inline" ref={controlRef}>
        <Button
          variant="secondary"
          aria-label={`${label} 감소`}
          disabled={props.disabled || decrease === undefined}
          onClick={() => move(decrease)}
        >
          −
        </Button>
        <Input
          {...props}
          id={id}
          type="number"
          min={min}
          max={max}
          step={validStep ? step : undefined}
          value={current === "" || Number.isFinite(current) ? current : ""}
          onChange={(event) =>
            change(
              event.target.value === "" ? "" : event.target.valueAsNumber,
              true,
            )
          }
          onBlur={() => setTouched(true)}
          aria-invalid={!!message}
          aria-describedby={described(id, hint, message)}
        />
        <Button
          variant="secondary"
          aria-label={`${label} 증가`}
          disabled={props.disabled || increase === undefined}
          onClick={() => move(increase)}
        >
          +
        </Button>
      </div>
    </Field>
  );
}
export const Stepper = NumberInput;

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
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;
export type PasswordInputProps = TextControlProps;
export type StepperProps = NumberInputProps;
export type CurrencyInputProps = ValidatedInputProps;
export type PhoneInputProps = ValidatedInputProps;
export type EmailInputProps = ValidatedInputProps;
export type AutocompleteProps = ComboboxProps;
function Field({
  label,
  required,
  id,
  hint,
  error,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="field fc-field">
      <label htmlFor={id}>
        {label}
        {required && " (필수)"}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="help">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function described(id: string, hint?: string, error?: string) {
  return (
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined
  );
}
export function PasswordInput({
  label,
  hint,
  error,
  id: supplied,
  ...props
}: TextControlProps) {
  const generated = React.useId(),
    id = supplied ?? generated;
  const [visible, setVisible] = React.useState(false);
  return (
    <Field {...props} label={label} id={id} hint={hint} error={error}>
      <div className="fc-inline">
        <Input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={described(id, hint, error)}
        />
        <Button
          variant="secondary"
          disabled={props.disabled}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "숨기기" : "표시"}
        </Button>
      </div>
    </Field>
  );
}
