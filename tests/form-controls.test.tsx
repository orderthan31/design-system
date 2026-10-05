import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import * as Controls from "../src/components/form-controls";
afterEach(cleanup);

test("address postal format prevents native submission", async () => {
  const { container } = render(
    <form>
      <Controls.AddressField label="주소" />
    </form>,
  );
  await userEvent.type(screen.getByLabelText("우편번호"), "123");
  expect(container.querySelector("form")!.checkValidity()).toBe(false);
  await userEvent.type(screen.getByLabelText("우편번호"), "45");
  expect(container.querySelector("form")!.checkValidity()).toBe(true);
});

test("file accept rejection blocks submission until a valid file is selected", async () => {
  const { container } = render(
    <form>
      <Controls.FileInput label="파일" accept=".pdf" />
    </form>,
  );
  const input = screen.getByLabelText("파일");
  const user = userEvent.setup({ applyAccept: false });
  await user.upload(
    input,
    new File(["x"], "bad.exe", { type: "application/octet-stream" }),
  );
  expect(container.querySelector("form")!.checkValidity()).toBe(false);
  await user.upload(
    input,
    new File(["x"], "good.pdf", { type: "application/pdf" }),
  );
  expect(container.querySelector("form")!.checkValidity()).toBe(true);
});

test("currency format validation blocks native form submission before blur", async () => {
  const { container } = render(
    <form>
      <Controls.CurrencyInput label="금액" />
    </form>,
  );
  await userEvent.type(screen.getByLabelText("금액"), "-500");
  expect(container.querySelector("form")!.checkValidity()).toBe(false);
  await userEvent.clear(screen.getByLabelText("금액"));
  await userEvent.type(screen.getByLabelText("금액"), "500");
  expect(container.querySelector("form")!.checkValidity()).toBe(true);
});

test("multiple galleries generate distinct ids with correct label associations", () => {
  const { container } = render(
    <>
      <Controls.FormControlsGallery />
      <Controls.FormControlsGallery />
    </>,
  );
  const ids = Array.from(container.querySelectorAll("[id]")).map(
    (element) => element.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(screen.getAllByRole("textbox", { name: "표시 이름" })).toHaveLength(2);
});

test("required checkbox groups need at least one choice, not every choice", async () => {
  const { container } = render(
    <form>
      <Controls.CheckboxGroup
        label="약관"
        required
        options={[
          { value: "a", label: "첫 항목" },
          { value: "b", label: "둘째 항목" },
        ]}
      />
    </form>,
  );
  const form = container.querySelector("form")!;
  expect(form.checkValidity()).toBe(false);
  await userEvent.click(screen.getByRole("checkbox", { name: "첫 항목" }));
  expect(form.checkValidity()).toBe(true);
});

test("phone rejects unsupported Korean prefixes and misplaced punctuation", async () => {
  render(<Controls.PhoneInput label="전화번호" defaultValue="0000000000" />);
  await userEvent.click(screen.getByLabelText("전화번호"));
  await userEvent.tab();
  expect(screen.getByRole("alert")).toHaveTextContent("전화번호");
  await userEvent.clear(screen.getByLabelText("전화번호"));
  await userEvent.type(screen.getByLabelText("전화번호"), "0-1-0-12345678");
  await userEvent.tab();
  expect(screen.getByRole("alert")).toHaveTextContent("전화번호");
});

test("combobox submits only option values rather than duplicate display labels", async () => {
  const { container } = render(
    <form>
      <Controls.Combobox
        label="도시"
        name="city"
        options={[{ value: "seoul", label: "서울" }]}
        defaultValue="seoul"
      />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).getAll("city")).toEqual(
    ["seoul"],
  );
});

