import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
test('document declares Korean language and Korean-first title', () => {
  const html = readFileSync('index.html', 'utf8');
  expect(html).toContain('<html lang="ko">');
  expect(html).toContain('<title>Common — 공유 디자인 시스템</title>');
});
