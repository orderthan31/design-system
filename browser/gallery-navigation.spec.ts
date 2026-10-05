import {test,expect,type Page} from '@playwright/test';
async function destination(page:Page,id:string,title:string){
 await expect(page).toHaveURL(new RegExp(`#/components/${id}$`));
 await expect(page.getByRole('heading',{level:1,name:title,exact:true})).toBeVisible();
 const selected=page.locator('.gallery-component-nav a[aria-current="page"]');
 expect(await selected.count()).toBeGreaterThan(0);
 for(const href of await selected.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href'))))expect(href).toBe(`#/components/${id}`);
}
async function openMenu(page:Page){const trigger=page.getByRole('button',{name:'탐색 메뉴 열기 또는 닫기'});if(await trigger.isVisible())await trigger.click();}
async function settledFocus(page:Page){await page.evaluate(async()=>{for(let i=0;i<5;i++)await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));await new Promise(resolve=>setTimeout(resolve,300));});}
test('component history keeps URL title and selection in sync without extra entries',async({page},info)=>{
 await page.goto('/#/components/button');await destination(page,'button','버튼 · Button');const initialLength=await page.evaluate(()=>history.length);
 await openMenu(page);await page.locator('.gallery-component-nav a[href="#/components/dialog"]:visible').first().click();await destination(page,'dialog','모달 · Dialog');
 expect(await page.evaluate(()=>history.length)).toBe(initialLength+1);
 await page.goBack();await destination(page,'button','버튼 · Button');expect(await page.evaluate(()=>history.length)).toBe(initialLength+1);
 await page.goForward();await destination(page,'dialog','모달 · Dialog');expect(await page.evaluate(()=>history.length)).toBe(initialLength+1);
 await page.reload();await destination(page,'dialog','모달 · Dialog');expect(await page.evaluate(()=>history.length)).toBe(initialLength+1);
 await info.attach('history-contract',{body:JSON.stringify(await page.evaluate(()=>({hash:location.hash,length:history.length,title:document.querySelector('main h1')?.textContent,selected:[...document.querySelectorAll('.gallery-component-nav a[aria-current="page"]')].map(node=>node.getAttribute('href'))}))),contentType:'application/json'});
});
test('mobile selection focuses destination after close while Escape restores the opener without navigation',async({page},info)=>{
 test.skip(info.project.name==='desktop-1440'||info.project.name==='tablet-768','mobile navigation at <=700px');
 await page.goto('/#/components/button');await destination(page,'button','버튼 · Button');
 const trigger=page.getByRole('button',{name:'탐색 메뉴 열기 또는 닫기'});await trigger.click();const menu=page.getByRole('dialog',{name:'컴포넌트 탐색',exact:true});await expect(menu).toBeVisible();
 await menu.locator('a[href="#/components/dialog"]').first().click();await expect(menu).toHaveCount(0);await destination(page,'dialog','모달 · Dialog');await settledFocus(page);
 const heading=page.getByRole('heading',{level:1,name:'모달 · Dialog',exact:true});await expect(heading).toBeFocused();expect(await heading.evaluate(node=>document.activeElement===node)).toBe(true);
 await info.attach('mobile-selection-focus',{body:JSON.stringify(await page.evaluate(()=>({hash:location.hash,activeTag:document.activeElement?.tagName,activeText:document.activeElement?.textContent,openDialogCount:document.querySelectorAll('dialog[open]').length}))),contentType:'application/json'});
 await trigger.click();await expect(menu).toBeVisible();await menu.getByRole('searchbox',{name:'컴포넌트 검색'}).focus();const length=await page.evaluate(()=>history.length);await page.keyboard.press('Escape');await expect(menu).toHaveCount(0);await settledFocus(page);
 await expect(trigger).toBeFocused();expect(await trigger.evaluate(node=>document.activeElement===node)).toBe(true);await destination(page,'dialog','모달 · Dialog');expect(await page.evaluate(()=>history.length)).toBe(length);
 await info.attach('mobile-focus-contract',{body:JSON.stringify(await page.evaluate(()=>({hash:location.hash,activeTag:document.activeElement?.tagName,activeName:document.activeElement?.getAttribute('aria-label'),closedMenuFocus:!!document.activeElement?.closest('dialog')}))),contentType:'application/json'});
});