test("required combobox rejects uncommitted search text in native validation", async () => {
  const { container } = render(
    <form>
      <Controls.Combobox
        label="도시"
        name="city"
        required
        options={[{ value: "seoul", label: "서울" }]}
      />
    </form>,
  );
  const input = screen.getByRole("combobox", { name: "도시 (필수)" });
  const form = container.querySelector("form")!;
  expect(form.checkValidity()).toBe(false);
  await userEvent.type(input, "없는 도시");
  expect(input).toHaveValue("없는 도시");
  expect(form.checkValidity()).toBe(false);
  expect(new FormData(form).getAll("city")).toEqual([""]);
  await userEvent.clear(input);
  await userEvent.type(input, "서");
  await userEvent.keyboard("{ArrowDown}{Enter}");
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll("city")).toEqual(["seoul"]);
});

test("required combobox validates the committed option while searching and clears on controlled reset", async () => {
  const options = [{ value: "seoul", label: "서울" }];
  const view = (value: string, required = true) => (
    <form>
      <Controls.Combobox
        label="도시"
        name="city"
        required={required}
        value={value}
        options={options}
        hint="도시를 선택해 주세요."
      />
    </form>
  );
  const { container, rerender } = render(view("seoul"));
  const form = container.querySelector("form")!;
  const input = screen.getByRole("combobox", { name: "도시 (필수)" });
  await userEvent.click(input);
  expect(input).toHaveValue("");
  expect(form.checkValidity()).toBe(true);
  expect(input).toHaveAttribute("aria-required", "true");
  expect(input).toHaveAccessibleDescription("도시를 선택해 주세요.");
  await userEvent.type(input, "없는 도시");
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll("city")).toEqual(["seoul"]);
  await userEvent.keyboard("{Escape}");
  expect(input).toHaveValue("서울");
  rerender(view(""));
  expect(form.checkValidity()).toBe(false);
  expect(new FormData(form).getAll("city")).toEqual([""]);
  rerender(view("", false));
  expect(form.checkValidity()).toBe(true);
});

test("extended form styles are core scoped, token based and responsive", async () => {
  const { existsSync, readFileSync } = await import("node:fs");
  const path = `${process.cwd()}/src/components/form-controls.css`;
  expect(existsSync(path)).toBe(true);
  const css = readFileSync(path, "utf8");
  expect(css).toContain(".ds-core .fc-grid");
  expect(css).toContain("var(--field-bg)");
  expect(css).toContain("@container");
  expect(
    css
      .match(/(?:^|\})\s*([^@{}]+)\{/g)
      ?.every((rule) => rule.includes(".ds-core")),
  ).toBe(true);
});

test("gallery exposes editable extended and native input examples without external providers", async () => {
  render(<Controls.FormControlsGallery />);
  expect(screen.getByRole("region", { name: "확장 폼 컨트롤" })).toBeVisible();
  expect(screen.getByLabelText("표시 이름")).toBeVisible();
  expect(screen.getByRole("searchbox", { name: "검색" })).toBeVisible();
  expect(screen.getByLabelText("메모")).toBeVisible();
  expect(screen.getByLabelText("언어")).toBeVisible();
  await userEvent.type(screen.getByLabelText("표시 이름"), "홍길동");
  expect(screen.getByLabelText("표시 이름")).toHaveValue("홍길동");
  expect(screen.getByRole("switch", { name: "자동 저장" })).toBeVisible();
  expect(
    screen.getByText("주소 검색은 서비스에서 연결해 주세요."),
  ).toBeVisible();
});

test("gallery address example selects explicitly labeled fixture data without a provider", async () => {
  render(<Controls.FormControlsGallery />);
  await userEvent.click(
    screen.getByRole("button", { name: "예시 주소 선택 (데모 데이터)" }),
  );
  expect(screen.getByLabelText("도로명 주소")).toHaveValue("예시로 123");
  expect(screen.getByLabelText("지번 주소")).toHaveValue("예시동 123-4");
  expect(screen.getByLabelText("우편번호")).toHaveValue("12345");
  expect(screen.getByLabelText("상세 주소")).toHaveValue("101호");
  expect(
    screen.getByText("데모 데이터이며 실제 주소 검색 서비스가 아닙니다."),
  ).toBeVisible();
});

