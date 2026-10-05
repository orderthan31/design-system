# TDS Mobile 레퍼런스 적용 계획

현재 프리뷰 공유 gate는 안정 checkpoint의 build/TypeScript 오류 없음과 공개 tree 민감정보 제외다. 전체 기능 확장·전체 테스트·독립 최종 수락을 이 checkpoint의 일반 commit/push 선행 조건으로 두지 않는다. 최종 DS 수락과 프리뷰 기능 점검은 분리한다.

상태: 첫 TextField/ListRow/BottomSheet/Dialog 및 후속 SegmentedControl/Slider/Rating/ProgressStepper/Result의 공개 core·단일 registry·실제 개별 상세를 연결했다. v3 reset/Button scoped 재리뷰는 통과했지만 전체 IA·나머지 범용 확장·최종 동일 tree 검증·독립 최종 수락은 아직 아니다. 상세 source/behavior/test/잔여는 component-inventory-v1.md에 연결한다.

## 기준과 직접 확인

- 확정된 개별 상세·범용 조합 범위를 기준으로 적용하며 내부 메시지 식별자는 공개 문서에 포함하지 않는다.
- 원본: https://tossmini-docs.toss.im/tds-mobile/
- 기존 browser helper는 기본 브라우저 profile 제약으로 시작하지 못했다. 설정을 바꾸지 않고 설치된 Playwright Chromium으로 원본을 직접 열었다. 소개 및 지정 BottomSheet/ListRow/TextField/Modal 5개 URL은 모두 HTTP 200, 실제 main/sidebar/목차/예시/props DOM과 1440px screenshot을 읽었다.
- 전체 sidebar DOM에 있는 링크를 canonical href로 중복 제거했다. 숨겨진 접힘의 자식 링크도 포함한다. 이것은 모든 component 상세를 조사하거나 모든 데모 동작을 인증한 결과가 아니다.
- TextField의 affix/trailing/clear/password, ListRow 영역 조합, BottomSheet 제목/CTA/선택 예시, Modal body/닫힘/접근성 절을 콘텐츠 구성의 참고로 삼는다. 문구·코드·Toss asset를 복제하지 않는다.

## 적용할 IA/상세

1. 단일 component registry로 개별 deep link·검색·기능군 탐색과 Foundations/Atoms/Molecules/Organisms/Templates 분류를 함께 제공한다. 동일 컴포넌트는 중복 정의하지 않는다. 기존 상위 route와 API identifiers를 보존한다. sidebar 현재 선택·접힘, 넓은 화면 section 목차, 모바일 선택 후 메뉴 닫기/초점 복원을 검증한다.
2. 상세 기본 화면은 이름 → 실제 조작 가능한 데모 → 짧은 variant/state 라벨. 코드/import·props 기본값/타입·조합 의존성·접근성/owner 책임은 탭/접힘으로 분리한다. 오류/형식/필수/위험 안내는 실제 UI에 유지한다.
3. 첫 대표 상세는 입력(Input/FormField 조합), 목록(List/ListItem 조합), BottomSheet, 모달(Dialog/Confirm)이다. 입력 prefix/suffix/trailing/clear와 목록 leading/content/trailing 일반 슬롯은 현재 core의 부족한 공개 조합으로 기록하고 실제 API·동작·테스트를 붙인다.
4. 오버레이는 단일/복수 action, 선택 적용·취소, body/스크롤, 중첩 Escape·focus·scroll 소유권을 실제 데모로 보여준다. 모바일 sheet를 단순 확대해 PC 모달로 쓰지 않는다. 문서용 focus-lock 해제 설정은 가져오지 않는다.
5. ListHeader/Footer, GridList, SegmentedControl, ProgressStepper, Slider/Rating, Result, BottomCTA를 순서대로 재사용/확장/누락 판정한다. 이름/카드/빈 콜백 추가를 기능 완료로 치지 않는다. 차트/커스텀 keypad 등의 미구현은 명시하며 무조건 제품특화라고 삭제하거나 전체 TDS 복제를 자동 승인하지 않는다.

## 소유권·검증 분리

