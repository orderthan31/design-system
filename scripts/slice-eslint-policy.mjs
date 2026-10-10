import shadcn from '@shadcn/lint';
import parser from '@typescript-eslint/parser';
export const sliceFiles=['packages/ui/src/**/*.{ts,tsx}','apps/docs/src/**/*.{ts,tsx}'];
export const sliceImports=['^\\./gyeol/(?:primitives|components|foundation)/','^\\.\\./(?:primitives|components)/','^@gyeol/'];
const owners=['foundation/theme','primitives/button','primitives/badge','primitives/input','primitives/layout','primitives/select','primitives/tabs','primitives/dialog','components/text-field','components/composition','primitives/checkbox','primitives/switch','primitives/textarea','primitives/slider','primitives/progress','primitives/separator','primitives/skeleton','primitives/loading-spinner','primitives/container','primitives/grid','primitives/highlight','primitives/icon','primitives/icon-button','components/form-field','components/action-group','components/list-header','components/list-footer','components/empty-state','components/search-field','components/email-input','components/password-input','components/number-input','components/formatted-input','components/phone-input','components/currency-input','components/file-input','components/checkbox-group','components/rating','components/address-field','primitives/popover','primitives/tooltip','primitives/radio-group','components/segmented-control','components/icon-action','components/multi-select','components/combobox','components/table','components/pagination','components/alert','components/error-state','components/result','components/progress-stepper','components/breadcrumb','components/bubble'];
export const sliceConfig=[
 {files:sliceFiles,languageOptions:{parser,parserOptions:{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}}},plugins:{shadcn},settings:{shadcn:{componentImports:sliceImports,mergeFunctions:['cn']}},rules:{'shadcn/no-restyle':['error',{allow:['layout']}],'shadcn/no-raw-colors':'error','shadcn/no-arbitrary-values':'error','shadcn/no-inline-styles':['error',{allow:[]}],'shadcn/require-static-classes':'error'}},
 // Exact native-control/style composition owners. The four other rules remain enabled.
 {files:owners.flatMap(name=>[`packages/ui/src/${name}.tsx`,`apps/docs/src/gyeol/${name}.tsx`]),rules:{'shadcn/no-restyle':'off'}},
 // Progress percentage is runtime geometry, not a fixed visual token. Keep the exemption exact.
 {files:['packages/ui/src/primitives/progress.tsx','apps/docs/src/gyeol/primitives/progress.tsx'],rules:{'shadcn/no-arbitrary-values':['error',{allow:['w-[var(--g-progress-width)]']}]}},
 // One explicit public customization contract demo: not a waiver for ordinary docs.
 {files:['apps/docs/src/customization.tsx'],rules:{'shadcn/no-restyle':'off','shadcn/no-raw-colors':['error',{allow:['bg-red-600','text-white']}]}},
];
