# 한결디자인 재구축 제안 v1 — 구조·소스 설치·첫 슬라이스

상태: **현황 조사/보존 완료, 구조·첫 구현 범위 검토 요청. 구현 승인·디자인 수락·패키지 발행 완료 아님.**
작성: 혜나 / 2026-10-07 KST
정본: Discord T-DES-003, thread 1557376481577934970. 요구 메시지 1557376481577934970 / 1557376486162300930 / 1557376489610285159 / 1557376493670105201 / 1557376496878747669 및 인계 1557376825133367321.

## 1. 현재 기준과 보존 증거

- 실경로 `<local-repository>`, repository `orderthan31/design-system`, branch `main`.
- local HEAD 및 새로 읽은 remote main: `9cdd458bd8e8c88e31e6e24613e0d8e73a35cc9b`.
- commit tree: `18d24af4e8d123c5dfecf1b9db1e44f55fcfec46`. dirty source는 이 commit tree와 다른 별도 상태다.
- tracked 변경 15개, untracked source 12개. 별도 untracked `AGENTS.md`는 보호 영역으로 제외했다. index 변경/stash 없음, worktree는 하나.
- durable backup: `<private-evidence>/baseline-20261007-220317/`. `history.bundle` 전체 refs 및 bundle verify 성공, `tracked.patch`, `staged.patch`, `status.z`, 변경/새 source 27개 사본 및 `manifest.json` SHA-256 보존. 각 사본을 원본 bytes와 대조했고 백업 전후 git status 동일성을 확인했다. scratch 백업도 남겨두었으나 durable 사본이 장기 보존 기준이다.
- dirty에는 마지막7 registry/source 분리와 CSS/gallery 교정이 함께 있다. 완료 주장 대신 그대로 보존한다. 이전 실행 로그나 설치 수를 새 재구축 완료율로 가져오지 않는다.
- 최신 인계가 source writer를 혜나로 지정했다. 현재 프로세스에서 해당 repo의 preview PID 31501(4175)과 esbuild PID 31502를 확인했다. 활성 `codex exec/resume`, registry/lint 수정 worker는 필터 결과에서 관측하지 못했다. 일반 Codex exec-server/gateway 존재만으로 해당 repo writer라 단정하지 않는다. 미래의 모든 대화 writer 부재를 증명한 것은 아니다. 새 source worker는 호출하지 않았고 기존 preview를 종료/refresh하지 않았다.
- `gh`는 현재 PATH에서 발견되지 않았다. remote 읽기는 git ls-remote로 성공했다. 이 단계는 gh 설치/인증 변경 없이 수행했다.
- reset/delete/force-push/rename/publish 없음. 조사 중 UI source 변경 없음. 추가한 repo 파일은 이 제안 문서뿐이다.

## 2. AS-IS → 새 요구 대조 (읽은 실제 source)

### 스타일/foundation/theme

`package.json:20–49`에는 Tailwind가 없다. Button은 `button.tsx:2,25`에서 CSS import와 문자열 class를 쓴다. Input/Select/Tabs/Dialog도 별도 CSS 기반이다. `core.css`, `default-theme.css`, 생성 토큰과 컴포넌트 CSS를 연결하는 현 모델은 새 구현의 주력이 될 수 없다.

재작성: utility 중심 appearance, semantic theme→utility bridge, 크기/variant/state 조합. 역사 토큰 원본과 예전 CSS는 증거로 보존하되 현재 기본 테마/API처럼 강제하지 않는다. 최소 CSS는 semantic 변수, @theme bridge, font-face, 필요한 motion으로만 제한한다.

### Radix/행동

`package.json:21`, `password-input.tsx:3,33–45`에서 Toggle 실사용을 확인했다. Select는 `select.tsx:3–4`의 native select다. Tabs는 `tabs.tsx:10,17–45`의 자체 roving keyboard/state다. Dialog는 `dialog.tsx:12–59,68–90`의 native showModal, global modal stack, scroll/focus 로직이다. 전체 Radix 기반으로 부를 수 없다.

