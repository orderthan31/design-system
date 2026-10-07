# hangyeol-core — CORE-01 local candidate

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
`inspect` checks the actual packed files. `lint inspect` resolves the pinned
installed tool dependencies and reports their actual versions/licenses; it does
**not** lint a consumer or assert a policy pass. `tokens inspect` parses the
packed semantic CSS and reports actual declarations and source hash without
writing files. Plain `lint` or `tokens` exits nonzero with the missing scope.
Consumer lint activation, token validation/generation/synchronization, CORE-02,
and all-96 execution are explicitly deferred.

Prepack collects canonical sources and fonts at build time and snapshots the
single shared installer; it does not maintain a second hand-authored UI copy.
Only the bin, dist tool modules/manifests, payload and licensing/docs boundary
ships. Build scripts/tests/repository sources are not needed by an installed bin.

Scoped package tests require `CORE01_EVIDENCE_DIR` to point to the authorized
external scratch directory; every temporary fixture uses that explicit parent.
