import React from 'react';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {test,expect} from 'vitest';
import * as core from '../src/index';
import {App} from '../src/App';
test('BottomCTA public exports and canonical detail provide working native form and folded docs',async()=>{
 expect(typeof core.BottomCTA).toBe('function');expect(typeof core.BottomCTARegion).toBe('function');window.history.replaceState({},'', '/#/components/bottom-cta');const {container}=render(<App/>);
 expect(screen.getByRole('heading',{level:1,name:'하단 작업 · BottomCTA'})).toBeVisible();expect(container.querySelectorAll('h1')).toHaveLength(1);
 const input=screen.getByRole('textbox',{name:'신청 제목 (필수)'});await userEvent.type(input,'검토안');await userEvent.click(screen.getByRole('button',{name:'신청하기'}));expect(screen.getByRole('status')).toHaveTextContent('제출: 검토안');
 await userEvent.click(screen.getByRole('button',{name:'취소'}));expect(input).toHaveValue('검토안');expect(screen.getByRole('status')).toHaveTextContent('취소했습니다. 입력 내용은 유지됩니다.');
 expect(container.querySelectorAll('.component-detail details[open]')).toHaveLength(0);expect(screen.getByTitle('고정 하단 작업 독립 예시')).toHaveAttribute('src','/browser/fixtures/bottom-cta.html');
});