재작성: Select/Tabs/Dialog의 headless state/keyboard/focus 소유자를 실제 Radix primitive로 교체한다. 이전 wrapper의 native/default-close/focus API와 새 API 차이를 기록하고 변경한다. 검증 가능한 접근성 기대와 loading guard, name/ref/native 전달은 계약으로 보존하되 기존 DOM 알고리즘을 무조건 복사하지 않는다.

### 계층/조합

`src/index.ts`는 chart 포함 집계 barrel과 atoms/primitives/molecules/organisms 재수출을 섞는다. 실제 조합은 `TextField → FormField/Input/Button/Icon`, 새 WIP의 `FormSection → Stack/ActionGroup`, `ListPanel → Stack` 등으로 읽힌다. 이 dependency graph를 기준으로 분류하며 이름상 Atomic 구분을 강제하지 않는다.

재작성: UI 내부 foundation → styled primitive → composition 단방향 import. docs 또는 registry를 UI가 import하지 않는다. 소비 설치는 per-component source graph이며 top-level 전체 barrel을 복사하지 않는다.

### 소스 설치/CLI/자산

현재 `registry.json`은 shadcn schema의 Hangyeol source 항목이다. working tree item 75개를 프로그램으로 세었다. Button 항목은 실제 button.tsx/CSS/theme 파일을 복사하고 react를 의존성으로 선언한다. **소스 설치 자체가 전혀 없다는 판정은 틀리다.** 그러나 이 개수는 새 구현 수락/검증 수가 아니다.

`docs/source-installation.md:7–85`는 기존 shadcn GitHub registry 명령, `:136–147`은 font binary 수동 복사, `:149–161`은 CSS-first/theme 조정 안내다. registry `meta.fontAssetsAutomatic`은 false다. 전용 CLI package/bin/publish 구성은 현재 package.json에 없다. registry source graph 아이디어는 재사용할 수 있으나 CSS payload와 소비 안내는 재작성한다. 기존 shadcn UI를 설치하고 CSS로 바꾸는 절차를 만들지 않는다.

### 문서/갤러리/검증

README 첫 본문은 preview checkpoint와 미완료 보고다. consumer entry는 index/core.css 기반이다. 새 README는 정체성/지원/실제 검증된 설치/로컬 import/theme/기여 중심으로 다시 쓰며 내부 상태는 development 문서로 분리한다. old gallery를 조금 꾸미는 대신 새 source를 쓰는 docs 앱을 만든다.

`lint-design.mjs:10,19`는 src glob과 plain-CSS 시대의 Tailwind 미지원 설명을 갖는다. workspace 신규 경로 검사가 자동으로 된다고 주장하지 않는다. 기존 lint/fixture를 보존·실행하고 신규 source coverage를 명시적으로 붙인다. 정책 변경은 검토 대상이며 기존 검사를 비활성화하거나 coverage를 통과 근거로 대체하지 않는다.

## 3. 제안 hierarchy (폴더·workspace는 미확정)

npm workspaces를 제안한다. 기존 npm lock/명령을 유지하면서 UI/docs/설치기를 분리하고 새 패키지 매니저 전환 비용을 피한다. root 기존 package 이름을 임의 변경하지 않는다.

```text
packages/
  ui/                     # private source authoring workspace, UI runtime 배포 아님
    src/foundation/       # semantic theme, typography/spacing/motion bridge, font CSS
    src/lib/              # class merging 및 정말 공유하는 작은 helper
    src/primitives/       # Button/Input/Label/Select/Tabs/Dialog/List/layout
    src/components/       # TextField/FormSection/ListPanel 등 실제 조합
  cli/                    # Node executable, project discovery/planning/write/install
registry/
  items/                  # item source edges, external dependency edges, target mapping
  assets/                 # verified release asset manifest; font/license payload ownership
apps/
  docs/                   # navigation/live examples/code/docs, consumer source를 사용
  consumer-fixture/       # gallery import 없이 설치된 소스만 쓰는 증명용 앱
```

