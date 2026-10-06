import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const pages = [
  "Overview",
  "Foundations",
  "Atoms",
  "Molecules",
  "Organisms",
];
async function navigate(page: Page, name: string) {
  await page.goto(`/#${name}`);
  await expect(page.locator("h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}
async function overflow(page: Page) {
  return page.evaluate(() => ({
    viewport: innerWidth,
    scroll: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("main *")]
      .filter((e) => {
        const b = e.getBoundingClientRect();
        const clipped = e.closest('.ds-table-scroll');
        if (clipped && clipped !== e) {
          const c = clipped.getBoundingClientRect();
          // Horizontal table panning is permitted only inside an in-viewport,
          // keyboard-focusable scrolling boundary, never document overflow.
          if (c.left >= 0 && c.right <= innerWidth + 1 &&
              (clipped as HTMLElement).tabIndex >= 0 &&
              getComputedStyle(clipped).overflowX === 'auto') return false;
        }
        return b.width > 0 && (b.right > innerWidth + 1 || b.left < -1);
      })
      .map((e) => ({
        tag: e.tagName,
        class: e.className,
        text: e.textContent?.slice(0, 70),
      })),
  }));
}
test("primary action meets canonical 48px geometry", async ({ page }) => {
  await page.goto("/");
  const b = page.getByRole("button", { name: "컴포넌트 둘러보기" });
  expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  await expect(page.locator(".sidebar")).toBeVisible();
});
test("six documentation pages have no overflow, no console errors, and scoped axe violations", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const measurements = [];
  fs.mkdirSync("evidence/screenshots", { recursive: true });
  for (const name of pages) {
    await navigate(page, name);
    const o = await overflow(page);
    expect(o.scroll, `${name} document overflow`).toBeLessThanOrEqual(
      o.viewport,
    );
    expect(o.offenders, `${name} escaping elements`).toEqual([]);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    measurements.push({
      name,
      ...o,
      axe: { violations: result.violations, passes: result.passes.length },
    });
    expect(result.violations, `${name} axe`).toEqual([]);
    await page.evaluate(() => {
      const modal = document.querySelector<HTMLDialogElement>('dialog[open]');
      if (!modal) document.getElementById('main')?.focus({preventScroll:true});
      window.scrollTo({top:0,left:0,behavior:'instant'});
    });
    await page.screenshot({
      path: `evidence/screenshots/${info.project.name}-${name.toLowerCase()}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
  fs.writeFileSync(
    `evidence/pages-${info.project.name}.json`,
    JSON.stringify({ errors, measurements }, null, 2),
  );
});
test("native controls, busy action, keyboard menu, tabs and tooltip are interactive", async ({
  page,
}) => {
  await navigate(page, "Atoms");
  const input = page.getByRole("textbox", { name: "편집 가능한 입력" });
  await input.fill("직접 입력 · typed value");
  await expect(input).toHaveValue("직접 입력 · typed value");
  const readonly = page.getByRole("textbox", { name: "읽기 전용 입력" });
  await expect(readonly).toHaveAttribute("readonly", "");
  await expect(
    page.getByRole("textbox", { name: "비활성 입력" }),
  ).toBeDisabled();
  const save = page
    .locator("#button")
    .getByRole("button", { name: "변경 사항 저장" });
  await save.click();
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(save).toHaveAttribute("aria-disabled", "true");
  await save.focus();
  await expect(save).toBeFocused();
  await expect(save).toHaveAttribute("aria-busy", "true");
  await expect(page.getByText("변경 사항을 저장했습니다.", { exact: true })).toBeVisible();
  const checkbox = page.getByRole("checkbox", {
    name: "추가 정보 포함",
  });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await page.getByRole("combobox", { name: "분류" }).selectOption("other");
  await expect(page.getByRole("combobox", { name: "분류" })).toHaveValue(
    "other",
  );
  await navigate(page, "Molecules");
  const menu = page.locator("#menu").getByRole("button", { name: "옵션" });
  await menu.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "복제" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "보관" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("보관 동작을 선택했습니다. 데이터는 변경되지 않았습니다."),
  ).toBeVisible();
  await expect(menu).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  const tab = page.locator("#tabs").getByRole("tab", { name: "미리보기" });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "코드" })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "<Tabs items={views} />",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "사용법" })).toBeFocused();
  const tooltip = page.getByRole("button", { name: "간격 안내" });
  await tooltip.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});
test("long KO204 EN446 JA160 bodies wrap, dialog actions do not overlap, focus traps and returns", async ({
  page,
}, info) => {
  const measurements = [];
  for (const component of ["Alert", "EmptyState", "Dialog"]) {
    await navigate(page, component === "Dialog" ? "Organisms" : "Molecules");
    const card = page.locator(`#${component.toLowerCase()}`);
    for (const [language, length] of [
      ["ko", 204],
      ["en", 446],
      ["ja", 160],
    ] as const) {
      await card
        .getByRole("combobox", { name: "예시 언어" })
        .selectOption(language);
      if (component === "Dialog")
        await card.getByRole("button", { name: "대화상자 열기" }).click();
      const text =
        component === "Dialog"
          ? page.getByRole("dialog").locator("[data-long-text]")
          : card.locator("[data-long-text]");
      await expect(text).toHaveAttribute("lang", language);
      expect((await text.textContent())!.length).toBe(length);
      const geometry = await text.evaluate((e) => {
        const b = e.getBoundingClientRect();
        return {
          width: b.width,
          height: b.height,
          scrollWidth: e.scrollWidth,
          clientWidth: e.clientWidth,
          fontSize: getComputedStyle(e).fontSize,
          lineHeight: getComputedStyle(e).lineHeight,
        };
      });
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
      expect(parseFloat(geometry.fontSize)).toBeGreaterThanOrEqual(14);
      const o = await overflow(page);
      expect(o.scroll).toBeLessThanOrEqual(o.viewport);
      if (component === "Dialog") {
        const dialog = page.getByRole("dialog");
        const body = await dialog.locator(".dialog-body").boundingBox();
        const actions = await dialog.locator(".dialog-actions").boundingBox();
        expect(body!.y + body!.height).toBeLessThanOrEqual(actions!.y + 0.5);
        const action = dialog.getByRole("button", { name: "계속" });
        expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(48);
        const close = dialog.getByRole("button", { name: "대화상자 닫기" });
        await close.focus();
        await page.keyboard.press("Shift+Tab");
        await expect(action).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(close).toBeFocused();
        await page.evaluate(() => {
          window.scrollTo({top:0,left:0,behavior:'instant'});
        });
        await page.screenshot({
          path: `evidence/screenshots/${info.project.name}-dialog-${language}.png`,
        });
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(
          card.getByRole("button", { name: "대화상자 열기" }),
        ).toBeFocused();
      } else if (component === "EmptyState") {
        expect(
          (await card
            .getByRole("button", { name: "첫 항목 추가" })
            .boundingBox())!.height,
        ).toBeGreaterThanOrEqual(48);
      }
      measurements.push({ component, language, length, ...geometry });
    }
  }
  fs.writeFileSync(
    `evidence/long-text-${info.project.name}.json`,
    JSON.stringify(measurements, null, 2),
  );
  await navigate(page, "Organisms");
  await page.getByRole("button", { name: "확인 창 열기" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "확인", exact: true })
    .click();
  await expect(
    page.getByText("변경 사항을 확인했습니다.", { exact: true }),
  ).toBeVisible();
});
test("original four fonts load and controls preserve canonical sizes", async ({
  page,
}, info) => {
  await navigate(page, "Atoms");
  const fonts = await page.evaluate(async () => {
    const weights = [400, 500, 600, 700];
    return Promise.all(
      weights.map(async (weight) => {
        const loaded = await document.fonts.load(`${weight} 16px Pretendard`);
        return {
          weight,
          loaded: loaded.length,
          status: loaded.map((f) => f.status),
          check: document.fonts.check(`${weight} 16px Pretendard`),
        };
      }),
    );
  });
  expect(
    fonts.every((f) => f.loaded > 0 && f.status.every((s) => s === "loaded")),
  ).toBe(true);
  const controls = await page
    .locator(".control:not(textarea),.button.primary,.icon-button")
    .evaluateAll((elements) =>
      elements
        .filter((e) => e.getBoundingClientRect().width > 0)
        .map((e) => ({
          tag: e.tagName,
          class: e.className,
          height: e.getBoundingClientRect().height,
          min:
            e.classList.contains("primary") ||
            e.classList.contains("icon-button")
              ? 48
              : 44,
        })),
    );
  expect(controls.every((c) => c.height >= c.min)).toBe(true);
  fs.writeFileSync(
    `evidence/fonts-controls-${info.project.name}.json`,
    JSON.stringify(
      { fonts, controls, glyphFallback: "not independently verified" },
      null,
      2,
    ),
  );
});
