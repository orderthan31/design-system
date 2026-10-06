import React from 'react';
import {act, render, screen, within} from '@testing-library/react';
import {afterEach, expect, test} from 'vitest';
import {App} from '../src/App';

afterEach(() => window.history.replaceState(null, '', '/'));

test('initial malformed fragment falls back to Overview without throwing', () => {
  window.history.replaceState(null, '', '/#%');
  expect(() => render(<App/>)).not.toThrow();
  expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('함께 쓰는 언어');
});

test('malformed hashchange preserves the current page and subsequent navigation works', () => {
  window.history.replaceState(null, '', '/#Atoms');
  render(<App/>);
  const errors: string[] = [];
  const record = (event: ErrorEvent) => { errors.push(event.message); event.preventDefault(); };
  window.addEventListener('error', record);
  try {
    for (const fragment of ['%', '%E0%A4%A', '%FF', 'NotAPage', 'input', 'main']) {
      act(() => {
        window.history.replaceState(null, '', `/#${fragment}`);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
      expect(errors).toEqual([]);
      expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('아톰');
    }
    for (const [fragment, label] of [['%46oundations', '기초'], ['Molecules', '몰리큘'], ['Organisms', '오가니즘'], ['Overview', '개요']]) {
      act(() => {
        window.history.replaceState(null, '', `/#${fragment}`);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
      const nav = screen.getByRole('navigation', {name: '문서 탐색'});
      expect(within(nav).getByRole('link', {name: new RegExp(label)})).toHaveAttribute('aria-current', 'page');
    }
  } finally {
    window.removeEventListener('error', record);
  }
});
