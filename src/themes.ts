export const themeRoles = [
  'surface', 'canvas', 'subtle', 'text', 'secondaryText', 'mutedText', 'inverseSurface', 'inverseText',
  'controlBorder', 'subtleBorder', 'focus', 'primaryDefault', 'primaryHover', 'primaryPressed', 'primaryText',
  'secondarySurface', 'secondaryHover', 'secondaryPressed', 'secondaryActionText', 'ghostSurface', 'ghostHover', 'ghostPressed', 'ghostText',
  'destructiveSurface', 'destructiveHover', 'destructivePressed', 'destructiveText', 'selectedSurface', 'selectedText',
  'infoSurface', 'infoText', 'warningSurface', 'warningText', 'successSurface', 'successText',
  'errorSurface', 'errorText', 'neutralSurface', 'neutralText', 'disabledSurface', 'disabledText', 'scrim',
] as const;
export type ThemeRole = typeof themeRoles[number];
export type ThemeId = 'slate' | 'indigo' | 'teal';
export interface Theme { readonly id: ThemeId; readonly label: string; readonly roles: Readonly<Record<ThemeRole, HexColor>> }
const neutral: Record<ThemeRole, HexColor> = {
  surface: '#ffffff', canvas: '#f8fafc', subtle: '#f1f5f9', text: '#0f172a', secondaryText: '#475569', mutedText: '#475569',
  inverseSurface: '#0f172a', inverseText: '#ffffff', controlBorder: '#64748b', subtleBorder: '#e2e8f0', focus: '#3730a3',
  primaryDefault: '#4338ca', primaryHover: '#3730a3', primaryPressed: '#312e81', primaryText: '#ffffff',
  secondarySurface: '#ffffff', secondaryHover: '#f1f5f9', secondaryPressed: '#eef2ff', secondaryActionText: '#0f172a',
  ghostSurface: '#ffffff', ghostHover: '#eef2ff', ghostPressed: '#e0e7ff', ghostText: '#3730a3',
  destructiveSurface: '#b91c1c', destructiveHover: '#991b1b', destructivePressed: '#7f1d1d', destructiveText: '#ffffff', selectedSurface: '#eef2ff', selectedText: '#3730a3',
  infoSurface: '#eff6ff', infoText: '#1e40af', warningSurface: '#fffbeb', warningText: '#92400e',
  successSurface: '#f0fdf4', successText: '#166534', errorSurface: '#fef2f2', errorText: '#b91c1c',
  neutralSurface: '#f1f5f9', neutralText: '#475569', disabledSurface: '#f1f5f9', disabledText: '#475569', scrim: '#0f172a66',
};
export const themes: readonly Theme[] = Object.freeze([
  Object.freeze({id: 'indigo', label: '인디고 라이트', roles: Object.freeze({...neutral})}),
  Object.freeze({id: 'teal', label: '틸 라이트', roles: Object.freeze({...neutral,
    primaryDefault: '#0f766e', primaryHover: '#115e59', primaryPressed: '#134e4a',
    focus: '#115e59', secondaryPressed: '#f0fdfa', ghostText: '#115e59', ghostHover: '#f0fdfa', ghostPressed: '#ccfbf1', selectedSurface: '#f0fdfa', selectedText: '#115e59',
  })}),
]);

/** Current UI default; historical 107-token source remains immutable. */
export const defaultTheme: Theme = Object.freeze({id:'slate',label:'슬레이트 라이트',roles:Object.freeze({...neutral,
  primaryDefault:'#334155',primaryHover:'#1e293b',primaryPressed:'#0f172a',focus:'#475569',
  secondaryPressed:'#e2e8f0',ghostText:'#334155',ghostHover:'#e2e8f0',ghostPressed:'#cbd5e1',
  selectedSurface:'#e2e8f0',selectedText:'#334155',
  infoSurface:'#f1f5f9',infoText:'#334155',successSurface:'#ecfdf5',successText:'#065f46',
  warningSurface:'#fffbeb',warningText:'#854d0e',errorSurface:'#fff1f2',errorText:'#be123c',
  destructiveSurface:'#be123c',destructiveHover:'#9f1239',destructivePressed:'#881337',
})});
export function renderDefaultThemeCss():string {
  return '/* Generated default override; historical tokens stay unchanged. */\n.ds-core {\n'+Object.entries(themeVariables(defaultTheme)).map(([key,value])=>`  ${key}: ${value};`).join('\n')+'\n}\n';
}

