# 한결디자인 재구축 — 구조 및 첫 슬라이스 결정 v1

작성: 혜지 / 2026-10-07
정본: T-DES-003 / thread 1557376481577934970
검토 입력: rebuild-proposal-v1.md 및 요구 정본 5개 문서, 혜나 보고 1557379172207169558–1557379174950371419.
판정: 구조 및 첫 end-to-end 구현 착수 승인. 새 디자인 사용자 수락, 구현 통과, 최종 배포 승인과 구분한다.

## 1. 검토 증거와 한계

Discord에서 요구 정본과 owner 보고를 다시 읽었다. 첨부 제안서 본문을 요구에 대조했다. 아래 기존 로컬 검토 사본의 source를 직접 읽었다.

- `<review-copy-1>/`: package.json:20–49, src/components/button.tsx:18–38, text-field.tsx:19–43, src/index.ts:1–40, docs/source-installation.md:3–48, scripts/lint-design.mjs:10–23.
- `<review-copy-2>/`: package.json:20–49, src/components/select.tsx:1–5, tabs.tsx:10–45, dialog.tsx:12–90.
- `<historical-preview>/release.json:2–8`는 과거 배포의 SHA `9cdd458bd8e8c88e31e6e24613e0d8e73a35cc9b`, tree `18d24af4e8d123c5dfecf1b9db1e44f55fcfec46`를 기록한다. 이는 metadata 읽기이며 이번 HTTP/OCI/asset 재검증이 아니다.

로컬 검토 사본의 현재 Git 기준점을 추가 조회하려던 command는 승인 응답 없이 종료되어 실행되지 않았다. 재시도하거나 우회하지 않았다. 따라서 위 사본을 이번에 exact-SHA 재확인한 source라고 주장하지 않는다. Mac dirty/27파일 백업/history bundle 대조는 혜나의 owner 증거이며 reviewer가 Mac에서 재실행한 결과가 아니다. build-registry.mjs는 위 사본에서 찾지 못했으므로 새 Mac WIP의 registry builder와 75개 graph를 독립 전수 인증하지 않았다. 이러한 한계는 구조 착수 승인과 새 구현 acceptance를 구분하여 기록한다.

읽은 source는 CSS-first Button, native Select, 자체 Tabs keyboard, Dialog modalOwners/showModal/focus logic, 전체 barrel의 chart 재수출, source-install 문서의 수동 font 전달 및 src-only lint 범위를 보여준다. 기존 구조의 동작 기대/source graph는 입력 근거이며 거절된 appearance를 유지할 이유가 아니다.

## 2. 채택 구조

npm workspaces를 채택한다. root의 기존 name 및 repository identity는 유지한다.

- `packages/core/src/ui/foundation/`: semantic theme, 타입/간격/모션 및 font/utility bridge.
- `packages/core/src/ui/lib/`: 작은 공통 helper.
- `packages/core/src/ui/primitives/`: styled controls, native List/layout.
- `packages/core/src/ui/components/`: 실제 primitive 조합.
- `packages/cli/`: project discovery, 변경 계획, 검증, source 생성, 의존성 설치.
- `registry/items/`, `registry/assets/`: source/dependency closure, target/hash/asset manifest.
- `apps/docs/`: 실제 설치 source와 예제/Variant/Code/Docs.
- `apps/consumer-fixture/`: 재현 가능한 fixture 정의. 이것만으로 clean install을 증명하지 않음.

foundation/lib → primitives → components의 import 방향을 유지하고 UI가 docs/registry/CLI를 import하지 않는다. 소비 기본 target `src/hangyeol/`, 설정 파일 `hangyeol.json`을 채택하되 source/style/public root와 aliases는 설정 가능하게 한다. 내부 상대 import는 target 이동 후에도 보존한다. 전체 barrel을 소비 payload로 가져오지 않는다.

## 3. 스타일 및 실제 primitive 책임

Tailwind v4 + 첫 React/Vite adapter, 정적 typed variant table 및 clsx/tailwind-merge helper 방향을 채택한다. 실제 dependency/engine 지원 버전을 확인하고 lock한다. v3나 다른 framework를 지원했다고 확대 보고하지 않는다.

scoped semantic 변수 + top-level namespaced `@theme inline` bridge를 사용한다. 실제 compiler로 생성된 utilities가 소비 화면에 반영되어야 한다. 기본 appearance를 old CSS/@apply 꾸러미로 보존하지 않는다. 최소 CSS는 역할별 semantic/font/필수 base/motion으로 한정한다.

consumer className은 마지막 merge하되 문자열 순서만으로 override를 증명하지 않는다. custom token utility와 표준 utility 사이의 padding/radius/background/text-size/text-color 충돌을 실제 helper 출력과 브라우저 computed style로 확인한다. 필요한 merge 설정은 작은 명시 계약으로 둔다.

