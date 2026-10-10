# 한결디자인 first slice — development handoff

> 이 문서는 Codex 실행 종료 당시의 기록입니다. browser blocker는 해당 worker 환경의 역사 증거이며, 이후 owner 실행 결과는 `rebuild-first-slice-owner-v2.md`가 우선합니다.

This implementation follows `rebuild-architecture-decision-v1.md`. The historical `src/`, registry, installation guide, proposal, approval and AGENTS bytes are preserved. The parent owns review, staging, commits, push and release. No Git writes or deployment/publication were performed.

## Ownership and source graph

- `packages/core/src/ui/`: private canonical authoring source. Foundation/lib → native and Radix primitives → compositions. No old core.css or historical barrel imports.
- `packages/core/registry/items.json`: component graph and component-only runtime dependencies. `payload-manifest.json` is generated from canonical sources and actual font bytes.
- `packages/cli/`: dependency-free executable, safety planner and publication lifecycle guard. Build/prepack regenerates the exact-version payload. The tarball includes executable, source manifest, source bytes, four font binaries, OFL license and upstream provenance.
- `apps/docs/src/hangyeol/`: CLI-generated installed source; edit canonical source and regenerate, never hand patch this directory. The docs package records installed hashes in `hangyeol.json`.
- `apps/docs/src/task-example.tsx`: local example policy, task enums and state; none of these enums belong to reusable UI.
- `apps/consumer-fixture/`: reproduction notes. Independent consumers outside the repository, with physical separate node_modules and package locks, provide installation proof.

Run `npm run build:slice`, `npm run typecheck:slice`, `npm run test:slice`, `npm run lint:design`, `npm run lint:design:fixtures`, and the existing root build/typecheck. The targeted test command runs only four Node safety/merge tests and nine first-slice behavior tests, not historical full suites. CLI packaging uses `npm pack --workspace @orderthan31/hangyeol-cli --pack-destination ../disposable` and the exact filename npm emits; see the CLI README for local npm-exec invocation. This candidate is not published.

## Styling contract

Tailwind 4.3.3 performs actual static utility compilation. The semantic bridge uses top-level `@theme inline` namespaced colors, typography, radius and spacing. Minimal base applies only to `data-hangyeol` scopes and themed portals; init imports Tailwind theme/utilities separately and never preflight. Pretendard binaries are copied, not remotely referenced at runtime. The light work surface uses warm neutral layers, ink hierarchy and a restrained olive action. A dark semantic theme is included.

The `cn` helper merges className last and explicitly places semantic type/radius/padding utilities in the corresponding standard conflict groups. The only docs appearance exception is `customization.tsx`: standard and semantic overrides are compiler checked and have a prepared browser computed-style proof. Ordinary docs use variants/sizes and layout classes. Browser computed-style proof remains pending because no browser could run in this environment.

Source lint inspects canonical and generated UI plus docs. Exact native control/composition owner paths disable only no-restyle; raw color, arbitrary-value, inline-style and static-class rules remain on. The customization demo has only its documented no-restyle exception and exact `bg-red-600`/`text-white` raw-palette exception. An exact synthetic historical fixture path preserves `bg-primary`/`text-foreground`: the new workspace's discoverable theme otherwise changes the plugin's old semantic grammar positive fixture. No actual historical source is exempted. Historical CSS/JSX rules and all original fixture cases remain intact. The new scanner calls the actual Tailwind compiler, checks every collected literal utility, proves an invented utility is rejected and proves a recognized DS Button restyle fails. Zero inspected files/sites/classes is an error.

## API and behavior

Button/Input/layout/List are native. Props, className and refs land on the actual element. Button defaults to type=button, loading disables activation. Input loading updates aria-busy without replacing its node. TextField ref/className/native props target the input; wrapperProps targets its outer div. Clear changes owned React state or calls onValueChange, then focuses the existing input. Clear does not synthesize a native ChangeEvent. Uncontrolled TextField reset restores its initial default. Controlled TextField reset belongs to the owner.

Select is Radix Root/Trigger/Content/Item. Its ref is HTMLButtonElement, not HTMLSelectElement. Name/required/FormData use the Radix hidden native select. Uncontrolled native reset restores the initial default. Controlled native reset requests the initial defaultValue or initial value through onValueChange; the owner must apply that request or prevent the form's reset. Canceled reset retains current values. No custom dropdown keyboard engine or forced value mutation is added.

Tabs uses Radix state, orientation, activation and disabled behavior. Dialog uses Radix modal/focus/keyboard behavior. Content's ref is HTMLDivElement, Title's HTMLHeadingElement, Description's HTMLParagraphElement. Radix returns focus to its Trigger; triggerless/initial/async owners can supply returnFocusRef. The task example does so for create and per-row edit triggers.

The installed Theme context supplies current theme attributes to portals. Dialog Content supplies an in-modal portal destination for Select so it remains inside the modal's accessible area. Dialog centering does not introduce a transformed ancestor. JSDOM tests exercise keyboard Select-in-Dialog, focus trap/Escape/return, and root theme changes with Dialog and Select open. Real clipping, browser inert behavior, nested themes and viewport layout remain browser acceptance work.

## Installer contract and limits

React 19 / Vite / Tailwind 4 is the first adapter. V3 and unsupported React/frameworks are diagnosed. Missing dependencies install exact-pinned; conflicting declared versions require explicit host resolution. CLI dependencies are separate from requested runtime/type/build dependencies. Button-only has no Radix, Chart/Recharts, react-is, docs or full barrel.

`hangyeol.json` defaults to source `src/hangyeol`, style `src/hangyeol.css`, public `public`, fonts `fonts/hangyeol`, base `/`. Roots, font URL path and base can be changed. Alias configuration adds TypeScript paths and a generated Vite resolver; an existing Vite config must explicitly match the chosen alias/root and use the Tailwind plugin. Arbitrary Vite config rewriting and JSONC tsconfig migration are outside this adapter. Import the reported stylesheet from the host entry.

Init/add validate every source/asset/metadata path, hash, duplicate and collision before writes. Symlink paths and escapes are rejected. Identical bytes are no-ops; edited payload files fail; explicit overwrite and additive stylesheet/alias integration preserve prior bytes in backups. Successful version/hash records are written only after dependencies install. A real offline dependency-install failure left source files in place, reported package/lock uncertainty, and recorded no success metadata. No destructive rollback is used. This slice has no update/merge engine.

Publication config points to GitHub Packages and prepublishOnly requires an explicit effective GitHub Packages registry. Direct guard checks reject default and npmjs registry routing. No publish command or workflow ran. Final release approval, registry credentials/visibility, live GitHub Packages download and publication remain separate.

## Checkpoint status

The local evidence folder `first-slice-v1` holds exact commands/exits, RED/GREEN output, the actual tarball/version/SHA256, both independent consumer builds, no-op/conflict/backup records, dependency-failure records, canonical/generated/installed hash comparisons, and HTTP font/license/provenance MIME/bytes/hash checks. Its local final report is the authority for the latest command outcomes.

Browser verification is blocked, not passed: Chromium exits before navigation with a macOS sandbox MachPortRendezvous permission error; Browser reports no available connection; Aside's local daemon authentication fails. No PNG screenshots, FontFace load, computed override styles, native sentinel computed-style comparison, desktop/320/390 overflow, browser console/network, or real browser task acceptance are claimed. A scoped Playwright smoke script is retained in local evidence for the parent to run in a browser-capable environment against production builds. Final AT/browser/accessibility/design acceptance and GitHub Packages live download/publication are explicitly pending.
