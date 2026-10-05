import React from "react";
import { expect, test, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import * as controls from "../src/components/date-controls";

test.each([
  [controls.DatePicker, "2023-02-29", "2024-02-29", "2024-02-30"],
  [controls.MonthPicker, "2024-13", "2024-02", "2024-00"],
  [controls.TimeInput, "24:00", "09:30", "09:xx"],
])(
  "native forms reject invalid defaults and drafts in %s",
  (Control, initial, valid, invalid) => {
    const validity = vi.fn();
    render(
      <form aria-label="native">
        <Control defaultValue={initial} onValidityChange={validity} />
      </form>,
    );
    const form = screen.getByRole("form") as HTMLFormElement;
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.validity.customError).toBe(true);
    expect(form.checkValidity()).toBe(false);
    expect(validity).toHaveBeenLastCalledWith(false);
    fireEvent.change(input, { target: { value: valid } });
    expect(form.checkValidity()).toBe(true);
    expect(validity).toHaveBeenLastCalledWith(true);
    fireEvent.change(input, { target: { value: invalid } });
    expect(form.checkValidity()).toBe(false);
    expect(validity).toHaveBeenLastCalledWith(false);
    fireEvent.change(input, { target: { value: "" } });
    expect(form.checkValidity()).toBe(true);
  },
);

test.each([controls.DatePicker, controls.MonthPicker, controls.TimeInput])(
  "required empty fields report invalid in %s",
  (Control) => {
    const validity = vi.fn();
    render(
      <form aria-label="native">
        <Control required onValidityChange={validity} />
      </form>,
    );
    expect((screen.getByRole("form") as HTMLFormElement).checkValidity()).toBe(
      false,
    );
    expect(validity).toHaveBeenLastCalledWith(false);
  },
);

test.each([
  [
    controls.DateRangePicker,
    { start: "2024-03-02", end: "2024-03-01" },
    "종료 날짜",
    "2024-03-03",
    "잘못된 날짜",
  ],
  [controls.DateTimeInput, "2024-03-01T08:30", "시간", "10:30", "25:30"],
] as const)(
  "composite validity notifies and blocks native submission %#",
  (Control, initial, label, valid, invalid) => {
    const validity = vi.fn();
    const element =
      Control === controls.DateRangePicker ? (
        <controls.DateRangePicker
          defaultValue={initial as controls.DateRangeValue}
          onValidityChange={validity}
        />
      ) : (
        <controls.DateTimeInput
          defaultValue={initial as string}
          min="2024-03-01T09:00"
          max="2024-03-01T18:00"
          onValidityChange={validity}
        />
      );
    render(<form aria-label="native">{element}</form>);
    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    expect(validity).toHaveBeenLastCalledWith(false);
    const input = screen.getByRole("textbox", { name: label });
    fireEvent.change(input, { target: { value: valid } });
    expect(form.checkValidity()).toBe(true);
    expect(validity).toHaveBeenLastCalledWith(true);
    fireEvent.change(input, { target: { value: invalid } });
    expect(form.checkValidity()).toBe(false);
    expect(validity).toHaveBeenLastCalledWith(false);
  },
);

