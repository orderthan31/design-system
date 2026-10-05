import React from 'react';
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, Confirm } from '../src/components/organisms';
import { FormField } from '../src/components/molecules';

test('기본 대화상자 닫기 컨트롤은 한국어 접근성 이름과 실제 닫기 동작을 제공한다', async () => {
  let closed = false;
  render(<Dialog open title="검토" onClose={() => { closed = true; }}>본문</Dialog>);
  await userEvent.click(screen.getByRole('button', { name: '대화상자 닫기' }));
  expect(closed).toBe(true);
});
test('기본 확인 대화상자는 한국어 확인과 취소를 제공한다', async () => {
  let confirmed = false;
  let cancelled = false;
  render(<Confirm open title="변경 확인" onConfirm={() => { confirmed = true; }} onClose={() => { cancelled = true; }}>변경 내용을 확인해 주세요.</Confirm>);
  await userEvent.click(screen.getByRole('button', { name: '확인' }));
  expect(confirmed).toBe(true);
  await userEvent.click(screen.getByRole('button', { name: '취소' }));
  expect(cancelled).toBe(true);
});
test('필수 입력은 한국어 안내와 native required 의미를 유지한다', () => {
  render(<FormField label="이름" required />);
  expect(screen.getByLabelText('이름 (필수)')).toBeRequired();
});
