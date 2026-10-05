# Historical snapshot — Shared component inventory and candidate classification

이 문서는 확장 이전의 보존 이력이다. 현재 기능별 정본은 `component-inventory-v1.md`다. 아래 pending/coverage 문구를 현재 상태로 적용하지 않는다.

## Scope and status vocabulary

This is a source-inspected inventory of the current reusable React implementation, not a release acceptance statement. Source references are repository-relative. The working tree is under active development; recheck implementation before treating this snapshot as release documentation.

- **Implemented / reused:** an existing export or actual nested composition can supply the named presentation need. This does not imply every historical state contract is implemented or tested.
- **Needed / pending:** an identified shared presentation gap or demonstration gap; no completed implementation is claimed.
- **Deferred extension:** a plausible reusable extension outside the current shared core. It requires a separate interaction contract and evidence before promotion.
- **Product composition:** the consumer owns labels, content, relationships, decisions and orchestration. Existing primitives can be reused without making the whole product feature a shared component.

## Current hierarchy: actual implementation

| Layer | Implemented items | Reuse and evidence |
| --- | --- | --- |
| Foundations | Token resolver and generated token styles; primitive, semantic and component token data | `src/tokens.ts`, `src/data/core.json`, `src/generated/tokens.css`. The Foundations gallery exposes token layers. Token existence is not comprehensive theme or accessibility verification. |
| Atoms | Button, IconButton, Input, Textarea, Select, Checkbox, Badge, Progress, Skeleton, Separator | `src/components/atoms.tsx`, `src/components/primitives.tsx`. Native entry/selection controls and feedback primitives are exported through `src/index.ts`. IconButton reuses Button; Separator currently renders a horizontal `hr`. |
| Molecules | FormField, Alert, EmptyState, Menu, Tabs, Tooltip; ActionGroup, SearchField | `molecules.tsx`, `feedback.tsx`, `navigation.tsx`, `composition.tsx`. FormField reuses Input or an associated supplied control; Alert reuses Badge; EmptyState reuses Button; SearchField is an Input with search type. Menu, Tabs and Tooltip have interactive implementations, not only images. |
| Organisms / reusable regions | Dialog, Confirm; FormSection, ListPanel | `organisms.tsx`, `composition.tsx`. Dialog combines a native dialog, heading, body, IconButton and optional footer; Confirm composes Dialog with Button actions. FormSection nests Stack and optional ActionGroup; ListPanel provides title, toolbar and stacked content slots. |
| Layout primitives | Container, Stack, Grid, Shell | `layout.tsx`, `layout.css`. Shell provides navigation, header and main slots. It exists and has a composition unit-test source, but is not used by the gallery application shell or CompositionExample in this snapshot. |
| Generic templates | FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate | `templates.tsx`, `composition.tsx`. The first three are slot-based templates used in the Templates gallery; DetailTemplate nests Grid, summary/content slots and optional ActionGroup. They are neutral layouts, not released product screens. |
| Gallery composition | CompositionExample | `composition.tsx`, connected to the Templates page in `src/App.tsx`. A demonstrator, not a separate domain feature or extra component family. |

The existing `componentFamilies` registry names the original 18 families. Layouts, added compositions and templates are additional exports; the registry and gallery summary are not a complete inventory of those exports.

### Inspectable dependency chains

- IconButton → Button.
- FormField → Input by default, or supplied Textarea/Select with label/help/error association.
- Alert → Badge + content; EmptyState → explanation + Button.
- Confirm → Dialog → heading/body/IconButton/footer, with Button cancel/confirm actions.
- FormSection → Stack + optional ActionGroup; SearchField → Input.
- CompositionExample → Container/Grid → FormSection/ListPanel → FormField/SearchField/ActionGroup → Input/Button.
- DetailTemplate → Grid → summary/content slots; its gallery content uses FormSection → FormField → Input.
- FormTemplate/ListTemplate/FeedbackTemplate → consumer-supplied slots; gallery examples supply existing fields, controls and feedback components.

This records the actual dependency shape rather than claiming every file name alone establishes an atomic hierarchy.

## Shared candidate decisions

