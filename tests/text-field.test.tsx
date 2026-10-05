import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { TextField } from '../src/components/text-field';
import { Button } from '../src/components/atoms';
import { InputDetail } from '../src/gallery/input-detail';
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'postcss';

test('보이는 라벨, 필수, 도움말, 오류와 외부 설명을 네이티브 입력에 연결한다', () => {
  render(<><p id="external">외부 설명</p><TextField label="이메일" id="email" name="email" type="email" required description="업무용 주소" error="주소를 확인해 주세요" aria-describedby="external" defaultValue="a@example.kr" /></>);
  const input = screen.getByRole('textbox', { name: '이메일 (필수)' });
  expect(input).toHaveAttribute('id', 'email');
  expect(input).toHaveAttribute('type', 'email');
  expect(input).toBeRequired();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('외부 설명 업무용 주소 주소를 확인해 주세요');
  expect(screen.getByRole('alert')).toHaveTextContent('주소를 확인해 주세요');
});

test('앞뒤 장식과 후행 동작은 속성이 아니라 독립된 요소로 렌더링한다', () => {
  const action = vi.fn();
  const { container } = render(<TextField label="금액" prefix={<span>₩</span>} suffix={<span>원</span>} trailingAction={<Button onClick={action}>적용</Button>} />);
  expect(screen.getByText('₩')).toBeInTheDocument();
  expect(screen.getByText('원')).toBeInTheDocument();
  const input = screen.getByRole('textbox', { name: '금액' });
  expect(input).not.toHaveAttribute('prefix');
  expect(input).not.toHaveAttribute('suffix');
  expect(input).not.toHaveAttribute('trailingAction');
  expect(container.querySelector('button button')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '적용' }));
  expect(action).toHaveBeenCalledOnce();
});

test('지우기는 네이티브 onChange와 FormData를 갱신하고 제출 없이 입력 초점을 복원한다', () => {
  const changed = vi.fn();
  const submitted = vi.fn((event: React.FormEvent) => event.preventDefault());
  render(<form aria-label="입력 폼" onSubmit={submitted}><TextField label="검색" name="query" defaultValue="초기 값" clearable onChange={event => changed(event.currentTarget.value)} /></form>);
  const input = screen.getByRole('textbox', { name: '검색' });
  fireEvent.change(input, { target: { value: '수정 값' } });
  expect(changed).toHaveBeenLastCalledWith('수정 값');
  const clear = screen.getByRole('button', { name: '입력 지우기' });
  expect(clear).toHaveAttribute('type', 'button');
  clear.focus();
  fireEvent.click(clear);
  expect(input).toHaveValue('');
  expect(changed).toHaveBeenLastCalledWith('');
  expect(changed).toHaveBeenCalledTimes(2);
  expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('query')).toBe('');
  expect(input).toHaveFocus();
  expect(submitted).not.toHaveBeenCalled();
});

test('제어형 입력은 소유자가 수락한 변경만 유지한다', () => {
  const changed = vi.fn();
  const { rerender } = render(<TextField label="코드" value="유지" clearable onChange={event => changed(event.currentTarget.value)} />);
  const input = screen.getByRole('textbox', { name: '코드' });
  fireEvent.change(input, { target: { value: '거절' } });
  expect(changed).toHaveBeenLastCalledWith('거절');
  expect(input).toHaveValue('유지');
  fireEvent.click(screen.getByRole('button', { name: '입력 지우기' }));
  expect(changed).toHaveBeenLastCalledWith('');
  expect(input).toHaveValue('유지');
  expect(input).toHaveFocus();
  rerender(<TextField label="코드" value="수락" clearable onChange={event => changed(event.currentTarget.value)} />);
  expect(input).toHaveValue('수락');
});

test.each(['disabled', 'readOnly'] as const)('%s 입력은 지우기로 우회할 수 없다', mode => {
  const changed = vi.fn();
  render(<TextField label="보호" defaultValue="유지" clearable {...{ [mode]: true }} onChange={changed} />);
  const input = screen.getByRole('textbox', { name: '보호' });
  const clear = screen.getByRole('button', { name: '입력 지우기' });
  expect(clear).toBeDisabled();
  fireEvent.click(clear);
  expect(input).toHaveValue('유지');
  expect(changed).not.toHaveBeenCalled();
  expect(input).toHaveAttribute(mode === 'readOnly' ? 'readonly' : 'disabled');
});

test('상위 fieldset의 비활성을 지우기로 우회하지 않는다', () => {
  const changed = vi.fn();
  render(<fieldset disabled><TextField label="상위 보호" defaultValue="보존" clearable onChange={changed} /></fieldset>);
  fireEvent.click(screen.getByRole('button', { name: '입력 지우기' }));
  expect(screen.getByRole('textbox', { name: '상위 보호' })).toHaveValue('보존');
  expect(changed).not.toHaveBeenCalled();
});

test('확인 중에도 비제어 입력의 노드, 편집값, 초점, 선택 영역을 보존한다', () => {
  const props = { label: '이름', defaultValue: '원래 값', description: '표시할 이름', busyLabel: '중복 확인 중', clearable: true };
  const { rerender } = render(<TextField {...props} />);
  const input = screen.getByRole('textbox', { name: '이름' }) as HTMLInputElement;
  input.focus();
  fireEvent.change(input, { target: { value: '사용자 편집' } });
  input.setSelectionRange(1, 3);
  for (const loading of [true, false, true, false]) {
    rerender(<TextField {...props} loading={loading} />);
    expect(screen.getByRole('textbox', { name: '이름' })).toBe(input);
    expect(input).toHaveValue('사용자 편집');
    expect(input).toHaveFocus();
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 3]);
    expect(input).not.toBeDisabled();
    expect(input).toHaveAccessibleDescription(loading ? '표시할 이름 중복 확인 중' : '표시할 이름');
    if (loading) expect(screen.getByRole('status')).toHaveTextContent('중복 확인 중');
    else expect(screen.queryByRole('status')).not.toBeInTheDocument();
  }
});

