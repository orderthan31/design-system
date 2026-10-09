# Independent installed-core consumer regression

This workspace describes the supported host shape. Workspace builds are not
installation evidence. The maintained regression is
`packages/core/test/external-consumer.test.mjs`; its hosts live outside the
repository with independent package/lock files and physical node_modules.

## Actual local installation

Use Node 22.22.2/npm 10.9.7 (core requires Node >=22.12). The tested private host
uses React/React DOM 19.2.0, Vite 7.3.6 and TypeScript 5.9.3. Declare the packed
manifest's exact common runtime/build/type dependencies as well: clsx 2.1.1,
tailwind-merge 3.7.0, Tailwind/@tailwindcss/vite 4.3.3 and React/React DOM types
19.2.2. Offline installation requires those bytes already in the prepared cache.
Do not substitute a workspace link or ancestor repository node_modules.

Obtain the filename from a real guarded scratch build/pack of current canonical
sources. Replace the relative artifact path below with that actual file; this is
a private UNLICENSED candidate, not a registry/Release download command.

```sh
npm install --save-dev --save-exact ../artifacts/hangyeol-core-0.1.0-s2.1.tgz --offline --ignore-scripts --no-audit --no-fund
./node_modules/.bin/hangyeol --version
./node_modules/.bin/hangyeol init --dry-run
./node_modules/.bin/hangyeol init
./node_modules/.bin/hangyeol add text-field --dry-run
./node_modules/.bin/hangyeol add text-field
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol tokens
./node_modules/.bin/hangyeol doctor
```

Core remains an exact file devDependency, not a UI runtime import. Installation
alone generates no UI. Init configures the supported React19/Vite/Tailwind4 host;
add installs the selected editable local graph. TextField requires Input/Button
and the common theme/cn helper, with separate font integration/assets. The test
uses custom ui/system, styles/theme.css, static/assets/type, /design/ and
@hangyeol paths. Existing supported stylesheet body and TypeScript settings are
retained. Vite config is absent initially so init creates its static adapter;
this does not promise arbitrary config/plugin migration.

Import local source and the generated stylesheet from the host entry. Use public
native props and semantic theme values; Input's native `size` is numeric, not a
DS size variant. The regression edits local UI/helper marker exports and an
owned custom palette, then uses LOCAL `node_modules/.bin/tsc` and
`node_modules/.bin/vite build`. Strict source checking includes `vite/client`
CSS declarations; dependency declaration checking uses skipLibCheck.

## Reproduce the bounded regression

Prepare a fresh external package root and artifact metadata using the existing
core build script in a guarded scratch mirror. Its artifact.json must include
actual tarball SHA256/SRI/version, sourceRevision HEAD/tree and toolHashes;
canonical source/tool hashes and current packageRoot bytes are checked before
host creation. A same-version stale artifact is not accepted merely by name.
Build-only dependency resolution may use a read-only repository link. Consumer
node_modules, dependency entries and build-bin resolutions must be physical and
local to the independent host; NODE_PATH is removed.

Set these to your permitted scratch/build/cache paths, using the explicit Node
22 toolchain and the read-only repository guard for build/test execution:

```sh
export TMPDIR="$SCRATCH"
export CORE10_EVIDENCE_DIR="$SCRATCH/core10/evidence"
export CORE10_PACKAGE_ROOT="$CORE10_EVIDENCE_DIR/build-root/packages/core"
export CORE10_ARTIFACT_PATH="$CORE10_EVIDENCE_DIR/boundary/artifact.json"
export npm_config_cache="$PREPARED_CACHE"
export npm_config_offline=true npm_config_ignore_scripts=true
export npm_config_audit=false npm_config_fund=false
node --test packages/core/test/external-consumer.test.mjs
```

The suite has no skip/fallback installation path. It records argv/runtime/time/
exit/stdout/stderr and complete byte/hash/inode/mtime/mode/link snapshots.
Read-only tools, dry-run, no-op, rejected edited targets and unsupported update
must leave the entire host unchanged. Initial integration/changed metadata may
create advertised `replace` backups; exact previous bytes are checked. Subsequent
no-op/read-only/conflict commands must not add or rewrite backups. An edited
TextField rejects default add; an unchanged Button add stays a strict no-op and
preserves edited common theme/helper/config records. No update engine is offered.

A separate host attempts `exec ./node_modules/.bin/hangyeol --version` with no
core installed. Missing executable exits 126/127 depending on shell, creates no
package/lock/node_modules and has zero npm/npx fallback calls. Instrumented npm
traps are proved separately before clearing the attempt trace; they do not
fabricate the production failure. This is command/process evidence, not a kernel
network audit. Do not use npx/registry execution as an absent-core fallback.

Prepared-cache installation/build evidence is not empty-cache, registry/VPS/
Release or publication portability. Browser/HTTP/font-load/focus/AT/Docs Reset
remain deferred (DEC02), update/apply/source Reset unimplemented (DEC01), and
stale authoring docs/default build guard constraints separate (DEC03). No
browser/server or existing preview is part of this regression.
