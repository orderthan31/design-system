import React from 'react';
import {render,screen} from '@testing-library/react';
import {test,expect} from 'vitest';
import {App} from '../src/App';
import * as core from '../src/index';

test('four generic public exports are linked to their real canonical details',()=>{
 for(const name of ['Slider','Rating','ProgressStepper','Result'] as const)expect(typeof core[name]).toBe('function');
});
test.each([
 ['slider','슬라이더 · Slider','slider','음량'],
 ['rating','별점 · Rating','group','만족도'],
 ['progress-stepper','단계 진행 · ProgressStepper','list','신청 단계'],
 ['result','결과 · Result','button','다시 시도'],
] as const)('canonical %s renders a live detail rather than a name card',(id,title,role,label)=>{
 window.history.replaceState({},'',`/#/components/${id}`);const {container}=render(<App/>);
 expect(screen.getByRole('heading',{level:1}).textContent).toBe(title);
 expect(screen.getAllByRole(role,{name:new RegExp(label)}).length).toBeGreaterThan(0);
 expect(container.querySelectorAll('.component-detail details[open]')).toHaveLength(0);
});