test.each([
  ["default", "2024-02-29T09:30Textra"],
  ["controlled", "2024-02-29T09:30Textra"],
  ["default", "2024-02-29T09:30extra"],
  ["controlled", "2024-02-29T09:30extra"],
  ["default", "2024-02-29T09:30\n"],
  ["controlled", "2024-02-29T09:30\n"],
])("datetime %s rejects the entire malformed value %s", (mode, malformed) => {
  const validity = vi.fn();
  const changed = vi.fn();
  const element = (value: string) => (
    <form aria-label="native">
      <controls.DateTimeInput
        {...(mode === "default" ? { defaultValue: value } : { value })}
        onValidityChange={validity}
        onChange={changed}
      />
    </form>
  );
  const { rerender } = render(element(malformed));
  const form = screen.getByRole("form") as HTMLFormElement;
  const time = screen.getByRole("textbox", {
    name: "시간",
  }) as HTMLInputElement;
  expect(form.checkValidity()).toBe(false);
  expect(time.validity.customError).toBe(true);
  expect(time).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("status")).toHaveTextContent(
    "날짜와 시간을 모두 입력해 주세요.",
  );
  expect(validity.mock.calls).toEqual([[false]]);
  if (mode === "default") {
    fireEvent.change(time, { target: { value: "10:45" } });
    expect(changed).toHaveBeenLastCalledWith("2024-02-29T10:45");
  } else {
    fireEvent.change(time, { target: { value: "10:45" } });
    expect(changed).toHaveBeenLastCalledWith("2024-02-29T10:45");
    expect(form.checkValidity()).toBe(false);
    expect(validity.mock.calls).toEqual([[false]]);
    rerender(element("2024-02-29T10:45"));
  }
  expect(form.checkValidity()).toBe(true);
  expect(time.validity.customError).toBe(false);
  expect(time).not.toHaveAttribute("aria-invalid");
  expect(screen.getByRole("status")).toHaveTextContent("2024-02-29 10:45");
  expect(validity).toHaveBeenLastCalledWith(true);
  if (mode === "controlled") {
    validity.mockClear();
    rerender(element(malformed));
    expect(form.checkValidity()).toBe(false);
    expect(validity.mock.calls).toEqual([[false]]);
    expect(screen.getByRole("status")).not.toHaveTextContent(
      "2024-02-29 09:30",
    );
  }
});

test("malformed controlled time cannot enter proposals when only the date is edited", () => {
  const changed = vi.fn();
  render(
    <controls.DateTimeInput
      value="2024-02-29T09:30Textra"
      onChange={changed}
    />,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "날짜" }), {
    target: { value: "2024-03-01" },
  });
  expect(changed).not.toHaveBeenCalled();
  expect(screen.getByRole("textbox", { name: "날짜" })).toHaveValue(
    "2024-02-29",
  );
  fireEvent.change(screen.getByRole("textbox", { name: "시간" }), {
    target: { value: "10:45" },
  });
  expect(changed).toHaveBeenLastCalledWith("2024-02-29T10:45");
});

test("controlled datetime never commits rejected parts or mixes them into later proposals", () => {
  const changed = vi.fn();
  const { rerender } = render(
    <controls.DateTimeInput value="2024-02-29T09:30" onChange={changed} />,
  );
  const time = screen.getByRole("textbox", { name: "시간" });
  fireEvent.change(time, { target: { value: "10:30" } });
  expect(changed).toHaveBeenLastCalledWith("2024-02-29T10:30");
  expect(time).toHaveValue("09:30");
  expect(screen.getByRole("status")).toHaveTextContent("2024-02-29 09:30");
  fireEvent.change(screen.getByRole("textbox", { name: "날짜" }), {
    target: { value: "2024-03-01" },
  });
  expect(changed).toHaveBeenLastCalledWith("2024-03-01T09:30");
  rerender(
    <controls.DateTimeInput value="2024-03-01T10:30" onChange={changed} />,
  );
  expect(time).toHaveValue("10:30");
  expect(screen.getByRole("status")).toHaveTextContent("2024-03-01 10:30");
});