test("address edits road, jibun, postal and detail and accepts an external search selection", async () => {
  const changed = vi.fn();
  render(
    <Controls.AddressField
      label="주소"
      onValueChange={changed}
      onSearch={(select) =>
        select({
          road: "서울시 세종대로 1",
          jibun: "서울시 중구 1",
          postal: "04524",
          detail: "",
        })
      }
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "주소 검색" }));
  expect(screen.getByLabelText("도로명 주소")).toHaveValue("서울시 세종대로 1");
  expect(screen.getByLabelText("지번 주소")).toHaveValue("서울시 중구 1");
  expect(screen.getByLabelText("우편번호")).toHaveValue("04524");
  await userEvent.type(screen.getByLabelText("상세 주소"), "101호");
  expect(changed).toHaveBeenLastCalledWith({
    road: "서울시 세종대로 1",
    jibun: "서울시 중구 1",
    postal: "04524",
    detail: "101호",
  });
  await userEvent.clear(screen.getByLabelText("우편번호"));
  await userEvent.type(screen.getByLabelText("우편번호"), "abc");
  await userEvent.tab();
  expect(screen.getByRole("alert")).toHaveTextContent("5자리");
});

test.each(["onSearch", "searchSlot"] as const)(
  "address ignores retained %s selection while disabled and uses the latest handler after re-enabling",
  async (source) => {
    let retained: ((value: Controls.AddressValue) => void) | undefined;
    const initialChanged = vi.fn();
    const latestChanged = vi.fn();
    const next = {
      road: "예시 도로",
      jibun: "예시 지번",
      postal: "12345",
      detail: "101호",
    };
    const search = {
      [source]: (select: (value: Controls.AddressValue) => void) => {
        retained ??= select;
        return null;
      },
    };
    const view = (disabled: boolean, onValueChange = initialChanged) => (
      <Controls.AddressField
        label="주소"
        disabled={disabled}
        onValueChange={onValueChange}
        {...search}
      />
    );
    const { rerender } = render(view(false));
    if (source === "onSearch")
      await userEvent.click(screen.getByRole("button", { name: "주소 검색" }));
    expect(retained).toBeDefined();
    rerender(view(true, latestChanged));
    act(() => retained!(next));
    expect(screen.getByLabelText("도로명 주소")).toHaveValue("");
    expect(screen.getByLabelText("우편번호")).toHaveValue("");
    expect(initialChanged).not.toHaveBeenCalled();
    expect(latestChanged).not.toHaveBeenCalled();
    rerender(view(false, latestChanged));
    act(() => retained!(next));
    expect(screen.getByLabelText("도로명 주소")).toHaveValue(next.road);
    expect(latestChanged).toHaveBeenCalledExactlyOnceWith(next);
    expect(initialChanged).not.toHaveBeenCalled();
  },
);

test("file input shows the selected filename and rejects files outside accept", async () => {
  const selected = vi.fn();
  render(
    <Controls.FileInput
      label="첨부 파일"
      accept=".pdf,image/*"
      onFilesChange={selected}
    />,
  );
  const input = screen.getByLabelText("첨부 파일");
  const file = new File(["test"], "guide.pdf", { type: "application/pdf" });
  await userEvent.upload(input, file);
  expect(screen.getByRole("status")).toHaveTextContent("guide.pdf");
  expect(selected).toHaveBeenLastCalledWith([file]);
  fireEvent.change(input, {
    target: { files: [new File(["test"], "bad.txt", { type: "text/plain" })] },
  });
  expect(screen.getByRole("alert")).toHaveTextContent("허용");
  expect(selected).toHaveBeenLastCalledWith([]);
  expect(input).toHaveAttribute("aria-invalid", "true");
});

test("switch has switch semantics and toggles using the keyboard", async () => {
  const changed = vi.fn();
  render(<Controls.Switch label="자동 저장" onCheckedChange={changed} />);
  const control = screen.getByRole("switch", { name: "자동 저장" });
  control.focus();
  await userEvent.keyboard(" ");
  expect(control).toBeChecked();
  expect(changed).toHaveBeenLastCalledWith(true);
});