test('호출자가 제공한 오류 의미를 오류 문구 없이도 보존한다', () => {
  render(<TextField label="서버 결과" aria-invalid="grammar" />);
  expect(screen.getByRole('textbox', { name: '서버 결과' })).toHaveAttribute('aria-invalid', 'grammar');
});

test('앞 장식에 입력이 있어도 지우기는 해당 TextField 입력만 대상으로 삼는다', () => {
  render(<TextField label="본문" defaultValue="지울 값" clearable prefix={<input aria-label="장식 입력" defaultValue="보존" />} />);
  fireEvent.click(screen.getByRole('button', { name: '입력 지우기' }));
  expect(screen.getByRole('textbox', { name: '본문' })).toHaveValue('');
  expect(screen.getByRole('textbox', { name: '장식 입력' })).toHaveValue('보존');
});

test('상세 페이지는 실제 입력 유형, 상태, 장식, 기존 비밀번호 입력과 접힌 문서를 제공한다', () => {
  const { container } = render(<InputDetail />);
  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: '이름 (필수)' })).toBeRequired();
  expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('type', 'email');
  expect(screen.getByRole('textbox', { name: '전화번호' })).toHaveAttribute('type', 'tel');
  expect(screen.getByRole('textbox', { name: '웹사이트' })).toHaveAttribute('type', 'url');
  expect(screen.getByRole('searchbox', { name: '검색어' })).toBeInTheDocument();
  expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'password');
  fireEvent.click(screen.getByRole('button', { name: '비밀번호 표시' }));
  expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'text');
  expect(screen.getByRole('textbox', { name: '비활성' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: '읽기 전용' })).toHaveAttribute('readonly');
  expect(screen.getByRole('textbox', { name: '금액' })).toBeInTheDocument();
  const details = Array.from(container.querySelectorAll('details'));
  expect(details).toHaveLength(3);
  expect(details.every(detail => !detail.open)).toBe(true);
  expect(screen.getByText('사용 코드')).toBeInTheDocument();
  expect(screen.getByText('속성', { selector: 'summary' })).toBeInTheDocument();
  expect(screen.getByText('조합과 접근성')).toBeInTheDocument();
});

test('상세 페이지 이메일 검증은 오류를 연결하고 수정 및 지우기에 결과를 초기화한다', () => {
  render(<InputDetail />);
  const input = screen.getByRole('textbox', { name: '검증 이메일' });
  fireEvent.change(input, { target: { value: 'invalid' } });
  fireEvent.click(screen.getByRole('button', { name: '검증' }));
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('이메일 형식을 확인해 주세요.');
  fireEvent.change(input, { target: { value: 'hello@example.kr' } });
  expect(input).not.toHaveAttribute('aria-invalid');
  fireEvent.click(screen.getByRole('button', { name: '검증' }));
  expect(screen.getByRole('status')).toHaveTextContent('이메일 형식이 올바릅니다.');
  fireEvent.click(screen.getByRole('button', { name: '검증 이메일 지우기' }));
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('스타일은 ds-core로 제한하고 좁은 컨테이너에서 자동으로 한 열이 된다', () => {
  const path = 'src/components/text-field.css';
  expect(existsSync(path)).toBe(true);
  const css = readFileSync(path, 'utf8');
  let rules = 0;
  parse(css).walkRules(rule => {
    rules++;
    for (const selector of rule.selectors) expect(selector.startsWith('.ds-core ')).toBe(true);
  });
  expect(rules).toBeGreaterThan(0);
  expect(css).toContain('repeat(auto-fit, minmax(min(100%, 280px), 1fr))');
  expect(css).toContain('min-width: 0');
  expect(css).toContain('overflow-x: auto');
  expect(readFileSync('src/components/text-field.tsx', 'utf8')).toContain("import './text-field.css'");
});

test('상세 문서는 실제 import와 슬롯 타입, 기본값, 소유자 책임을 설명한다', () => {
  const { container } = render(<InputDetail />);
  const text = Array.from(container.querySelectorAll('details')).map(detail => detail.textContent).join('\n');
  expect(text).toContain("import { Button } from './components/atoms'");
  expect(text).toContain("import { PasswordInput } from './components/form-controls'");
  expect(text).toContain('React.ReactNode');
  expect(text).toContain('clearable');
  expect(text).toContain('false');
  expect(text).toContain('입력 확인 중…');
  expect(text).toContain('type="button"');
  expect(text).toContain('소유자');
  expect(text).toContain('서버');
  expect(container.querySelector('table caption')).toHaveTextContent('TextField 속성');
});

test('상세 페이지 확인 중 전환은 편집 가능한 입력을 유지한다', () => {
  render(<InputDetail />);
  const input = screen.getByRole('textbox', { name: '닉네임' });
  fireEvent.change(input, { target: { value: '편집 중' } });
  fireEvent.click(screen.getByRole('button', { name: '확인 시작' }));
  expect(screen.getByRole('status')).toHaveTextContent('닉네임 확인 중…');
  expect(input).toHaveAttribute('aria-busy', 'true');
  expect(input).not.toBeDisabled();
  fireEvent.change(input, { target: { value: '계속 편집' } });
  fireEvent.click(screen.getByRole('button', { name: '확인 종료' }));
  expect(screen.getByRole('textbox', { name: '닉네임' })).toBe(input);
  expect(input).toHaveValue('계속 편집');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});