상대 UI import는 설치 후에도 유지되는 내부 구조를 기준으로 쓴다. consumer target은 기본 `src/hangyeol/` 제안이며 config로 바꿀 수 있게 한다. `hangyeol.json`(이름 제안)은 source root, stylesheet/public asset root, aliases, installed version/hash를 기록한다. docs 예제와 installed source는 같은 authoring source에서 나온다. docs-only decorator로 appearance를 고치지 않는다. 오래된 역사 docs/test는 payload에서 제외한다.

registry는 source를 다시 수작업 복제하지 않는다. build가 canonical UI source를 수집하여 manifest/hash/자산과 함께 CLI tarball에 payload로 넣는 구성을 우선 제안한다. CLI/source payload를 같은 version으로 묶으면 실행기의 registry URL 인증·main drift 문제가 줄어든다. 향후 별도 remote registry가 필요하면 다른 ADR로 다루며 지금 두 배포 체계를 동시에 만들지 않는다.

## 4. 스타일·variant·primitive 책임

- Tailwind v4 계열 + Vite integration 제안. 실제 설치 버전은 호환 확인 후 pin/lock하며 `latest`를 계약으로 쓰지 않는다. 소비 framework별 integration은 별도 adapter로 처리한다. 첫 지원 경로는 React/Vite/Tailwind v4이고 기존 v3/모호한 build는 자동 변환하지 않고 명확히 진단한다.
- `cn`은 clsx + tailwind-merge 사용 제안, variant는 명시적 typed variant table로 시작. 기본/variant/state class를 정적인 완전한 문자열로 쓰고 consumer className을 마지막 merge한다. 이후 복잡도가 필요할 때 CVA 추가를 판단한다. consumer도 해당 helper dependency를 실제로 설치한다.
- semantic CSS 변수는 scoped Hangyeol theme container에 두고 top-level `@theme inline` bridge에서 namespaced utilities로 연결한다. 중첩 테마에서 변수 참조가 선언 위치에 굳지 않도록 실제 root/subtree 변경을 검증한다. spacing/type/radius도 새 체계로 제안하며 구 토큰 107개/구 블루/구 14px를 보존 기준으로 삼지 않는다.
- utility appearance/state: hover/focus-visible/disabled/aria-invalid/data-state 및 responsive modifier. object style/color 꾸러미나 old CSS의 @apply 포장으로 구현하지 않는다. className override는 실제 해당 slot owner에서 검증한다. Radix portal은 theme root/container 전달로 변수·폰트가 유실되지 않도록 계약화한다.
- Tailwind preflight는 소비 host 전체 영향이 있으므로 설치기가 묵시적으로 전체 reset을 추가하지 않는다. 기존 Tailwind entry/layers를 읽고 초기 파일 생성 또는 변경 preview를 낸다. source 탐색 경로가 기본 scan 밖이면 명시적 source 등록을 생성한다.

첫 mapping:

