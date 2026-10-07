import { createRequire } from 'node:module';
import path from 'node:path';
import { readJSON } from './common.mjs';

// CORE-01 establishes actual installed tooling, not the later consumer lint policy.
export function inspectLint(boundary) {
  const require = createRequire(path.join(boundary.root, 'package.json'));
  return {
    package: boundary.pkg.name,
    version: boundary.pkg.version,
    consumerPolicy: 'pending later S2 task; no consumer files linted',
    dependencies: Object.entries(boundary.pkg.dependencies).map(([name, expected]) => {
      const file = require.resolve(`${name}/package.json`);
      const actual = readJSON(file);
      if (actual.version !== expected) throw Error(`Tool dependency mismatch: ${name}`);
      return { name, version: actual.version, license: actual.license, resolved: true };
    }),
  };
}

export function runLint(args, boundary) {
  if (args.length === 1 && args[0] === 'inspect') {
    console.log(JSON.stringify(inspectLint(boundary), null, 2));
    return 0;
  }
  console.error('CORE-01 supports "hangyeol lint inspect" to inspect installed tooling. Consumer lint policy/execution is not implemented in CORE-01; no lint pass is claimed.');
  return 2;
}
