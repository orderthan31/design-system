# T-PLAN v0.12 consumer coverage

## Purpose and evidence boundary

This is a presentation-layer consumption map for the supplied T-PLAN v0.12 requirements: node canvas, parallel branches and joins, human review, model decisions, and skipped paths. It does not reproduce a full product specification. The complete canonical plan was not available in the inspected repository; this map is limited to the requirement distinctions supplied for this documentation task and the current local component source.

The version identifies the consumer-planning target, not the shared package version or a claim that the consumer is implemented. This document does not approve screens, product policy, mobile feature parity or deployment. It defines no service interface, backend state enumeration or execution engine.

For actual dependency chains and candidate decisions, see `docs/component-inventory.md`. **Implemented reuse** means a shared piece exists; **product composition pending** means the consuming feature has not been established by this repository; **deferred extension** means no dedicated shared implementation exists.

## Coverage map

| Consumer presentation need | Implemented shared reuse | Classification and uncovered work |
| --- | --- | --- |
| Responsive workspace framing | Container, Stack, Grid, Shell | Layouts implemented. The gallery consumes Shell; product assembly remains independent. Consumer navigation/content assembly and editor-specific responsive behavior remain product composition pending. |
| Configuration form | FormField, Input, Textarea, Select, Checkbox, FormSection, ActionGroup | Shared form composition and Input busy presentation implemented. Busy keeps the input editable and preserves its node/value/focus through transitions. Domain fields, validation messages, rules and persistent save behavior remain product-owned. |
| Search and item browsing | SearchField, ListPanel, EmptyState, Skeleton | Neutral search input and list/content slots implemented. SearchField has no search service, combobox behavior or result orchestration; product filtering/data/selection remain pending consumer composition. |
| Selection details / editing region | FormSection, Tabs, FormField | Reusable section/layout primitives implemented; the retired templates are not available. A dedicated Inspector and its selected-node adaptation are not implemented. |
| Status, activity and explanation | Badge, Alert, Progress, Skeleton | Presentation primitives implemented. Consumer wording and independent status meanings must remain explicit. Existing tones do not define the consumer's state model. |
| Actions and confirmation | Button, IconButton, ActionGroup, Menu, Dialog, Confirm | Generic interactions and a real Button kind/size/default-busy-disabled matrix implemented. Domain consequences and permissions remain product-owned. Full hover/pressed/focus matrix coverage and persistent Menu selection presentation remain separate. |
| Supplementary guidance | Tooltip, Alert, FormField description/error slots | Shared explanatory pieces implemented; guidance cannot rely on color or a tooltip as the sole label. Consumer copy and validation coverage remain pending. |
| Node canvas | Existing tokens, Button/IconButton, Badge, Tooltip and field/detail regions can be dependencies | GraphNode, Port and Edge are deferred shared extension candidates, not implemented canvas primitives. Positioning, connections, navigation, zoom/pan and accessible alternatives require separately scoped work. |
| Node inspector | Tabs, FormSection, FormField, Input/Select/Textarea | Existing components can form a product-owned panel. An exported Inspector is a deferred extension candidate, not an existing component. |
| Condition editing | FormField, Input, Select, ActionGroup | Product composition pending; ConditionRow is a deferred candidate. Field reuse does not implement condition interpretation or a repeatable builder. |
| Parallel branch and join visualization | Grid/Stack and existing feedback pieces can support a list/detail alternative | Product composition pending; future graph extensions may render branch/join content. There is no implemented branch/join graph widget or relationship behavior. |
| Human review | Dialog/Confirm, FormSection, Button, Alert and detail slots | Presentation reuse available; reviewer context, reasons and available choices remain product composition pending. Generic Confirm is not a complete human-review workflow. |
| Model decision | ListPanel, Badge, Alert and explanatory slots | Presentation reuse available; decision evidence, outcomes and condition content remain product composition pending. Do not substitute the human-review interaction. |
| Skipped-path explanation | Text/content slots, Badge/Alert and future node/edge styling | Product composition pending. No dedicated skipped-path tone or graph presentation is implemented. Requires an explicit label/reason and a distinguishable non-color treatment; do not reinterpret an existing tone as the full feature. |
| Theme replacement | Token layers, resolver, ThemeGallery and scoped theme module | Foundations contains interactive Indigo/Teal substitution and core restoration. Allowed pairs are recalculated; actual primary colors/input preservation/root isolation/reflow are browser-checked. These examples do not pass a new consumer palette or arbitrary component adjacency. |

