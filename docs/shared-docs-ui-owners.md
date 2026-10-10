# Shared Docs UI owners

Docs is a source-installed consumer, not a second component implementation. Canonical owners are in `packages/core/src/ui`; selection and dependency metadata are in `packages/core/registry/items.json`. `npm run build` builds core and runs the installed local `hangyeol init` / `hangyeol add` before building Docs. Do not copy canonical files into the consumer or edit generated ownership hashes.

## Selectable additions

```sh
hangyeol add code-block native-select color-input palette-picker link disclosure control-label preview-surface specimen brand-mark
```

| Item | Public owners | Responsibility |
| --- | --- | --- |
| `code-block` | `CodeBlock` | Inert Prism tokens, lazy Prettier formatting, guarded clipboard action, error guidance, syntax/toolbar/pre CSS |
| `native-select` | `NativeSelect` | Native select/options, props/ref/form/reset and preserved 44px appearance |
| `color-input` | `ColorInput` | Native color input, props/ref/form/reset and preserved 64×44 appearance |
| `palette-picker` | `PalettePicker` | Native radio options in nested Theme scopes, square swatches, checked/focus rings; caller supplies options and state |
| `link` | `Link`, `NavigationLink`, `SkipLink`, `NavigationGroupLabel`, `LinkFocusScope` | Real anchors and shared focus/selected/target geometry; no routing policy |
| `disclosure` | `Disclosure`, `DisclosureSummary` | Native details/summary with list marker, closed default and focus treatment |
| `control-label` | `ControlLabel`, `ControlGroup` | Compact checkbox label and composed-input focus treatment; existing Checkbox remains unchanged |
| `preview-surface` | `PreviewSurface` | Surface, border, radius and 24px/16px responsive padding |
| `specimen` | `Specimen` | Static color/radius/spacing/container/grid/elevation/layer/overlay/panel illustrations, not live modals |
| `brand-mark` | `BrandMark` | Consumer-supplied symbol/wordmark alpha masks and explicit-theme neutral wordmark |

These owners import their own CSS as side effects. Selected source installation includes those CSS files; no `docs.css` import is required. Rules remain **unlayered**, preserving their original precedence above Tailwind utilities. This is intentional preservation, not a general promise that utility classes override owner defaults. Customize the editable owner or its public API/variables deliberately.

CodeBlock alone selects Button, formatting/highlighting files and pinned `prettier@3.6.2`, `prismjs@1.30.0`, and development type dependency `@types/prismjs@1.26.6`. Button-only installation does not select those engines/types. Installer and doctor now resolve per-item `types` alongside runtime dependencies. Slot-based compositions declare `@radix-ui/react-slot@1.4.0` in their selected runtime closure.

`PreviewSurface`, `Specimen`, and `ControlGroup` support `asChild`: pass exactly one native element, retaining its ref, events, semantics, and `FormData(event.currentTarget)`. When mapping these wrappers, put `key` on the wrapper, not only on its child.

`Link` variants are `inline` (default), `text`, `brand`, and `logo`; anchors forward native props and do not intercept modified clicks. `LinkFocusScope` slots onto one structural element to preserve the same opt-in focus treatment on anchors nested inside GNB/LNB and other owners, without globally restyling those owners. Docs retains hash navigation, heading focus, menu state, search, responsive sidebar and history handling.

`PalettePicker` accepts `options`, `name`, `value` or `defaultValue`, `onValueChange`, a legend `label`, optional `mode`, native fieldset props/ref and `inputProps`. Options supply value/label, optional accessible label, palette, disabled state and swatch content. Uncontrolled options use native reset without synthetic change callbacks.

Specimen data remains caller-owned. Dynamic examples set `--hangyeol-swatch-color` and `--hangyeol-space-multiple`; the owner consumes those values. Docs customization keeps its own preview font/gap parameters and source-example synchronization. BrandCI supplies the actual assets, accessible label and `--hangyeol-brand-width` (`176px` or `min(313px, 100%)`); BrandMark owns the 313/82 alpha renderer. No core owner contains Docs asset paths.

## Verification boundaries

Source tests compare transferred declarations, media contexts and unlayered placement to the frozen transfer fixture, validate every selectable local source/CSS closure and reject authored raw Docs controls/anchors. JSDOM tests cover native refs, events, external form association, reset, Slot form behavior and static specimens. Existing installed-CodeBlock tests retain formatting/inertia/race/failure checks and the default example census.

This is not browser, viewport, keyboard-platform or accessibility acceptance. The installed lint currently treats owner CSS classes as unknown Tailwind utilities and the dynamic mask variable as unowned; do not suppress those findings with name allowlists. Root lint also retains pre-existing Docs composition findings. Prepared-dependency physical consumers prove local tarball installation/build isolation, not empty-cache registry portability: the available registry did not provide the pinned Slot metadata.