- **Button**: native button + 선택적 Radix Slot 조합, type=button 기본, disabled/loading guard, actual ref/className/native props. Slot은 조합용이지 클릭/폼 동작 headless의 증거로 부풀리지 않는다. loading+asChild의 링크/버튼 차이는 명시하거나 미지원 조합을 제한한다.
- **Input/Label**: native input + Radix Label 연결. Radix에 범용 텍스트 입력 primitive가 없는 범위는 native semantics를 쓴다. name/form/required/autocomplete/ref/value/defaultValue/event/IME를 전달한다. loading 전환이 input DOM을 교체하지 않는다.
- **TextField**: Label+Input+Description/Error+optional action composition. className/ref/input props 대상은 actual input, wrapperClassName/slot props는 별도. id/aria-describedby/error 관계를 한 owner로 관리한다. 기존 querySelector로 입력을 찾는 clear 경로는 ref 연결로 재설계한다.
- **Select**: Radix Select Root/Trigger/Value/Portal/Content/Viewport/Item. value/defaultValue/onValueChange, disabled, name/required 지원 범위를 명시. keyboard/typeahead/Escape/focus return과 FormData/reset을 실제 조작으로 검증. native Select의 children/event/HTMLSelectElement ref API와 호환된다고 거짓 약속하지 않는다.
- **Tabs**: Radix Root/List/Trigger/Content. value/defaultValue/onValueChange, orientation/activationMode, roving focus/disabled/state. docs owner state는 탭 panel 밖에 두어 Code/Docs 이동으로 입력이 초기화되지 않게 한다.
- **Dialog**: Radix Root/Trigger/Portal/Overlay/Content/Title/Description/Close. controlled/uncontrolled open, Escape/outside/초점 trap/복귀; Hangyeol은 styling과 조합 API를 소유. dialog global modalOwners/showModal 병행 제거 대상으로 잡는다. 외부 trigger, 처음 열린 상태, nested/portal theme 책임을 문서화한다.
- **List/layout**: native ul/li/section/flex/grid. 없는 Radix layout으로 감싸지 않는다. ListPanel은 List+heading+toolbar+empty/actions 조합이며 제품 enum·backend를 받지 않는다.

후속 mapping 대상: Checkbox/Switch/RadioGroup/Slider/Accordion/Popover/Tooltip/DropdownMenu/Toast는 해당 Radix primitive, Confirm은 AlertDialog 방향으로 별도 검토한다. Calendar/Combobox/DataTable/Chart는 단일 Radix primitive로 해결된다고 하지 않고 전용 동작 엔진/native 및 source-dependency 경계를 따로 설계한다. 첫 슬라이스에 이 후속 범위를 몰아넣지 않는다.

## 5. CLI → local source → GitHub Packages 경계

### package 및 인증 제안 (실행 가능한 발행 명령 아님)

배포 후보는 repository owner scope의 `@orderthan31/hangyeol-cli` 하나다. **미확정 신규 식별자**이며 기존 `shared-design-system`을 rename하는 결정이 아니다. CLI bin 이름도 review 후 정한다. UI source authoring workspace는 private이고 소비자가 UI package를 런타임 import하지 않는다. source payload는 CLI가 실행될 때만 읽는다.

GitHub Packages의 npm registry에 release tarball을 배포하고 npx가 이 scoped executable을 실행하는 경로를 제안한다. `@orderthan31`만 GitHub Packages registry로 라우팅하고 React/Radix 등 외부 dependency resolution은 기존 npm registry 설정을 존중한다. npmjs.com **발행** 금지는 외부 dependency **설치** 금지로 확대 해석하지 않는다. 명령/인증 setup은 미발행 후보를 실제 사용자 quick start처럼 기재하지 않는다.

공식 GitHub 문서에 따르면 로컬 package 인증은 PAT classic을 사용하며 read:packages와 실제 접근권한이 필요하다. public package라고 anonymous npx가 된다고 약속하지 않는다. GitHub Actions 발행은 repo GITHUB_TOKEN + packages:write를 우선 제안한다. visibility/접근 정책/기존 scope 사용 가능성은 reviewer 결정·실제 확인 대상으로 남긴다. secret는 Git/로그/생성 source에 넣지 않는다.

release guard 제안: package publishConfig registry=GitHub Packages, repository 연결, 승인된 workflow에서만 발행, npmjs registry로 향하면 prepublish guard가 실패. 지금 workflow 실행/패키지 발행 없음.

### 설치 transaction 제안