/** Map semantic overrides to the variables existing components actually consume. */
export function themeVariables(theme: Theme): Record<`--${string}`, string> {
  const r = theme.roles;
  for (const role of themeRoles) channels(r[role], role === 'scrim');
  const coupled: readonly (readonly [ThemeRole, ThemeRole])[] = [
    ['secondarySurface', 'surface'], ['secondaryHover', 'subtle'], ['secondaryPressed', 'selectedSurface'], ['secondaryActionText', 'text'],
    ['ghostSurface', 'surface'], ['ghostHover', 'selectedSurface'], ['destructiveSurface', 'errorText'],
    ['destructiveText', 'inverseText'], ['inverseSurface', 'text'], ['primaryText', 'inverseText'],
  ];
  for (const [role, consumedRole] of coupled) {
    if (r[role].toLowerCase() !== r[consumedRole].toLowerCase()) throw new Error(`${role} must match ${consumedRole}: existing component CSS consumes that role`);
  }
  const failure = assessTheme(theme).find(row => !row.passes);
  if (failure) throw new Error(`Theme contrast fails: ${failure.foreground}/${failure.background} ${failure.ratio} < ${failure.threshold}`);
  const map: Record<string, ThemeRole> = {
    'color-bg-surface': 'surface', 'color-bg-canvas': 'canvas', 'color-bg-subtle': 'subtle',
    'color-text-primary': 'text', 'color-text-secondary': 'secondaryText', 'color-text-muted': 'mutedText',
    'color-text-muted-onSubtle': 'mutedText', 'color-text-inverse': 'inverseText', 'color-link': 'ghostText', 'color-focus': 'focus',
    'color-border-control': 'controlBorder', 'color-border-subtle': 'subtleBorder',
    'color-action-primary-bg-default': 'primaryDefault', 'color-action-primary-bg-hover': 'primaryHover', 'color-action-primary-bg-pressed': 'primaryPressed',
    'color-selected-bg': 'selectedSurface', 'color-selected-fg': 'selectedText',
    'color-disabled-bg': 'disabledSurface', 'color-disabled-fg': 'disabledText',
    'button-bg-default': 'primaryDefault', 'button-bg-hover': 'primaryHover', 'button-bg-pressed': 'primaryPressed', 'button-fg': 'primaryText',
    'button-disabled-bg': 'disabledSurface', 'button-disabled-fg': 'disabledText',
    'field-bg': 'surface', 'field-fg': 'text', 'field-border': 'controlBorder', 'field-focus': 'focus', 'field-description': 'mutedText', 'field-error-fg': 'errorText', 'field-error-bg': 'errorSurface',
    'dialog-bg': 'surface', 'dialog-fg': 'text', 'empty-bg': 'surface', 'empty-fg': 'secondaryText', 'progress-track': 'subtle', 'progress-fill': 'primaryDefault',
    'color-info-surface': 'infoSurface', 'color-info-text': 'infoText', 'color-warning-surface': 'warningSurface', 'color-warning-text': 'warningText',
    'color-inverse-surface': 'inverseSurface', 'color-inverse-text': 'inverseText', 'color-scrim': 'scrim',
    'color-action-secondary-pressed': 'secondaryPressed', 'color-action-ghost-pressed': 'ghostPressed', 'color-action-destructive-hover': 'destructiveHover', 'color-action-destructive-pressed': 'destructivePressed',
    'color-action-primary-text': 'primaryText', 'color-action-secondary-surface': 'secondarySurface', 'color-action-secondary-hover': 'secondaryHover', 'color-action-secondary-text': 'secondaryActionText',
    'color-action-ghost-surface': 'ghostSurface', 'color-action-ghost-hover': 'ghostHover', 'color-action-ghost-text': 'ghostText',
    'color-action-destructive-surface': 'destructiveSurface', 'color-action-destructive-text': 'destructiveText',
  };
  const statuses = {running: ['infoSurface', 'infoText'], review: ['warningSurface', 'warningText'], success: ['successSurface', 'successText'], error: ['errorSurface', 'errorText'], neutral: ['neutralSurface', 'neutralText']} as const;
  for (const [status, roles] of Object.entries(statuses)) {
    for (const prefix of ['color-status', 'badge', 'alert']) {
      map[`${prefix}-${status}-bg`] = roles[0]; map[`${prefix}-${status}-fg`] = roles[1];
    }
  }
  return Object.fromEntries(Object.entries(map).map(([variable, role]) => [`--${variable}`, r[role]]));
}

