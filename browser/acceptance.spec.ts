import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768, 1024, 1440]) {
  test(`navigation, responsive composition and keyboard at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    for (const section of [
      "개요",
      "기초",
      "아톰",
      "몰리큘",
      "오가니즘",
      "템플릿",
    ]) {
      await page
        .getByRole("navigation", { name: "문서 탐색" })
        .getByRole("link", { name: section, exact: false })
        .click();
      await expect(page.getByRole("main")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page
      .getByRole("navigation", { name: "문서 탐색" })
      .getByRole("link", { name: "몰리큘" })
      .click();
    const tooltip = page.getByRole("button", { name: "간격 안내" });
    await tooltip.focus();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
    const preview = page.getByRole("tab", { name: "미리보기", exact: true });
    await preview.focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("tab", { name: "코드", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page
      .getByRole("navigation", { name: "문서 탐색" })
      .getByRole("link", { name: "오가니즘" })
      .click();
    await page
      .getByRole("button", { name: "대화상자 열기", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.screenshot({
      path: test.info().outputPath(`ds-reviewed-${width}.png`),
      fullPage: true,
    });
  });
}
