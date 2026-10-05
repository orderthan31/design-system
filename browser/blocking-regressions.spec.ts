import {test, expect} from '@playwright/test';
import {buildSync} from 'esbuild';

// Compile the real reusable components into a test-only consumer, not product UI.
const consumer = buildSync({
  stdin: {
    contents: `
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import {flushSync} from 'react-dom';
      import {Input} from './src/components/atoms';
      import {Tabs, Menu, Tooltip} from './src/components/navigation';
      const host = document.createElement('div');
      host.id = 'regression-consumer';
      document.body.replaceChildren(host);
      const root = createRoot(host);
      window.renderBusy = (loading) => flushSync(() => root.render(
        <><span id="existing-help">Existing help</span>
        <Input aria-label="Lookup" defaultValue="Original" aria-describedby="existing-help" busyLabel="Checking entry…" loading={loading}/></>
      ));
      window.submissions = 0;
      window.selected = '';
      window.renderForm = () => flushSync(() => root.render(
        <form onSubmit={e => {e.preventDefault(); window.submissions++;}}>
          <Tabs items={[{label:'Preview',content:'Preview panel'},{label:'Code',content:'Code panel'}]}/>
          <Menu label="Options" items={['Archive']} onSelect={value => window.selected = value}/>
          <Tooltip label="Help" text="Helpful detail"/>
        </form>
      ));
    `,
    resolveDir: process.cwd(),
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  define: {'process.env.NODE_ENV': '"production"'},
}).outputFiles[0].text;

async function installConsumer(page: import('@playwright/test').Page) {
  await page.route('**/__blocking-regressions.js', route => route.fulfill({contentType: 'application/javascript', body: consumer}));
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.addScriptTag({url: '/__blocking-regressions.js'});
}

test('Input busy on/off retains the live edited DOM node, focus and selection', async ({page}) => {
  await installConsumer(page);
  await page.evaluate(() => (window as any).renderBusy(false));
  const input = page.getByRole('textbox', {name: 'Lookup'});
  await input.fill('User edited');
  await input.evaluate((node: HTMLInputElement) => {
    (window as any).originalInput = node;
    node.setSelectionRange(2, 5);
  });
  for (const loading of [true, false, true, false]) {
    await page.evaluate(loading => (window as any).renderBusy(loading), loading);
    await expect(input).toHaveValue('User edited');
    await expect(input).toBeFocused();
    await expect(input).toBeEnabled();
    expect(await input.evaluate((node: HTMLInputElement) => ({sameNode: node === (window as any).originalInput, selection: [node.selectionStart, node.selectionEnd]}))).toEqual({sameNode: true, selection: [2, 5]});
    await expect(input).toHaveAccessibleDescription(loading ? 'Existing help Checking entry…' : 'Existing help');
    await expect(page.getByRole('status')).toHaveCount(loading ? 1 : 0);
  }
});

test('Tabs, Menu trigger/items and Tooltip never submit their enclosing form', async ({page}) => {
  await installConsumer(page);
  for (const activation of ['click', 'Enter', 'Space']) {
    for (const control of ['tab', 'menu trigger', 'menu item', 'tooltip']) {
      await page.evaluate(() => (window as any).renderForm());
      let target = control === 'tab' ? page.getByRole('tab', {name: 'Code'})
        : control === 'tooltip' ? page.getByRole('button', {name: 'Help'})
        : page.getByRole('button', {name: 'Options'});
      if (control === 'menu item') {
        await target.focus();
        await page.keyboard.press('ArrowDown');
        target = page.getByRole('menuitem', {name: 'Archive'});
        await expect(target).toBeFocused();
      }
      await expect(target).toHaveAttribute('type', 'button');
      if (activation === 'click') await target.click();
      else { await target.focus(); await page.keyboard.press(activation); }
      expect(await page.evaluate(() => (window as any).submissions)).toBe(0);
      if (control === 'tab') await expect(page.getByRole('tabpanel')).toHaveText('Code panel');
      if (control === 'menu trigger') { await expect(page.getByRole('menu')).toBeVisible(); await page.keyboard.press('Escape'); }
      if (control === 'menu item') expect(await page.evaluate(() => (window as any).selected)).toBe('Archive');
      if (control === 'tooltip') await expect(page.getByRole('tooltip')).toBeVisible();
    }
  }
});

test('malformed initial fragment and hashchanges do not crash documentation', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#%');
  await expect(page.locator('h1')).toContainText('함께 쓰는 언어');
  await page.evaluate(() => {window.location.hash = 'Atoms';});
  await expect(page.locator('h1')).toHaveText('아톰 (Atoms)');
  for (const fragment of ['%', '%E0%A4%A', '%FF', 'NotAPage', 'input', 'main']) {
    await page.evaluate(fragment => new Promise<void>(resolve => {
      window.addEventListener('hashchange', () => resolve(), {once: true});
      window.location.hash = fragment;
    }), fragment);
    await expect(page.locator('h1')).toHaveText('아톰 (Atoms)');
  }
  await page.evaluate(() => {window.location.hash = '%46oundations';});
  await expect(page.locator('h1')).toHaveText('기초 (Foundations)');
  expect(errors).toEqual([]);
});