- 이 대화가 source coordinator/writer다. scoped fix 범위는 form-controls+test, date-controls+css+test, organisms/navigation+관련 test였다. 조사 당시 supported delegate checkpoint에서 live child는 0이었고 이후 신규 파일만 맡은 (내부 검수 식별자 생략)의 3건을 사용했다. 해당 batch는 완료 반환·추가 쓰기 없음이며 부모가 source/exports/core/routes를 통합한다; 이것만으로 다른 대화 writer의 부재를 추정하지 않는다. 기존 명시 single-writer 합의를 유지하고 예상 밖 겹침만 멈춘다.
- 조사/매핑은 새 문서에 작성했다. 폼/날짜/선택색/중첩 Escape source 파일은 이 레퍼런스 조사로 덮어쓰지 않는다. 대표 상세는 별도 신규 파일에서 먼저 구성하고 App/registry/스타일/export 통합은 부모만 한다.
- IA 전 준비 working tree에서 parent 직접 clean install(audit 0), unit 234/49 files, build/typecheck, 신규 실제 Chromium 회귀 20건(320/390/768/1440), date unit 62건을 UTC/Los_Angeles/Apia/Kiritimati 각 시간대에서 통과했다. 이는 전체 browser·독립 재리뷰·최종 수락이 아니다.
- index `1f816ae63dc6b6636001c8c1cbc65f0356c7d426`는 이전에 거절된 snapshot이며 최신 working tree와 다르다. 이를 새로운 결과의 tree로 표기하지 않는다. IA 추가 뒤 새 동결 tree의 clean install/unit/build/dev/browser/screenshot/독립 재리뷰를 수행하고 일반 commit/push의 exact SHA를 대조·제출한다.
- DataTable/Pagination·GNB/LNB/Drawer·실제 한국어 DateRangePicker·PC/mobile·Pretendard·새 slate/theme·Lucide·기존 원본/테스트를 유지한다. 배포·소비앱 통합·force/reset·SDK/브랜드 asset 설치는 하지 않는다.

## 다음 안정 checkpoint의 회귀·검수 계약

- 대표 개별 상세: TextField 입력 조합, ListRow 목록 조합, BottomSheet 및 Dialog/Confirm. 실제 UI 적용·브라우저 검증·대표 화면 공유 전에는 조사 숫자나 registry 테스트를 화면 완료로 표기하지 않는다.
- Atomic/기능군/검색은 `src/gallery/registry.ts`의 동일 entry와 canonical component hash를 공유한다. 기존 상위 hash와 malformed-fragment 회귀를 보존한다. 잘못된 직접 진입은 Overview로 fallback하고, 실행 중 잘못된 hashchange는 직전 유효 화면을 유지한다. 유효 route의 직접 진입/refresh/back/forward는 실제 browser에서 URL·h1·aria-current 및 history.length를 함께 검사한다.
- 모바일 메뉴 **선택**은 메뉴를 닫은 뒤 새 상세 제목(h1, programmatic tabIndex=-1)에 초점을 둔다. **Escape 취소**는 route/선택을 바꾸지 않고 메뉴 trigger로 복귀한다. 재선택·backdrop 취소·브라우저 history 초점도 명시적으로 구분하고 native Dialog cleanup의 복원 race를 검사한다.
- 원래 리뷰 5건과 증적을 직접 연결한다: NumberInput(min 생략 off-grid/default/NaN·Infinity)의 실제 checkValidity/requestSubmit·disabled Combobox 전환 후 값/콜백 불변·DateTime 전체 원문 parsing/native/callback/status·core-only 선택 날짜 default/hover/pressed/focus·Menu/Tooltip 첫 Escape만 child 닫기와 parent focus/scroll 유지 및 다음 Escape 복원. unrelated unit totals를 원래 결함 해소 증거로 대체하지 않는다.
- 검수 자료는 승인된 목적지에만 제공한다. source snapshot 또는 baseline diff+신규 파일, tree/내용 해시 manifest, 회귀 근거, 최신 계획/inventory 및 대표 화면을 연결한다. env/credentials/원시 운영로그·개인 경로·node_modules·임시 브라우저 profile은 Git 및 공유 자료에서 제외한다. Git 프리뷰 공유와 별도 자료 첨부 허가는 구분한다.
- source/manifest snapshot과 staged Git tree를 구분한다. active children가 쓰는 중간 tree로 검수 packet을 동결하지 않는다. 이를 위한 미검수 commit/push·새 writer·전체 대기 gate는 만들지 않는다.