## Preserve independent meanings

### Parallel branch versus join

A parallel branch presents multiple distinct paths, not just the next row in a sequential list. A join presents convergence rather than another ordinary sequential step. Under the supplied v0.12 decision, the consumer must distinguish selected required paths from unselected paths: unselected branches are skipped, not success or failure, and are not awaited by the join. The join requires all required predecessors on the selected paths to succeed. Selected paths that are failed, cancelled, running or awaiting human review must not be relabeled skipped to bypass this requirement. An undecided or failed decision is not evidence of an unselected path. Shared downstream content must not be marked skipped merely because an unselected branch also points to it. These are consumer coverage requirements only; this repository does not implement scheduling or orchestration.

### Human review versus model decision

Human review communicates a human-facing request, context and explicit choices. A model decision communicates a non-human decision outcome and its explanatory evidence where appropriate. Both may reuse Button, Badge, Alert and detail regions, but their product compositions must remain distinct. A generic confirmation modal does not establish either complete feature, and a review-colored badge does not establish a review workflow.

### Skipped versus disabled, waiting, success or failure

A skipped path describes a path not taken and why that matters to the viewer. A disabled control describes an unavailable action. Waiting, success and failure convey other meanings. Keep the path label and explanation visible, separate state from keyboard focus, and distinguish the representation without relying on color alone. Current Badge tones and Menu actions are not a complete skipped-path implementation.

### Selection versus focus, busy versus inactive

Tabs already maintain active selection independently from their roving focus mechanics. Current Menu is an action list and does not expose a persistent selected-item presentation. Button has visible loading feedback and action suppression while loading. Input provides visible busy feedback, associated descriptions and aria-busy, retains readable editable content and preserves focus/selection across loading transitions. Busy is not an inactive state.

## Extension boundary

GraphNode, Port, Edge, Inspector and ConditionRow are future reusable candidates only when their presentation/interaction contracts can remain neutral across consumers. Promote them separately after proving reusable slots, non-color states, accessible names, focus/keyboard behavior, long labels and responsive alternatives. They are not required to be invented merely to complete an inventory.

The product may first compose an inspector or condition form from existing shared components. That reuse does not turn the product panel into a new exported shared component. Branch, join, human-review and model-decision content and skipped-path explanations stay consumer-owned even if their eventual visual frames become reusable.

## Pending acceptance checklist

- Gallery Shell reuse is established; consumer product assembly still needs its own verification.
- Exercise Button kind × size × state coverage rather than treating scattered variants as a complete matrix.
- Input busy presentation is implemented and transition-tested; verify the consuming application's wording and behavior separately without conflating busy with disabled/read-only.
- Resolve whether a persistent selection control is required separately from the implemented action Menu; demonstrate selected/unselected behavior if required.
- Shared theme examples are demonstrated and scoped browser-checked; revalidate all affected permitted text/non-text pairings and runtime states for any consuming palette, including feedback/overlay roles.
- Validate consumer keyboard/focus, state distinctions, multilingual long text and overflow at relevant small and large widths. Shared responsive checks are not complete consumer editor acceptance.
- Scope and validate any canvas extensions independently, including an accessible non-canvas representation where needed.
- Confirm this limited map against the complete canonical T-PLAN v0.12 before asserting exhaustive requirement coverage.

No consumer screens, graph extensions or product behaviors were implemented by this documentation change. No application test run was performed for this document; source inspection is evidence of availability, not a runtime acceptance pass.