test("checkbox group independently toggles native checkboxes", async () => {
  render(
    <Controls.CheckboxGroup
      label="알림 채널"
      options={[
        { value: "sms", label: "문자" },
        { value: "mail", label: "메일" },
      ]}
    />,
  );
  await userEvent.click(screen.getByRole("checkbox", { name: "문자" }));
  await userEvent.click(screen.getByRole("checkbox", { name: "메일" }));
  expect(
    screen
      .getAllByRole("checkbox")
      .every((input) => (input as HTMLInputElement).checked),
  ).toBe(true);
  expect(
    screen.queryByRole("button", { name: "문자 제거" }),
  ).not.toBeInTheDocument();
});

test("radio group uses a shared native group and allows exactly one selection", async () => {
  render(
    <Controls.RadioGroup
      label="수령 방법"
      options={[
        { value: "delivery", label: "배송" },
        { value: "visit", label: "방문" },
      ]}
    />,
  );
  await userEvent.click(screen.getByRole("radio", { name: "배송" }));
  await userEvent.click(screen.getByRole("radio", { name: "방문" }));
  expect(screen.getByRole("radio", { name: "배송" })).not.toBeChecked();
  expect(screen.getByRole("radio", { name: "방문" })).toBeChecked();
  expect(screen.getByRole("group", { name: "수령 방법" })).toBeVisible();
});

test("multiselect creates removable tags and returns multiple selected values", async () => {
  const changed = vi.fn();
  render(
    <Controls.MultiSelect
      label="관심 분야"
      options={[
        { value: "design", label: "디자인" },
        { value: "dev", label: "개발" },
      ]}
      onValueChange={changed}
    />,
  );
  await userEvent.click(screen.getByRole("checkbox", { name: "디자인" }));
  await userEvent.click(screen.getByRole("checkbox", { name: "개발" }));
  expect(changed).toHaveBeenLastCalledWith(["design", "dev"]);
  await userEvent.click(screen.getByRole("button", { name: "디자인 제거" }));
  expect(screen.getByRole("checkbox", { name: "디자인" })).not.toBeChecked();
  expect(changed).toHaveBeenLastCalledWith(["dev"]);
});

test("multiselect cannot remove selected disabled options through tags", async () => {
  const changed = vi.fn();
  render(
    <Controls.MultiSelect
      label="관심 분야"
      defaultValue={["design", "dev"]}
      options={[
        { value: "design", label: "디자인", disabled: true },
        { value: "dev", label: "개발" },
      ]}
      onValueChange={changed}
    />,
  );
  const remove = screen.getByRole("button", { name: "디자인 제거" });
  await userEvent.click(remove);
  expect(screen.getByRole("checkbox", { name: "디자인" })).toBeChecked();
  expect(changed).not.toHaveBeenCalled();
  expect(remove).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "개발 제거" }));
  expect(changed).toHaveBeenCalledExactlyOnceWith(["design"]);
});

test("combobox filters choices, selects with keyboard, and dismisses with Escape", async () => {
  const changed = vi.fn();
  render(
    <Controls.Combobox
      label="도시"
      options={[
        { value: "seoul", label: "서울" },
        { value: "busan", label: "부산" },
      ]}
      onValueChange={changed}
    />,
  );
  const input = screen.getByRole("combobox", { name: "도시" });
  await userEvent.type(input, "부");
  expect(
    screen.queryByRole("option", { name: "서울" }),
  ).not.toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}{Enter}");
  expect(input).toHaveValue("부산");
  expect(changed).toHaveBeenLastCalledWith("busan");
  expect(input).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(input);
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(input).toHaveFocus();
});

