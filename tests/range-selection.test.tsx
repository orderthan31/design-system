import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
afterEach(cleanup);

test("Controls associate with an external form and Rating applies its supplied group id", async () => {
  const { Slider, Rating } = await controls();
  const { container } = render(
    <>
      <form id="external" />
      <Slider
        label="외부 음량"
        name="volume"
        form="external"
        min={5}
        max={10}
      />
      <Rating
        id="review-score"
        label="외부 평가"
        name="score"
        form="external"
        defaultValue={4}
      />
    </>,
  );
  expect(screen.getByRole("slider")).toHaveValue("5");
  expect(screen.getByRole("group", { name: "외부 평가" })).toHaveAttribute(
    "id",
    "review-score",
  );
  expect(
    new FormData(container.querySelector("form")!).getAll("volume"),
  ).toEqual(["5"]);
  expect(
    new FormData(container.querySelector("form")!).getAll("score"),
  ).toEqual(["4"]);
});

test("Unnamed Rating instances have distinct native names and do not deselect each other", async () => {
  const { Rating } = await controls();
  render(
    <>
      <Rating label="첫 평가" defaultValue={2} />
      <Rating label="둘째 평가" defaultValue={4} />
    </>,
  );
  const inputs = screen.getAllByRole("radio") as HTMLInputElement[];
  expect(inputs[0].name).not.toBe(inputs[5].name);
  await userEvent.click(inputs[2]);
  expect(inputs[2]).toBeChecked();
  expect(inputs[8]).toBeChecked();
});

test.each(["slider", "rating"] as const)(
  "Korean %s detail has a real stateful form demo, disabled state and folded documentation",
  async (kind) => {
    const { existsSync } = await import("node:fs");
    expect(
      existsSync(`${process.cwd()}/src/gallery/range-selection-detail.tsx`),
    ).toBe(true);
    const path = "../src/gallery/range-selection-detail";
    const { RangeSelectionDetail } = (await import(
      /* @vite-ignore */ path
    )) as typeof import("../src/gallery/range-selection-detail");
    const { container } = render(<RangeSelectionDetail kind={kind} />);
    expect(container.querySelector("h1")).toBeNull();
    if (kind === "slider") {
      fireEvent.change(screen.getByRole("slider", { name: "음량" }), {
        target: { value: "60" },
      });
      expect(screen.getByText("현재 값: 60")).toBeVisible();
      expect(
        screen.getByRole("slider", { name: "비활성 음량" }),
      ).toBeDisabled();
    } else {
      await userEvent.click(screen.getAllByRole("radio", { name: "4점" })[0]);
      expect(screen.getByText("현재 값: 4점")).toBeVisible();
      expect(screen.getAllByRole("radio", { name: "4점" })[1]).toBeDisabled();
    }
    await userEvent.click(screen.getByRole("button", { name: "폼 값 확인" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      `제출 값: ${kind === "slider" ? 60 : 4}`,
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "데모 비활성화" }),
    );
    expect(screen.getByRole("button", { name: "폼 값 확인" })).toBeDisabled();
    const summaries = Array.from(
      container.querySelectorAll("details > summary"),
    ).map((node) => node.textContent);
    expect(summaries).toEqual(["사용 코드", "속성", "조합과 접근성"]);
    expect(
      Array.from(container.querySelectorAll("details")).every(
        (node) => !node.open,
      ),
    ).toBe(true);
    const code = container.querySelector("pre code")!.textContent!;
    expect(code).toContain("./src/components/range-selection");
    expect(code).toContain("./src/core.css");
    expect(code).toContain("onValueChange");
    expect(container.textContent).toContain("RangeError");
    expect(container.textContent).toContain("서버");
  },
);

test("Slider accepts decimal and any steps, defaults to min and rejects off-grid synthetic changes", async () => {
  const { Slider } = await controls();
  const changed = vi.fn();
  const { rerender } = render(
    <Slider
      label="배율"
      min={0.1}
      max={1}
      step={0.1}
      defaultValue={0.3}
      onValueChange={changed}
    />,
  );
  const input = screen.getByRole("slider");
  fireEvent.change(input, { target: { value: "0.35" } });
  expect(changed).not.toHaveBeenCalled();
  expect(input).toHaveValue("0.3");
  fireEvent.change(input, { target: { value: "0.4" } });
  expect(changed).toHaveBeenLastCalledWith(0.4);
  rerender(<Slider label="배율" step="any" value={0.35} />);
  expect(input).toHaveValue("0.35");
});

