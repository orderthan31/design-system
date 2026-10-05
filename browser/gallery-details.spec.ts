import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function contained(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);}
async function docsAndA11y(page:Page){
 expect(await page.locator('.component-detail details[open]').count()).toBe(0);
 const result=await new AxeBuilder({page}).include('.component-detail').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
 await contained(page);
 if(page.viewportSize()!.width<=700){
  await page.evaluate(()=>window.scrollTo(0,600));
  const geometry=await page.evaluate(()=>({navBottom:document.querySelector('.sidebar')!.getBoundingClientRect().bottom,mainTop:document.querySelector('main')!.getBoundingClientRect().top}));
  expect(geometry.navBottom).toBeLessThanOrEqual(geometry.mainTop+1);
 }
}
test('TextField detail keeps native edit clear validation and busy input identity',async({page},info)=>{
 await page.goto('/#/components/text-field');await expect(page.getByRole('heading',{level:1,name:'텍스트 필드 · TextField'})).toBeVisible();
 const search=page.getByRole('textbox',{name:'빠른 검색'});await expect(page.getByRole('searchbox',{name:'검색어',exact:true})).toHaveAttribute('type','search');await expect(search).toHaveValue('디자인');await page.getByRole('button',{name:'검색 지우기'}).click();await expect(search).toHaveValue('');await expect(search).toBeFocused();
 const email=page.getByRole('textbox',{name:'검증 이메일'});await email.fill('bad');await page.getByRole('button',{name:'검증',exact:true}).click();await expect(email).toHaveAttribute('aria-invalid','true');await email.fill('sample@example.kr');await page.getByRole('button',{name:'검증',exact:true}).click();await expect(page.getByRole('status').filter({hasText:'이메일 형식이 올바릅니다.'})).toBeVisible();
 const nickname=page.getByRole('textbox',{name:'닉네임'});await nickname.fill('편집한 닉네임');await nickname.evaluate(node=>{(window as any).nicknameNode=node;(node as HTMLInputElement).setSelectionRange(1,3);});
 await page.getByRole('button',{name:'확인 시작',exact:true}).click();await expect(nickname).toHaveAttribute('aria-busy','true');await nickname.fill('처리 중 편집');await page.getByRole('button',{name:'확인 종료',exact:true}).click();await expect(nickname).toHaveValue('처리 중 편집');expect(await nickname.evaluate(node=>node===(window as any).nicknameNode)).toBe(true);
 await expect(page.getByRole('textbox',{name:'비활성'})).toBeDisabled();await expect(page.getByRole('textbox',{name:'읽기 전용'})).toHaveAttribute('readonly','');
 await docsAndA11y(page);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('text-field.png'),fullPage:true});
});
test('ListRow detail supports native list slots selection disabled invariance search and bulk update',async({page},info)=>{
 await page.goto('/#/components/list-row');const list=page.getByRole('list',{name:'검토 항목'});await expect(list.locator(':scope > li')).toHaveCount(4);
 await expect(list.getByRole('checkbox',{name:'잠긴 항목 선택'})).toBeDisabled();await expect(list.getByRole('button',{name:'잠긴 항목 열기'})).toBeDisabled();
 await list.getByRole('checkbox',{name:'문서 정리 선택'}).check();await list.getByRole('button',{name:'화면 검토 열기'}).click();await expect(page.getByRole('status')).toHaveText('화면 검토 항목을 열었습니다.');await page.getByRole('button',{name:'선택 완료',exact:true}).click();await expect(page.getByRole('status')).toHaveText('2개 항목을 완료했습니다.');await expect(list.getByRole('checkbox',{name:'문서 정리 선택'})).not.toBeChecked();await expect(list.getByText('완료',{exact:true})).toHaveCount(2);
 const query=page.getByRole('searchbox',{name:'항목 검색'});await query.fill('없는 항목');await expect(page.getByText('검색 결과 없음',{exact:true})).toBeVisible();await query.fill('');await page.getByRole('combobox',{name:'분류'}).selectOption('문서');await expect(list.locator(':scope > li')).toHaveCount(2);await page.getByRole('combobox',{name:'분류'}).selectOption('전체');
 await docsAndA11y(page);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('list-row.png'),fullPage:true});
});
test('BottomSheet detail applies drafts only on apply and uses mobile sheet versus PC dialog',async({page},info)=>{
 await page.goto('/#/components/bottom-sheet');const region=page.getByRole('region',{name:'BottomSheet 상세',exact:true}),trigger=region.getByRole('button',{name:'옵션 선택',exact:true});await trigger.click();const dialog=page.getByRole('dialog',{name:'옵션 선택',exact:true});await expect(dialog).toBeVisible();
 if(page.viewportSize()!.width<=640){expect(await dialog.evaluate(node=>!!node.closest('.nr-sheet'))).toBe(true);const box=await dialog.boundingBox();expect(Math.abs(box!.y+box!.height-page.viewportSize()!.height)).toBeLessThanOrEqual(1);}else expect(await dialog.evaluate(node=>!!node.closest('.nr-sheet'))).toBe(false);
 await dialog.getByRole('radio',{name:'자세히'}).check();await dialog.getByRole('button',{name:'취소',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();await expect(region.getByRole('status')).toHaveText('아직 적용 전');
 await trigger.click();await expect(dialog.getByRole('radio',{name:'간단히'})).toBeChecked();await dialog.getByRole('radio',{name:'자세히'}).check();await dialog.getByRole('button',{name:'적용',exact:true}).click();await expect(region.getByRole('status')).toHaveText('옵션: 자세히');await expect(trigger).toBeFocused();
 await docsAndA11y(page);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('bottom-sheet.png'),fullPage:true});await trigger.click();await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('bottom-sheet-open.png'),fullPage:true});await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await contained(page);
});
test('Dialog detail Escape closes top popup or child only and restores each exact opener',async({page},info)=>{
 await page.goto('/#/components/dialog');const trigger=page.getByRole('button',{name:'작업 열기'});await trigger.click();const parent=page.getByRole('dialog',{name:'작업 안내',exact:true});const menu=parent.getByRole('button',{name:'작업 메뉴'});await menu.click();await parent.getByRole('menuitem',{name:'복제'}).focus();await page.keyboard.press('Escape');await expect(parent.getByRole('menu')).toHaveCount(0);await expect(parent).toBeVisible();await expect(menu).toBeFocused();
 const help=parent.getByRole('button',{name:'도움말'});await help.focus();await expect(parent.getByRole('tooltip')).toBeVisible();await page.keyboard.press('Escape');await expect(parent.getByRole('tooltip')).toHaveCount(0);await expect(parent).toBeVisible();await expect(help).toBeFocused();
 const remove=parent.getByRole('button',{name:'삭제 확인'});await remove.click();const child=page.getByRole('dialog',{name:'삭제할까요?',exact:true});await expect(child).toBeVisible();await page.keyboard.press('Escape');await expect(child).toHaveCount(0);await expect(parent).toBeVisible();await expect(remove).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('dialog-open.png'),fullPage:true});await page.keyboard.press('Escape');await expect(parent).toHaveCount(0);await expect(trigger).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');await docsAndA11y(page);await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:info.outputPath('dialog.png'),fullPage:true});
});