test.each([false, true])(
  "combobox blocks open-list selection after disabling (controlled=%s)",
  async (controlled) => {
    const changed = vi.fn();
    const options = [{ value: "seoul", label: "서울" }];
    const view = (disabled: boolean) => (
      <form>
        <Controls.Combobox
          label="도시"
          name="city"
          disabled={disabled}
          options={options}
          value={controlled ? "" : undefined}
          onValueChange={changed}
        />
      </form>
    );
    const { container, rerender } = render(view(false));
    const input = screen.getByRole("combobox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");
    const option = screen.getByRole("option", { name: "서울" });
    rerender(view(true));
    fireEvent.click(option);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(changed).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "서" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.blur(input);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(
      new FormData(container.querySelector("form")!).getAll("city"),
    ).toEqual([]);
    rerender(view(false));
    expect(input).toHaveValue("");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await userEvent.click(input);
    await userEvent.click(screen.getByRole("option", { name: "서울" }));
    expect(changed).toHaveBeenCalledExactlyOnceWith("seoul");
  },
);

test("combobox guards retained option and keyboard callbacks using current disabled state", async () => {
  const changed = vi.fn();
  const view = (disabled: boolean) => (
    <Controls.Combobox
      label="도시"
      disabled={disabled}
      options={[{ value: "seoul", label: "서울" }]}
      onValueChange={changed}
    />
  );
  const { rerender } = render(view(false));
  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.keyboard("{ArrowDown}");
  // Retain the real React handlers to exercise callbacks from the enabled render.
  const handlers = (element: HTMLElement) =>
    (
      element as unknown as Record<
        string,
        {
          onClick?: () => void;
          onKeyDown?: (event: {
            key: string;
            nativeEvent: { isComposing: boolean };
            preventDefault: () => void;
          }) => void;
        }
      >
    )[Object.keys(element).find((key) => key.startsWith("__reactProps$"))!]!;
  const choose = handlers(screen.getByRole("option")).onClick!;
  const keyDown = handlers(input).onKeyDown!;
  rerender(view(true));
  act(() => {
    choose();
    keyDown({
      key: "Enter",
      nativeEvent: { isComposing: false },
      preventDefault: vi.fn(),
    });
    keyDown({
      key: "ArrowDown",
      nativeEvent: { isComposing: false },
      preventDefault: vi.fn(),
    });
  });
  expect(changed).not.toHaveBeenCalled();
  expect(input).toHaveValue("");
  expect(input).toHaveAttribute("aria-expanded", "false");
});

test("email error is linked to the editable email input and clears after correction", async () => {
  render(<Controls.EmailInput label="이메일" required />);
  const input = screen.getByLabelText("이메일 (필수)");
  await userEvent.type(input, "invalid");
  await userEvent.tab();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription(
    "올바른 이메일 주소를 입력해 주세요.",
  );
  await userEvent.clear(input);
  await userEvent.type(input, "hello@example.kr");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("phone retains editable formatting and exposes Korean format errors", async () => {
  render(<Controls.PhoneInput label="전화번호" />);
  const input = screen.getByLabelText("전화번호");
  await userEvent.type(input, "010-1234-5678");
  await userEvent.tab();
  expect(input).toHaveValue("010-1234-5678");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  await userEvent.clear(input);
  await userEvent.type(input, "abc");
  await userEvent.tab();
  expect(screen.getByRole("alert")).toHaveTextContent("전화번호");
});

test("Korean currency groups won and rejects fractions and negative amounts", async () => {
  render(<Controls.CurrencyInput label="금액" required />);
  const input = screen.getByLabelText("금액 (필수)");
  await userEvent.type(input, "12345");
  await userEvent.tab();
  expect(input).toHaveValue("12,345");
  expect(screen.getByText("원")).toBeVisible();
  await userEvent.clear(input);
  await userEvent.type(input, "-1.5");
  await userEvent.tab();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("alert")).toHaveTextContent("정수");
});

test("password preserves typed value when visibility changes", async () => {
  render(<Controls.PasswordInput label="비밀번호" required />);
  const input = screen.getByLabelText("비밀번호 (필수)");
  await userEvent.type(input, "secret");
  expect(input).toHaveAttribute("type", "password");
  await userEvent.click(screen.getByRole("button", { name: "비밀번호 표시" }));
  expect(input).toHaveAttribute("type", "text");
  expect(input).toHaveValue("secret");
  await userEvent.click(
    screen.getByRole("button", { name: "비밀번호 숨기기" }),
  );
  expect(input).toHaveAttribute("type", "password");
});

test("stepper stops at the highest aligned value instead of emitting an off-grid maximum", async () => {
  const changed = vi.fn();
  const { container } = render(
    <form>
      <Controls.Stepper
        label="수량"
        min={0}
        max={5}
        step={2}
        defaultValue={4}
        onValueChange={changed}
      />
    </form>,
  );
  const input = screen.getByRole("spinbutton", { name: "수량" });
  const increase = screen.getByRole("button", { name: "수량 증가" });
  await userEvent.click(increase);
  expect(input).toHaveValue(4);
  expect(increase).toBeDisabled();
  expect(changed).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "수량 감소" }));
  expect(input).toHaveValue(2);
  expect(changed).toHaveBeenCalledExactlyOnceWith(2);
  expect(container.querySelector("form")!.checkValidity()).toBe(true);
});

