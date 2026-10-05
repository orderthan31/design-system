import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('segmented native keyboard selection skips disabled options and preserves required FormData/reset',async({page},info)=>{
 await page.goto('/#/components/segmented-control');
 await expect(page.getByRole('heading',{level:1,name:'분할 선택 · SegmentedControl'})).toBeVisible();
 const group=page.getByRole('group',{name:'검토 범위'});
 const all=group.getByRole('radio',{name:'전체',exact:true});const ready=group.getByRole('radio',{name:'준비 완료'});const draft=group.getByRole('radio',{name:'초안',exact:true});
 await all.focus();await page.keyboard.press('ArrowRight');await expect(ready).toBeChecked();await expect(ready).toBeFocused();
 await expect(page.getByRole('list',{name:'범위별 항목'}).locator('li')).toHaveCount(2);
 await page.keyboard.press('ArrowRight');await expect(draft).toBeChecked();await page.keyboard.press('ArrowRight');await expect(all).toBeChecked();await expect(group.getByRole('radio',{name:'보관',exact:true})).not.toBeChecked();
 const before=await page.getByRole('status',{name:'필터 결과'}).textContent();
 await expect(page.getByRole('group',{name:'비활성 범위'}).getByRole('radio',{name:'준비 완료'})).toBeDisabled();
 expect(await page.getByRole('status',{name:'필터 결과'}).textContent()).toBe(before);
 const form=page.getByRole('form',{name:'네이티브 제출 예시'});
 await form.getByRole('button',{name:'선택 제출'}).click();await expect(form.getByRole('alert')).toHaveText('표시 방식을 선택해 주세요.');await expect(form.getByRole('status',{name:'제출 결과'})).toHaveText('아직 제출 전');
 await form.locator('label').filter({hasText:'자세히'}).click();await expect(form.getByRole('radio',{name:'자세히'})).toBeChecked();
 expect(await form.evaluate(node=>new FormData(node as HTMLFormElement).get('display'))).toBe('detail');
 await form.getByRole('button',{name:'선택 제출'}).click();await expect(form.getByRole('status',{name:'제출 결과'})).toHaveText('제출한 표시 방식: 자세히');
 await form.getByRole('button',{name:'선택 초기화'}).click();await expect(form.getByRole('radio',{name:'자세히'})).not.toBeChecked();expect(await form.evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(false);
 expect(await page.locator('.component-detail details[open]').count()).toBe(0);
 const axe=await new AxeBuilder({page}).include('.component-detail').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
 const selected=group.locator('label:has(input[value="all"])');await all.focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');await expect(all).toBeChecked();
 const style=await selected.evaluate(node=>{const s=getComputedStyle(node);return{background:s.backgroundColor,color:s.color,outline:s.outlineWidth,height:node.getBoundingClientRect().height};});
 expect(style.background).toBe('rgb(51, 65, 85)');expect(style.color).toBe('rgb(255, 255, 255)');expect(style.outline).toBe('3px');expect(style.height).toBeGreaterThanOrEqual(48);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));expect(await page.evaluate(()=>window.scrollY)).toBe(0);await page.screenshot({path:info.outputPath('segmented-control.png'),fullPage:true});
 await info.attach('segmented-native-contract',{body:JSON.stringify({hash:await page.evaluate(()=>location.hash),selected:await all.isChecked(),style}),contentType:'application/json'});
});
