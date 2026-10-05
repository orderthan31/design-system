# Scoped light-theme contract

## Library boundary

`src/themes.ts` exports `themes`, `themeRoles`, `textPairs`, `nonTextPairs`, `themeVariables`, `assessTheme`, `contrastRatio`, `compositeColor`, `applyTheme`, and `renderThemeCss`; types include `Theme`, `ThemeId`, `ThemeRole`, `HexColor`, `ContrastPair`, and `ContrastAssessment`.

The two demonstration palettes are **Indigo light** and **Teal light**. They are generic library examples, not product configuration. Both have 38 resolved roles and produce 84 semantic/component CSS overrides. Their brand primary, hover, pressed, link, focus and selected colors differ. Generic information, warning, success, error, neutral, inverse and scrim roles remain shared.

The immutable source remains `public/source/tokens/core.json`: 107 tokens (39 primitive, 29 semantic, 39 component), SHA-256 `b459f1c541d3c2e37190c745e727a4b3c2a755ac395cbd8040e4eb2a972d2d20`. No primitive palette, geometry, motion, typography or source token is rewritten. Pretendard remains the library primary font. The override layer is additive, not a replacement core-token manifest.

## Consumption and restoration

```tsx
import { ThemeGallery } from './components/theme-gallery';
// The consuming gallery/App chooses where to render this example:
<ThemeGallery />
```

The gallery imports the generated `theme-roles.css`. Visible UI, accessible names, option labels and status messages are Korean-primary (`lang="ko"`); API, role, token and enum identifiers are unchanged, and role identifiers in the numerical table are marked `lang="en"`. Its labeled native select offers both palettes and the core baseline; a separate button restores the baseline. A polite status announces the current selection. Only the preview subtree receives the theme attribute and custom properties. The preview nests the existing **Button** and **FormField → Input**, not copies. Editing the field survives switching. Generic information/warning/inverse samples and a decorative scrim example are shown only for replacement palettes. A separate table recalculates every authorized pair at render time. Baseline restoration removes theme overrides and makes **no replacement-theme contrast claim** for the historical core.

For non-React scoped consumption:

```ts
import { applyTheme, themes } from './themes';
const restore = applyTheme(previewElement, themes[1]);
// Dispose/switch by restoring first; never apply to document root/body.
restore();
```

`applyTheme` validates before mutation, preserves prior inline values/priorities and the prior `data-ds-theme` attribute, and returns an idempotent cleanup. Layered applications must be restored in reverse order. Unrelated declarations and sibling/root styles are untouched. Theme-generated CSS is attribute-scoped; use `data-ds-theme` only on an intended subtree. A child can establish its own theme. `themeVariables` also supports React inline styles. For a new replacement palette, use inline overrides instead of merely reusing an existing attribute id with different values.

## Actual component mappings (unchanged component CSS)

| Existing consumer | Override role / restriction |
| --- | --- |
| Primary Button default/hover/pressed | `--button-bg-default/hover/pressed` → `primaryDefault/Hover/Pressed`; `--button-fg` → `primaryText` |
| Secondary Button | `--color-bg-surface` → `surface`; hover `--color-bg-subtle` → `subtle`; text `--color-text-primary` → `text`; border `--color-border-control` → `controlBorder` |
| Ghost / quiet Button | Transparent default over an authorized light backdrop; `--color-link` → `ghostText`; hover `--color-selected-bg` → `selectedSurface` |
| Destructive Button | `--color-status-error-fg` → `errorText`; `--color-text-inverse` → `inverseText`; there is currently no separate hover/pressed color in the existing CSS |
| FormField / Input | `--field-bg/fg/border/description/error-fg/error-bg`; labels use primary/secondary semantic text; read-only uses canvas |
| Generic additions | `--color-info-surface/text`, `--color-warning-surface/text`, `--color-inverse-surface/text`, `--color-scrim`, and action text/surface aliases |
| Compatibility status aliases | Existing running badge/alert/status aliases resolve to generic info; review aliases resolve to generic warning. No new domain states or enums are introduced. |

Because existing CSS is intentionally unchanged, independent action-role values cannot arbitrarily diverge: secondary surface/hover/text must equal surface/subtle/text; ghost default/hover surface must equal surface/selectedSurface; destructive surface/text must equal errorText/inverseText; inverse surface must equal text; primary text must equal inverseText (also used by other filled primary consumers). `themeVariables` rejects these divergences rather than claiming that unused variables restyle existing components. The transparent ghost is authorized only on the listed light surfaces, not on arbitrary backgrounds.

## Numerical contrast allowlist

`textPairs` and `nonTextPairs` are the executable, closed allowlist. Every assessment resolves the **current palette values** and computes full-precision ratios; no source/historical pass flag is inherited. Exported results are numeric pair assessments, not accessibility-conformance certification. `themeVariables` refuses a palette with a failing authorized pair. `assessTheme` remains usable for inspecting failures before application.

Each palette has **43 unique text pairs** at a minimum **4.5:1**:

