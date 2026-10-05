import { test, expect, type Page, type Locator } from '@playwright/test';
import { contrastRatio } from '../src/themes';
import { buildSync } from 'esbuild';
import fs from 'node:fs';

// Real exports rendered in an isolated host document, never the gallery App.
const built = buildSync({stdin: {resolveDir: process.cwd(), loader: 'tsx', contents: `
  import React from 'react';
  import {createRoot} from 'react-dom/client';
  import {DatePicker,DateRangePicker,MonthPicker,TimeInput,DateTimeInput,NumberInput,Combobox,Drawer, BottomSheet, Button, Input, Textarea, Select, Checkbox, IconButton, Badge, Alert, Progress, Skeleton, Separator, EmptyState, Dialog, Confirm, Menu, Tabs, Tooltip, FormField, Container, Stack, Grid, Shell, FormSection, ActionGroup, SearchField, ListPanel, FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate} from './src/index';
  import {applyTheme, themes} from './src/themes';
  const root = createRoot(document.querySelector('#mount'));
  window.consumerClicks = 0;
  function Consumer() {
    const [modal, setModal] = React.useState('');
    return <div className="ds-core" id="consumer">
    <Container><FormSection title="공통 소비 폼">
      <FormField label="소비 입력" defaultValue="유지할 값"/>
      <Button id="consumer-primary">소비 기본 작업</Button>
      <Button variant="secondary">소비 보조 작업</Button>
      <div aria-label="소비 버튼 상태">
        {['primary','secondary','ghost','destructive'].flatMap(kind => ['small','medium','large'].flatMap(size => ['default','busy','disabled'].map(state =>
          <Button key={kind+size+state} data-testid={kind+'-'+size+'-'+state} variant={kind} size={size} loading={state==='busy'} disabled={state==='disabled'} onClick={() => window.consumerClicks++}>{kind+' '+size+' '+state}</Button>
        )))}
        <Button data-testid="quiet" variant="quiet">quiet 별칭</Button>
      </div>
    </FormSection></Container>
    <section aria-label="소비 필드 상태" className="stack">
      <Input aria-label="일반 입력" defaultValue="기본 값"/>
      <Input aria-label="오류 입력" aria-invalid="true" defaultValue="오류 값"/>
      <Input aria-label="읽기 전용 입력" readOnly defaultValue="읽기 전용"/>
      <Input aria-label="사용 불가 입력" disabled defaultValue="사용 불가"/>
      <Input aria-label="처리 중 입력" loading defaultValue="처리 중에도 입력 가능"/>
      <Textarea aria-label="여러 줄 입력" defaultValue="첫째 줄"/>
      <Textarea aria-label="오류 여러 줄" aria-invalid="true"/>
      <Textarea aria-label="읽기 전용 여러 줄" readOnly defaultValue="읽기 전용"/>
      <Textarea aria-label="사용 불가 여러 줄" disabled/>
      <Select aria-label="일반 선택"><option value="a">첫째 선택</option><option value="b">둘째 선택</option></Select>
      <Select aria-label="오류 선택" aria-invalid="true"><option>오류 선택</option></Select>
      <Select aria-label="사용 불가 선택" disabled><option>선택 불가</option></Select>
      <Checkbox label="선택 안 됨"/><Checkbox label="선택됨" defaultChecked/>
      <Checkbox label="일부 선택" mixed/><Checkbox label="오류 체크" aria-invalid="true"/><Checkbox label="사용 불가 체크" disabled/>
      <FormField label="필수 오류 필드" required description="도움말" error="오류 설명"><Textarea aria-label="필수 오류 필드"/></FormField>
      <FormField label="선택 필드" description="선택 도움말"><Select><option>선택</option></Select></FormField>
    </section>
    <section aria-label="소비 탐색 상태" className="stack">
      <IconButton label="아이콘 동작" data-testid="icon-default">+</IconButton>
      <IconButton label="처리 중 아이콘" loading data-testid="icon-busy">+</IconButton>
      <IconButton label="사용 불가 아이콘" disabled data-testid="icon-disabled">+</IconButton>
      <Menu label="소비 메뉴" items={['첫 동작','둘째 동작']} />
      <Tabs items={[{label:'첫 탭',content:'첫 내용'},{label:'둘째 탭',content:'둘째 내용'}]}/>
      <Tooltip label="소비 도움말" text="마우스와 키보드 도움말"/>
      <Button onClick={()=>setModal('dialog')}>대화상자 열기</Button>
      <Button onClick={()=>setModal('confirm')}>확인창 열기</Button>
    </section>
    <section aria-label="소비 피드백 상태" className="stack">
      {['neutral','running','success','review','error'].map(tone=><React.Fragment key={tone}><Badge tone={tone}>{tone} 배지</Badge><Alert tone={tone} title={tone+' 알림'}>설명</Alert></React.Fragment>)}
      <Progress value={65} label="소비 진행률"/><Progress label="소비 진행 중"/>
      <Skeleton/><Separator/>
      <EmptyState title="빈 내용" action="빈 내용 작업">설명</EmptyState>
      <EmptyState title="처리 중 빈 내용" action="처리 중 빈 내용 작업" loading>설명</EmptyState>
    </section>
    <section aria-label="추가 조합과 레이아웃" className="stack">
      <Shell navigation={<p>탐색 슬롯</p>} header={<p>제목 슬롯</p>}><Stack><SearchField aria-label="소비 검색"/><ActionGroup><Button>조합 작업</Button></ActionGroup></Stack></Shell>
      <ListPanel title="목록 영역"><p>행 슬롯</p></ListPanel>
      <FormTemplate title="소비 폼 템플릿" fields={<FormField label="템플릿 입력"/>} actions={<Button>템플릿 작업</Button>}/>
      <ListTemplate title="소비 목록 템플릿" rows={<p>목록 슬롯</p>}/>
      <FeedbackTemplate title="소비 피드백 템플릿" status={<Badge>중립</Badge>} content={<p>내용 슬롯</p>}/>
      <DetailTemplate title="소비 상세 템플릿" summary={<p>요약</p>} content={<p>상세</p>}/>
    </section>
    <Dialog open={modal==='dialog'} title="소비 대화상자" onClose={()=>setModal('')} footer={<><Button variant="secondary" onClick={()=>setModal('')}>닫기 작업</Button><Button>주요 작업</Button></>}><FormField label="대화상자 입력"/></Dialog>
    <Confirm open={modal==='confirm'} title="소비 확인창" onClose={()=>setModal('')} onConfirm={()=>window.consumerClicks++}>내용</Confirm>
    </div>;
  }
  root.render(<Consumer/>);
  function InitialOverlays(){const [outer,setOuter]=React.useState(true),[inner,setInner]=React.useState(true);return <div className="ds-core"><Drawer open={outer} title="처음 열린 측면" onClose={()=>setOuter(false)}><Button>측면 동작</Button><BottomSheet open={inner} title="처음 열린 하단" onClose={()=>setInner(false)}><Button>하단 동작</Button></BottomSheet></Drawer></div>;}
  window.mountInitialOverlays=()=>root.render(<InitialOverlays/>);
  function AuditControls(){return <div className="ds-core"><form id="audit-form"><DatePicker label="제한 날짜" defaultValue="2024-02-28" min="2024-02-01" max="2024-03-31" disabledDates={['2024-02-29']}/><DatePicker label="그레고리력 날짜" defaultValue="2011-12-30"/><DatePicker label="경계 날짜" defaultValue="9999-12-01"/><MonthPicker label="검증 월" defaultValue="2024-02"/><TimeInput label="검증 시간" defaultValue="09:30"/><DateTimeInput label="소유자 날짜시간" value="2024-02-29T09:30" onChange={value=>window.auditChanges.push(value)}/><NumberInput label="격자 수량" min={0} max={5} step={2} defaultValue={4}/><Combobox label="필수 도시" required name="city" options={[{value:'seoul',label:'서울'}]}/></form></div>;}
  window.mountAuditControls=()=>{window.auditChanges=[];root.render(<AuditControls/>);};
  function ReviewControls(){const [disabled,setDisabled]=React.useState(false);window.disableAuditCombo=()=>setDisabled(true);return <div className="ds-core"><form id="number-form" onSubmit={e=>{e.preventDefault();window.reviewSubmits++;}}><NumberInput label="수동 격자" defaultValue={0} step={1}/></form><form id="default-number-form"><NumberInput label="기본 격자 오류" defaultValue={0.5} step={1}/></form><form id="nonfinite-number-form"><NumberInput label="비유한 값" value={Number.NaN}/></form><form id="malformed-datetime-form"><DateTimeInput label="형식 오류 날짜시간" defaultValue="2024-02-29T09:30Textra" onValidityChange={valid=>window.reviewValidity.push(valid)}/></form><Combobox label="잠글 도시" disabled={disabled} options={[{value:'seoul',label:'서울'}]} onValueChange={value=>window.reviewComboChanges.push(value)}/></div>;}
  window.mountReviewControls=()=>{window.reviewSubmits=0;window.reviewValidity=[];window.reviewComboChanges=[];root.render(<ReviewControls/>);};
  function ReviewPopups(){const [open,setOpen]=React.useState(true);return <div className="ds-core"><Dialog open={open} title="하위 팝업 소유권" onClose={()=>{window.reviewCloses++;setOpen(false);}}><Menu label="모달 메뉴" items={['하위 작업']}/><Tooltip label="모달 도움말">간단한 안내</Tooltip></Dialog></div>;}
  window.mountReviewPopups=()=>{window.reviewCloses=0;root.render(<ReviewPopups key={(window.reviewPopupMount=(window.reviewPopupMount??0)+1)}/>);};

  let restore;
  window.setConsumerTheme = id => {
    restore?.(); restore = undefined;
    if (id !== 'baseline') restore = applyTheme(document.querySelector('#consumer'), themes.find(t => t.id === id));
  };
`,}, bundle: true, write: false, outfile: 'consumer.js', format: 'iife', define: {'process.env.NODE_ENV': '"production"'}});
const consumer = built.outputFiles.find(file => file.path.endsWith('.js'))!.text;
const coreCSS = fs.existsSync('src/core.css') ? buildSync({entryPoints: ['src/core.css'], bundle: true, write: false, outfile: 'core.css', external: ['/source/*']}).outputFiles[0].text : '/* No independent core stylesheet yet. */';
const host = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>공통 DS 소비 검사</title></head><body>
  <h1>일반 호스트 문서</h1><button id="host-button" class="button primary">외부 일반 버튼</button>
  <input id="host-input" class="control" aria-label="외부 일반 입력"><a id="host-link" href="#host">외부 링크</a>
  <div id="outside-ds" class="ds-core"><button class="button primary" type="button">범위 밖 DS 작업</button></div>
  <select id="host-select"><option>호스트 선택</option></select><textarea id="host-textarea">호스트 입력</textarea>
  <nav id="host-nav">호스트 탐색</nav><main id="host-main">호스트 영역</main><dialog id="host-dialog">닫힌 호스트 대화상자</dialog>
  <h2 id="host-heading">호스트 제목</h2><p id="host-paragraph">호스트 문단</p><div id="host-collision" class="row error success">호스트 클래스 충돌 검사</div>
  <div id="mount"></div></body></html>`;
async function install(page: Page) {
  await page.route('**/__core-consumer', route => route.fulfill({contentType: 'text/html', body: host}));
  await page.goto('/__core-consumer');
  await page.addScriptTag({content: consumer});
  await expect(page.getByRole('button', {name: '소비 기본 작업'})).toBeVisible();
}
test('initially open nested modal ownership follows native top-layer ordering',async({page})=>{
 await install(page);await page.addStyleTag({content:coreCSS});await page.evaluate(()=>{document.body.style.setProperty('overflow','auto','important');(window as any).mountInitialOverlays();});
 const outer=page.getByRole('dialog',{name:'처음 열린 측면',exact:true}),inner=page.getByRole('dialog',{name:'처음 열린 하단',exact:true});
 await expect(inner).toBeVisible();await expect(inner.getByRole('button',{name:'대화상자 닫기'})).toBeFocused();
 await page.keyboard.press('Escape');await expect(inner).toHaveCount(0);await expect(outer).toBeVisible();await expect(outer.getByRole('button',{name:'대화상자 닫기'})).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');
 await page.keyboard.press('Escape');await expect(outer).toHaveCount(0);expect(await page.evaluate(()=>document.body.style.getPropertyValue('overflow'))).toBe('auto');expect(await page.evaluate(()=>document.body.style.getPropertyPriority('overflow'))).toBe('important');
});
test('consumer native validity, rejected controlled datetime, bounded step and Gregorian date stay consistent',async({page})=>{
 await install(page);await page.addStyleTag({content:coreCSS});await page.evaluate(()=>(window as any).mountAuditControls());const city=page.getByRole('combobox',{name:'필수 도시 (필수)'});await city.fill('없는 도시');expect(await page.locator('#audit-form').evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(false);await city.fill('서');await city.press('ArrowDown');await city.press('Enter');await city.focus();expect(await page.locator('#audit-form').evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(true);expect(await page.locator('#audit-form').evaluate(node=>new FormData(node as HTMLFormElement).get('city'))).toBe('seoul');await city.press('Escape');
 const date=page.getByLabel('제한 날짜',{exact:true});await date.fill('2023-02-29');expect(await date.evaluate(node=>(node as HTMLInputElement).checkValidity())).toBe(false);await date.fill('2024-02-28');const picker=page.locator('.dc-picker').filter({has:date});await picker.getByRole('button',{name:'달력 열기'}).click();await expect(picker.getByRole('button',{name:'2024년 2월 29일',exact:true})).toBeDisabled();await picker.getByRole('button',{name:'2024년 2월 28일',exact:true}).focus();await page.keyboard.press('PageDown');await expect(picker.getByRole('button',{name:'2024년 3월 28일',exact:true})).toBeFocused();await page.keyboard.press('Home');await page.keyboard.press('End');await page.keyboard.press('Escape');
 for(const [label,bad,good] of [['검증 월','2024-13','2024-02'],['검증 시간','25:61','09:30']]){const field=page.getByLabel(label,{exact:true});await field.fill(bad);expect(await field.evaluate(node=>(node as HTMLInputElement).checkValidity())).toBe(false);await field.fill(good);expect(await field.evaluate(node=>(node as HTMLInputElement).checkValidity())).toBe(true);}
 const owner=page.getByRole('group',{name:'소유자 날짜시간',exact:true}),time=owner.getByRole('textbox',{name:'시간',exact:true});await time.fill('10:30');await expect(time).toHaveValue('09:30');await expect(owner.getByRole('status')).toContainText('09:30');expect(await page.evaluate(()=>(window as any).auditChanges)).toContain('2024-02-29T10:30');
 await expect(page.getByRole('button',{name:'격자 수량 증가'})).toBeDisabled();await page.getByRole('button',{name:'격자 수량 감소'}).click();await expect(page.getByRole('spinbutton',{name:'격자 수량'})).toHaveValue('2');expect(await page.getByLabel('그레고리력 날짜').evaluate(node=>(node as HTMLInputElement).checkValidity())).toBe(true);await containedAudit(page);
});
async function containedAudit(page:Page){expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));}
test('review regressions keep numeric native submission, malformed datetime and disabled open combo consistent',async({page})=>{
 await install(page);await page.addStyleTag({content:coreCSS});await page.evaluate(()=>(window as any).mountReviewControls());const manual=page.getByRole('spinbutton',{name:'수동 격자'});await manual.fill('1.5');await manual.blur();await expect(manual).toHaveAttribute('aria-invalid','true');for(const id of ['number-form','default-number-form','nonfinite-number-form','malformed-datetime-form'])expect(await page.locator('#'+id).evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(false);await page.locator('#number-form').evaluate(node=>(node as HTMLFormElement).requestSubmit());expect(await page.evaluate(()=>(window as any).reviewSubmits)).toBe(0);expect(await page.evaluate(()=>(window as any).reviewValidity)).not.toContain(true);await expect(page.getByRole('group',{name:'형식 오류 날짜시간'}).getByRole('status')).not.toContainText('2024-02-29');await manual.fill('2');await manual.blur();expect(await page.locator('#number-form').evaluate(node=>(node as HTMLFormElement).checkValidity())).toBe(true);
 const combo=page.getByRole('combobox',{name:'잠글 도시'});await combo.click();await expect(page.getByRole('option',{name:'서울'})).toBeVisible();await page.evaluate(()=>(window as any).disableAuditCombo());await expect(combo).toBeDisabled();await expect(page.getByRole('option',{name:'서울'})).toHaveCount(0);await expect(page.getByRole('listbox')).toHaveCount(0);expect(await page.evaluate(()=>(window as any).reviewComboChanges)).toEqual([]);await expect(combo).toHaveValue('');
});
test('nested Menu and Tooltip consume only their own Escape before parent Dialog',async({page})=>{
 await install(page);await page.addStyleTag({content:coreCSS});for(const child of ['Menu','Tooltip']){await page.evaluate(()=>{document.body.style.setProperty('overflow','auto','important');(window as any).mountReviewPopups();});const dialog=page.getByRole('dialog',{name:'하위 팝업 소유권'});await expect(dialog).toBeVisible();if(child==='Menu'){await dialog.getByRole('button',{name:'모달 메뉴'}).click();await dialog.getByRole('menuitem',{name:'하위 작업'}).focus();}else await dialog.getByRole('button',{name:'모달 도움말'}).focus();await page.keyboard.press('Escape');await expect(dialog).toBeVisible();await expect(page.getByRole(child==='Menu'?'menu':'tooltip')).toHaveCount(0);expect(await page.evaluate(()=>(window as any).reviewCloses)).toBe(0);expect(await page.evaluate(()=>document.body.style.overflow)).toBe('hidden');await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();expect(await page.evaluate(()=>(window as any).reviewCloses)).toBe(1);expect(await page.evaluate(()=>document.body.style.getPropertyValue('overflow'))).toBe('auto');expect(await page.evaluate(()=>document.body.style.getPropertyPriority('overflow'))).toBe('important');}
});
test('core-only calendar selected day stays distinct through default hover and held pressed states',async({page})=>{
 await install(page);await page.addStyleTag({content:coreCSS});await page.evaluate(()=>(window as any).mountAuditControls());const picker=page.locator('.dc-picker').filter({has:page.getByLabel('제한 날짜',{exact:true})});await picker.getByRole('button',{name:'달력 열기'}).click();const selected=picker.getByRole('button',{name:'2024년 2월 28일',exact:true}),other=picker.getByRole('button',{name:'2024년 2월 27일',exact:true});await expect(selected).toHaveAttribute('aria-pressed','true');const ordinary=await other.evaluate(node=>getComputedStyle(node).backgroundColor);for(const mode of ['default','hover','pressed']){if(mode==='hover')await selected.hover();if(mode==='pressed')await page.mouse.down();await expect.poll(()=>selected.evaluate(node=>getComputedStyle(node).backgroundColor)).not.toBe(ordinary);}await page.mouse.move(0,0);await page.mouse.up();await selected.focus();await expect(selected).toBeFocused();await page.keyboard.press('Escape');
});
async function externalStyles(page: Page) {
  return page.evaluate(() => Object.fromEntries(['body','#host-button','#host-input','#host-link','#host-select','#host-textarea','#host-nav','#host-main','#host-dialog','#host-heading','#host-paragraph','#host-collision'].map(selector => {
    const style = getComputedStyle(document.querySelector(selector)!);
    return [selector, Object.fromEntries(['backgroundColor','color','margin','fontFamily','fontSize','lineHeight','padding','border','boxSizing','display','outline','minHeight'].map(key => [key, style[key as any]]))];
  })));
}

test('gallery-free core provides 48/44px controls without altering host elements; subtree themes restore in isolation', async ({page}, info) => {
  await install(page);
  const before = await externalStyles(page);
  const rootBefore = await page.evaluate(() => document.documentElement.getAttribute('style'));
  await page.addStyleTag({content: coreCSS});
  const primary = page.getByRole('button', {name: '소비 기본 작업'});
  await expect(primary).toHaveCSS('min-height', '48px');
  expect((await primary.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  const input = page.getByRole('textbox', {name: '소비 입력'});
  expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  expect(await externalStyles(page)).toEqual(before);
  const outside = page.getByRole('button', {name: '범위 밖 DS 작업'});
  await expect(outside).toHaveCSS('background-color', 'rgb(51, 65, 85)', {timeout: 5000});
  await input.fill('교체 후에도 유지');
  for (const [id, color] of [['indigo','rgb(67, 56, 202)'],['teal','rgb(15, 118, 110)'],['baseline','rgb(51, 65, 85)']]) {
    await page.evaluate(id => (window as any).setConsumerTheme(id), id);
    await expect(primary).toHaveCSS('background-color', color, {timeout: 5000});
    await expect(input).toHaveValue('교체 후에도 유지');
    await expect(outside).toHaveCSS('background-color', 'rgb(51, 65, 85)');
    expect(await externalStyles(page)).toEqual(before);
    expect(await page.evaluate(() => document.documentElement.getAttribute('style'))).toBe(rootBefore);
  }
  expect(await page.locator('#consumer').getAttribute('data-ds-theme')).toBeNull();
  expect(await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}))).toEqual({width:info.project.use.viewport!.width,scroll:info.project.use.viewport!.width});
  await page.screenshot({path: info.outputPath('gallery-free-core.png'), fullPage: true});
});

async function keyboardFocus(page: Page, target: Locator) {
  await target.evaluate(node => {
    const sentinel = document.createElement('span');
    sentinel.tabIndex = 0; sentinel.dataset.focusSentinel = 'true';
    node.before(sentinel); sentinel.focus();
  });
  await page.keyboard.press('Tab');
  await expect(target).toBeFocused();
  expect(await target.evaluate(node => node.matches(':focus-visible'))).toBe(true);
  await expect(target).toHaveCSS('outline-style', 'solid');
  await expect(target).toHaveCSS('outline-width', '3px');
  await expect(target).toHaveCSS('outline-offset', '3px');
  await page.locator('[data-focus-sentinel]').evaluateAll(nodes => nodes.forEach(node => node.remove()));
}
async function stableStyle(target: Locator) {
  // Finite retry: do not record transition intermediates as final state colors.
  await expect.poll(() => target.evaluate(node => node.getAnimations().filter(animation => animation.playState === 'running').length), {timeout: 5000}).toBe(0);
  return target.evaluate(node => {
    const s = getComputedStyle(node);
    return {background:s.backgroundColor, color:s.color, border:s.borderColor, cursor:s.cursor, outline:s.outlineColor};
  });
}
const opaqueHex = (rgb: string) => '#' + rgb.match(/\d+/g)!.slice(0,3).map(value => Number(value).toString(16).padStart(2,'0')).join('');
for (const theme of ['baseline', 'indigo', 'teal']) {
  test(`core Button kinds × sizes: actual hover/pressed/focus separate from busy/disabled (${theme})`, async ({page}) => {
    test.setTimeout(90000);
    await install(page); await page.addStyleTag({content:coreCSS});
    await page.evaluate(id => { (window as any).consumerClicks = 0; (window as any).setConsumerTheme(id); }, theme);
    for (const kind of ['primary','secondary','ghost','destructive']) for (const size of ['small','medium','large']) {
      const target = page.getByTestId(`${kind}-${size}-default`);
      await target.scrollIntoViewIfNeeded(); await page.mouse.move(0,0);
      await target.evaluate(node => (node as HTMLElement).blur());
      const d = await stableStyle(target);
      await target.hover(); const h = await stableStyle(target);
      expect(h.background, `${kind} ${size} hover`).not.toBe(d.background);
      await page.mouse.down(); const p = await stableStyle(target);
      expect(await target.evaluate(node => node.matches(':active'))).toBe(true);
      expect(p.background, `${kind} ${size} pressed`).not.toBe(h.background);
      await page.mouse.up(); await page.mouse.move(0,0);
      await keyboardFocus(page, target);
      for (const style of [d,h,p]) expect(contrastRatio(opaqueHex(style.color), style.background === 'rgba(0, 0, 0, 0)' ? '#ffffff' : opaqueHex(style.background))).toBeGreaterThanOrEqual(4.5);
      const busy = page.getByTestId(`${kind}-${size}-busy`);
      await busy.scrollIntoViewIfNeeded(); await page.mouse.move(0,0);
      const b = await stableStyle(busy);
      await busy.hover(); expect((await stableStyle(busy)).background).toBe(b.background);
      await page.mouse.down(); expect((await stableStyle(busy)).background).toBe(b.background); await page.mouse.up();
      await expect(busy).toHaveAttribute('aria-busy','true'); await expect(busy).toHaveCSS('cursor','wait');
      const clicks = await page.evaluate(() => (window as any).consumerClicks);
      await keyboardFocus(page,busy); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
      expect(await page.evaluate(() => (window as any).consumerClicks)).toBe(clicks);
      const disabled = page.getByTestId(`${kind}-${size}-disabled`);
      await disabled.scrollIntoViewIfNeeded(); await page.mouse.move(0,0);
      const unavailable = await stableStyle(disabled);
      await disabled.hover({force:true}); expect((await stableStyle(disabled)).background).toBe(unavailable.background);
      await page.mouse.down(); expect((await stableStyle(disabled)).background).toBe(unavailable.background); await page.mouse.up();
      await expect(disabled).toBeDisabled(); expect(await disabled.evaluate(node => (node as HTMLButtonElement).tabIndex)).toBe(0);
      await disabled.evaluate(node => { (node as HTMLElement).focus(); }); expect(await disabled.evaluate(node => node === document.activeElement)).toBe(false);
      expect(await page.evaluate(() => (window as any).consumerClicks)).toBe(clicks);
    }
  });
}

test('native fields and checkbox have actual hover/pressed cues and independent keyboard focus; readonly/error/busy remain meaningful', async ({page}) => {
  test.setTimeout(90000); await install(page); await page.addStyleTag({content:coreCSS});
  for (const name of ['일반 입력','처리 중 입력','여러 줄 입력','일반 선택','선택 필드']) {
    const target = page.getByLabel(name,{exact:true});
    await target.scrollIntoViewIfNeeded(); await page.mouse.move(0,0);
    const d = await stableStyle(target);
    await target.hover(); const h = await stableStyle(target); expect(h.border, name+' hover').not.toBe(d.border);
    await page.mouse.down(); const p = await stableStyle(target); expect(p.background, name+' pressed').not.toBe(d.background);
    await page.mouse.up(); await page.keyboard.press('Escape'); await page.mouse.move(0,0);
    await keyboardFocus(page,target);
    if (name==='일반 선택') {await target.selectOption('b'); await expect(target).toHaveValue('b');}
    if (name==='처리 중 입력') {await target.fill('처리 중 편집'); await expect(target).toHaveValue('처리 중 편집'); await expect(target).toHaveAttribute('aria-busy','true');}
  }
  for (const name of ['오류 입력','오류 여러 줄','오류 선택','필수 오류 필드']) {
    const target=page.getByLabel(name,{exact:true}); await target.scrollIntoViewIfNeeded(); await target.hover();
    await expect(target).toHaveCSS('border-color','rgb(190, 18, 60)');
    await keyboardFocus(page,target); await expect(target).toHaveAttribute('aria-invalid','true');
    await expect(target).toHaveCSS('border-color','rgb(190, 18, 60)');
  }
  for (const name of ['읽기 전용 입력','읽기 전용 여러 줄']) {const target=page.getByLabel(name); const value=await target.inputValue();await keyboardFocus(page,target);await page.keyboard.type('수정 불가');await expect(target).toHaveValue(value);}
  for (const name of ['사용 불가 입력','사용 불가 여러 줄','사용 불가 선택']) {const target=page.getByLabel(name);await expect(target).toBeDisabled();await target.evaluate(node=>(node as HTMLElement).focus());expect(await target.evaluate(node=>node===document.activeElement)).toBe(false);}
  for (const name of ['선택 안 됨','선택됨','일부 선택']) {
    const target=page.getByRole('checkbox',{name,exact:true}),label=target.locator('..');
    await target.scrollIntoViewIfNeeded(); await page.mouse.move(0,0);const d=await stableStyle(label);
    await label.hover();const h=await stableStyle(label);expect(h.background).not.toBe(d.background);
    await page.mouse.down();const p=await stableStyle(label);expect(p.background).not.toBe(h.background);await page.mouse.up();
    await keyboardFocus(page,target);const checked=await target.isChecked();await page.keyboard.press('Space');expect(await target.isChecked()).toBe(!checked);
    expect((await target.boundingBox())!.width).toBe(24);expect((await label.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  }
  await expect(page.getByRole('checkbox',{name:'사용 불가 체크'})).toBeDisabled();
});

test('Menu/Tabs/Tooltip and reusable action children expose real hover/pressed/focus without inventing passive interaction states', async ({page}) => {
  test.setTimeout(90000); await install(page); await page.addStyleTag({content:coreCSS});
  async function action(target: Locator) {
    await target.scrollIntoViewIfNeeded();await page.mouse.move(0,0);const d=await stableStyle(target);
    await target.hover();const h=await stableStyle(target);expect(h.background).not.toBe(d.background);
    await page.mouse.down();const p=await stableStyle(target);expect(p.background).not.toBe(h.background);await page.mouse.up();
    await page.mouse.move(0,0);await keyboardFocus(page,target);
  }
  await action(page.getByRole('button',{name:'아이콘 동작',exact:true}));
  expect((await page.getByRole('button',{name:'아이콘 동작',exact:true}).boundingBox())!.width).toBe(48);
  await keyboardFocus(page,page.getByRole('button',{name:'처리 중 아이콘',exact:true}));
  await expect(page.getByRole('button',{name:'사용 불가 아이콘'})).toBeDisabled();
  await action(page.getByRole('button',{name:'빈 내용 작업',exact:true}));
  await keyboardFocus(page,page.getByRole('button',{name:'처리 중 빈 내용 작업'}));
  const menu=page.getByRole('button',{name:'소비 메뉴'});
  await action(menu);await page.keyboard.press('ArrowDown');
  const item=page.getByRole('menuitem',{name:'첫 동작'});await expect(item).toBeFocused();
  await page.mouse.move(0,0);const d=await stableStyle(item);await item.hover();const h=await stableStyle(item);
  await page.mouse.down();const p=await stableStyle(item);expect(p.background).not.toBe(h.background);await page.mouse.up();await expect(menu).toBeFocused();
  for(const name of ['첫 탭','둘째 탭']) {const tab=page.getByRole('tab',{name});await action(tab);await expect(tab).toHaveAttribute('aria-selected','true');await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{selected:true})).toBeFocused();}
  const help=page.getByRole('button',{name:'소비 도움말'});await action(help);await expect(page.getByRole('tooltip')).toBeVisible();
  await page.getByRole('tooltip').hover();await expect(page.getByRole('tooltip')).toBeVisible();await help.focus();await page.keyboard.press('Escape');await expect(page.getByRole('tooltip')).toHaveCount(0);
  for(const title of ['소비 대화상자','소비 확인창']) {
    await page.getByRole('button',{name:title==='소비 대화상자'?'대화상자 열기':'확인창 열기',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:title});await expect(dialog).toBeVisible();
    await action(dialog.getByRole('button',{name:title==='소비 대화상자'?'주요 작업':'확인',exact:true}));
    const secondary=dialog.getByRole('button',{name:title==='소비 대화상자'?'닫기 작업':'취소',exact:true});
    await secondary.hover();const h=await stableStyle(secondary);await page.mouse.down();const p=await stableStyle(secondary);expect(p.background).not.toBe(h.background);
    // Release inside non-action dialog content: backdrop release intentionally dismisses.
    const interior=await dialog.locator('.dialog-head h2').boundingBox();
    await page.mouse.move(interior!.x+5,interior!.y+5);await page.mouse.up();await keyboardFocus(page,secondary);await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
  }
  for(const selector of ['.badge','.alert','.progress','.skeleton','.separator']) {
    const target=page.locator('#consumer '+selector).first();await target.scrollIntoViewIfNeeded();
    expect(await target.evaluate(node=>(node as HTMLElement).tabIndex)).toBe(-1);
    const before=await target.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color,border:getComputedStyle(node).borderColor}));
    await target.hover();await page.mouse.down();const after=await target.evaluate(node=>({background:getComputedStyle(node).backgroundColor,color:getComputedStyle(node).color,border:getComputedStyle(node).borderColor}));await page.mouse.up();expect(after).toEqual(before);
  }
});

test('quiet alias, invalid/readonly pointer combinations, checkbox mixed semantics and passive motion contracts', async ({page}) => {
  await install(page);await page.addStyleTag({content:coreCSS});
  const quiet=page.getByTestId('quiet'),ghost=page.getByTestId('ghost-medium-default');
  for(const mode of ['default','hover','pressed']) {
    async function get(target:Locator) {await target.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await target.evaluate(node=>(node as HTMLElement).blur());if(mode!=='default')await target.hover();if(mode==='pressed')await page.mouse.down();const style=await stableStyle(target);await page.mouse.up();return style;}
    const q=await get(quiet),g=await get(ghost);expect(q.background).toBe(g.background);expect(q.color).toBe(g.color);
  }
  await keyboardFocus(page,quiet);
  for(const name of ['오류 입력','오류 여러 줄','오류 선택','필수 오류 필드','읽기 전용 입력','읽기 전용 여러 줄']) {
    const target=page.getByLabel(name,{exact:true});await target.scrollIntoViewIfNeeded();await target.hover();const h=await stableStyle(target);await page.mouse.down();const p=await stableStyle(target);await page.mouse.up();await page.keyboard.press('Escape');
    if(name.includes('오류')) {expect(p.border).toBe('rgb(190, 18, 60)');expect(h.border).toBe(p.border);} else expect(p.background).toBe(h.background);
    await keyboardFocus(page,target);
  }
  const mixed=page.getByRole('checkbox',{name:'일부 선택'});expect(await mixed.evaluate(node=>(node as HTMLInputElement).indeterminate)).toBe(true);
  const invalid=page.getByRole('checkbox',{name:'오류 체크'});await invalid.hover();await page.mouse.down();expect(await invalid.evaluate(node=>node.matches(':active'))).toBe(true);await page.mouse.up();await keyboardFocus(page,invalid);await expect(invalid).toHaveAttribute('aria-invalid','true');
  await expect(page.getByRole('progressbar',{name:'소비 진행률'})).toHaveAttribute('aria-valuenow','65');
  await expect(page.getByRole('progressbar',{name:'소비 진행 중'})).not.toHaveAttribute('aria-valuenow');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#consumer .skeleton').first()).toHaveCSS('animation-name','none');
});
