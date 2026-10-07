import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

export function inspectTokens(boundary) {
  const file = 'foundation/theme.css';
  if (!boundary.manifest.files[file]) throw Error('Canonical semantic theme is missing from core payload');
  const css = postcss.parse(fs.readFileSync(path.join(boundary.payloadRoot, 'source', file), 'utf8'));
  const declarations = [];
  css.walkDecls(declaration => {
    if (!declaration.prop.startsWith('--')) return;
    const owner = declaration.parent;
    declarations.push({
      name: declaration.prop,
      value: declaration.value,
      scope: owner.type === 'rule' ? owner.selector : `@${owner.name} ${owner.params}`,
    });
  });
  if (!declarations.length) throw Error('Empty semantic token inspection is not a pass');
  return {
    package: boundary.pkg.name,
    version: boundary.pkg.version,
    source: file,
    sourceHash: boundary.manifest.files[file].hash,
    operation: 'read-only inspection of packed canonical declarations',
    declarations,
    deferred: ['consumer token validation', 'token generation or synchronization', 'all-96 execution'],
  };
}

export function runTokens(args, boundary) {
  if (args.length === 1 && args[0] === 'inspect') {
    console.log(JSON.stringify(inspectTokens(boundary), null, 2));
    return 0;
  }
  console.error('CORE-01 supports "hangyeol tokens inspect" only. Consumer token workflows are not implemented in CORE-01; no generation or synchronization was performed.');
  return 2;
}
