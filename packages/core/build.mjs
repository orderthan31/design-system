import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildSlicePayload } from '../../scripts/build-slice-payload.mjs';
import { hash } from '../cli/src/safety.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const target = fileURLToPath(new URL('./', import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(target, 'package.json')));
if (pkg.name !== 'hangyeol-core' || pkg.license !== 'UNLICENSED' || pkg.private !== true) {
  throw Error('CORE-01 package/license boundary requires a private UNLICENSED candidate');
}
const manifest = buildSlicePayload({ packageDir: 'packages/core', writeLegacyRegistry: false });
const provenance = JSON.parse(fs.readFileSync(path.join(target, 'payload/assets/provenance.json')));
if (provenance.license !== 'SIL OFL 1.1' || provenance.unmodified_originals !== true) {
  throw Error('Font license/provenance differs from the inspected unmodified upstream boundary');
}
for (const record of provenance.files) {
  const name = path.basename(record.file);
  if (manifest.assets[name]?.hash !== record.sha256) throw Error(`Font provenance hash mismatch: ${name}`);
}
if (!fs.readFileSync(path.join(target, 'payload/assets/LICENSE'), 'utf8').includes('SIL OPEN FONT LICENSE')) {
  throw Error('Actual font OFL license bytes are missing');
}

const copies = [
  ['packages/core/src/router.mjs', 'dist/router.mjs'],
  ...['common', 'lint', 'tokens'].map(name => [`packages/core/src/tools/${name}.mjs`, `dist/tools/${name}.mjs`]),
  ['packages/cli/src/installer.mjs', 'dist/tools/installer.mjs'],
  ['packages/cli/src/safety.mjs', 'dist/tools/safety.mjs'],
  ['packages/cli/src/host-config.mjs', 'dist/tools/host-config.mjs'],
];
const files = {};
for (const [from, to] of copies) {
  const bytes = fs.readFileSync(path.join(root, from));
  fs.mkdirSync(path.dirname(path.join(target, to)), { recursive: true });
  fs.writeFileSync(path.join(target, to), bytes);
  files[to] = { hash: hash(bytes), bytes: bytes.length, source: from };
}
const bin = 'bin/hangyeol.mjs';
fs.chmodSync(path.join(target, bin), 0o755);
const bytes = fs.readFileSync(path.join(target, bin));
files[bin] = { hash: hash(bytes), bytes: bytes.length, source: 'packages/core/bin/hangyeol.mjs' };
fs.writeFileSync(path.join(target, 'dist/tool-manifest.json'), JSON.stringify({ package: pkg.name, version: pkg.version, files }, null, 2) + '\n');

const require = createRequire(path.join(root, 'package.json'));
const notices = [];
for (const [name, version] of Object.entries(pkg.dependencies)) {
  const metadata = JSON.parse(fs.readFileSync(require.resolve(`${name}/package.json`)));
  if (metadata.version !== version || !metadata.license) throw Error(`Unverified tool dependency/license: ${name}`);
  notices.push(`- ${name} ${metadata.version}: ${metadata.license}. Installed as a dependency; its package retains its own license/notice files.`);
}
fs.writeFileSync(path.join(target, 'THIRD_PARTY_NOTICES.md'), '# Third-party boundaries\n\nUnmodified Pretendard v1.3.9: SIL OFL 1.1. Actual license and upstream provenance are bundled at payload/assets/LICENSE and payload/assets/provenance.json. Historical browser-load statements in that copied provenance are not new CORE-01 verification.\n\n' + notices.join('\n') + '\n\nFirst-party code/UI sources are UNLICENSED. No ownership or new license grant is asserted by this package.\n');
console.error(`Built ${pkg.name}@${pkg.version}: installed router/tools and canonical source/font payload`);