test.each(["date", "month"])(
  "%s year selectors reject out-of-domain years",
  async (kind) => {
    const changed = vi.fn();
    render(
      kind === "date" ? (
        <controls.DatePicker defaultValue="9999-12-31" onChange={changed} />
      ) : (
        <controls.MonthPicker defaultValue="9999-12" onChange={changed} />
      ),
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: kind === "date" ? "달력 열기" : "월 선택 열기",
      }),
    );
    const select = screen.getByRole("combobox", {
      name: "연도",
    }) as HTMLSelectElement;
    expect(
      Array.from(select.options).every(
        (option) => Number(option.value) >= 1 && Number(option.value) <= 9999,
      ),
    ).toBe(true);
    for (const year of ["10000", "0"]) {
      const option = document.createElement("option");
      option.value = year;
      select.add(option);
      fireEvent.change(select, { target: { value: year } });
      expect(select).toHaveValue("9999");
      option.remove();
    }
    if (kind === "date") {
      expect(screen.getByRole("button", { name: "다음 달" })).toBeDisabled();
      await userEvent.keyboard("{ArrowRight}{PageDown}");
      expect(
        screen.getByRole("button", { name: "9999년 12월 31일" }),
      ).toBeInTheDocument();
    }
    await userEvent.click(
      screen.getByRole("button", {
        name: kind === "date" ? "9999년 12월 31일" : "9999년 12월",
      }),
    );
    expect(changed).toHaveBeenLastCalledWith(
      kind === "date" ? "9999-12-31" : "9999-12",
    );
  },
);

test("Gregorian calendars preserve skipped civil dates and inclusive ranges without timezone drift", async () => {
  const changed = vi.fn();
  const { unmount } = render(
    <controls.DatePicker defaultValue="2011-12-29" onChange={changed} />,
  );
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  expect(
    screen.getByRole("button", { name: "2011년 12월 30일" }),
  ).toBeInTheDocument();
  await userEvent.keyboard("{ArrowRight}{Enter}");
  expect(changed).toHaveBeenLastCalledWith("2011-12-30");
  expect(screen.getByRole("textbox")).toHaveValue("2011-12-30");
  unmount();
  render(
    <controls.DateRangePicker
      defaultValue={{ start: "2011-12-29", end: "2011-12-31" }}
    />,
  );
  expect(screen.getByRole("status")).toHaveTextContent("총 3일");
  fireEvent.change(screen.getByRole("textbox", { name: "종료 날짜" }), {
    target: { value: "2011-12-30" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("총 2일");
});

test.each(["0001-01-01", "0099-12-31", "2000-02-29", "9999-12-31"])(
  "Gregorian valid date %s stays date-only",
  (value) => {
    const changed = vi.fn();
    render(
      <form aria-label="native">
        <controls.DatePicker onChange={changed} />
      </form>,
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value } });
    expect(changed).toHaveBeenLastCalledWith(value);
    expect((screen.getByRole("form") as HTMLFormElement).checkValidity()).toBe(
      true,
    );
  },
);

test.each(["0000-01-01", "10000-01-01", "1900-02-29", "2100-02-29"])(
  "Gregorian invalid date %s is not committed",
  (value) => {
    const changed = vi.fn();
    render(
      <form aria-label="native">
        <controls.DatePicker onChange={changed} />
      </form>,
    );
    fireEvent.change(screen.getByRole("textbox"), { target: { value } });
    expect(changed).not.toHaveBeenCalled();
    expect((screen.getByRole("form") as HTMLFormElement).checkValidity()).toBe(
      false,
    );
  },
);

test("today uses the local civil date rather than the UTC date", async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2024-02-29T10:30:00Z"));
  try {
    const now = new Date();
    const today = `${String(now.getFullYear()).padStart(4, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const changed = vi.fn();
    render(<controls.DatePicker onChange={changed} />);
    await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
    expect(
      screen.getByRole("button", {
        name: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`,
      }),
    ).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: "오늘" }));
    expect(changed).toHaveBeenLastCalledWith(today);
  } finally {
    vi.useRealTimers();
  }
});

test("invalid month limits do not seed a year outside the Gregorian domain", async () => {
  render(<controls.MonthPicker min="0000-01" />);
  await userEvent.click(screen.getByRole("button", { name: "월 선택 열기" }));
  const select = screen.getByRole("combobox", {
    name: "연도",
  }) as HTMLSelectElement;
  expect(Number(select.value)).toBeGreaterThanOrEqual(1);
  expect(
    screen.getByRole("button", { name: `${select.value}년 1월` }),
  ).toBeInTheDocument();
  expect(
    Array.from(select.options).every(
      (option) => Number(option.value) >= 1 && Number(option.value) <= 9999,
    ),
  ).toBe(true);
});