test.each([0, -2, NaN, Infinity, -Infinity])(
  "stepper rejects invalid step configuration %s without emitting values",
  async (step) => {
    const changed = vi.fn();
    const { container } = render(
      <form>
        <Controls.Stepper
          label="수량"
          min={0}
          max={5}
          step={step}
          defaultValue={4}
          onValueChange={changed}
        />
      </form>,
    );
    const increase = screen.getByRole("button", { name: "수량 증가" });
    const decrease = screen.getByRole("button", { name: "수량 감소" });
    expect(increase).toBeDisabled();
    expect(decrease).toBeDisabled();
    await userEvent.click(increase);
    await userEvent.click(decrease);
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getByRole("spinbutton")).toHaveValue(4);
    expect(container.querySelector("form")!.checkValidity()).toBe(false);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "허용 범위와 입력 단위",
    );
  },
);

test.each([
  { min: 0, max: 5, step: 2, initial: 3, direction: "증가", expected: 4 },
  { min: 0, max: 5, step: 2, initial: 5, direction: "감소", expected: 4 },
  { min: 1, max: 6, step: 2, initial: 4, direction: "감소", expected: 3 },
  {
    min: 0,
    max: 0.3,
    step: 0.1,
    initial: 0.2,
    direction: "증가",
    expected: 0.3,
  },
])(
  "stepper moves onto the min-based grid from $initial with step $step ($direction)",
  async ({ min, max, step, initial, direction, expected }) => {
    const changed = vi.fn();
    const { container } = render(
      <form>
        <Controls.Stepper
          label="수량"
          min={min}
          max={max}
          step={step}
          defaultValue={initial}
          onValueChange={changed}
        />
      </form>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: `수량 ${direction}` }),
    );
    expect(screen.getByRole("spinbutton")).toHaveValue(expected);
    expect(changed).toHaveBeenCalledExactlyOnceWith(expected);
    expect(container.querySelector("form")!.checkValidity()).toBe(true);
  },
);

test.each([0, 0.5])(
  "number input keeps minless draft validity on the zero-based grid from %s",
  (defaultValue) => {
    const changed = vi.fn();
    const submitted = vi.fn((event: React.FormEvent) => event.preventDefault());
    const { container } = render(
      <form onSubmit={submitted}>
        <Controls.NumberInput
          label="수량"
          defaultValue={defaultValue}
          step={1}
          onValueChange={changed}
        />
      </form>,
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const form = container.querySelector("form")!;
    expect(input.validity.customError).toBe(defaultValue === 0.5);
    fireEvent.change(input, { target: { value: "1.5" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(1.5);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.validity.customError).toBe(true);
    expect(form.checkValidity()).toBe(false);
    form.requestSubmit();
    expect(submitted).not.toHaveBeenCalled();
    expect(changed).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "수량 증가" }));
    expect(input).toHaveValue(2);
    expect(changed).toHaveBeenCalledExactlyOnceWith(2);
    expect(input.validity.customError).toBe(false);
    expect(form.checkValidity()).toBe(true);
    form.requestSubmit();
    expect(submitted).toHaveBeenCalledTimes(1);
  },
);

