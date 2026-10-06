import {test,expect,type Page} from '@playwright/test';
import {contrastRatio} from '../src/themes';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
async function contained(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));}
async function accessible(page:Page,selector:string){const result=await new AxeBuilder({page}).include(selector).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);}
test('Korean range calendar edits dates, keyboard crosses leap-day, reversed and malformed ranges reject',async({page},info)=>{
 await page.goto('/#Organisms');const range=page.getByRole('region',{name:'기간 선택',exact:true});
 const start=range.getByRole('textbox',{name:'시작 날짜',exact:true}),end=range.getByRole('textbox',{name:'종료 날짜',exact:true});
 await expect(range.getByRole('status')).toContainText('총 3일');
 await range.getByRole('button',{name:'달력 열기'}).first().click();
 const selected=range.getByRole('button',{name:'2024년 2월 28일',exact:true});await selected.focus();await page.keyboard.press('ArrowRight');
 await expect(range.getByRole('button',{name:'2024년 2월 29일',exact:true})).toBeFocused();await page.keyboard.press('Enter');
 await expect(start).toHaveValue('2024-02-29');await expect(range.getByRole('status')).toContainText('총 2일');
 await end.fill('2024-02-27');await expect(range.getByRole('alert')).toContainText('종료 날짜');
 await end.fill('2024-03-01');await start.fill('2023-02-29');await expect(range.getByRole('alert')).toContainText('올바른 날짜');await expect(range.getByRole('status')).not.toContainText('총');
 await start.fill('2024-02-28');await range.getByRole('button',{name:'달력 열기'}).first().click();await accessible(page,'.dc-gallery');await contained(page);
 fs.mkdirSync('evidence/screenshots',{recursive:true});await range.screenshot({path:`evidence/screenshots/${info.project.name}-calendar-range.png`});
});
test('Korean forms use real password, currency, combo, group, switch and upload controls',async({page},info)=>{
 await page.goto('/#Molecules');const forms=page.getByRole('region',{name:'확장 폼 컨트롤'});
 const password=forms.getByLabel('비밀번호 (필수)',{exact:true});await password.fill('safe-example');await forms.getByRole('button',{name:'비밀번호 표시'}).click();await expect(password).toHaveAttribute('type','text');
 const money=forms.getByLabel('금액 (필수)',{exact:true});await money.fill('25000');await money.press('Tab');await expect(money).toHaveValue('25,000');
 const combo=forms.getByRole('combobox',{name:'담당 분야'});await combo.fill('개');await combo.press('ArrowDown');await combo.press('Enter');await expect(combo).toHaveValue('개발');
 await forms.getByRole('switch',{name:'자동 저장'}).click();await expect(forms.getByRole('switch',{name:'자동 저장'})).toBeChecked();
 await forms.getByLabel('첨부 파일',{exact:true}).setInputFiles({name:'example.pdf',mimeType:'application/pdf',buffer:Buffer.from('example')});await expect(forms).toContainText('example.pdf');
 await forms.getByLabel('상세 주소',{exact:true}).fill('301호');await expect(forms.getByLabel('상세 주소',{exact:true})).toHaveValue('301호');
 await accessible(page,'.fc-gallery');await contained(page);fs.mkdirSync('evidence/screenshots',{recursive:true});await forms.screenshot({path:`evidence/screenshots/${info.project.name}-forms.png`});
});
test('DataTable connects sort/search/filter/pagination/select-all/bulk and real states',async({page},info)=>{
 await page.goto('/#Organisms');const gallery=page.locator('.ds-data-gallery');const table=gallery.getByRole('table',{name:'색상 데이터 탐색',exact:true});
 await table.getByRole('button',{name:/이름/}).click();await expect(table.getByRole('columnheader',{name:'이름 정렬'})).toHaveAttribute('aria-sort','ascending');
 const data=gallery.locator('.ds-data-example').filter({has:page.getByRole('heading',{name:'데이터 테이블',exact:true})});await data.getByRole('button',{name:'다음 페이지',exact:true}).click();
 await data.getByRole('checkbox',{name:/전체/}).check();await expect(data.getByRole('button',{name:'선택 항목 제외'})).toBeEnabled();await data.getByRole('button',{name:'선택 항목 제외'}).click();await expect(data.getByRole('status').filter({hasText:'제외했습니다'})).toBeVisible();
 await data.getByRole('searchbox').fill('없는 항목');await expect(data).toContainText('검색 결과가 없습니다');await data.getByRole('searchbox').fill('');
 await data.getByRole('combobox',{name:'색 계열'}).selectOption('따뜻한 색');await data.getByRole('combobox',{name:'페이지당 행 수'}).selectOption('10');
 await gallery.getByRole('button',{name:'다시 시도'}).click();await expect(gallery.getByRole('alert')).toHaveCount(0);
 await accessible(page,'.ds-data-gallery');await contained(page);fs.mkdirSync('evidence/screenshots',{recursive:true});await gallery.screenshot({path:`evidence/screenshots/${info.project.name}-data.png`});
});
test('Drawer nested BottomSheet owns scroll, traps Tab and restores focus without closing its parent',async({page},info)=>{
 await page.goto('/#Organisms');const gallery=page.locator('.nr-gallery');const trigger=gallery.getByRole('button',{name:'측면 영역 열기',exact:true});
 await trigger.click();const drawer=page.getByRole('dialog',{name:'측면 상세',exact:true});await expect(drawer).toBeVisible();expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).toBe('hidden');
 await drawer.getByRole('button',{name:'하단 영역 열기'}).click();const sheet=page.getByRole('dialog',{name:'하단 선택',exact:true});await expect(sheet).toBeVisible();const first=sheet.getByRole('button',{name:'대화상자 닫기'}),last=sheet.getByRole('button',{name:'선택 적용'});
 await first.focus();await page.keyboard.press('Shift+Tab');await expect(last).toBeFocused();await page.keyboard.press('Tab');await expect(first).toBeFocused();
 await page.keyboard.press('Escape');await expect(sheet).toHaveCount(0);await expect(drawer).toBeVisible();expect(await page.evaluate(()=>getComputedStyle(document.body).overflow)).toBe('hidden');await expect(drawer.getByRole('button',{name:'하단 영역 열기'})).toBeFocused();
 await accessible(page,'dialog[open]');fs.mkdirSync('evidence/screenshots',{recursive:true});await drawer.screenshot({path:`evidence/screenshots/${info.project.name}-drawer.png`});await page.keyboard.press('Escape');await expect(drawer).toHaveCount(0);await expect(trigger).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('');await contained(page);
});
test('Disclosure keyboard, toast dismissal and error retry expose actual state',async({page})=>{
 await page.goto('/#Molecules');const gallery=page.getByRole('region',{name:'상태와 펼침'});
 const one=gallery.getByRole('button',{name:'단일 펼침 1'}),two=gallery.getByRole('button',{name:'단일 펼침 2'});await one.focus();await page.keyboard.press('Space');await expect(one).toHaveAttribute('aria-expanded','true');await two.click();await expect(one).toHaveAttribute('aria-expanded','false');
 await gallery.getByRole('button',{name:'복수 펼침 1'}).click();await gallery.getByRole('button',{name:'복수 펼침 2'}).click();for(const name of ['복수 펼침 1','복수 펼침 2'])await expect(gallery.getByRole('button',{name})).toHaveAttribute('aria-expanded','true');
 await gallery.getByRole('button',{name:'실패 보기'}).click();await gallery.getByRole('button',{name:'다시 시도'}).click();await expect(gallery.getByRole('status',{name:'불러오는 중'})).toBeVisible();await gallery.getByRole('button',{name:'알림 보기'}).click();await gallery.getByRole('button',{name:'알림 닫기'}).click();await expect(gallery.getByText('작업이 완료되었습니다')).toHaveCount(0);await accessible(page,'[aria-label="상태와 펼침"]');await contained(page);
});
test('ErrorState retry boundary and keyboard offset focus contrast against actual error surface',async({page})=>{
 await page.goto('/#Molecules');const gallery=page.getByRole('region',{name:'상태와 펼침',exact:true});await gallery.getByRole('button',{name:'실패 보기'}).click();const alert=gallery.getByRole('alert'),retry=alert.getByRole('button',{name:'다시 시도'});await gallery.getByRole('button',{name:'알림 보기'}).focus();await page.keyboard.press('Tab');await expect(retry).toBeFocused();const colors=await retry.evaluate(node=>({border:getComputedStyle(node).borderLeftColor,outline:getComputedStyle(node).outlineColor,offset:getComputedStyle(node).outlineOffset,width:getComputedStyle(node).outlineWidth,background:getComputedStyle(node.closest('[role="alert"]')!).backgroundColor}));const hex=(rgb:string)=>'#'+rgb.match(/\d+/g)!.slice(0,3).map(value=>Number(value).toString(16).padStart(2,'0')).join('');expect(colors.background).toBe('rgb(255, 241, 242)');expect(colors.offset).toBe('3px');expect(colors.width).toBe('3px');for(const color of [colors.border,colors.outline])expect(contrastRatio(hex(color),hex(colors.background))).toBeGreaterThanOrEqual(3);
});
test('remaining feedback demo actions produce local state changes',async({page})=>{
 await page.goto('/#Molecules');const gallery=page.getByRole('region',{name:'상태와 펼침',exact:true});await gallery.getByRole('button',{name:'빈 결과 보기'}).click();await gallery.getByRole('button',{name:'다시 불러오기'}).click();await expect(gallery.getByRole('status',{name:'불러오는 중'})).toBeVisible();await contained(page);
});
test('wide data tables remain contained and keyboard-scrollable',async({page})=>{
 await page.goto('/#Organisms');const scroll=page.locator('.ds-table-scroll').first();await expect(scroll).toHaveAttribute('tabindex','0');const box=await scroll.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(page.viewportSize()!.width+1);await scroll.focus();await expect(scroll).toBeFocused();if(await scroll.evaluate(node=>node.scrollWidth>node.clientWidth)){await page.keyboard.press('ArrowRight');await expect.poll(()=>scroll.evaluate(node=>node.scrollLeft)).toBeGreaterThan(0);}await contained(page);
});

test('slate default, icon subset and reduced motion render without document overflow',async({page},info)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#Foundations');const icons=page.getByRole('region',{name:'아이콘',exact:true});await expect(icons.locator('svg')).toHaveCount(36);await expect(icons.locator('svg').first()).toHaveAttribute('aria-hidden','true');
 const gallery=page.getByRole('region',{name:'테마 라이브러리'});await gallery.getByRole('button',{name:'기본 코어로 복원'}).click();await expect(gallery.getByRole('button',{name:'기본 작업',exact:true})).toHaveCSS('background-color','rgb(51, 65, 85)');await accessible(page,'[aria-label="아이콘"]');await contained(page);fs.mkdirSync('evidence/screenshots',{recursive:true});await icons.screenshot({path:`evidence/screenshots/${info.project.name}-icons.png`});
});
