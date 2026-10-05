import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

test('한국어 기초 문서에서 테마 전환은 실제 버튼 색상만 범위 내 변경하고 값을 유지한다', async ({page}, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#Foundations');
  const gallery = page.getByRole('region', {name: '테마 라이브러리', exact:true});
  const preview = gallery.getByRole('region', {name: '범위 한정 테마 미리보기'});
  const select = gallery.getByRole('combobox', {name: '미리보기 테마'});
  const field = preview.getByRole('textbox', {name:'표시 이름'});
  const primary = preview.getByRole('button', {name:'기본 작업', exact:true});
  const rootBefore = await page.evaluate(() => document.documentElement.getAttribute('style'));
  await field.fill('테마를 바꿔도 입력 유지');
  const observations = [];
  for (const id of ['indigo', 'teal', 'baseline']) {
    await select.selectOption(id);
    await expect(field).toHaveValue('테마를 바꿔도 입력 유지');
    expect(await page.evaluate(() => document.documentElement.getAttribute('style'))).toBe(rootBefore);
    const expected = {indigo:'rgb(67, 56, 202)',teal:'rgb(15, 118, 110)',baseline:'rgb(51, 65, 85)'}[id];
    // CSS transitions expose intermediate colors; wait for the final rendered value.
    await expect(primary).toHaveCSS('background-color', expected!);
    const background = await primary.evaluate(element => getComputedStyle(element).backgroundColor);
    expect((await primary.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    const geometry = await page.evaluate(() => ({width:innerWidth, scroll:document.documentElement.scrollWidth}));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width);
    const axe = await new AxeBuilder({page}).include('[aria-label="테마 라이브러리"]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(axe.violations).toEqual([]);
    observations.push({id,background,geometry,axeViolations:axe.violations});
  }
  await expect(gallery.getByRole('table')).toHaveCount(0);
  expect(errors).toEqual([]);
  fs.mkdirSync('evidence/screenshots',{recursive:true});
  await select.selectOption('teal');
  await gallery.screenshot({path:`evidence/screenshots/${info.project.name}-korean-theme.png`});
  fs.writeFileSync(`evidence/theme-${info.project.name}.json`,JSON.stringify({errors,observations},null,2));
});
