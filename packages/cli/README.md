# 한결디자인 설치 CLI 후보

This unpublished candidate installs local React 19 / Vite / Tailwind 4 source. UI authoring is private; consumers import installed source, never the CLI runtime.

Build and pack from the repository root:

```sh
npm run build:slice
npm pack --workspace @orderthan31/gyeol-cli --pack-destination /your/disposable/directory
```

Use the **actual filename emitted by npm pack**, from an independent host:

```sh
npm exec --yes --package /your/disposable/directory/orderthan31-gyeol-cli-0.1.0-slice.1.tgz -- gyeol init --dry-run
npm exec --yes --package /your/disposable/directory/orderthan31-gyeol-cli-0.1.0-slice.1.tgz -- gyeol init
npm exec --yes --package /your/disposable/directory/orderthan31-gyeol-cli-0.1.0-slice.1.tgz -- gyeol add button
```

The adapter creates Vite configuration when absent. An existing configuration must explicitly use `@tailwindcss/vite`; arbitrary config rewriting is rejected. Import the reported stylesheet from your application entry. Existing umbrella/preflight imports must be reviewed and split by the host owner; init never inserts preflight.

Defaults: source `src/gyeol`, stylesheet `src/gyeol.css`, public `public`, fonts `fonts/gyeol`, base `/`. Configure with `--source-root`, `--style-path`, `--public-root`, `--font-path`, `--base-path`, and optional `--alias`. Relative internal imports survive custom roots. An alias adds TypeScript paths and resolves the generated Vite config. Existing Vite configs must explicitly resolve the same alias/root or init diagnoses them before writing. No alias is needed for relative imports.

`--dry-run` prints every path/hash/action and separate runtime/build/type dependency changes. Identical files are no-ops. Edited source conflicts fail before any writes. `--overwrite` preserves replaced bytes in `.gyeol-backups`. Additive stylesheet/TypeScript integration also backs up existing bytes. Successful installs record version/hash in `gyeol.json`; dependency failure reports partial source/package/lock state without recording success or rolling back edits. A missing dependency is installed exact-pinned. Conflicting versions are diagnosed rather than silently replaced. Source targets must be project-relative and symlink-free.

Commands are only `init`, `add`, and `--version`; no update/merge engine. First slice components: button, input, theme, layout, text-field, select, tabs, dialog, composition. Requested closure excludes Chart, Recharts, react-is, docs and aggregate barrels. CLI has no external runtime dependencies.

GitHub Packages publication/live downloads require separate release approval and credentials. No npmjs publication is allowed. The prepublish guard requires an effective explicit GitHub Packages registry. Nothing here claims a working published `npx @orderthan31/gyeol-cli` command.