## 전체 sidebar 링크 대조

직접 수집한 고유 sidebar URL **67개**를 아래에 빠짐없이 대응시켰다. component 경로 **57개**에는 복합 컴포넌트의 하위 상세도 포함되므로 컴포넌트 family 개수와 같지 않다. 분류는 구현 완료/수락 표시가 아니다.

- `/` · 소개 · **IA 참고** → `Overview/README`. 짧은 설치/import 가이드·개별 상세 진입.
- `start/` · 시작하기 · **IA 참고** → `Overview/README`. 짧은 설치/import 가이드·개별 상세 진입.
- `foundation/colors/` · Colors · **재사용** → `theme/tokens/Pretendard`. 기존 scoped palette/contrast 및 타이포 상세.
- `foundation/typography/` · Typography · **재사용** → `theme/tokens/Pretendard`. 기존 scoped palette/contrast 및 타이포 상세.
- `components/badge/` · Badge · **재사용** → `Badge`. tone/state 상세.
- `components/board-row/` · Board Row · **확장** → `ListItem + Badge`. leading/content/trailing 일반 슬롯과 요약행.
- `components/border/` · Border · **재사용** → `Separator`. 구분선·간격.
- `components/bottom-info/` · Bottom Info · **확장** → `Alert/필드 help + footer`. 하단 안내 슬롯.
- `components/bottom-sheet/` · Bottom Sheet · **재사용+확장** → `BottomSheet → Dialog`. title/body/footer·단일/복수 CTA·선택 후 적용 상세.
- `components/bubble/` · Bubble · **누락** → `별도 공개 API 없음`. 비모달 말풍선 표현은 Tooltip과 구분.
- `components/button/` · Button · **재사용** → `Button`. kind×size×default/busy/disabled + H/P/F.
- `components/checkbox/` · Checkbox · **재사용** → `Checkbox/CheckboxGroup`. 선택·mixed·그룹 disabled.
- `components/grid-list/` · Grid List · **조합 확장** → `Grid + List/ListItem`. 격자 목록의 공개 조합과 반응형 의미 구조.
- `components/highlight/` · Highlight · **누락** → `공개 강조 텍스트 API 없음`. mark 기반 강조·읽기 대비.
- `components/icon-button/` · Icon Button · **재사용** → `IconAction/IconButton`. Lucide·한국어 accessible name.
- `components/list-footer/` · List Footer · **조합 확장** → `ListPanel/ActionGroup`. 목록 footer·메타·action 공개 조합.
- `components/list-header/` · List Header · **조합 확장** → `ListPanel/Stack`. 제목/설명/우측 action 공개 조합.
- `components/loader/` · Loader · **재사용** → `LoadingSpinner`. status·reduced motion.
- `components/menu/` · Menu · **재사용** → `Menu`. 선택 결과·키보드·모달 내부 Escape.
- `components/modal/` · Modal · **재사용** → `Dialog/Confirm`. 기존 API 유지·PC/mobile 모달 상세.
- `components/numeric-spinner/` · Numeric Spinner · **재사용** → `NumberInput/Stepper`. 숫자 격자·native 제출·disabled.
- `components/paragraph/` · Paragraph · **조합 확장** → `타이포 토큰 + native text`. 공개 텍스트 조합/문서 규칙.
- `components/post/` · Post · **조합 확장** → `타이포/본문 슬롯`. 본문·제목·목록 표현; 편집 엔진 아님.
- `components/progress-bar/` · Progress Bar · **재사용** → `Progress`. determinate/indeterminate.
- `components/progress-stepper/` · Progress Stepper · **후속 구현/부모 연결** → `ProgressStepper` ordered ol/li/current/completed/pending + 실제 단계 변경 상세. 숫자 Stepper/navigation과 구분한다. 최초 조사 누락 판정은 역사이고 전체 TDS 수락은 아니다.
- `components/rating/` · Rating · **후속 구현/부모 연결** → `Rating` native radio/required/FormData/keyboard/disabled/clear·비제어 및 최신 controlled reset. 공개 core와 실제 상세·source/Chromium 회귀를 inventory에 연결했다.
- `components/result/` · Result · **후속 조합 구현/부모 연결** → `Result → Alert/Icon + Button action slots`. 실제 retry/add/result status와 success/error/empty/info·복구 안내. 원격 저장/서비스 성공으로 오인하지 않는다.
- `components/search-field/` · Search Field · **재사용+확장** → `SearchField/Input(search)`. 검색·clear·목록 연동.
- `components/segmented-control/` · Segmented Control · **후속 구현/부모 연결** → `SegmentedControl (native radio group)`. 정본 개별 상세·제어/비제어·FormData/필수/reset·disabled/키보드 및 별도 후속 checkpoint 검증. Tabs/tabpanel과 구분하며 최초 조사 때의 누락 판정을 구현 완료 숫자로 소급하지 않음.
- `components/skeleton/` · Skeleton · **재사용** → `Skeleton`. loading·읽기 안내.
- `components/slider/` · Slider · **후속 구현/부모 연결** → `Slider` native range·유한 범위/step·numeric change·FormData/disabled·keyboard/reset. 공개 core와 실제 개별 상세·회귀를 inventory에 연결했다.
- `components/stepper/` · Stepper · **대조 확장** → `숫자 Stepper 현재 존재`. 동명 API의 실제 역할 대조; 단계 진행과 혼동 금지.
- `components/switch/` · Switch · **재사용** → `Switch`. checked/default/disabled/required.
- `components/tab/` · Tab · **재사용+확장** → `Tabs`. 선택·tabpanel·키보드 및 현재 API 제한 문서.
- `components/table-row/` · Table Row · **조합 확장** → `Table/ListItem`. 모바일 행 조합; PC DataTable 대체 금지.
- `components/text-button/` · Text Button · **재사용** → `Button quiet/ghost`. 비-submit 텍스트 action.
- `components/toast/` · Toast · **재사용** → `Toast`. dismiss 요청·상태 안내.
- `components/tooltip/` · Tooltip · **재사용** → `Tooltip`. 설명·focus/Escape; modal 내부 소비.
- `components/top/` · Top · **조합 확장** → `Breadcrumb/Stack/ActionGroup`. 공개 제목·부제목·action 조합.
- `components/Agreement/v3/` · V3 · **조합/정책 분리** → `CheckboxGroup + Accordion`. 범용 동의 표시 조합 점검; 법률/동의 정책은 소비자 책임.
- `components/Agreement/v4/` · V4 · **조합/정책 분리** → `CheckboxGroup + Accordion`. 범용 동의 표시 조합 점검; 법률/동의 정책은 소비자 책임.
- `components/Asset/check-first/` · Asset 이해하기 · **부분 재사용** → `Icon + ListItem.thumbnail`. 범용 icon/image frame 점검; Toss asset/Lottie/팩 설치 없음.
- `components/Asset/frame/` · Asset 활용하기 · **부분 재사용** → `Icon + ListItem.thumbnail`. 범용 icon/image frame 점검; Toss asset/Lottie/팩 설치 없음.
- `components/Asset/asset/` · 래핑한 컴포넌트 활용하기 · **부분 재사용** → `Icon + ListItem.thumbnail`. 범용 icon/image frame 점검; Toss asset/Lottie/팩 설치 없음.
- `components/BottomCTA/check-first/` · BottomCTA 이해하기 · **후속 범용 구현·실제 상세 연결** → `BottomCTA/BottomCTARegion` (`Button + ActionGroup + Container`). Single/Double native 동작·실제 fixed·측정 높이 예약·safe-area·소유 본문/초점 보호·PC1200px. SDK/keyboard 전용 계약은 별도 미지원.
- `components/BottomCTA/Single/` · Single · **후속 범용 구현·실제 상세 연결** → `BottomCTA/BottomCTARegion` (`Button + ActionGroup + Container`). Single/Double native 동작·실제 fixed·측정 높이 예약·safe-area·소유 본문/초점 보호·PC1200px. SDK/keyboard 전용 계약은 별도 미지원.
- `components/BottomCTA/Double/` · Double · **후속 범용 구현·실제 상세 연결** → `BottomCTA/BottomCTARegion` (`Button + ActionGroup + Container`). Single/Double native 동작·실제 fixed·측정 높이 예약·safe-area·소유 본문/초점 보호·PC1200px. SDK/keyboard 전용 계약은 별도 미지원.
- `components/BottomCTA/fixed-bottom-cta/` · FixedBottomCTA · **후속 범용 구현·실제 상세 연결** → `BottomCTA/BottomCTARegion` (`Button + ActionGroup + Container`). Single/Double native 동작·실제 fixed·측정 높이 예약·safe-area·소유 본문/초점 보호·PC1200px. SDK/keyboard 전용 계약은 별도 미지원.
- `components/Chart/bar-chart/` · Bar Chart · **미구현/별도 범위** → `공개 chart API 없음`. 범용 chart 누락 기록; Progress를 chart 완료로 치지 않음.
- `components/Dialog/dialog/` · Dialog 이해하기 · **재사용** → `Dialog/Confirm/Alert`. 안내/확인 조합; TDS SDK API로 교체하지 않음.
- `components/Dialog/alert-dialog/` · AlertDialog · **재사용** → `Dialog/Confirm/Alert`. 안내/확인 조합; TDS SDK API로 교체하지 않음.
- `components/Dialog/confirm-dialog/` · ConfirmDialog · **재사용** → `Dialog/Confirm/Alert`. 안내/확인 조합; TDS SDK API로 교체하지 않음.
- `components/Keypad/alphabet-keypad/` · Alphabet Keypad · **미구현/별도 범위** → `Input inputMode/type`. 커스텀 keypad 미구현; 보안 키패드는 플랫폼/보안 범위 분리.
- `components/Keypad/full-secure-keypad/` · Full Secure Keypad · **미구현/별도 범위** → `Input inputMode/type`. 커스텀 keypad 미구현; 보안 키패드는 플랫폼/보안 범위 분리.
- `components/Keypad/number-keypad/` · Number Keypad · **미구현/별도 범위** → `Input inputMode/type`. 커스텀 keypad 미구현; 보안 키패드는 플랫폼/보안 범위 분리.
- `components/ListRow/list-row-overview/` · ListRow 이해하기 · **재사용+확장** → `List/ListItem`. left/content/right·다중 텍스트·선택/action 확장; Legacy 이전 API는 복제하지 않음.
- `components/ListRow/list-row-components/` · ListRow 영역 구성하기 · **재사용+확장** → `List/ListItem`. left/content/right·다중 텍스트·선택/action 확장; Legacy 이전 API는 복제하지 않음.
- `components/ListRow/ListRowLegacy/list-row-legacy/` · ⚠️ v3에서 제거되는 API · **역사/제외** → `기존 API 호환 보존`. TDS 제거 예정 Legacy API의 신규 복제 없음.
- `components/TextField/text-field/` · TextField · **재사용+확장** → `Input/FormField/PasswordInput/Textarea`. affix/trailing/clear·입력 조합 상세; SplitTextField는 공개 조합 누락 점검.
- `components/TextField/split-text-field/` · SplitTextField · **재사용+확장** → `Input/FormField/PasswordInput/Textarea`. affix/trailing/clear·입력 조합 상세; SplitTextField는 공개 조합 누락 점검.
- `components/TextField/text-area/` · TextArea · **재사용+확장** → `Input/FormField/PasswordInput/Textarea`. affix/trailing/clear·입력 조합 상세; SplitTextField는 공개 조합 누락 점검.
- `hooks/OverlayExtension/check-first/` · Overlay Extension 이해하기 · **관리 API 차이** → `controlled open + callback`. hook/queue 신규 도입 자동 승인 아님; 현재 소유권 계약 유지.
- `hooks/OverlayExtension/use-dialog/` · useDialog · **관리 API 차이** → `controlled open + callback`. hook/queue 신규 도입 자동 승인 아님; 현재 소유권 계약 유지.
- `hooks/OverlayExtension/use-toast/` · useToast · **관리 API 차이** → `controlled open + callback`. hook/queue 신규 도입 자동 승인 아님; 현재 소유권 계약 유지.
- `hooks/OverlayExtension/use-bottom-sheet/` · useBottomSheet · **관리 API 차이** → `controlled open + callback`. hook/queue 신규 도입 자동 승인 아님; 현재 소유권 계약 유지.
- `migration/from-toss-design-system/` · @toss-design-system에서 마이그레이션 · **SDK 전용/제외** → `기존 API 유지`. Toss SDK 설치·이전 작업 없음.
- `migration/v2/` · v1에서 v2로 마이그레이션 · **SDK 전용/제외** → `기존 API 유지`. Toss SDK 설치·이전 작업 없음.
