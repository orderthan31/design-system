import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function inspect(page:Page){
 expect(await page.locator('.component-detail details[open]').count()).toBe(0);
 const result=await new AxeBuilder({page}).include('.component-detail').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));expect(await page.evaluate(()=>window.scrollY)).toBe(0);
}
test('Slider detail native keyboard bounds step numeric state and disabled fieldset stay consistent',async({page},info)=>{
 await page.goto('/#/components/slider');await expect(page.getByRole('heading',{level:1,name:'슬라이더 · Slider'})).toBeVisible();
 const slider=page.getByRole('slider',{name:'음량',exact:true});await slider.focus();await page.keyboard.press('ArrowRight');await expect(slider).toHaveValue('45');await expect(page.getByText('현재 값: 45',{exact:true})).toBeVisible();
 await page.keyboard.press('Home');await expect(slider).toHaveValue('0');await page.keyboard.press('End');await expect(slider).toHaveValue('100');
 await page.getByRole('button',{name:'폼 값 확인'}).click();await expect(page.getByRole('status')).toHaveText('제출 값: 100');
 await page.getByRole('checkbox',{name:'데모 비활성화'}).check();await expect(slider).toBeDisabled();await expect(page.getByRole('button',{name:'폼 값 확인'})).toBeDisabled();
 const form=page.locator('.rs-demo-form');expect(await form.evaluate(node=>new FormData(node as HTMLFormElement).has('volume'))).toBe(false);
 await page.getByRole('checkbox',{name:'데모 비활성화'}).uncheck();await expect(slider).toHaveValue('100');await expect(page.getByRole('slider',{name:'비활성 음량'})).toBeDisabled();
 const reset=page.getByRole('form',{name:'비제어 초기화'});const initial=reset.getByRole('slider',{name:'초기 음량'});await initial.focus();await page.keyboard.press('End');await expect(initial).toHaveValue('100');await reset.getByRole('button',{name:'초기값 복원'}).click();await expect(initial).toHaveValue('20');expect(await reset.evaluate(node=>new FormData(node as HTMLFormElement).get('reset-volume'))).toBe('20');
 await inspect(page);await page.screenshot({path:info.outputPath('slider.png'),fullPage:true});
});
test('Rating detail native keyboard required submission and explicit clear remain form safe',async({page},info)=>{
 await page.goto('/#/components/rating');const form=page.locator('.rs-demo-form');const group=form.getByRole('group',{name:'만족도 (필수)',exact:true});
 expect(await form.evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(false);
 await form.getByRole('button',{name:'폼 값 확인'}).click();await expect(form.getByRole('status')).toHaveCount(0);
 const second=group.getByRole('radio',{name:'2점',exact:true});await group.locator('label').filter({hasText:'2점'}).click();await second.focus();await page.keyboard.press('ArrowRight');await expect(group.getByRole('radio',{name:'3점',exact:true})).toBeChecked();
 await expect(page.getByText('현재 값: 3점',{exact:true})).toBeVisible();await form.getByRole('button',{name:'폼 값 확인'}).click();await expect(form.getByRole('status')).toHaveText('제출 값: 3');
 const clear=group.getByRole('button',{name:'만족도 지우기',exact:true});await expect(clear).toHaveAttribute('type','button');await clear.click();expect(await form.evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(false);expect(await form.evaluate(node=>new FormData(node as HTMLFormElement).has('score'))).toBe(false);
 await group.locator('label').filter({hasText:'4점'}).click();await page.getByRole('checkbox',{name:'데모 비활성화'}).check();await expect(clear).toBeDisabled();await expect(group.getByRole('radio',{name:'4점',exact:true})).toBeDisabled();expect(await form.evaluate(node=>new FormData(node as HTMLFormElement).has('score'))).toBe(false);
 await page.getByRole('checkbox',{name:'데모 비활성화'}).uncheck();await expect(group.getByRole('radio',{name:'4점',exact:true})).toBeChecked();
 const reset=page.getByRole('form',{name:'비제어 초기화'});await reset.locator('label').filter({hasText:'5점'}).click();await expect(reset.getByRole('radio',{name:'5점',exact:true})).toBeChecked();await reset.getByRole('button',{name:'초기값 복원'}).click();await expect(reset.getByRole('radio',{name:'2점',exact:true})).toBeChecked();expect(await reset.evaluate(node=>new FormData(node as HTMLFormElement).get('reset-score'))).toBe('2');
 await inspect(page);await page.screenshot({path:info.outputPath('rating.png'),fullPage:true});
});
test('ProgressStepper detail changes ordered states without masquerading as navigation',async({page},info)=>{
 await page.goto('/#/components/progress-stepper');const list=page.getByRole('list',{name:'신청 단계'});
 await expect(list.locator('li[aria-current="step"]')).toHaveCount(1);await expect(list.locator('li[aria-current="step"]')).toContainText('정보 입력');await expect(page.getByRole('button',{name:'이전 단계'})).toBeDisabled();
 await page.getByRole('button',{name:'다음 단계'}).click();await expect(list.locator('li[data-state="completed"]')).toHaveCount(1);await expect(list.locator('li[aria-current="step"]')).toContainText('내용 확인');await expect(list.getByRole('button')).toHaveCount(0);
 await page.getByRole('button',{name:'다음 단계'}).click();await expect(list.locator('li[data-state="completed"]')).toHaveCount(2);await expect(page.getByRole('button',{name:'다음 단계'})).toBeDisabled();
 await page.mouse.move(0,0);
 await expect(page.getByRole('button',{name:'다음 단계'})).toHaveCSS('background-color','rgb(241, 245, 249)');
 const immediate=await page.getByRole('button',{name:'다음 단계'}).evaluate(node=>{const button=node as HTMLButtonElement;button.disabled=false;const style=getComputedStyle(button);const colors={foreground:style.color,background:style.backgroundColor};button.disabled=true;return colors;});
 expect(immediate).toEqual({foreground:'rgb(255, 255, 255)',background:'rgb(51, 65, 85)'});
 await page.getByRole('button',{name:'처음부터'}).click();await expect(list.locator('li[data-state="completed"]')).toHaveCount(0);await expect(list.locator('li[aria-current="step"]')).toContainText('정보 입력');
 const reenabled=await page.getByRole('button',{name:'다음 단계'}).evaluate(node=>{const style=getComputedStyle(node);return {foreground:style.color,background:style.backgroundColor};});
 expect(reenabled.foreground).toBe('rgb(255, 255, 255)');expect(reenabled.background).toBe('rgb(51, 65, 85)');
 await inspect(page);await page.screenshot({path:info.outputPath('progress-stepper.png'),fullPage:true});
});
test('controlled Rating reset retains latest owner checked state required validity and actual FormData without rerender',async({page})=>{
 await page.goto('/#/components/rating');const form=page.locator('.rs-demo-form');const group=form.getByRole('group',{name:'만족도 (필수)',exact:true});
 await group.locator('label').filter({hasText:'4점'}).click();await expect(group.getByRole('radio',{name:'4점',exact:true})).toBeChecked();
 const reset=await form.evaluate(async node=>{const form=node as HTMLFormElement;form.reset();await Promise.resolve();return {score:new FormData(form).get('score'),valid:form.checkValidity()};});
 expect(reset).toEqual({score:'4',valid:true});await expect(group.getByRole('radio',{name:'4점',exact:true})).toBeChecked();await expect(page.getByText('현재 값: 4점',{exact:true})).toBeVisible();
 const cancelled=await form.evaluate(async node=>{const form=node as HTMLFormElement;form.addEventListener('reset',event=>event.preventDefault(),{once:true});form.reset();await Promise.resolve();return new FormData(form).get('score');});expect(cancelled).toBe('4');
});
test('Result detail retries and empty actions update actual outcomes with recovery guidance retained',async({page},info)=>{
 await page.goto('/#/components/result');const detail=page.locator('.component-detail');await expect(detail.getByRole('alert')).toContainText('입력 내용은 유지됩니다. 연결을 확인한 뒤 다시 시도해 주세요.');
 await detail.getByRole('button',{name:'다시 시도',exact:true}).click();await expect(detail.getByRole('alert')).toHaveCount(0);await expect(detail.getByRole('heading',{name:'다시 불러왔습니다',exact:true})).toBeVisible();await expect(detail.getByRole('status').filter({hasText:'신청 번호 DEMO-001을 다시 불러왔습니다.'})).toBeVisible();
 await detail.getByRole('button',{name:'결과 확인',exact:true}).click();await expect(detail.getByRole('status').filter({hasText:'신청 번호 DEMO-001의 결과를 확인했습니다.'})).toBeVisible();
 await detail.getByRole('button',{name:'빈 결과 보기',exact:true}).click();await detail.getByRole('button',{name:'샘플 항목 추가',exact:true}).click();await expect(detail.getByRole('heading',{name:'샘플 항목을 추가했습니다',exact:true})).toBeVisible();
 await expect(detail.getByRole('button',{name:'권한 필요',exact:true})).toBeDisabled();await expect(detail.getByRole('button',{name:'처리 중',exact:true})).toHaveAttribute('aria-disabled','true');
 await inspect(page);await page.screenshot({path:info.outputPath('result.png'),fullPage:true});
});
