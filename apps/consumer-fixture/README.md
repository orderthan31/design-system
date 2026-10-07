# Independent consumer fixture

This workspace documents the reproducible host shape; workspace builds alone are not installation evidence. Create disposable hosts outside the repository, each with its own package, lockfile and physical node_modules. Use the actual locally packed CLI tarball with npm exec. Button-only adds `button`; full-slice adds `button input theme layout text-field select tabs dialog composition`.

Host dependencies: React/React DOM 19.2.0 and Vite 7.3.6, TypeScript 5.9.3. Leave Vite configuration absent so init creates the Tailwind plugin adapter. An entry imports the CLI-generated stylesheet. Use `data-gyeol` for a native scope or the installed Theme component. Place an ordinary native sentinel outside that scope and verify it against browser defaults.

The local evidence report records exact pack filename/hash, actual commands and independent builds. It is separate from GitHub Packages release and final acceptance.