test.each([NaN, Infinity, -Infinity])(
  "number input blocks optional native forms for nonfinite controlled value %s",
  (value) => {
    const submitted = vi.fn((event: React.FormEvent) => event.preventDefault());
    const { container, rerender } = render(
      <form onSubmit={submitted}>
        <Controls.NumberInput label="수량" value={value} />
      </form>,
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    const form = container.querySelector("form")!;
    expect(input).toHaveValue(null);
    fireEvent.blur(input);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.validity.customError).toBe(true);
    expect(form.checkValidity()).toBe(false);
    form.requestSubmit();
    expect(submitted).not.toHaveBeenCalled();
    rerender(
      <form onSubmit={submitted}>
        <Controls.NumberInput label="수량" value={2} />
      </form>,
    );
    expect(input.validity.customError).toBe(false);
    expect(form.checkValidity()).toBe(true);
  },
);

test.each([
  { min: 0.5, max: 3, step: 1, draft: "1", expected: 1.5 },
  { min: 0, max: 3, step: 1, draft: "4", expected: 3 },
])(
  "number input rejects invalid manual draft $draft without notifying consumers",
  ({ min, max, step, draft, expected }) => {
    const changed = vi.fn();
    const { container } = render(
      <form>
        <Controls.NumberInput
          label="수량"
          min={min}
          max={max}
          step={step}
          defaultValue={min}
          onValueChange={changed}
        />
      </form>,
    );
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.change(input, { target: { value: draft } });
    expect(input.validity.customError).toBe(true);
    expect(container.querySelector("form")!.checkValidity()).toBe(false);
    expect(changed).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", {
        name: `수량 ${draft === "4" ? "감소" : "증가"}`,
      }),
    );
    expect(input).toHaveValue(expected);
    expect(changed).toHaveBeenCalledExactlyOnceWith(expected);
    expect(input.validity.customError).toBe(false);
  },
);

test("controlled number input retains invalid manual drafts without callbacks and resets from props", () => {
  const changed = vi.fn();
  const view = (value: number) => (
    <form>
      <Controls.NumberInput
        label="수량"
        value={value}
        onValueChange={changed}
      />
    </form>
  );
  const { container, rerender } = render(view(0));
  const input = screen.getByRole("spinbutton") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "1.5" } });
  expect(input).toHaveValue(1.5);
  expect(input.validity.customError).toBe(true);
  expect(container.querySelector("form")!.checkValidity()).toBe(false);
  expect(changed).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "수량 증가" }));
  expect(changed).toHaveBeenCalledExactlyOnceWith(2);
  expect(input).toHaveValue(0);
  fireEvent.change(input, { target: { value: "1.5" } });
  rerender(view(3));
  expect(input).toHaveValue(3);
  expect(input.validity.customError).toBe(false);
});

test("number stepper respects bounds and reports invalid manual values", async () => {
  render(
    <Controls.NumberInput
      label="수량"
      defaultValue={2}
      min={0}
      max={4}
      step={2}
    />,
  );
  const input = screen.getByRole("spinbutton", { name: "수량" });
  await userEvent.click(screen.getByRole("button", { name: "수량 증가" }));
  expect(input).toHaveValue(4);
  expect(screen.getByRole("button", { name: "수량 증가" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "수량 감소" }));
  expect(input).toHaveValue(2);
  await userEvent.clear(input);
  await userEvent.type(input, "5");
  await userEvent.tab();
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByRole("alert")).toHaveTextContent("범위");
});
