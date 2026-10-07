import { AddressField } from "./address-field";
export { AddressField } from "./address-field";
export type { AddressValue, AddressFieldProps } from "./address-field";
import { FileInput } from "./file-input";
export { FileInput } from "./file-input";
export type { FileInputProps } from "./file-input";
import { Combobox, type ComboboxProps } from "./combobox";
export { Combobox } from "./combobox";
export type { ComboboxProps } from "./combobox";
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


export { Autocomplete } from "./combobox";

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