test.each([
  ["date", "2024-02-10", "2024-02-20", "2024-02-09", "2024-02-21"],
  ["month", "2024-02", "2024-06", "2024-01", "2024-07"],
  ["time", "09:00", "18:00", "08:59", "18:01"],
])(
  "%s min/max drafts block native forms without emitting values",
  (kind, min, max, below, above) => {
    const Control =
      kind === "date"
        ? controls.DatePicker
        : kind === "month"
          ? controls.MonthPicker
          : controls.TimeInput;
    const changed = vi.fn();
    render(
      <form aria-label="native">
        <Control min={min} max={max} onChange={changed} />
      </form>,
    );
    const form = screen.getByRole("form") as HTMLFormElement;
    const input = screen.getByRole("textbox");
    for (const value of [below, above]) {
      fireEvent.change(input, { target: { value } });
      expect(form.checkValidity()).toBe(false);
      expect(changed).not.toHaveBeenCalled();
    }
    fireEvent.change(input, { target: { value: max } });
    expect(form.checkValidity()).toBe(true);
    expect(changed).toHaveBeenLastCalledWith(max);
  },
);

test("datetime upper bound and invalid default report composite native invalidity", () => {
  const validity = vi.fn();
  const { rerender } = render(
    <form aria-label="native">
      <controls.DateTimeInput
        defaultValue="2024-03-01T18:01"
        max="2024-03-01T18:00"
        onValidityChange={validity}
      />
    </form>,
  );
  const form = screen.getByRole("form") as HTMLFormElement;
  expect(form.checkValidity()).toBe(false);
  expect(validity).toHaveBeenLastCalledWith(false);
  fireEvent.change(screen.getByRole("textbox", { name: "시간" }), {
    target: { value: "18:00" },
  });
  expect(form.checkValidity()).toBe(true);
  expect(validity).toHaveBeenLastCalledWith(true);
  rerender(
    <form aria-label="native">
      <controls.DateTimeInput
        value="2023-02-29T09:30"
        onValidityChange={validity}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(false);
  expect(validity).toHaveBeenLastCalledWith(false);
});

test.each(["date", "month"])(
  "%s lower year selector stays within domain",
  async (kind) => {
    render(
      kind === "date" ? (
        <controls.DatePicker defaultValue="0001-01-01" />
      ) : (
        <controls.MonthPicker defaultValue="0001-01" />
      ),
    );
    await userEvent.click(
      screen.getByRole("button", {
        name: kind === "date" ? "달력 열기" : "월 선택 열기",
      }),
    );
    const select = screen.getByRole("combobox", {
      name: "연도",
    }) as HTMLSelectElement;
    expect(select).toHaveValue("1");
    expect(
      Array.from(select.options).every(
        (option) => Number(option.value) >= 1 && Number(option.value) <= 9999,
      ),
    ).toBe(true);
    if (kind === "date") {
      expect(screen.getByRole("button", { name: "이전 달" })).toBeDisabled();
      await userEvent.keyboard("{ArrowLeft}{PageUp}");
      expect(screen.getByRole("button", { name: "1년 1월 1일" })).toHaveFocus();
    }
  },
);

test.each(["1900", "2000", "2100"])(
  "Gregorian PageDown clamps century leap year %s",
  async (year) => {
    render(<controls.DatePicker defaultValue={`${year}-01-31`} />);
    await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
    await userEvent.keyboard("{PageDown}");
    expect(
      screen.getByRole("button", {
        name: `${year}년 2월 ${year === "2000" ? 29 : 28}일`,
      }),
    ).toHaveFocus();
  },
);

test.each(["range", "datetime"])(
  "%s invalid defaults never notify a transient valid state",
  (kind) => {
    const validity = vi.fn();
    render(
      kind === "range" ? (
        <controls.DateRangePicker
          defaultValue={{ start: "2023-02-29", end: "2024-03-01" }}
          onValidityChange={validity}
        />
      ) : (
        <controls.DateTimeInput
          defaultValue="2023-02-29T09:30"
          onValidityChange={validity}
        />
      ),
    );
    expect(validity.mock.calls).toEqual([[false]]);
  },
);

test("날짜 직접 입력은 윤년을 검증하고 유효한 날짜만 전달한다", () => {
  expect(controls.DatePicker).toBeTypeOf("function");
  const changed = vi.fn();
  render(
    <controls.DatePicker
      label="예약 날짜"
      defaultValue="2024-02-28"
      onChange={changed}
    />,
  );
  const input = screen.getByRole("textbox", { name: "예약 날짜" });
  fireEvent.change(input, { target: { value: "2024-02-29" } });
  expect(changed).toHaveBeenLastCalledWith("2024-02-29");
  fireEvent.change(input, { target: { value: "2023-02-29" } });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByText("올바른 날짜를 YYYY-MM-DD 형식으로 입력해 주세요."),
  ).toBeVisible();
  expect(changed).toHaveBeenCalledTimes(1);
});

