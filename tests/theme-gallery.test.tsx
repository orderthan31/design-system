import React from 'react';
import { expect, test } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeGallery } from '../src/components/theme-gallery';
import { themes, themeVariables, textPairs, nonTextPairs } from '../src/themes';

test('generic feedback, inverse and explicit alpha-composite examples report fresh numerical rows', async () => {
  const user = userEvent.setup();
  render(<ThemeGallery />);
  const preview = screen.getByRole('region', {name: '범위 한정 테마 미리보기'});
  expect(within(preview).getByText('정보')).toBeVisible();
  expect(within(preview).getByText('주의')).toBeVisible();
  expect(within(preview).getByText('반전 배경')).toBeVisible();
  expect(within(preview).getByText(/스크림 합성 결과: #9fa2aa/)).toBeVisible();
  const table = screen.getByRole('table', {name: '다시 계산한 명암비 조합'});
  expect(within(table).getAllByRole('row')).toHaveLength(1 + textPairs.length + nonTextPairs.length);
  expect(table).toHaveTextContent('primaryText / primaryDefault');
  await user.selectOptions(screen.getByRole('combobox', {name: '미리보기 테마'}), 'teal');
  expect(table).toHaveTextContent('5.47');
  await user.click(screen.getByRole('button', {name: '기본 코어로 복원'}));
  expect(screen.queryByRole('table', {name: '다시 계산한 명암비 조합'})).not.toBeInTheDocument();
  expect(screen.getByText(/복원한 기본 코어에는 교체 테마의 명암비 검증 결과를 적용하지 않습니다/)).toBeVisible();
});

test('Korean-primary theme switching scopes real nested Button/FormField previews and restores baseline', async () => {
  const user = userEvent.setup();
  const rootBefore = document.documentElement.getAttribute('style');
  render(<><button>Outside control</button><ThemeGallery /></>);
  expect(screen.getByRole('region', {name: '테마 라이브러리'})).toBeVisible();
  const preview = screen.getByRole('region', {name: '범위 한정 테마 미리보기'});
  const select = screen.getByRole('combobox', {name: '미리보기 테마'});
  expect(select).toHaveValue('indigo');
  expect(screen.getByRole('option', {name: '인디고 라이트'})).toBeVisible();
  expect(screen.getByRole('option', {name: '틸 라이트'})).toBeVisible();
  expect(preview).toHaveAttribute('data-ds-theme', 'indigo');
  expect(within(preview).getByLabelText('표시 이름')).toHaveClass('control');
  for (const [label, kind] of [['기본 작업', 'primary'], ['보조 작업', 'secondary'], ['고스트 작업', 'ghost'], ['삭제 작업', 'destructive']]) {
    expect(within(preview).getByRole('button', {name: label})).toHaveClass(kind);
  }
  await user.type(within(preview).getByLabelText('표시 이름'), '한글 sample');
  await user.selectOptions(select, 'teal');
  expect(preview).toHaveAttribute('data-ds-theme', 'teal');
  for (const [key, value] of Object.entries(themeVariables(themes[1]))) expect(preview.style.getPropertyValue(key)).toBe(value);
  expect(within(preview).getByLabelText('표시 이름')).toHaveValue('한글 sample');
  expect(screen.getByRole('button', {name: 'Outside control'}).getAttribute('style')).toBeNull();
  expect(document.documentElement.getAttribute('style')).toBe(rootBefore);
  expect(screen.getByRole('status')).toHaveTextContent('틸 라이트');
  await user.click(screen.getByRole('button', {name: '기본 코어로 복원'}));
  expect(select).toHaveValue('baseline');
  expect(preview).not.toHaveAttribute('data-ds-theme');
  expect(preview.style.getPropertyValue('--button-bg-default')).toBe('');
  expect(screen.getByRole('status')).toHaveTextContent('기본 코어');
});
