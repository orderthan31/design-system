import fs from 'node:fs';
import postcss from 'postcss';
import { expect, test } from 'vitest';

test('core import graph contains only scoped component rules and namespaced animations, not gallery resets', () => {
  const files = ['src/core.css','src/generated/scoped-tokens.css','src/default-theme.css','src/components/layout.css','src/components/date-controls.css','src/components/data-display.css','src/components/form-controls.css','src/components/navigation-regions.css','src/components/workspace-templates.css','src/components/text-field.css','src/components/list-row.css','src/components/segmented-control.css','src/components/range-selection.css','src/components/progress-result.css','src/components/bottom-cta.css'];
  const css = files.map(file => fs.readFileSync(file,'utf8')).join('\n');
  expect(fs.readFileSync('src/core.css', 'utf8').match(/@import[^;]+;/g)).toEqual([
    '@import "./generated/scoped-tokens.css";', '@import "./default-theme.css";', '@import "./components/layout.css";', '@import "./components/date-controls.css";', '@import "./components/data-display.css";', '@import "./components/form-controls.css";', '@import "./components/navigation-regions.css";', '@import "./components/workspace-templates.css";', '@import "./components/text-field.css";', '@import "./components/list-row.css";', '@import "./components/segmented-control.css";', '@import "./components/bottom-cta.css";', '@import "./components/range-selection.css";', '@import "./components/progress-result.css";',
  ]);
  const root = postcss.parse(css);
  root.walkRules(rule => {
    if (rule.parent?.type === 'atrule' && /keyframes$/.test(rule.parent.name)) return;
    expect(rule.selectors.every(selector => selector.trim().startsWith('.ds-core')), rule.selector).toBe(true);
  });
  root.walkAtRules('keyframes', rule => expect(rule.params).toMatch(/^ds-core-/));
  expect(css).not.toMatch(/\.sidebar|\.workspace|\.topbar|\.hero|:root/);
});

test('typed icon subset has a scoped responsive visual grid',()=>{expect(fs.readFileSync('src/core.css','utf8')).toContain('.ds-core .ds-icon-grid');});

test('scoped default tokens are exactly the immutable 107-token generated baseline under an opt-in ancestor', () => {
  const baseline = fs.readFileSync('src/generated/tokens.css', 'utf8');
  expect(fs.readFileSync('src/generated/scoped-tokens.css', 'utf8')).toBe(baseline.replace(':root', '.ds-core'));
  expect([...baseline.matchAll(/--[\w-]+:/g)]).toHaveLength(107);
});
