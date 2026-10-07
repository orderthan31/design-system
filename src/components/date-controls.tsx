import React from "react";
import "./date-controls.css";
import { DatePicker } from "./date-picker";
export { DatePicker, type DatePickerProps } from "./date-picker";
import { DateRangePicker } from "./date-range-picker";
export { DateRangePicker, type DateRangePickerProps } from "./date-range-picker";
import { MonthPicker } from "./month-picker";
export { MonthPicker, type MonthPickerProps } from "./month-picker";
import { TimeInput } from "./time-input";
export { TimeInput, type TimeInputProps } from "./time-input";
import { DateTimeInput } from "./date-time-input";
export { DateTimeInput, type DateTimeInputProps } from "./date-time-input";
export type { DateRangeValue } from "./date-range-picker";
export function DateControlsGallery() {
  return (
    <div className="dc-gallery">
      <section aria-label="날짜 선택">
        <h3>날짜 선택</h3>
        <DatePicker defaultValue="2024-02-28" />
      </section>
      <section aria-label="기간 선택">
        <h3>기간 선택</h3>
        <DateRangePicker
          defaultValue={{ start: "2024-02-28", end: "2024-03-01" }}
        />
      </section>
      <section aria-label="월 선택">
        <h3>월 선택</h3>
        <MonthPicker defaultValue="2024-02" />
      </section>
      <section aria-label="시간 입력">
        <h3>시간 입력</h3>
        <TimeInput defaultValue="09:30" />
      </section>
      <section aria-label="날짜와 시간">
        <h3>날짜와 시간</h3>
        <DateTimeInput defaultValue="2024-02-29T09:30" />
      </section>
      <section aria-label="입력 상태">
        <h3>입력 상태</h3>
        <div className="dc-state-stack">
          <DatePicker
            label="읽기 전용 날짜"
            defaultValue="2024-02-29"
            readOnly
          />
          <TimeInput label="비활성 시간" defaultValue="09:30" disabled />
          <MonthPicker label="확인 중인 월" defaultValue="2024-02" busy />
          <DatePicker label="날짜 오류" defaultValue="2023-02-29" />
        </div>
      </section>
    </div>
  );
}