- text, secondary text, muted/placeholder text, ghost/link text and error text on surface/canvas/subtle;
- primary text on default/hover/pressed; secondary action text on default/hover; ghost text on default/hover; destructive text on its filled surface;
- selected, inverse, information, warning, success, error, neutral and disabled text on their matching surfaces;
- primary and secondary body text on each of information/warning/success/error/neutral/selected surfaces.

Each palette has **23 unique non-text pairs** at a minimum **3:1**:

- control border and focus color against surface/canvas/subtle;
- primary default/hover/pressed and destructive fill against those same adjacent surfaces;
- invalid/error control color against those surfaces;
- meaningful information/warning graphics against their matching surfaces.

| Palette | Lowest authorized text ratio | Lowest authorized non-text ratio |
| --- | ---: | ---: |
| Indigo light | 5.905927118870345 | 4.343923406321176 |
| Teal light | 5.473250081210842 | 4.343923406321176 |

Busy alone is not an inactive exemption: the existing loading Button keeps its active color pair and spinner uses current text color. Disabled text is numerically checked here even though genuinely inactive controls have WCAG exemptions. Disabled reason/help text must still use an authorized active text role. Secondary border, field border, focus ring and primary progress fill are meaningful non-text uses. Subtle borders/separators and the scrim sample are decorative; no required-control-boundary pass is claimed for subtle borders.

Unlisted combinations are **not authorized**. No fades, translucent ancestors, arbitrary colored containers, images, gradients or blending are covered. Focus is measured against the light surface at the existing offset outline, not against a filled brand color. The offset geometry/keyboard visibility and every actual component adjacency still need browser verification. Do not position ghost/link text over primary fills or place inverse white text on light surfaces without a new calculation and contract.

### Formula and alpha scrim

`contrastRatio` is dependency-free and accepts opaque six-digit hex only. Channels are normalized to sRGB 0–1, linearized by `c / 12.92` for `c <= 0.04045`, otherwise `((c + 0.055) / 1.055) ** 2.4`. Relative luminance is `0.2126R + 0.7152G + 0.0722B`; ratio is `(lighter + 0.05) / (darker + 0.05)`. Threshold comparison is unrounded. Rounded table values are display only; for example `#777777` on white is about 4.47808945 and **fails** 4.5 even if displayed as 4.48.

`compositeColor` applies source-over composition in encoded sRGB over an explicit opaque six-digit backdrop, rounds to 8-bit channels, and returns the resulting opaque hex. Both palettes' scrim is `#0f172a66` (alpha `102/255 = 0.4`). Over white `#ffffff`, the effective backdrop is `#9fa2aa`; **white text on it is only 2.5538827486585394:1 and is forbidden**. The gallery intentionally puts no text on the scrim. Over a different backdrop, composite again and measure the actual opaque result; this single decorative example does not grant a blanket overlay/text pass. The existing dialog backdrop is hardcoded and is not changed by this layer; wiring it to the generic scrim would be a separate integration change.

Normative criteria: W3C WCAG 2.2 SC 1.4.3 Contrast (Minimum), SC 1.4.11 Non-text Contrast and the relative-luminance definition. Normal text uses 4.5:1; meaningful required non-text uses 3:1 against actual adjacent colors. No large-text shortcut is used here.

## Generated CSS and verification

`src/theme-roles.css` is the exact output of `renderThemeCss()`. Its test compares bytes to the generator, so module changes cannot silently leave stale CSS. Regenerate it from the module using the project's TypeScript transpiler (the module has no runtime dependencies):

```sh
node --input-type=module -e 'import fs from "node:fs"; import ts from "typescript"; const code=ts.transpileModule(fs.readFileSync("src/themes.ts","utf8"),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText; const m=await import("data:text/javascript;base64,"+Buffer.from(code).toString("base64")); fs.writeFileSync("src/theme-roles.css",m.renderThemeCss());'
npm test -- tests/themes.test.ts tests/theme-gallery.test.tsx
```

Tests exercise contrast precision, alpha rejection/composition, source-token integrity, complete actual-variable mapping, pair uniqueness/thresholds, fresh failure detection, reject-before-mutation, generator parity, scoped apply/cleanup and interactive real-component switching/reset. Test-first feature slices were observed failing before implementation. A source-integrity invariant is a retained-baseline regression assertion, not a claim that the baseline was newly implemented.

Current integration evidence: Foundations now renders ThemeGallery. Browser tests at 320/390/1440 verify final computed primary colors for Indigo/Teal/core restoration, preserved input, unchanged document-root styles, minimum action height, document reflow and scoped axe checks. CSS transitions are awaited before comparing the rendered color. This does not cover every hover/pressed/focus adjacency, nested-scope behavior, per-glyph font fallback or assistive-technology interaction. jsdom drops `!important` priorities on custom properties; the test restores the priority actually retained by jsdom. Real-browser restoration of those priorities remains unverified. Numerical pair passes and selected runtime tests do not establish comprehensive consumer accessibility acceptance.
