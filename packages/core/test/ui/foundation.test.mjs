import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';

const css = fs.readFileSync(new URL('../../src/ui/foundation/theme.css', import.meta.url), 'utf8');
const root = postcss.parse(css);
function declarations(selector) {
  const values = {};
  root.walkRules(selector, rule => {
    for (const node of rule.nodes) if (node.type === 'decl') values[node.prop] = node.value;
  });
  return values;
}
for (const [scheme, selector, role, value] of [
  ['light', '[data-hangyeol]', '--g-canvas', '#F8FAFC'],
  ['light', '[data-hangyeol]', '--g-surface', '#FFFFFF'],
  ['dark', '[data-hangyeol][data-theme="dark"]', '--g-canvas', '#0F172A'],
  ['dark', '[data-hangyeol][data-theme="dark"]', '--g-surface', '#1E293B'],
]) test(`${scheme} default ${role} matches the approved foundation`, () => {
  assert.equal(declarations(selector)[role], value);
});
test('five editable palette patches keep neutral and status ownership with the scoped defaults', () => {
  const palettes = ['Indigo', 'Silver', 'Forest', 'Amber', 'Rose'];
  let count = 0;
  for (const palette of palettes) for (const scheme of ['light', 'dark']) {
    const selector = `[data-hangyeol][data-palette="${palette}"][data-theme="${scheme}"]`;
    let found = false;
    root.walkRules(selector, rule => { found = true; });
    assert.ok(found, selector);
    const patch = declarations(selector);
    for (const key of Object.keys(patch)) assert.ok(['--g-action', '--g-action-hover', '--g-on-action', '--g-focus'].includes(key), key);
    count++;
  }
  assert.equal(count, 10);
  // Changing the surface must not also change the independently owned action contrast.
  assert.equal(declarations('[data-hangyeol]')['--g-on-action'], '#FFFFFF');
});
test('semantic utility aliases remain top-level inline and base rules remain scoped', () => {
  const themes = root.nodes.filter(node => node.type === 'atrule' && node.name === 'theme');
  assert.equal(themes.length, 1);
  assert.equal(themes[0].params, 'inline');
  assert.ok(themes[0].nodes.some(node => node.prop === '--color-g-surface' && node.value === 'var(--g-surface)'));
  root.walkRules(rule => assert.ok(postcss.list.comma(rule.selector).every(selector => selector.trim().startsWith('[data-hangyeol]')), rule.selector));
  assert.doesNotMatch(css, /preflight|\bbody\s*\{/i);
});
