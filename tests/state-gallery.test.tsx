import React from 'react';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {test,expect} from 'vitest';
import {StateGallery} from '../src/components/state-gallery';
test('Korean button gallery preserves all kinds, sizes, busy and disabled states',async()=>{
  render(<StateGallery/>);
  expect(screen.getAllByRole('button')).toHaveLength(36);
  expect(screen.getAllByRole('button').filter(b=>b.getAttribute('aria-busy')==='true')).toHaveLength(12);
  expect(screen.getAllByRole('button').filter(b=>(b as HTMLButtonElement).disabled)).toHaveLength(12);
  expect(screen.getByRole('textbox',{name:'처리 중 입력 예시'})).toHaveAttribute('aria-busy','true');
  await userEvent.click(screen.getAllByRole('button',{name:'기본'})[0]);
  expect(screen.getByText('주요 동작 · 작게 선택됨. 제품 동작은 실행하지 않았습니다.')).toHaveAttribute('role','status');
});