1. **init**: package/framework/React/Tailwind version, stylesheet, tsconfig aliases, source/public root를 읽는다. 변경 목록을 먼저 보여주고 미지원/충돌은 actionable error. host files를 몰래 고치지 않는다.
2. 공통 theme/font/helper를 생성한다. 기존 Pretendard 400/500/600/700 실제 woff2 + LICENSE + provenance를 tarball payload에서 복사하고 bytes/hash와 URL을 기록한다. base path가 다르면 명시 설정을 쓴다. metadata만으로 복사 완료라 하지 않는다.
3. **add**: requested item graph closure만 계산하여 source/작은 helper와 필요한 runtime/build/type dependency를 분리한다. Button만 선택한 깨끗한 프로젝트에 Recharts/react-is/docs/전체 UI를 넣지 않는다. init 공통 자산과 선택 add의 책임을 구분한다.
4. 경로 escape/절대 target/위험한 symlink/중복 target/hash 불일치를 검증한 뒤 계획된 파일을 생성한다. installer source ownership과 consumer 파일 소유를 구분한다.
5. 기존 생성물은 identical면 no-op, 편집됐으면 기본 conflict; overwrite 명시 선택과 backup 없이는 덮지 않는다. dependency 충돌에도 묵시적 downgrade가 없다. install 실패는 transaction 상태와 파일/dependency partial 결과를 정확히 보고한다.
6. 생성된 로컬 경로 import와 Tailwind/style entry로 실행한다. runtime에 CLI/payload import 없음. component className 변경과 theme/root/subtree override가 실제 화면에 반영되어야 한다.
7. component/source별 installed version/hash를 기록한다. update는 old base/현재 수정/new source 차이를 보여주고 명시적 merge/overwrite만 허용한다. 자동 latest 동기화로 consumer 수정물을 지우지 않는다.

미발행 개발 증명은 승인된 실제 CLI를 build/pack한 뒤 **실제 생성된 tarball**을 npx/npm exec로 실행한다. 이 증거는 local packed CLI 설치이며 GitHub Packages에서 내려받은 증거가 아니다. 최종 별도 gate에서 실제 package registry download+npx를 다시 검증한다.

## 6. 새 디자인과 첫 end-to-end 범위

대표 화면: **중립적인 작업 목록 + 새 항목 Dialog**. backend/특정 제품 정책 없이 local state로 add/filter/edit가 실제로 작동한다.

- 상단 제목/설명/action, TextField 검색, Select 필터, Tabs 상태별 목록, ListPanel/ListItem, 새 항목 Dialog의 TextField/Select/저장·취소.
- Foundations는 새 neutral surface/ink hierarchy + 제한된 action accent, 오류/선택/focus/busy 역할, 간격/타입/모서리/motion 기준을 함께 만든다. 기존 파란 박스/구 치수 유지가 목표가 아니다. 색/수치는 실제 화면과 대비 조합 검토를 거쳐 확정한다.
- PC는 탐색·목록·툴바 관계를 명확히 하고 모바일은 검색/필터/action 재배치와 읽기 순서를 유지한다. 첫 화면의 responsive 조작은 공통 DS 지원 증거이지 모든 소비 제품 mobile parity 승인이 아니다.
- 구현 범위: 위 primitive/composition + 실제 init/add CLI + manifest/font binary + docs 대표 화면/개별 Variant-Code-Docs + 새 consumer fixture. 첫 source installation graph 밖의 75개 확장은 하지 않는다.
- docs 설정/시연은 다른 owner, preview+current code+reset은 같은 state owner; component route 변경은 해당 state lifecycle을 명시한다. Dialog/Select portal도 consumer와 동일한 theme/context를 쓴다.

## 7. 재사용 반론·영향

