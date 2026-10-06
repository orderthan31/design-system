import shadcn from '@shadcn/lint';
import tsParser from '@typescript-eslint/parser';
import dsPolicy, { customPropertyOwners } from './scripts/design-jsx-policy.mjs';

// No Tailwind migration/components.json/theme fabrication. See docs/design-rules.md.
export const componentImports = [
  '^\\.{1,2}/index$',
  '^\\.{1,2}/(?:\\.\\./)*(?:src(?:/index)?|components(?:/[^/]+)?)(?:$|/)',
  '^\\./(?:atoms|primitives|molecules|icons|form-controls|date-controls|data-display|navigation(?:-regions)?|templates|composition|layout|workspace-templates|text-field|list-row|bottom-cta|range-selection|progress-result|segmented-control|content-primitives|chart)$',
];
export const geometryExceptions = [
  {file:'src/components/primitives.tsx',properties:['width'],reason:'Progress finite/clamped percentage fill, not a palette/spacing override.'},
  {file:'src/gallery/connected-detail.tsx',properties:['maxWidth','gap'],reason:'Consumer-owned Container width and approved Grid gap values.'},
  {file:'src/gallery/bottom-cta-consumer.tsx',properties:['height'],reason:'Consumer local scroll region viewport-height example.'},
  {file:'src/gallery/data-detail.tsx',properties:['width','minWidth','maxWidth'],reason:'Wide-cell containment demonstration.'},
  {file:'src/gallery/region-overlay-detail.tsx',properties:['maxWidth'],reason:'Consumer wrapper width only.'},
  {file:'src/gallery/icon-detail.tsx',properties:[],reason:'SVG geometry uses public Icon size/strokeWidth, not style overrides.'},
  {file:'src/App.tsx',properties:['background'],reason:'Foundation swatch displays the actual resolved token, not a DS control restyle.'},
];
// Enumerated owners only; do not exclude the core or its four independent rules.
const styleOwners=['atoms','primitives','molecules','icons','form-controls','date-controls','data-display','navigation','navigation-regions','templates','composition','layout','workspace-templates','text-field','list-row','bottom-cta','range-selection','progress-result','segmented-control','content-primitives','chart','input-group'];
export default [
 {ignores:['node_modules/**','dist/**','evidence/**','public/**']},
 {files:['src/**/*.{ts,tsx}'],languageOptions:{parser:tsParser,parserOptions:{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}}},plugins:{shadcn,ds:dsPolicy},settings:{shadcn:{ui:'./src',componentImports,note:'Use public variant/size and semantic tokens. See docs/design-rules.md; no CSS restyle in consumers.'}},rules:{
  'shadcn/no-restyle':['error',{allow:['layout']}],
  'shadcn/no-raw-colors':'error',
  'shadcn/no-arbitrary-values':'error',
  'shadcn/no-inline-styles':['error',{allow:[]}],
  'ds/no-unowned-custom-properties':['error',{owners:customPropertyOwners.map(({file,properties})=>({file,properties}))}],
  'shadcn/require-static-classes':'error',
 }},
 {files:styleOwners.map(name=>`src/components/${name}.tsx`),rules:{'shadcn/no-restyle':'off'}},
 ...geometryExceptions.filter(entry=>entry.properties.length).map(entry=>({files:[entry.file],rules:{'shadcn/no-inline-styles':['error',{allow:entry.properties}]}})),
];
