# hangyeol-core — local candidate

This private installed development package owns the executable, tool router,
shared installer/safety implementation, and same-version canonical source/font
payload. It is not a runtime UI dependency. Generated UI imports local source.

First-party code and UI payload are `UNLICENSED`; no repository license grant was
found or invented. The font assets retain the copied SIL OFL 1.1 license and
original upstream provenance. See LICENSE and THIRD_PARTY_NOTICES.md. Publication
is blocked. This is not a Release download or registry quickstart.

Build/pack in the authoring repository:

```sh
npm run build --workspace=hangyeol-core
npm pack --dry-run --json --workspace=hangyeol-core
npm pack --workspace=hangyeol-core --pack-destination=../scratch
```

In an independent disposable React 19/Vite host, install the actual tarball
filename emitted by pack as an exact development dependency:

```sh
npm install --save-dev --save-exact ../scratch/hangyeol-core-0.1.0-s2.1.tgz
./node_modules/.bin/hangyeol --version
./node_modules/.bin/hangyeol inspect
./node_modules/.bin/hangyeol init --dry-run
./node_modules/.bin/hangyeol init
./node_modules/.bin/hangyeol add button --dry-run
```

The direct local bin is authoritative; no npx registry fallback is used. The
core package stays in package.json/package-lock.json and node_modules. Installing
the package performs no postinstall generation. Init/add reuse the existing CLI
installer: React 19/Vite/Tailwind 4 adapter, preflight-free stylesheet, configurable
source/style/public/font/base/alias paths, exact runtime/build/type dependencies,
complete pre-write collision/hash/path/symlink plans, no-op/conflict/explicit
backup behavior, and success records only after dependency installation. Core
installed records include the core package and payload version. The legacy CLI
remains separately packaged and uses its own payload/version.

Every command first verifies package/payload/tool versions, ownership and hashes.
`inspect` checks the actual packed files. `lint inspect` retains its installed
tool inspection API and reports policy hashes, exact versions/licenses and the
grammar classifier. It does **not** run consumer lint. `tokens inspect` parses
the packed semantic CSS without writes; plain `tokens` remains deferred.

From the disposable host, use the physically installed bin:

```sh
./node_modules/.bin/hangyeol add text-field
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol lint inspect
```

Lint reads `gyeol.json` and recursively checks `.ts`/`.tsx` under its `sourceRoot`
(default `src/gyeol`, configurable such as `ui/system`). Consumer examples to be
checked belong inside that root. It does not scan unrelated app `src` files,
load host ESLint/Vite/TypeScript executable configs, generate files or fix code.
Stdout is a JSON report; stderr findings use actual host-relative file, line,
column, rule and reason. Exit 0 is a complete supported check; exit 1 denotes
findings/invalid input; exit 2 denotes unsupported CLI usage or an unavailable
compiler with no policy findings. An unavailable compiler never produces a
certified unknown-class pass.

The package collects the unchanged repository slice ESLint policy and existing
custom-property supplement, plus their hashes and installed dependency LICENSE
bytes in `dist/policy`. Exact template owners alone can compose native control
styles; public variants/layout are the consumer contract. Other rules remain
enabled. The authoring docs customization exception is not copied to consumers.

Unknown utility checking calls the actual adapter-pinned host Tailwind 4.3.3
`compile/build` API with bounded CSS imports. Grammar classification by pinned
`@shadcn/lint`/`cn` is reported separately. No compiler install, grammar unknown
fallback, host `@plugin`/`@config` execution or palette override is performed.
Runtime class strings, indirect wrappers, arbitrary host CSS restyling and
browser/computed/AT behavior are outside the static check. See
`docs/core-lint-contract.md` in the authoring repository for the precise scope.
Token generation/synchronization and all-96 execution remain deferred.

Prepack collects canonical sources and fonts at build time and snapshots the
single shared installer; it does not maintain a second hand-authored UI copy.
Only the bin, dist tool modules/manifests, payload and licensing/docs boundary
ships. Build scripts/tests/repository sources are not needed by an installed bin.

Scoped package tests require `CORE01_EVIDENCE_DIR` to point to the authorized
external scratch directory; every temporary fixture uses that explicit parent.
CORE-07 source-built/installed lint tests separately require `CORE07_EVIDENCE_DIR`.
The installed test reads the packed artifact prerequisite from its explicit
`core01-boundary` evidence subdirectory. Prepared offline cache verification is
not empty-cache, VPS, live registry or Release-download proof. CORE-06's bounded
file recovery does not roll back node_modules or guarantee crash/hostile-race
atomicity; lint does not change those limitations.
