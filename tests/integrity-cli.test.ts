import { test, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
test('원본 무결성 CLI는 개인 경로를 내장하지 않고 기준 경로 입력을 요구한다', () => {
  const env = {...process.env};
  delete env.DS_BASELINE_DIR;
  const result = spawnSync(process.execPath, ['scripts/check-integrity.mjs'], {encoding:'utf8',env});
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Usage: node scripts/check-integrity.mjs <baseline-directory>');
});