export interface ContrastPair { readonly foreground: ThemeRole; readonly background: ThemeRole; readonly kind: 'text' | 'nontext'; }
const on = (foreground: ThemeRole, backgrounds: readonly ThemeRole[], kind: ContrastPair['kind'] = 'text'): ContrastPair[] => backgrounds.map(background => ({foreground, background, kind}));
const lightSurfaces = ['surface', 'canvas', 'subtle'] as const;
/** Closed allowlist; unlisted backgrounds/alpha/opacity are not authorized. */
export const textPairs: readonly ContrastPair[] = [
  ...['text', 'secondaryText', 'mutedText', 'ghostText', 'errorText'].flatMap(role => on(role as ThemeRole, lightSurfaces)),
  ...on('primaryText', ['primaryDefault', 'primaryHover', 'primaryPressed']),
  ...on('secondaryActionText', ['secondarySurface', 'secondaryHover', 'secondaryPressed']),
  ...on('ghostText', ['ghostSurface', 'ghostHover', 'ghostPressed']), ...on('destructiveText', ['destructiveSurface', 'destructiveHover', 'destructivePressed']),
  ...on('selectedText', ['selectedSurface']), ...on('inverseText', ['inverseSurface']),
  ...on('infoText', ['infoSurface']), ...on('warningText', ['warningSurface']),
  ...on('successText', ['successSurface']), ...on('errorText', ['errorSurface']), ...on('neutralText', ['neutralSurface']),
  ...on('disabledText', ['disabledSurface']),
  ...on('text', ['infoSurface', 'warningSurface', 'successSurface', 'errorSurface', 'neutralSurface', 'selectedSurface']),
  ...on('secondaryText', ['infoSurface', 'warningSurface', 'successSurface', 'errorSurface', 'neutralSurface', 'selectedSurface']),
];
export const nonTextPairs: readonly ContrastPair[] = [
  ...on('controlBorder', [...lightSurfaces, 'errorSurface'], 'nontext'), ...on('focus', [...lightSurfaces, 'errorSurface'], 'nontext'),
  ...['primaryDefault', 'primaryHover', 'primaryPressed', 'destructiveSurface', 'destructiveHover', 'destructivePressed'].flatMap(role => on(role as ThemeRole, lightSurfaces, 'nontext')),
  ...on('errorText', lightSurfaces, 'nontext'),
  ...on('infoText', ['infoSurface'], 'nontext'), ...on('warningText', ['warningSurface'], 'nontext'),
];
export interface ContrastAssessment extends ContrastPair { readonly ratio: number; readonly threshold: number; readonly passes: boolean; }
export function assessTheme(theme: Theme): ContrastAssessment[] {
  return [...textPairs, ...nonTextPairs].map(pair => {
    const ratio = contrastRatio(theme.roles[pair.foreground], theme.roles[pair.background]);
    const threshold = pair.kind === 'text' ? 4.5 : 3;
    return {...pair, ratio, threshold, passes: ratio >= threshold};
  });
}

/** Apply to a subtree only; restore in reverse application order for layered overrides. */
export function applyTheme(scope: HTMLElement, theme: Theme): () => void {
  if (scope === scope.ownerDocument.documentElement || scope === scope.ownerDocument.body) throw new Error('Theme requires a local scope, not document root/body');
  const variables = themeVariables(theme);
  const prior = Object.keys(variables).map(key => [key, scope.style.getPropertyValue(key), scope.style.getPropertyPriority(key)]);
  const attribute = scope.getAttribute('data-ds-theme');
  for (const [key, value] of Object.entries(variables)) scope.style.setProperty(key, value);
  scope.setAttribute('data-ds-theme', theme.id);
  let restored = false;
  return () => {
    if (restored) return;
    for (const [key, value, priority] of prior) {
      if (value) scope.style.setProperty(key, value, priority); else scope.style.removeProperty(key);
    }
    if (attribute === null) scope.removeAttribute('data-ds-theme'); else scope.setAttribute('data-ds-theme', attribute);
    restored = true;
  };
}
export function renderThemeCss(): string {
  return '/* Generated from src/themes.ts via renderThemeCss(); do not edit. */\n' + themes.map(theme =>
    `[data-ds-theme="${theme.id}"] {\n${Object.entries(themeVariables(theme)).map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}\n`
  ).join('\n');
}

/** Dependency-free sRGB utilities. Only explicit six/eight-digit hex is accepted. */
export type HexColor = `#${string}`;
function channels(color: string, alpha = false): number[] {
  if (!/^#[\da-f]{6}([\da-f]{2})?$/i.test(color)) throw new Error('Expected six/eight-digit hex color');
  if (!alpha && color.length !== 7) throw new Error('Expected opaque six-digit hex color; composite alpha first');
  return color.slice(1).match(/../g)!.map(value => parseInt(value, 16));
}
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (color: string) => {
    const [r, g, b] = channels(color).map(value => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
/** Source-over composition in encoded sRGB, rounded to the resulting 8-bit channels. */
export function compositeColor(foreground: string, backdrop: string): HexColor {
  const source = channels(foreground, true), target = channels(backdrop);
  const opacity = source.length === 4 ? source[3] / 255 : 1;
  return `#${target.map((value, i) => Math.round(source[i] * opacity + value * (1 - opacity)).toString(16).padStart(2, '0')).join('')}`;
}