- Button/Input/List/layout: native semantics를 유지한다. Slot은 실제 필요 시만 사용. 첫 Button은 native를 우선하며 loading+asChild를 미지원으로 제한해도 된다. loading guard/type=button/ref/native 전달을 보존한다.
- TextField: actual input의 ref/native props/className과 wrapper/slot props를 구분한다. clear는 내부 ref와 사용자 ref를 함께 연결하고 controlled/uncontrolled ownership 및 IME를 깨지 않도록 구현한다. querySelector와 강제 DOM value mutation을 그대로 재사용하지 않는다.
- Select: 실제 Radix Root/Trigger/Content/Item에 동작을 맡긴다. native children/ChangeEvent/HTMLSelectElement ref 호환을 주장하지 않는다. name/required 지원과 FormData/reset은 wrapper의 명시 계약과 실제 조작으로 검증한다. controlled 값은 owner에 있고 native reset과 동일하다고 가정하지 않는다. 필요한 reset adapter는 기존 자체 dropdown engine을 부활시키는 방식이 아니다.
- Tabs: Radix Root/List/Trigger/Content, value/activation/orientation/disabled 계약. docs state owner는 패널 밖에 두어 Code/Docs 이동과 preview state lifecycle을 분리한다.
- Dialog: 실제 Radix Root/Trigger/Portal/Overlay/Content/Title/Description/Close. 기존 modalOwners/showModal을 병행하지 않는다. trigger 없음/초기 open의 복귀 대상과 async 닫힘을 명시한다.

Portal은 단순히 subtree container를 전달했다는 이유로 완료가 아니다. theme/font inheritance와 overflow/clipping, transformed ancestor, modal layering 및 Select-in-Dialog focus를 함께 확인한다. modal inert/aria-hidden 영역 밖으로 Select를 잘못 보내지 않는다. 필요한 최소 theme/portal context는 local UI source로 설치되며 docs-only context가 아니다. root/nested theme 변경과 열려 있는 portal의 업데이트까지 같은 경로에서 확인한다.

Preflight를 host 전체에 묵시 추가하지 않는다. 이미 있는 host reset은 읽고 변경 preview에 포함한다. reset 없는 consumer도 첫 지원 경로로 확인하고 필요한 최소 base는 Hangyeol scope 및 portal에만 적용한다. 이것이 plain-CSS appearance 재도입의 명분이 되어서는 안 된다. Tailwind source scan 밖 target은 명시 source 등록으로 처리한다.

## 4. CLI 및 release 경계

CLI executable + 동일 version의 canonical UI source/registry/font/license payload를 하나의 tarball로 묶는 모델을 채택한다. registry는 수작업 source 복제본이 아니라 canonical source에서 수집한다. private UI workspace는 authoring boundary이며 npm publish 대상이 아니다.

개발 식별자는 신규 `@orderthan31/hangyeol-cli`, 단일 bin `hangyeol`로 채택한다. 기존 package/repository rename은 아니다. 이 결정은 registry availability/발행/anonymous 실행 성공의 확인이 아니다. namespace 가능성, package visibility 및 실제 권한 확인은 release gate에 남긴다. README에 미발행 식별자를 작동하는 registry quick start처럼 제시하지 않는다.

init은 host discovery/계획/theme/font/helper, add는 선택 closure를 담당한다. external runtime/build/type deps와 CLI 자체 deps는 분리한다. React 기존 버전/lock/config를 묵시 downgrade하거나 auth/global registry를 몰래 바꾸지 않는다. init 공통 font/license와 component add 파일을 구분한다.

생성 전에 전체 target collision/path escape/symlink/hash/conflict를 검증한다. identical=no-op, edited=conflict. overwrite는 명시 선택 및 backup이 있을 때만 허용한다. dependency 설치 실패는 계획/실제 파일/package/lock 상태를 정확히 보고하고 consumer 편집물을 파괴하는 무조건 rollback을 하지 않는다. installed metadata는 성공한 범위만 기록한다.

첫 CLI는 실제 init/add/no-op/conflict/명시 overwrite와 version/hash 기록까지 구현한다. 자동 update/3-way merge engine을 첫 slice에 몰아넣지 않으며 미구현 명령을 성공 기능으로 문서화하지 않는다. 업데이트가 생겨도 편집물 묵시 교체를 금지하는 ownership 계약은 지금부터 유지한다.

GitHub Packages에는 승인된 완료 release만 배포한다. 로컬 PAT classic/read 권한, Actions GITHUB_TOKEN/packages:write 및 scope routing을 구분한다. auth secret는 생성 source/repo/log에 넣지 않는다. npmjs 발행은 금지하고 필요한 외부 npm dependency 설치는 허용한다. publishConfig/승인 workflow/효과적 registry guard는 방어층이며 실제 publish는 이번 단계에서 실행하지 않는다.

## 5. 첫 실행 범위

제품 중립적인 작업 목록 + create/edit Dialog를 local state로 구현한다. 검색/필터/Tabs/저장·취소와 empty/disabled/error/loading 상태가 실제 작동해야 한다. 제품 enum/backend는 docs 예제 owner에만 두며 reusable component API에 넣지 않는다. 재사용 primitive/composition과 예제 동작을 구분한다.