test("한국어 달력은 월과 연도를 선택하고 제한 날짜 및 오늘·지우기를 적용한다", async () => {
  const changed = vi.fn();
  render(
    <controls.DatePicker
      defaultValue="2024-02-28"
      min="2024-02-10"
      max="2024-03-15"
      disabledDates={["2024-02-29"]}
      onChange={changed}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  expect(screen.getByRole("button", { name: "2024년 2월 9일" })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "2024년 2월 29일" }),
  ).toBeDisabled();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "월" }),
    "3",
  );
  await userEvent.click(
    screen.getByRole("button", { name: "2024년 3월 12일" }),
  );
  expect(changed).toHaveBeenLastCalledWith("2024-03-12");
  expect(
    screen.queryByRole("group", { name: "날짜 달력" }),
  ).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  expect(screen.getByRole("combobox", { name: "연도" })).toHaveValue("2024");
  expect(screen.getByRole("button", { name: "오늘" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "지우기" }));
  expect(changed).toHaveBeenLastCalledWith("");
});

test("달력 키보드는 월 경계를 넘고 Home End 및 PageUp PageDown을 지원한다", async () => {
  const changed = vi.fn();
  render(
    <controls.DatePicker
      defaultValue="2024-01-31"
      disabledDates={["2024-02-01"]}
      onChange={changed}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  const selected = screen.getByRole("button", { name: "2024년 1월 31일" });
  expect(selected).toHaveFocus();
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "2024년 2월 2일" })).toHaveFocus();
  await userEvent.keyboard("{Home}");
  expect(screen.getByRole("button", { name: "2024년 1월 28일" })).toHaveFocus();
  await userEvent.keyboard("{End}");
  expect(screen.getByRole("button", { name: "2024년 2월 3일" })).toHaveFocus();
  await userEvent.keyboard("{PageDown}");
  expect(screen.getByRole("button", { name: "2024년 3월 3일" })).toHaveFocus();
  await userEvent.keyboard("{PageUp}{ArrowDown}{ArrowUp}{ArrowLeft}{Enter}");
  expect(changed).toHaveBeenLastCalledWith("2024-02-02");
  expect(screen.getByRole("button", { name: "달력 열기" })).toHaveFocus();
});