1. **기존 CSS가 이미 분리돼 있는데 버리나?** source ownership 추출/행동 기대/기존 테스트는 근거로 재사용하지만 CSS-first appearance를 유지하면 요구 위반이다. source graph는 새 utility implementation으로 재생성한다. 이전 WIP bytes/history는 백업에 남긴다.
2. **native가 접근성이 좋으니 그대로?** 텍스트 입력/layout native는 유지가 타당하다. Select/Tabs/Dialog의 기존 자체 동작을 그대로 두고 Radix dependency만 추가하는 것은 타당하지 않다. 공개 API 변화와 form/reset 차이를 소비 예제로 설명한다.
3. **runtime UI package가 더 쉽지 않나?** 요구는 소스 소유다. CLI만 ephemeral 실행되고 생성 UI는 local import여야 한다. single tarball payload는 전달 편의이지 runtime UI 의존성이 아니다.
4. **기존 shadcn registry를 쓰면 되지 않나?** 일부 source 설치는 재사용 근거지만 font binaries/host adaptation/GitHub Packages executable/version atomicity를 별도 구현해야 한다. 전용 CLI를 제안하며 기본 shadcn source+core overlay로 대체하지 않는다.
5. **workspace와 API break 비용**: import 경로, Select/Dialog/Tabs public props 및 refs, tsconfig/build/lint 범위, docs route/state가 바뀐다. migration guide에 old→new를 명시한다. 전체 compatibility wrapper/old barrel을 first slice에 두어 새 구조를 오염시키지 않는다.
6. **GitHub Packages 접근 마찰**: npmjs 공개 발행과 달리 사전 scope/auth setup이 필요하다. 이를 숨기지 않고 지원 정책에 포함한다. 인증 미검증을 구조 승인 blocker와 혼동하지 않는다.
7. **전역 reset/portal/theme**: host에 Tailwind preflight를 강제로 켜거나 portal이 root theme만 쓰면 parity가 깨진다. 설치 계획/portal container/semantic utilities를 첫 소비 증명에 넣는다.
8. **lint 이전 경로**: 기존 policy를 중지하지 않는다. 신규 workspace coverage/실제 Tailwind compiler 연동은 별도 검토 후 보강하고 CSS-first 역사 문구는 새로운 적용 계약과 구분한다. green을 만들려고 fixture를 약화하지 않는다.

## 8. 첫 슬라이스 완료 증거와 gate

혜지의 구조/첫 범위 결정 기록 뒤 source 구현을 시작한다. 아래는 acceptance checklist이며 현재 통과 보고가 아니다.

- 깨끗한 React/Vite consumer에서 실제 packed CLI npx 실행, init/add 결과 파일·package/lock·font binary/license/hash를 대조.
- Button-only install과 전체 first-slice install을 별도 대조하여 Chart/docs/전체 barrel exclusion 확인.
- 기존 edited file conflict/no-op/명시 overwrite 보호, target path/alias/font URL/source scan 적용 확인.
- local UI import만으로 build/typecheck, docs와 같은 theme/default/state, consumer className override와 root/nested theme 변경 실제 화면.
- Select keyboard/value/FormData/reset, Tabs arrows/disabled/activation, Dialog Escape/focus return/간단 nested 및 form 버튼/loading/input identity를 짧은 actual browser smoke로 확인.
- PC/mobile 대표 화면과 reset/tab/component 이동 및 current code 일치, 갤러리 전용 appearance 부재.
- rapid gate: build/typecheck/diff + 기존 lint/coverage 명시 + 짧은 실제 화면. fullsuite/Playwright/coverage 반복을 초기 구현의 대기 gate로 쓰지 않는다. 최종 AT/IME/브라우저/전수 parity는 별도 상태다.
- ordinary commit/push 후 full SHA/tree/remote match를 제출. historical WIP를 묵시적으로 stage하지 않는다. AGENTS는 계속 제외.
- 사용자 디자인 수락 / 기술 완료 / GitHub Packages 실제 download+npx 검증·발행은 별도 판정. private5174 refresh·새 배포·실제 package publish는 이 단계가 허용하지 않는다.

## 9. reviewer 결정 요청

검토 대상은 (a) npm workspaces/단방향 source hierarchy, (b) UI private source + CLI bundled registry/assets 모델, (c) 신규 scoped CLI package 후보/접근 정책, (d) 위 first slice 범위/API 변화, (e) 새 Tailwind coverage를 포함하는 lint 적용 계약이다. 이미 확정된 Tailwind/Radix/source ownership/GitHub Packages/npmjs 발행 금지는 재질문하지 않는다.

공식 자료 확인: Tailwind Theme variables(@theme inline), Detecting classes in source files; Radix Select/Dialog/Tabs; GitHub Docs Working with the npm registry; npm Docs npx. 실제 dependency version 및 registry 실행은 아직 미검증이다.