test("Range styles are scoped, token based and narrow-screen safe with selected, focus and fieldset disabled states", async () => {
  const { existsSync, readFileSync } = await import("node:fs");
  const path = `${process.cwd()}/src/components/range-selection.css`;
  expect(existsSync(path)).toBe(true);
  const css = readFileSync(path, "utf8");
  expect(css).toContain("var(--field-bg)");
  expect(css).toContain("var(--color-selected-fg)");
  expect(css).toContain("var(--color-disabled-fg)");
  expect(css).toContain(":checked");
  expect(css).toContain(":focus-visible");
  expect(css).toContain(":disabled");
  expect(css).toContain("flex-wrap: wrap");
  expect(css).toContain("min-width: 0");
  expect(
    css
      .match(/(?:^|\})\s*([^@{}]+)\{/g)
      ?.every((rule) => rule.includes(".ds-core")),
  ).toBe(true);
});

test.each([false, true])(
  "Rating ignores disabled radio and clear including ancestor fieldset (fieldset=%s)",
  async (fieldset) => {
    const { Rating } = await controls();
    const changed = vi.fn();
    const { container } = render(
      <form>
        <fieldset disabled={fieldset}>
          <Rating
            label="잠금 평가"
            name="score"
            defaultValue={2}
            disabled={!fieldset}
            clearable
            onValueChange={changed}
          />
        </fieldset>
      </form>,
    );
    const third = screen.getByRole("radio", { name: "3점" });
    const clear = screen.getByRole("button", { name: "잠금 평가 지우기" });
    expect(third).toBeDisabled();
    expect(clear).toBeDisabled();
    fireEvent.click(third);
    fireEvent.click(clear);
    expect(changed).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: "2점" })).toBeChecked();
    expect(new FormData(container.querySelector("form")!).has("score")).toBe(
      false,
    );
  },
);

test("Rating rejects nonfinite, fractional and out-of-range scores", async () => {
  const { Rating } = await controls();
  for (const value of [NaN, Infinity, -Infinity, -1, 6, 2.5]) {
    expect(() => render(<Rating label="평가" value={value} />)).toThrow(
      RangeError,
    );
    expect(() => render(<Rating label="평가" defaultValue={value} />)).toThrow(
      RangeError,
    );
  }
});

test("Rating clear is explicit, never submits and restores required validity", async () => {
  const { Rating } = await controls();
  const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
  const changed = vi.fn();
  const { container } = render(
    <form onSubmit={submit}>
      <Rating
        label="평가"
        name="score"
        defaultValue={3}
        required
        clearable
        onValueChange={changed}
      />
    </form>,
  );
  expect(screen.getByRole("radio", { name: "3점" })).toBeChecked();
  const clear = screen.getByRole("button", { name: "평가 지우기" });
  expect(clear).toHaveAttribute("type", "button");
  await userEvent.click(clear);
  expect(submit).not.toHaveBeenCalled();
  expect(changed).toHaveBeenCalledExactlyOnceWith(0);
  expect(container.querySelector("form")!.checkValidity()).toBe(false);
  expect(new FormData(container.querySelector("form")!).has("score")).toBe(
    false,
  );
  expect(
    screen
      .getAllByRole("radio")
      .every((input) => !(input as HTMLInputElement).checked),
  ).toBe(true);
});

test("Rating retains DOM on owner rerender and rejects controlled selections and clear", async () => {
  const { Rating } = await controls();
  const changed = vi.fn();
  const view = (value?: number) => (
    <Rating
      label="평가"
      value={value}
      defaultValue={2}
      clearable
      onValueChange={changed}
    />
  );
  const { rerender, unmount } = render(view());
  const third = screen.getByRole("radio", { name: "3점" });
  await userEvent.click(third);
  rerender(view());
  expect(screen.getByRole("radio", { name: "3점" })).toBe(third);
  expect(third).toBeChecked();
  unmount();
  const owner = render(view(2));
  const second = screen.getByRole("radio", { name: "2점" });
  await userEvent.click(screen.getByRole("radio", { name: "3점" }));
  expect(second).toBeChecked();
  expect(screen.getByRole("radio", { name: "3점" })).not.toBeChecked();
  await userEvent.click(screen.getByRole("button", { name: "평가 지우기" }));
  expect(second).toBeChecked();
  owner.rerender(view(2));
  expect(screen.getByRole("radio", { name: "2점" })).toBe(second);
  owner.rerender(view(4));
  expect(screen.getByRole("radio", { name: "4점" })).toBeChecked();
});

