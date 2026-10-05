import React from 'react';
import { expect, test } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

test('기초 문서에서 실제 공통 컴포넌트의 테마를 바꾸고 코어로 복원한다', async () => {
  window.location.hash = '#Foundations';
  const rootBefore = document.documentElement.getAttribute('style');
  render(<App />);
  const gallery = screen.getByRole('region', {name: '테마 라이브러리'});
  const preview = within(gallery).getByRole('region', {name: '범위 한정 테마 미리보기'});
  const field = within(preview).getByRole('textbox', {name: '표시 이름'});
  await userEvent.type(field, '그대로 유지');
  await userEvent.selectOptions(within(gallery).getByRole('combobox', {name: '미리보기 테마'}), 'teal');
  expect(preview).toHaveAttribute('data-ds-theme', 'teal');
  expect(field).toHaveValue('그대로 유지');
  expect(document.documentElement.getAttribute('style')).toBe(rootBefore);
  expect(within(gallery).getByRole('table', {name: '다시 계산한 명암비 조합'})).toBeVisible();
  await userEvent.click(within(gallery).getByRole('button', {name: '기본 코어로 복원'}));
  expect(preview).not.toHaveAttribute('data-ds-theme');
  expect(within(gallery).queryByRole('table')).not.toBeInTheDocument();
});