| Candidate | Classification | Current coverage / remaining work |
| --- | --- | --- |
| Container / Stack / Grid | Implemented / reused | Available for neutral responsive region composition. |
| Shell | Implemented; gallery reuse pending | Exported slot layout; do not describe the bespoke gallery sidebar as a Shell instance. |
| Field / action / search combinations | Implemented / reused | FormField, ActionGroup, SearchField and FormSection already provide the neutral pieces. SearchField is not a query service, result engine or enhanced combobox. |
| List / detail regions | Implemented / reused | ListPanel, ListTemplate and DetailTemplate provide slots. Rows, selection models, sorting, pagination and data ownership are consumer responsibilities unless separately implemented. |
| Form / list / feedback templates | Implemented / reused | Existing neutral templates remain alongside the added composition example. |
| Button kind × size × state gallery | Implemented / partial coverage | StateGallery displays primary/secondary/ghost/destructive × small/medium/large × default/busy/disabled using real Button instances. Complete hover/pressed/focus coverage remains separate; quiet is a compatibility variant, not a new matrix family. |
| Input busy presentation | Implemented / reused | Input provides a visible spinner/status and aria-busy/aria-describedby without disabling entry. Stable input reconciliation preserves uncontrolled edits, focus and selection through loading transitions; caller wording remains configurable and the default is Korean. |
| Menu selected/unselected presentation | Needed / pending | Current Menu is an action list with callbacks and dismissal, not a persistent selected-item control; no selected-item styling/contract is implemented in this snapshot. |
| Theme substitution demonstration and expanded role contrast | Implemented / scoped evidence | Foundations renders ThemeGallery using nested Button/FormField. Indigo/Teal examples and core restoration are interactive; current authorized pair ratios are recalculated rather than inheriting historical pass flags. Browser checks cover actual primary color changes, input preservation, root isolation and reflow. Arbitrary palettes and every state/adjacency remain consumer validation. |
| Dedicated condition-builder row | Deferred extension or product composition | Basic fields can be composed now. A reusable ConditionRow needs operator/value layout, validation and keyboard contracts; no such export exists. |
| Specialized tables, timeline, rich editor, canvas minimap | Deferred | Generic slots are not implementations of these widgets. Add only with demonstrated reuse needs and separately scoped interaction work. |

Historical `src/data/components.json` state lists are retained baseline contracts, including original static-evidence flags. They are neither an authoritative runtime inventory nor proof that each listed state has a current interactive example. Conversely, those historical flags do not erase the actual React implementations above.

## Node canvas: future extension, not existing core

| Candidate | Shared extension opportunity | Product-owned composition |
| --- | --- | --- |
| GraphNode | Deferred generic node frame, focus/selection affordance, title/body/action slots | Node meaning, configured content, relationship labels and available actions. No GraphNode export exists. |
| Port | Deferred connection target, accessible label, hit area and focus contract | Which connections are allowed and what a connection means. No Port export exists. |
| Edge | Deferred connector rendering, label, selected/focused appearance and non-color distinction | Source/target relationships, path interpretation and branch meaning. No Edge export exists. |
| Inspector | Deferred reusable inspect/edit region, potentially composed from existing DetailTemplate, Tabs and FormSection | Selected-item fields, descriptions and validation rules. Current detail slots are reusable, not a finished Inspector. |
| ConditionRow | Deferred repeatable condition input layout | Condition vocabulary, decision criteria and interpretation. Existing Input/Select/FormField are dependencies, not a condition builder. |

Parallel branch, join, human-review and model-decision node content belongs to product composition. A future common canvas may render these compositions in neutral slots without defining their operational semantics. A skipped path needs explicit explanatory text and a distinct presentation; it must not be silently represented as success, failure, inactivity or a disabled control. No canvas interactions, graph manipulation or domain decision behavior are claimed here.

## Acceptance boundary

This document adds no implementation and reports no newly executed application tests. Responsive shared layouts do not establish full mobile workflow/editor parity. Product adoption, theme replacement, keyboard/focus behavior, busy/error/selection states, long-text reflow and each future extension require scoped consumer validation. No service interface, backend state enumeration or execution engine is specified by this inventory.