test("Rating is a Korean labelled native required radio group with keyboard and form values", async () => {
  const { Rating } = await controls();
  expect(Rating).toBeTypeOf("function");
  const changed = vi.fn();
  const { container } = render(
    <form>
      <Rating label="만족도" name="score" required onValueChange={changed} />
    </form>,
  );
  expect(screen.getByRole("group", { name: "만족도 (필수)" })).toBeVisible();
  const form = container.querySelector("form")!;
  expect(form.checkValidity()).toBe(false);
  const first = screen.getByRole("radio", { name: "1점" });
  expect(screen.getByText("1점")).toBeVisible();
  first.focus();
  await userEvent.keyboard(" ");
  expect(first).toBeChecked();
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("radio", { name: "2점" })).toBeChecked();
  expect(changed).toHaveBeenLastCalledWith(2);
  expect(form.checkValidity()).toBe(true);
  expect(new FormData(form).getAll("score")).toEqual(["2"]);
  expect(container.querySelector("button button")).toBeNull();
});

test.each([false, true])(
  "Slider ignores disabled changes including ancestor fieldset (fieldset=%s)",
  async (fieldset) => {
    const { Slider } = await controls();
    const changed = vi.fn();
    const { container } = render(
      <form>
        <fieldset disabled={fieldset}>
          <Slider
            label="잠금"
            name="locked"
            defaultValue={20}
            disabled={!fieldset}
            onValueChange={changed}
          />
        </fieldset>
      </form>,
    );
    const input = screen.getByRole("slider");
    expect(input).toBeDisabled();
    fireEvent.change(input, { target: { value: "30" } });
    expect(changed).not.toHaveBeenCalled();
    expect(input).toHaveValue("20");
    expect(new FormData(container.querySelector("form")!).has("locked")).toBe(
      false,
    );
  },
);

test("Slider keeps the same DOM and uncontrolled value across owner renders; controlled owners can reject or accept", async () => {
  const { Slider } = await controls();
  const changed = vi.fn();
  const view = (value?: number) => (
    <Slider
      label="음량"
      value={value}
      defaultValue={20}
      onValueChange={changed}
    />
  );
  const { rerender, unmount } = render(view());
  const input = screen.getByRole("slider");
  fireEvent.change(input, { target: { value: "30" } });
  rerender(view());
  expect(screen.getByRole("slider")).toBe(input);
  expect(input).toHaveValue("30");
  unmount();
  const owner = render(view(20));
  const controlled = screen.getByRole("slider");
  fireEvent.change(controlled, { target: { value: "30" } });
  expect(controlled).toHaveValue("20");
  owner.rerender(view(20));
  expect(screen.getByRole("slider")).toBe(controlled);
  expect(controlled).toHaveValue("20");
  owner.rerender(view(40));
  expect(controlled).toHaveValue("40");
});

async function controls() {
  const { existsSync } = await import("node:fs");
  expect(
    existsSync(`${process.cwd()}/src/components/range-selection.tsx`),
  ).toBe(true);
  const path = "../src/components/range-selection";
  return import(/* @vite-ignore */ path) as Promise<
    typeof import("../src/components/range-selection")
  >;
}

test("Slider exposes a labelled native range and submits its numeric changes", async () => {
  const { Slider } = await controls();
  const changed = vi.fn();
  const { container } = render(
    <form>
      <Slider
        label="음량"
        name="volume"
        min={0}
        max={10}
        step={2}
        defaultValue={4}
        onValueChange={changed}
      />
    </form>,
  );
  const input = screen.getByRole("slider", { name: "음량" });
  expect(input).toHaveAttribute("type", "range");
  expect(input).toHaveValue("4");
  fireEvent.change(input, { target: { value: "6" } });
  expect(changed).toHaveBeenCalledExactlyOnceWith(6);
  expect(new FormData(container.querySelector("form")!).get("volume")).toBe(
    "6",
  );
});

test("Slider rejects malformed numeric contracts instead of silently submitting a clamped value", async () => {
  const { Slider } = await controls();
  for (const props of [
    { value: NaN },
    { value: Infinity },
    { value: -1 },
    { value: 101 },
    { min: NaN },
    { max: Infinity },
    { min: 10, max: 5 },
    { step: 0 },
    { step: -1 },
    { step: NaN },
    { step: Infinity },
    { value: 3, step: 2 },
  ]) {
    expect(() => render(<Slider label="범위" {...props} />)).toThrow(
      RangeError,
    );
  }
});