새 타입/간격/surface/ink/action accent/state 관계를 첫 화면으로 제시한다. 구 블루/구 14px/구 토큰 수치 보존 목표나 기본 shadcn 모습에 이름만 붙인 결과는 승인하지 않는다. 과한 hero, 중첩 카드, 모든 행의 rounded box로 새 디자인을 대신하지 않는다. 색/수치의 최종 디자인 판단은 실제 PC/mobile 화면 및 의미 있는 대비 조합 검토 뒤에 한다.

docs는 검색/Overview/Foundations/영어 component 목록과 첫 범위의 실제 예제 한 개 + Variant/Code/Docs를 구현한다. 작업 목록은 대표 slice 화면이며 무의미한 Templates/모아보기 page를 재생성하는 이유가 아니다. preview/code/reset은 같은 typed state owner를 사용하고 docs chrome으로 component appearance를 몰래 수정하지 않는다.

## 6. 첫 checkpoint 증거

1. 승인된 실제 CLI를 build/pack하고 tarball filename/version/hash를 보존한다. local npm exec/npx 실제 실행 로그를 남긴다. direct node dist 실행만으로 npx를 증명하지 않는다.
2. repo 밖의 disposable Button-only 및 full-slice consumers를 각각 만든다. repo/workspace UI symlink/import와 root node_modules 의존 없이 독립 package/lock으로 install/build한다. fixture template은 사용할 수 있지만 workspace hoisting으로 성공한 것과 구분한다.
3. 파일별 source/hash/target, 실제 font binary/license/provenance와 HTTP URL/MIME/bytes/font load, runtime/build/type dependency 포함·제외를 대조한다. Button-only에 Chart/Recharts/docs/전체 barrel이 없어야 한다. asset 공통 init 책임은 별도로 센다.
4. installed source만으로 build/typecheck, default/root/nested theme/className override 및 reset 없는 host isolation을 확인한다. docs generated source는 같은 canonical source/manifest와 hash가 맞고 수동 패치가 없어야 한다.
5. 짧은 실제 브라우저 조작으로 Select keyboard/value/FormData/reset, Tabs activation/disabled, Dialog focus trap/Escape/return, Select-in-Dialog, loading/input identity, no-op/conflict/overwrite 보호를 확인한다. 320/390px와 desktop에서 overflow·긴 제목·toolbar 재배치·portal을 확인한다. fullsuite/Playwright 반복 대기 gate를 만들지 않는다.
6. build/typecheck/diff + 기존 lint 및 신규 coverage 결과를 남긴다. 기존 src checker/fixture를 보존하면서 packages/ui, apps/docs/generated source, CLI/manifest 해당 경로를 검사한다. 실제 Tailwind compiler-aware 검사와 recognized component negative fixture를 포함한다. 기존 findings/new touched findings/미검증 범위를 분리하고 파일 0개 검사로 green을 만들지 않는다.
7. no-restyle 규칙과 소비 override 증명의 충돌은 전용 customization 예제/fixture에만 좁은 documented 예외로 해결한다. primitive authoring과 일반 docs usage의 규칙을 구분하고 raw color/arbitrary class/global disable로 모든 화면을 제외하지 않는다. 구 14px/블루 같은 historical aesthetic policy는 새 재구축 방향에 맞춰 설명 있는 migration으로 변경할 수 있다. lint를 green으로 만들기 위해 검사를 약화하는 변경은 금지한다.
8. historical WIP/AGENTS를 묵시 stage하지 않고 새 승인 범위만 ordinary commit/push한다. full SHA/tree, remote match, runtime/명령 exit, owner browser evidence 및 deferred 항목을 제출한다. public-tree에 로컬 백업/credentials/private 절대경로/운영 raw logs를 넣지 않는다.

## 7. 실행 권한 및 후속 판정

혜나는 sole source writer로 위 결정문을 repo docs에 반영하고 첫 slice를 즉시 구현·검증·ordinary push한다. 수신/계획-only 답변을 한 번 더 요구하지 않는다. 독립 reviewer는 read-only를 유지한다. 예상치 못한 competing writer/파일 mutation은 해당 범위만 조정한다.

reset/delete/force-push/기존 이름 rename/AGENTS 수정/제품앱 통합/private5174 refresh/새 service 배포/실제 package publish는 허용하지 않는다. 본 결정은 기존 preview를 제거하거나 재구축 source로 바꾸는 결정이 아니다.

후속 보고는 기술적 첫 checkpoint, 실제 새 디자인 시연, 사용자 디자인 수락, 전수 최종 기술 acceptance, GitHub Packages 다운로드+npx 및 발행을 별도 상태로 유지한다. 첫 구현 checkpoint 뒤 동일 SHA를 독립 검토하며 미승인 모습을 전체 75개에 선복제하지 않는다.

## 공식 근거 재확인

검토 시 공식 Tailwind theme/source detection/preflight, Radix Select/Tabs/Dialog, GitHub npm registry 인증 및 npm-exec 문서를 조회했다. scoped semantic 변수에 top-level @theme inline을 연결하는 근거, static class discovery, optional preflight imports, primitive 실제 props/portal, public package 포함 인증 및 local executable boundary를 확인했다. 실제 의존성 설치/registry 인증/신규 CLI 실행은 이번 reviewer 설계 검토에서 수행하지 않았다.
