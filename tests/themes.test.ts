import { expect, test } from 'vitest';
import { contrastRatio, compositeColor, themes, themeRoles, themeVariables, assessTheme, textPairs, nonTextPairs, applyTheme, renderThemeCss } from '../src/themes';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

test('theme work preserves the immutable 107-token source and Pretendard baseline', () => {
  const bytes = fs.readFileSync('public/source/tokens/core.json');
  const core = JSON.parse(bytes.toString());
  expect(Object.keys({...core.primitive, ...core.semantic, ...core.component})).toHaveLength(107);
  expect(createHash('sha256').update(bytes).digest('hex')).toBe('b459f1c541d3c2e37190c745e727a4b3c2a755ac395cbd8040e4eb2a972d2d20');
  expect(fs.readFileSync('src/generated/core.json')).toEqual(bytes);
  expect(fs.readFileSync('src/generated/tokens.css', 'utf8')).toContain('--font-family-base: Pretendard;');
  for (const theme of themes) themeVariables(theme);
  expect(fs.readFileSync('public/source/tokens/core.json')).toEqual(bytes);
});

 test('two light palettes completely replace semantic colors, preserve geometry/font/primitives, and recalculate every permitted pair', () => {
  expect(themes.map(theme => theme.id)).toEqual(['indigo', 'teal']);
  expect(themes[0].roles.primaryDefault).not.toBe(themes[1].roles.primaryDefault);
  const baseline = fs.readFileSync('src/generated/tokens.css', 'utf8');
  const baselineColors = [...baseline.matchAll(/--((?:color-(?!palette)|button-|field-|dialog-|empty-|progress-|badge-|alert-)[\w-]+):/g)].map(match => `--${match[1]}`);
  for (const theme of themes) {
    expect(Object.keys(theme.roles).sort()).toEqual([...themeRoles].sort());
    const variables = themeVariables(theme);
    for (const variable of baselineColors) expect(variables).toHaveProperty(variable);
    expect(Object.keys(variables).some(key => /font|space|radius|size|palette/.test(key))).toBe(false);
    const rows = assessTheme(theme);
    expect(new Set(rows.map(row => `${row.kind}:${row.foreground}/${row.background}`)).size).toBe(rows.length);
    expect(rows).toHaveLength(textPairs.length + nonTextPairs.length);
    expect(rows.filter(row => row.kind === 'text').length).toBeGreaterThan(40);
    expect(rows.filter(row => row.kind === 'nontext').length).toBeGreaterThan(10);
    for (const row of rows) {
      expect(row.ratio, `${theme.id}: ${row.foreground}/${row.background}`).toBeGreaterThanOrEqual(row.kind === 'text' ? 4.5 : 3);
      expect(row.ratio).toBe(contrastRatio(theme.roles[row.foreground], theme.roles[row.background]));
    }
    expect(variables['--button-fg']).toBe(theme.roles.primaryText);
    expect(variables['--color-link']).toBe(theme.roles.ghostText);
    expect(variables['--color-status-error-fg']).toBe(theme.roles.destructiveSurface);
    expect(variables['--field-description']).toBe(theme.roles.mutedText);
    expect(variables['--color-info-surface']).toBe(theme.roles.infoSurface);
    expect(variables['--color-warning-text']).toBe(theme.roles.warningText);
    expect(variables['--color-scrim']).toBe(theme.roles.scrim);
  }
  const changed = {...themes[0], roles: {...themes[0].roles, primaryDefault: '#ffffff' as const}};
  expect(assessTheme(changed).find(row => row.foreground === 'primaryText' && row.background === 'primaryDefault')?.ratio).toBe(1);
});

test('scoped override restores exact prior inline values and leaves root and siblings untouched', () => {
  const scope = document.createElement('section'), sibling = document.createElement('section');
  document.body.append(scope, sibling);
  scope.style.setProperty('--button-bg-default', '#123456', 'important');
  // jsdom drops !important on custom properties; compare the actual prior priority.
  const priorPriority = scope.style.getPropertyPriority('--button-bg-default');
  scope.style.setProperty('--unrelated', 'keep');
  scope.setAttribute('data-ds-theme', 'prior');
  const rootBefore = document.documentElement.getAttribute('style');
  const restore = applyTheme(scope, themes[1]);
  expect(scope.style.getPropertyValue('--button-bg-default')).toBe('#0f766e');
  expect(scope.getAttribute('data-ds-theme')).toBe('teal');
  expect(sibling.getAttribute('style')).toBeNull();
  expect(document.documentElement.getAttribute('style')).toBe(rootBefore);
  restore(); restore();
  expect(scope.style.getPropertyValue('--button-bg-default')).toBe('#123456');
  expect(scope.style.getPropertyPriority('--button-bg-default')).toBe(priorPriority);
  expect(scope.style.getPropertyValue('--color-info-text')).toBe('');
  expect(scope.style.getPropertyValue('--unrelated')).toBe('keep');
  expect(scope.getAttribute('data-ds-theme')).toBe('prior');
  expect(() => applyTheme(document.body, themes[0])).toThrow(/scope/i);
  scope.remove(); sibling.remove();
});

test('generated stylesheet exactly matches the module and is scoped without root or typography overrides', () => {
  const css = renderThemeCss();
  expect(fs.readFileSync('src/theme-roles.css', 'utf8')).toBe(css);
  expect(css).toContain('[data-ds-theme="indigo"]');
  expect(css).toContain('[data-ds-theme="teal"]');
  expect(css).not.toMatch(/:root|font-family|--space|--color-palette/);
  for (const theme of themes) for (const [key, value] of Object.entries(themeVariables(theme))) expect(css).toContain(`${key}: ${value};`);
});

test('replacement rejects unsupported alias divergence and failing contrast before mutation', () => {
  const scope = document.createElement('section');
  const mismatched = {...themes[0], roles: {...themes[0].roles, secondarySurface: '#fffbeb' as const}};
  expect(() => applyTheme(scope, mismatched)).toThrow(/secondarySurface/);
  const unreadable = {...themes[0], roles: {...themes[0].roles, primaryDefault: '#ffffff' as const}};
  expect(() => applyTheme(scope, unreadable)).toThrow(/contrast/i);
  expect(scope.getAttribute('style')).toBeNull();
  expect(scope.hasAttribute('data-ds-theme')).toBe(false);
  const missingScrim = {...themes[0], roles: {...themes[0].roles, scrim: '#nope' as const}};
  expect(() => themeVariables(missingScrim)).toThrow(/hex/i);
});

test('opaque sRGB contrast is symmetric and uses full precision', () => {
  expect(contrastRatio('#000000', '#ffffff')).toBe(21);
  expect(contrastRatio('#ffffff', '#000000')).toBe(21);
  expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
  expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.4780894536, 9);
  expect(contrastRatio('#777777', '#ffffff')).toBeLessThan(4.5);
});

test('alpha must be explicitly composited over an opaque backdrop', () => {
  expect(compositeColor('#00000080', '#ffffff')).toBe('#7f7f7f');
  expect(compositeColor('#0f172a66', '#ffffff')).toBe('#9fa2aa');
  expect(() => contrastRatio('#00000080', '#ffffff')).toThrow(/opaque/i);
  expect(() => contrastRatio('red', '#ffffff')).toThrow(/hex/i);
  expect(() => compositeColor('#00000080', '#ffffff80')).toThrow(/opaque/i);
});
