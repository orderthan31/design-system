import React from 'react';
import {fireEvent,render,screen,within} from '@testing-library/react';
import {expect,test} from 'vitest';
import * as core from '../src/index';
import {SegmentedDetail} from '../src/gallery/segmented-detail';

test('public segmented selection has real filtering and native form submission with folded docs',()=>{
 expect(typeof core.SegmentedControl).toBe('function');render(<SegmentedDetail/>);
 expect(screen.getByRole('list',{name:'범위별 항목'}).children).toHaveLength(3);
 fireEvent.click(within(screen.getByRole('group',{name:'검토 범위'})).getByRole('radio',{name:'준비 완료'}));
 expect(screen.getByRole('list',{name:'범위별 항목'}).children).toHaveLength(2);
 const form=screen.getByRole('form',{name:'네이티브 제출 예시'}) as HTMLFormElement;
 expect(form.checkValidity()).toBe(false);
 fireEvent.click(screen.getByRole('radio',{name:'자세히'}));
 fireEvent.click(screen.getByRole('button',{name:'선택 제출'}));
 expect(screen.getByRole('status',{name:'제출 결과'}).textContent).toContain('자세히');
 expect(form.checkValidity()).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'선택 초기화'}));expect(form.checkValidity()).toBe(false);
 expect(document.querySelectorAll('details[open]')).toHaveLength(0);
 expect(screen.queryByRole('heading',{level:1})).toBeNull();
});