test("기간은 시작과 종료 달력으로 선택하고 역순을 검증하며 포함 일수를 보여 준다", async () => {
  expect(controls.DateRangePicker).toBeTypeOf("function");
  const changed = vi.fn();
  render(
    <controls.DateRangePicker
      defaultValue={{ start: "2024-02-28", end: "" }}
      onChange={changed}
    />,
  );
  const start = screen.getByRole("textbox", { name: "시작 날짜" });
  const end = screen.getByRole("textbox", { name: "종료 날짜" });
  await userEvent.click(
    within(start.closest(".dc-picker") as HTMLElement).getByRole("button", {
      name: "달력 열기",
    }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "2024년 2월 29일" }),
  );
  await userEvent.click(
    within(end.closest(".dc-picker") as HTMLElement).getByRole("button", {
      name: "달력 열기",
    }),
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "연도" }),
    "2024",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "월" }),
    "3",
  );
  await userEvent.click(screen.getByRole("button", { name: "2024년 3월 2일" }));
  expect(changed).toHaveBeenLastCalledWith({
    start: "2024-02-29",
    end: "2024-03-02",
  });
  expect(screen.getByRole("status")).toHaveTextContent(
    "총 3일 (시작일·종료일 포함)",
  );
  fireEvent.change(end, { target: { value: "2024-02-28" } });
  expect(end).toHaveAttribute("aria-invalid", "true");
  expect(
    screen.getByText("종료 날짜는 시작 날짜보다 빠를 수 없습니다."),
  ).toBeVisible();
  expect(screen.getByRole("status")).not.toHaveTextContent("총");
});

test("월 선택은 직접 입력 오류와 범위를 검증하고 연도별 월을 선택한다", async () => {
  expect(controls.MonthPicker).toBeTypeOf("function");
  const changed = vi.fn();
  render(
    <controls.MonthPicker
      defaultValue="2024-02"
      min="2024-02"
      max="2025-06"
      onChange={changed}
    />,
  );
  const input = screen.getByRole("textbox", { name: "월" });
  fireEvent.change(input, { target: { value: "2024-13" } });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(changed).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "월 선택 열기" }));
  expect(screen.getByRole("button", { name: "2024년 1월" })).toBeDisabled();
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "연도" }),
    "2025",
  );
  expect(screen.getByRole("button", { name: "2025년 7월" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "2025년 6월" }));
  expect(changed).toHaveBeenLastCalledWith("2025-06");
  expect(input).toHaveValue("2025-06");
});

test("시간 입력은 24시간 형식과 최소 최대 범위를 검증한다", () => {
  expect(controls.TimeInput).toBeTypeOf("function");
  const changed = vi.fn();
  render(<controls.TimeInput min="09:00" max="18:00" onChange={changed} />);
  const input = screen.getByRole("textbox", { name: "시간" });
  fireEvent.change(input, { target: { value: "24:00" } });
  expect(input).toHaveAttribute("aria-invalid", "true");
  fireEvent.change(input, { target: { value: "08:59" } });
  expect(
    screen.getByText("선택 가능한 시간을 HH:mm 형식으로 입력해 주세요."),
  ).toBeVisible();
  expect(changed).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: "09:30" } });
  expect(changed).toHaveBeenLastCalledWith("09:30");
  expect(input).not.toHaveAttribute("aria-invalid");
  fireEvent.change(input, { target: { value: "" } });
  expect(changed).toHaveBeenLastCalledWith("");
});

test("날짜 시간 입력은 중첩 날짜·시간을 조합해 시간대 없는 값을 전달한다", async () => {
  expect(controls.DateTimeInput).toBeTypeOf("function");
  const changed = vi.fn();
  render(
    <controls.DateTimeInput
      defaultValue="2024-02-28T09:30"
      min="2024-02-28T09:00"
      max="2024-03-02T18:00"
      onChange={changed}
    />,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "시간" }), {
    target: { value: "10:45" },
  });
  expect(changed).toHaveBeenLastCalledWith("2024-02-28T10:45");
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  await userEvent.click(
    screen.getByRole("button", { name: "2024년 2월 29일" }),
  );
  expect(changed).toHaveBeenLastCalledWith("2024-02-29T10:45");
  expect(screen.getByRole("status")).toHaveTextContent("2024-02-29 10:45");
});

