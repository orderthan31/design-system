import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = process.env.CORE02_EVIDENCE_DIR;
assert.ok(evidence, 'CORE-02 fixtures require explicit designated scratch CORE02_EVIDENCE_DIR');
const payload = path.join(root, 'packages/core/payload');
const manifest = JSON.parse(fs.readFileSync(path.join(payload, 'manifest.json')));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function snapshot(dir, base = dir) {
  const result = {};
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) Object.assign(result, snapshot(filename, base));
    else result[path.relative(base, filename)] = sha(fs.readFileSync(filename));
  }
  return result;
}

test('init rejects existing host base/publicDir conflicts before any file write', () => {
  const host = fs.mkdtempSync(path.join(evidence, 'base-conflict-'));
  fs.writeFileSync(path.join(host, 'package.json'), JSON.stringify({
    name: 'core02-base-conflict-fixture', version: '1.0.0', private: true, type: 'module',
    dependencies: {react: '19.2.0', 'react-dom': '19.2.0', ...manifest.runtime},
    devDependencies: {vite: '7.3.6', ...manifest.build, ...manifest.types},
  }, null, 2));
  fs.writeFileSync(path.join(host, 'vite.config.ts'),
    "import {defineConfig} from 'vite';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({base:'/host-owned/',publicDir:'public',plugins:[tailwindcss()]});\n");
  const before = snapshot(host);
  const args = ['init', '--source-root', 'ui/system', '--style-path', 'styles/theme.css',
    '--public-root', 'static', '--font-path', 'assets/fonts', '--base-path', '/design/'];
  const moduleURL = pathToFileURL(path.join(root, 'packages/core/src/tools/installer.mjs')).href;
  const wrapper = `import {runInstaller} from ${JSON.stringify(moduleURL)}; process.exit(runInstaller(process.argv.slice(1), {payloadRoot:${JSON.stringify(payload)}}));`;
  const started = new Date().toISOString(), start = performance.now();
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', wrapper, ...args],
    {cwd: host, encoding: 'utf8', maxBuffer: 16e6});
  const after = snapshot(host);
  fs.writeFileSync(path.join(evidence, `source-base-conflict-${Date.now()}.json`), JSON.stringify({
    command: [process.execPath, '--input-type=module', '-e', wrapper, ...args],
    cwd: host, started, runtime: process.version, exit: result.status,
    durationMs: Math.round(performance.now() - start), stdout: result.stdout, stderr: result.stderr,
    before, after, fixtureScope: 'source installer regression, not installed-package acceptance',
  }, null, 2));
  assert.equal(result.error, undefined, 'installer subprocess must actually execute');
  assert.notEqual(result.status, 0, 'CORE-02 must reject a host base/publicDir conflict before writes');
  assert.deepEqual(after, before, 'rejected init must preserve the complete host file snapshot');
});
