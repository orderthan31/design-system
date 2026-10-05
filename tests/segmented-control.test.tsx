import React from 'react';
import {fireEvent,render,screen} from '@testing-library/react';
import {expect,test,vi} from 'vitest';
import fs from 'node:fs';
import {SegmentedControl} from '../src/components/segmented-control';
const options=[{value:'all',label:'전체'},{value:'ready',label:'준비'},{value:'blocked',label:'제외',disabled:true}];

test('native labelled group preserves uncontrolled FormData, required validity and form reset',()=>{
 const changed=vi.fn();const {container}=render(<form><SegmentedControl label="목록 범위" name="scope" options={options} required onValueChange={changed}/><button type="reset">초기화</button></form>);
 const form=container.querySelector('form')!;
 expect(screen.getByRole('group',{name:'목록 범위'})).toBeTruthy();
 expect(form.checkValidity()).toBe(false);
 fireEvent.click(screen.getByRole('radio',{name:'준비'}));
 expect(new FormData(form).get('scope')).toBe('ready');expect(form.checkValidity()).toBe(true);
 expect(changed).toHaveBeenCalledTimes(1);expect(changed.mock.calls[0][0]).toBe('ready');
 fireEvent.click(screen.getByRole('button',{name:'초기화'}));
 expect(new FormData(form).has('scope')).toBe(false);
});

test('controlled owner may reject changes, accepting props updates uses the same native node',()=>{
 const changed=vi.fn();const {container,rerender}=render(<form><SegmentedControl label="범위" name="scope" options={options} value="all" onValueChange={changed}/></form>);
 const ready=screen.getByRole('radio',{name:'준비'});fireEvent.click(ready);
 expect(changed.mock.calls[0][0]).toBe('ready');expect((screen.getByRole('radio',{name:'전체'}) as HTMLInputElement).checked).toBe(true);
 expect(new FormData(container.querySelector('form')!).get('scope')).toBe('all');
 rerender(<form><SegmentedControl label="범위" name="scope" options={options} value="ready" onValueChange={changed}/></form>);
 expect(screen.getByRole('radio',{name:'준비'})).toBe(ready);expect((ready as HTMLInputElement).checked).toBe(true);
});

test('native default reset and option disabled preserve the group form contract',()=>{
 const changed=vi.fn();const {container}=render(<form><SegmentedControl label="범위" name="scope" options={options} defaultValue="all" onValueChange={changed}/><button type="reset">초기화</button></form>);
 const blocked=screen.getByRole('radio',{name:'제외'}) as HTMLInputElement;expect(blocked.disabled).toBe(true);
 fireEvent.click(screen.getByRole('radio',{name:'준비'}));fireEvent.click(screen.getByRole('button',{name:'초기화'}));
 expect(new FormData(container.querySelector('form')!).get('scope')).toBe('all');
});

test('a disabled ancestor excludes values and retains edits across rerenders',()=>{
 const {container,rerender}=render(<form><fieldset disabled><SegmentedControl label="잠긴 범위" name="scope" options={options} defaultValue="ready"/></fieldset></form>);
 expect((screen.getByRole('radio',{name:'준비'}) as HTMLInputElement).matches(':disabled')).toBe(true);
 expect(new FormData(container.querySelector('form')!).has('scope')).toBe(false);
 rerender(<form><fieldset><SegmentedControl label="잠긴 범위" name="scope" options={options} defaultValue="ready"/></fieldset></form>);
 expect(new FormData(container.querySelector('form')!).get('scope')).toBe('ready');
});

test('unique unnamed native groups and external/help/error descriptions stay associated',()=>{
 render(<><p id="external">서비스 안내</p><SegmentedControl label="첫 범위" options={options} description="범위를 고르세요" error="선택이 필요합니다" aria-describedby="external"/><SegmentedControl label="다른 범위" options={options}/></>);
 const groups=screen.getAllByRole('group');const first=groups[0].querySelector('input')!,second=groups[1].querySelector('input')!;
 expect(first.name).not.toBe(second.name);expect(first.id).not.toBe(second.id);
 const ids=first.getAttribute('aria-describedby')!.split(' ');expect(ids).toHaveLength(3);
 expect(ids.map(id=>document.getElementById(id)!.textContent)).toEqual(['서비스 안내','범위를 고르세요','선택이 필요합니다']);
 expect(first.getAttribute('aria-invalid')).toBe('true');expect(screen.getByRole('alert').textContent).toBe('선택이 필요합니다');
});

test('selection includes a non-color decorative check without changing radio names',()=>{
 render(<SegmentedControl label="범위" options={options} value="all"/>);
 const checked=screen.getByRole('radio',{name:'전체'});
 const mark=checked.closest('label')!.querySelector('[data-segmented-mark]');
 expect(mark?.textContent).toBe('✓');expect(mark?.getAttribute('aria-hidden')).toBe('true');
});

test('segmented style keeps selected, focus, native disabled and host isolation explicit',()=>{
 const css=fs.readFileSync('src/components/segmented-control.css','utf8');
 expect(css).toContain('.ds-core .ds-segmented-option:has(input:checked)');
 expect(css).toContain('input:focus-visible');expect(css).toContain('input:disabled');
 expect(css).not.toMatch(/:root|position:\s*fixed/);
});