test("갤러리는 실제 날짜·기간·월·시간·날짜시간 컴포넌트를 조합한다", async () => {
  expect(controls.DateControlsGallery).toBeTypeOf("function");
  render(<controls.DateControlsGallery />);
  const date = within(screen.getByRole("region", { name: "날짜 선택" }));
  await userEvent.click(date.getByRole("button", { name: "달력 열기" }));
  await userEvent.click(date.getByRole("button", { name: "2024년 2월 29일" }));
  expect(date.getByRole("textbox")).toHaveValue("2024-02-29");
  expect(screen.getByRole("region", { name: "기간 선택" })).toHaveTextContent(
    "총 3일",
  );
  expect(
    within(screen.getByRole("region", { name: "월 선택" })).getByRole(
      "textbox",
    ),
  ).toHaveValue("2024-02");
  expect(
    within(screen.getByRole("region", { name: "시간 입력" })).getByRole(
      "textbox",
    ),
  ).toHaveValue("09:30");
  expect(
    within(screen.getByRole("region", { name: "날짜와 시간" })).getAllByRole(
      "textbox",
    ),
  ).toHaveLength(2);
});

test.each([
  ["", "background", "--color-action-primary-bg-default"],
  [
    ':hover:not(:disabled):not([aria-busy="true"])',
    "background",
    "--color-action-primary-bg-hover",
  ],
  [
    ':active:not(:disabled):not([aria-busy="true"])',
    "background",
    "--color-action-primary-bg-pressed",
  ],
  [":focus-visible", "outline", "--color-focus"],
])(
  "선택한 달력 버튼 %s 스타일은 뒤에 오는 core quiet 규칙보다 구체적이다",
  async (state, property, token) => {
    render(
      <div className="ds-core">
        <controls.DatePicker defaultValue="2024-02-28" />
      </div>,
    );
    await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
    const selected = screen.getByRole("button", {
      name: "2024년 2월 28일",
      pressed: true,
    });
    expect(
      screen.getByRole("button", { name: "2024년 2월 27일", pressed: false }),
    ).toBeInTheDocument();
    const selector = `.ds-core .dc-calendar .button.quiet[aria-pressed="true"]${state}`;
    expect(
      selected.matches(selector.replace(/:hover|:active|:focus-visible/g, "")),
    ).toBe(true);
    const css = readFileSync("src/components/date-controls.css", "utf8");
    const rule = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].find(
      (match) =>
        match[1]
          .trim()
          .replace(/\s+/g, " ")
          .replace(/\(\s+/g, "(")
          .replace(/\s+\)/g, ")") === selector,
    );
    expect(rule, `Missing selected-state selector: ${selector}`).toBeDefined();
    expect(rule![2]).toMatch(
      new RegExp(`${property}:\\s*[^;]*var\\(${token}\\)`),
    );
    if (!state) expect(rule![2]).toContain("color: var(--color-text-inverse)");
  },
);

test("날짜 스타일은 모든 선택자가 ds-core에 한정되고 좁은 화면에서 줄바꿈된다", () => {
  const css = readFileSync("src/components/date-controls.css", "utf8");
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim().replace(/\s+/g, " "))
    .filter((selector) => !selector.startsWith("@"));
  expect(selectors.length).toBeGreaterThan(5);
  expect(
    selectors.every((selector) =>
      selector.split(",").every((part) => part.trim().startsWith(".ds-core ")),
    ),
  ).toBe(true);
  expect(css).toContain("flex-wrap: wrap");
  expect(css).toContain("minmax(0, 1fr)");
  expect(css).toContain("var(--color-bg-surface)");
});

test("오류가 있는 기간 초안은 이전 기간 요약을 숨긴다", () => {
  render(
    <controls.DateRangePicker
      defaultValue={{ start: "2024-03-09", end: "2024-03-11" }}
    />,
  );
  expect(screen.getByRole("status")).toHaveTextContent("총 3일");
  fireEvent.change(screen.getByRole("textbox", { name: "종료 날짜" }), {
    target: { value: "잘못된 날짜" },
  });
  expect(screen.getByRole("status")).not.toHaveTextContent("총");
});

