# 한결디자인 첫 슬라이스 — owner 검증 v2

2026-10-07 · T-DES-003 `1557376481577934970` · sole writer 혜나.

## 현재 상태

첫 기술 checkpoint의 owner 검증 결과다. 사용자 디자인 수락·전수 기술 완료·실제 GitHub Packages 발행은 아니다. 과거 worker의 Chromium sandbox 실패는 유지하되 owner 환경에서는 Chromium 141.0.7390.37로 실제 화면 검증을 실행했다.

## 구현과 보완

- npm workspaces, canonical UI → CLI/source/font payload → 독립 consumer의 로컬 import 흐름.
- Tailwind 4.3.3, 실제 Radix Select/Tabs/Dialog, native Button/Input/List/layout.
- 작업 목록의 검색/필터/상태 탭/생성/편집/저장/취소.
- 모바일 TextField clear button의 줄바꿈·축소 수정. FormData 출력의 unbroken JSON에 `min-w-0 break-all` 적용. source 수정과 실제 consumer 재build를 구분해 확인했다.
- 브라우저 smoke의 키보드와 async focus 판정은 실제 option/tab/focus에 대한 bounded assertion으로 변경했다. 실패를 숨기지 않고 worker 기록과 owner 실패/성공 로그를 별도 evidence에 보존했다.

## 실제 검증

- `build:slice`, `typecheck:slice`, `test:slice` 성공. Node tests 4, Vitest tests 9 성공.
- `lint:slice`: 27 source files, 108 component sites, 4 CLI/manifest files, 151 static classes (브랜드 표시 변경 후 최종 검사); diagnostic/unknown 0. 실제 Tailwind compiler와 negative fixture 사용.
- `lint:design`와 기존 fixture 실행 성공. 과거 plugin fixture run에는 Tailwind worker timeout 뒤 bundled grammar fallback 경고가 있었다. 신규 compiler-aware 검사 성공과 구분한다.
- 기존 root build 성공은 보존된 dirty WIP를 포함한 local 결과이며, historical WIP를 이번 commit에 stage했다는 의미가 아니다.
- 로컬 packed CLI를 실제 npm exec로 실행한 repo 밖 Button-only/full-slice consumer를 사용했다. package/lock/생성 source hash와 선택 dependency를 대조했고 독립 build 성공. CLI tarball proof는 실제 GitHub Packages 다운로드 proof가 아니다.
- docs/Button-only/full-slice에서 실제 Pretendard 400/500/600/700 HTTP bytes/MIME/hash/FontFace load 확인.
- Preflight 없는 native host sentinel, Select keyboard/FormData/reset, Dialog focus trap/Escape/return, Select-in-Dialog, manual Tabs/disabled skip, loading/input identity/selection, 중첩 열린 portal theme 변경, standard/custom utility computed override, docs current Code/reset 확인.
- 초기 desktop 1280px와 mobile 390/320px 및 조작 후 320px에서 document overflow 없음. 검사한 browser console/network error 없음. screenshots를 owner가 직접 열어 검토했다.

## 브랜드 및 시각 판단

변경 지시 `1557396468120158269`와 철학 문서 `1557394672014336000`를 읽고 신규 header/sidebar/browser title/README/개발 docs 표기를 한결디자인으로 반영했다. 개발 repository/package/bin/import/config 이름은 유지한다. 영문 브랜드와 최종 로고는 미확정이며 G 모노그램을 새 로고로 확정하지 않았다.

현재 후보는 warm neutral surface, ink hierarchy, olive primary action이다. 목록을 개별 카드로 싸지 않고 공통 시작선·간격·행 구분으로 관계를 만들며, accent는 주요 행동에 제한한다. 구 blue 유지와 기본 shadcn 외관 복제는 채택하지 않았다. 1280/390/320의 입력·목록·Dialog에서 검토했으나 최종 palette/contrast/logo 수락은 별도다. 현재 wordmark는 읽기 쉬운 텍스트 표기이며 최종 시안이 아니다.

## 보존 및 후속 리뷰

과거 WIP 27파일을 baseline SHA-256과 재대조하여 불변을 확인했다. AGENTS 및 historical source/registry/install guide는 stage하지 않는다. 제안/결정 원문은 private evidence에 보존하고 Git 공유본에서 운영 절대경로만 치환했다. historical 문서의 이전 승인/preview freeze 기록은 최신 브랜드·preview 운영 지시를 덮어쓰지 않는다.

혜지의 exact-SHA 리뷰 → 보완 → 다음 sprint 배정으로 이어간다. 이번 구현의 정적 preview entry는 `apps/docs/dist`이며 root의 historical `dist`와 다르다. 최신 사용자 지시에 따라 5174 갱신은 혜지가 exact SHA로 담당한다. owner 로컬 build/browser 확인은 remote 5174 갱신 증거가 아니다.

미검증: Safari/Firefox, 실기기 AT/IME 및 soft keyboard, 전수 component parity/대비, logo 후보의 독창성, live GitHub Packages 접근/발행. 광범위 통합테스트는 디자인 형성 뒤의 별도 gate다.
