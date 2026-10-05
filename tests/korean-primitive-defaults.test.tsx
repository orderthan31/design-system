import React from 'react';
import {test, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Input} from '../src/components/atoms';
import {Tabs, Menu} from '../src/components/navigation';
import {EmptyState} from '../src/components/feedback';
import {Progress, Skeleton} from '../src/components/primitives';

test('busy 입력의 기본 안내는 한국어이고 상태와 설명이 연결된다', () => {
  render(<Input loading aria-label="이름" />);
  expect(screen.getByRole('textbox')).toHaveAccessibleDescription('입력 확인 중…');
  expect(screen.getByRole('status')).toHaveTextContent('입력 확인 중…');
});
test('기본 탭 묶음은 한국어 접근성 이름을 제공한다', () => {
  render(<Tabs items={[{label:'미리보기',content:'본문'}]} />);
  expect(screen.getByRole('tablist', {name:'보기 전환'})).toBeVisible();
});
test('기본 메뉴의 한국어 항목 선택은 여전히 소비자 콜백을 호출한다', async () => {
  let selected='';
  render(<Menu onSelect={value=>{selected=value;}} />);
  await userEvent.click(screen.getByRole('button',{name:'작업 메뉴'}));
  await userEvent.click(screen.getByRole('menuitem',{name:'복제'}));
  expect(selected).toBe('복제');
});
test('빈 상태의 기본 작업은 한국어로 표시한다', () => {
  render(<EmptyState title="비어 있음">안내</EmptyState>);
  expect(screen.getByRole('button',{name:'항목 추가'})).toBeVisible();
});
test('진행 상태의 기본 레이블과 불확정 안내는 한국어이다', () => {
  render(<Progress />);
  expect(screen.getByRole('progressbar',{name:'진행률'})).toBeVisible();
  expect(screen.getByText('진행 중')).toBeVisible();
});
test('스켈레톤의 기본 읽기 안내는 한국어이다', () => {
  render(<Skeleton />);
  expect(screen.getByRole('status')).toHaveTextContent('콘텐츠 불러오는 중');
});