test("날짜시간 초안이 잘못되면 이전 날짜시간 요약을 숨긴다", () => {
  render(<controls.DateTimeInput defaultValue="2024-02-29T09:30" />);
  fireEvent.change(screen.getByRole("textbox", { name: "시간" }), {
    target: { value: "25:30" },
  });
  expect(screen.getByRole("status")).not.toHaveTextContent("09:30");
});

test("빈 달력은 최소 날짜의 월에서 시작하며 제한 날짜를 직접 입력하면 오류를 연결한다", async () => {
  const changed = vi.fn();
  render(
    <controls.DatePicker
      min="2024-02-20"
      max="2024-03-01"
      onChange={changed}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  expect(screen.getByRole("combobox", { name: "월" })).toHaveValue("2");
  expect(screen.getByRole("button", { name: "2024년 2월 20일" })).toHaveFocus();
  await userEvent.keyboard("{ArrowLeft}");
  expect(screen.getByRole("button", { name: "2024년 2월 20일" })).toHaveFocus();
  const input = screen.getByRole("textbox", { name: "날짜" });
  fireEvent.change(input, { target: { value: "2024-02-19" } });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(
    document.getElementById(
      input.getAttribute("aria-describedby")!.split(" ").at(-1)!,
    ),
  ).toHaveTextContent("선택할 수 없는 날짜입니다.");
  expect(changed).not.toHaveBeenCalled();
});

test.each(["disabled", "readOnly", "busy"] as const)(
  "%s 날짜 컴포넌트는 사용자 변경을 막는다",
  async (mode) => {
    const changed = vi.fn();
    render(
      <controls.DatePicker
        {...{ [mode]: true }}
        defaultValue="2024-02-29"
        onChange={changed}
      />,
    );
    const input = screen.getByRole("textbox");
    expect(screen.getByRole("button", { name: "달력 열기" })).toBeDisabled();
    await userEvent.type(input, "2025");
    expect(input).toHaveValue("2024-02-29");
    expect(changed).not.toHaveBeenCalled();
    if (mode === "busy") {
      expect(input).toHaveAttribute("aria-busy", "true");
      expect(screen.getByRole("status")).toHaveTextContent("입력 확인 중");
    }
  },
);

test("월을 변경하면 첫 선택 가능한 날짜 하나가 탭 순서에 포함된다", async () => {
  render(
    <controls.DatePicker
      defaultValue="2024-02-28"
      disabledDates={["2024-03-01"]}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "월" }),
    "3",
  );
  expect(
    screen.getByRole("button", { name: "2024년 3월 2일" }),
  ).toHaveAttribute("tabindex", "0");
});

test("갤러리에는 읽기 전용·비활성·확인 중·오류 예제가 있다", () => {
  render(<controls.DateControlsGallery />);
  const states = within(screen.getByRole("region", { name: "입력 상태" }));
  expect(
    states.getByRole("textbox", { name: "읽기 전용 날짜" }),
  ).toHaveAttribute("readonly");
  expect(states.getByRole("textbox", { name: "비활성 시간" })).toBeDisabled();
  expect(states.getByRole("textbox", { name: "확인 중인 월" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  expect(states.getByRole("textbox", { name: "날짜 오류" })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("PageDown은 윤년의 짧은 달에서 말일로 고정된다", async () => {
  render(<controls.DatePicker defaultValue="2024-01-31" />);
  await userEvent.click(screen.getByRole("button", { name: "달력 열기" }));
  await userEvent.keyboard("{PageDown}");
  expect(screen.getByRole("button", { name: "2024년 2월 29일" })).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(
    screen.queryByRole("group", { name: "날짜 달력" }),
  ).not.toBeInTheDocument();
});
