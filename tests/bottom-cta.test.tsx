import React from 'react';
import {render,screen,fireEvent,act} from '@testing-library/react';
import {test,expect,vi,afterEach} from 'vitest';
import {BottomCTA,BottomCTARegion} from '../src/components/bottom-cta';
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();});
test('single/double reuse independently named native safe buttons with ordered accessories',()=>{
 const {container}=render(<BottomCTA topAccessory={<p>상단 안내</p>} bottomAccessory={<p>하단 안내</p>} label="신청 작업" actions={[{children:'취소'},{children:'신청',type:'submit',form:'apply',name:'intent',value:'apply',variant:'destructive'}]}/>);
 expect(screen.getByRole('group',{name:'신청 작업'})).toBeVisible();expect(screen.getByRole('button',{name:'취소'})).toHaveAttribute('type','button');expect(screen.getByRole('button',{name:'취소'})).toHaveClass('secondary');
 const submit=screen.getByRole('button',{name:'신청'});expect(submit).toHaveAttribute('type','submit');expect(submit).toHaveAttribute('form','apply');expect(submit).toHaveAttribute('name','intent');expect(submit).toHaveAttribute('value','apply');expect(submit).toHaveClass('destructive');
 expect(container.textContent).toBe('상단 안내취소신청하단 안내');expect(container.querySelector('[data-bottom-cta-panel]')).toHaveAttribute('data-placement','flow');expect(container.querySelector('[data-bottom-cta-spacer]')).toBeNull();
});
test('external native submit carries fields and busy action does not submit or affect sibling identity',()=>{
 const submitted=vi.fn(e=>e.preventDefault());const cancelled=vi.fn();const view=(busy:boolean)=><><form id="apply" onSubmit={submitted}><input name="title" aria-label="제목" required defaultValue="초안"/></form><BottomCTA actions={[{children:'취소',onClick:cancelled},{children:'신청',type:'submit',form:'apply',loading:busy}]}/></>;
 const {container,rerender}=render(view(false));const input=screen.getByRole('textbox');const submit=screen.getByRole('button',{name:'신청'});fireEvent.click(screen.getByRole('button',{name:'취소'}));expect(cancelled).toHaveBeenCalledTimes(1);expect(submitted).not.toHaveBeenCalled();fireEvent.click(submit);expect(submitted).toHaveBeenCalledTimes(1);expect(new FormData(container.querySelector('form')!).get('title')).toBe('초안');
 rerender(view(true));expect(screen.getByRole('button',{name:'신청'})).toBe(submit);expect(screen.getByRole('textbox')).toBe(input);expect(submit).toHaveAttribute('aria-busy','true');fireEvent.click(submit);expect(submitted).toHaveBeenCalledTimes(1);expect(screen.getByRole('button',{name:'취소'})).not.toBeDisabled();
});
test('fixed requires explicit region, dynamically reserves measured border-box and cleans observer',()=>{
 expect(()=>render(<BottomCTA placement="fixed" actions={[{children:'확인'}]}/>)).toThrow(/BottomCTARegion/);
 let resize:ResizeObserverCallback=()=>{};const disconnect=vi.fn(),observe=vi.fn();vi.stubGlobal('ResizeObserver',class{constructor(cb:ResizeObserverCallback){resize=cb;}observe=observe;disconnect=disconnect;unobserve(){} });
 let height=100;vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){return {height:this.hasAttribute('data-bottom-cta-panel')?height:0,width:320,x:0,y:0,top:0,bottom:height,left:0,right:320,toJSON(){}} as DOMRect;});
 const {container,unmount}=render(<BottomCTARegion cta={<BottomCTA placement="fixed" actions={[{children:'확인'}]}/>}><p>마지막 본문</p></BottomCTARegion>);
 expect(container.querySelector('[data-bottom-cta-panel]')).toHaveAttribute('data-placement','fixed');expect(container.querySelector('[data-bottom-cta-spacer]')).toHaveAttribute('aria-hidden','true');expect(container.querySelector('[data-bottom-cta-region]')?.getAttribute('style')).toContain('--ds-bottom-cta-height: 100px');
 height=170;act(()=>resize([],{} as ResizeObserver));expect(container.querySelector('[data-bottom-cta-region]')?.getAttribute('style')).toContain('--ds-bottom-cta-height: 170px');expect(observe).toHaveBeenCalledWith(container.querySelector('[data-bottom-cta-panel]'),{box:'border-box'});unmount();expect(disconnect).toHaveBeenCalled();vi.unstubAllGlobals();
});
test('rejected border-box observation falls back to flow and disconnects without crashing',()=>{
 const disconnect=vi.fn();vi.stubGlobal('ResizeObserver',class{observe(){throw new TypeError('unsupported box');}disconnect=disconnect;unobserve(){} });
 const {container}=render(<BottomCTARegion cta={<BottomCTA placement="fixed" actions={[{children:'확인'}]}/>}><p>본문</p></BottomCTARegion>);
 expect(container.querySelector('[data-bottom-cta-panel]')).toHaveAttribute('data-placement','flow');expect(container.querySelector('[data-bottom-cta-spacer]')).toBeNull();expect(disconnect).toHaveBeenCalled();
});
test('missing ResizeObserver honestly falls back to flow without reserved space',()=>{
 vi.stubGlobal('ResizeObserver',undefined);const {container}=render(<BottomCTARegion cta={<BottomCTA placement="fixed" actions={[{children:'확인'}]}/>}><p>본문</p></BottomCTARegion>);expect(container.querySelector('[data-bottom-cta-panel]')).toHaveAttribute('data-placement','flow');expect(container.querySelector('[data-bottom-cta-spacer]')).toBeNull();vi.unstubAllGlobals();
});
