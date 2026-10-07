import { Field, described, type FieldProps, type TextControlProps } from "./field-frame";
import { PasswordInput } from "./password-input";
export { PasswordInput } from "./password-input";
export type { FieldProps, TextControlProps, PasswordInputProps } from "./field-frame";
import React from "react";
import { Icon } from "./icons";
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
export function FileInput({label,accept,multiple,onFilesChange,hint,error,id:supplied,...props}:FileInputProps) {
 const generated=React.useId(),id=supplied??generated;
 const input=React.useRef<HTMLInputElement>(null);
 const [files,setFiles]=React.useState<File[]>([]),[failure,setFailure]=React.useState(''),[dragging,setDragging]=React.useState(false);
 const dragDepth=React.useRef(0),callback=React.useRef(onFilesChange);callback.current=onFilesChange;
 const message=error||failure||undefined;
 const allowed=(file:File)=>!accept||accept.split(',').some(entry=>{const rule=entry.trim().toLowerCase();return rule.startsWith('.')?file.name.toLowerCase().endsWith(rule):rule.endsWith('/*')?file.type.toLowerCase().startsWith(rule.slice(0,-1)):file.type.toLowerCase()===rule;});
 const reject=(reason:string)=>{if(input.current){input.current.value='';input.current.setCustomValidity(reason);}setFiles([]);setFailure(reason);callback.current?.([]);};
 const publish=()=>{const element=input.current;if(!element||props.disabled)return;const next=Array.from(element.files??[]);if(!multiple&&next.length>1){reject('파일을 한 개만 선택해 주세요.');return;}if(next.some(file=>!allowed(file))){reject('허용된 파일 형식을 선택해 주세요.');return;}element.setCustomValidity('');setFailure('');setFiles(next);callback.current?.(next);};
 const clear=()=>{if(props.disabled)return;if(input.current){input.current.value='';input.current.setCustomValidity('');}setFailure('');setFiles([]);callback.current?.([]);};
 const choose=()=>{if(!props.disabled)input.current?.click();};
 const drop=(event:React.DragEvent)=>{event.preventDefault();dragDepth.current=0;setDragging(false);if(props.disabled)return;const next=Array.from(event.dataTransfer.files);if(!next.length)return;if(!multiple&&next.length>1){reject('파일을 한 개만 선택해 주세요.');return;}if(next.some(file=>!allowed(file))){reject('허용된 파일 형식을 선택해 주세요.');return;}
  try{const transfer=new DataTransfer();next.forEach(file=>transfer.items.add(file));const element=input.current;if(!element)throw Error('missing input');element.files=transfer.files;const actual=Array.from(element.files??[]);if(actual.length!==next.length||actual.some((file,index)=>file.name!==next[index].name||file.size!==next[index].size||file.type!==next[index].type))throw Error('FileList assignment failed');publish();}
  catch{reject('드롭한 파일을 입력에 연결하지 못했어요. 파일 선택 버튼을 사용해 주세요.');}
 };
 React.useEffect(()=>{const element=input.current,form=element?.form;if(!element||!form)return;const reset=(event:Event)=>{queueMicrotask(()=>{if(event.defaultPrevented||!element.isConnected)return;element.setCustomValidity('');setFailure('');setFiles(Array.from(element.files??[]));setDragging(false);dragDepth.current=0;});};form.addEventListener('reset',reset);return()=>form.removeEventListener('reset',reset);});
 return <Field {...props} label={label} id={id} hint={hint} error={message}>
  <input {...props} ref={input} id={id} type="file" className="fc-file-native" accept={accept} multiple={multiple} tabIndex={-1} aria-hidden="true" aria-invalid={!!message} aria-describedby={described(id,hint,message)} onChange={publish} onInvalid={event=>{event.preventDefault();event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-file-choose]')?.focus();}}/>
  <div className="fc-file-drop" role="group" aria-label={`${label} 파일 선택`} aria-disabled={props.disabled} aria-describedby={described(id,hint,message)} data-dragging={dragging} data-invalid={!!message}
   onClick={event=>{if(!(event.target instanceof Element)||event.target.closest('button'))return;choose();}}
   onDragEnter={event=>{if(!event.dataTransfer.types.includes('Files'))return;event.preventDefault();if(!props.disabled){dragDepth.current++;setDragging(true);}}}
   onDragOver={event=>{event.preventDefault();event.dataTransfer.dropEffect=props.disabled?'none':'copy';}}
   onDragLeave={event=>{event.preventDefault();dragDepth.current=Math.max(0,dragDepth.current-1);if(!dragDepth.current)setDragging(false);}}
   onDrop={drop}>
   <Icon name="upload" size={28}/><p>{dragging?'여기에 파일을 놓으세요':'파일을 끌어 놓거나 선택하세요'}</p>
   <Button variant="secondary" disabled={props.disabled} data-file-choose aria-label={`${label} 파일 선택${props.required?' (필수)':''}`} onClick={choose}>파일 선택</Button>
   {accept&&<p className="help">허용 형식: {accept}</p>}
  </div>
  <div className="fc-file-summary"><span role="status">{files.length?`${files.length}개 파일 선택됨`:'선택한 파일 없음'}</span>{(files.length>0||failure)&&<Button variant="ghost" disabled={props.disabled} onClick={clear}>비우기</Button>}</div>
  {files.length>0&&<ul className="fc-file-list" aria-label="선택한 파일">{files.map((file,index)=><li key={`${file.name}-${index}`}><Icon name="file"/><span>{file.name}</span></li>)}</ul>}
 </Field>;
}

import {Switch} from "./switch";
import {RadioGroup} from "./radio-group";
import {CheckboxGroup} from "./checkbox-group";
import {MultiSelect} from "./multi-select";
import type {ChoiceOption} from "./choice-option";
export {Switch,type SwitchProps} from "./switch";
export {RadioGroup,type RadioGroupProps} from "./radio-group";
export {CheckboxGroup,type CheckboxGroupProps} from "./checkbox-group";
export {MultiSelect,type MultiSelectProps} from "./multi-select";
export type {ChoiceOption} from "./choice-option";
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

import { NumberInput } from "./number-input";
import { CurrencyInput } from "./currency-input";
import { PhoneInput } from "./phone-input";
import { EmailInput } from "./email-input";
import type { NumberInputProps } from "./number-input";
import type { ValidatedInputProps } from "./formatted-input";
export { NumberInput, Stepper } from "./number-input";
export { CurrencyInput } from "./currency-input";
export { PhoneInput } from "./phone-input";
export { EmailInput } from "./email-input";
export type { NumberInputProps } from "./number-input";
export type { ValidatedInputProps } from "./formatted-input";

export type StepperProps = NumberInputProps;
export type CurrencyInputProps = ValidatedInputProps;
export type PhoneInputProps = ValidatedInputProps;
export type EmailInputProps = ValidatedInputProps;
export type AutocompleteProps = ComboboxProps;
