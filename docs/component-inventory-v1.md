# 공통 컴포넌트 인벤토리 v1

현재 공유 기준: build/TypeScript 오류가 없는 안정 checkpoint는 먼저 Git으로 공유하고 동일 commit의 프리뷰에서 기능 점검한다. 아래 범위별 이력은 최종 전체 수락이 아니며, 과거 검수 전 push 보류를 현재 프리뷰 공유의 선행 조건으로 적용하지 않는다. 전체 coverage·동일 트리 독립 최종 수락은 별도 잔여다.

## 파일/주소/월/시간/날짜시간 canonical 상세 checkpoint

- `hasExtendedInputDetail`은 FileInput/AddressField/MonthPicker/TimeInput/DateTimeInput 자기 route에 기존 core·필요 controls·현재 코드·API 제약을 연결합니다. core 재작성·외부 요청·엔진을 추가하지 않습니다.
- FileInput accept/multiple/required/disabled/error, native 선택·파일명·onFilesChange(File[]) 결과 및 선택 비우기/초기화를 제공합니다. value/defaultValue 파일 경로 string API를 만들지 않습니다. 하나라도 형식 거절이면 native 선택·소비자 배열 전체를 비우고 invalid를 표시합니다. 현재 코드는 실제 File 객체를 직렬화/재생하지 않고 선택·콜백·설정 방법입니다. accept 변경만으로 기존 파일을 재검증하지 않습니다. 초기화는 owner 배열 [] + subtree 재마운트이며 native form.reset 동기화가 아닙니다. 외부 error와 accept custom validity는 구분합니다. 업로드·전송·크기/개수 상한은 없습니다.
- AddressField는 postal/road/jibun/detail 제어형 value/onValueChange, disabled/required/error 및 searchSlot(select)로 가상 로컬 샘플을 선택합니다. 실제 provider/SDK/주소 검색이 아니며 네트워크 어댑터를 추가하지 않습니다. postal 5자리 native pattern·postal/road required와 name.key 제출 계약, onSearch/searchSlot callback·임의 slot disabled의 소비자 소유를 설명합니다. 외부 provider 수락은 미완료이며 로컬 canonical 예제 연결과 구분합니다.
- 날짜 3종은 확정 value/onChange와 onValidityChange를 별도로 표시하고 disabled/readOnly/busy/required/error·범위 제한을 실제 preview/현재 코드에 연결합니다. DateTimeInput만 disabledDates 옵션을 연결합니다. min/max는 양끝 포함이고, 잘못된 내부 draft는 확정 value와 다를 수 있습니다. 빈/부분값 onChange는 validity true 이벤트가 아니며 시간대 없는 문자열 계약입니다. timezone API/name/form/id/step/onDraftChange를 invent하지 않습니다. 초기화는 owner 값·설정과 내부 draft/팝업을 되돌리는 preview 재마운트입니다.
- bounded Chrome 390/1440px 5route: 실제 로컬 txt 파일 선택·거절·복수 유효 재선택/초기화(FileList/콜백/invalid), 주소 로컬 sample·상세 입력/우편번호 오류·disabled 차단, 월 달력 선택/범위 draft, 시간/날짜시간 유효 변경과 invalid draft/확정 분리, 상태·빈 required/오류를 확인했습니다. 해당 범위 document overflow/runtime exception 발견 없고 표시 TSX30개 typecheck 오류0입니다. 해당 브라우저 조작 동안 POST/PUT/PATCH 요청은 없었고 구현에도 외부 전송 코드가 없습니다. OS 파일 선택창/전체 MIME·상태/AT·다른 브라우저·full suite·디자인/독립 수락은 미완료입니다.
- current route source: registry **80 / mounted-source 58 / blank-source 22**. 이전 feedback checkpoint의 53/27은 과거 이력입니다. core 부재는 기존 frozen 대조에서 발견 없었고 이번은 gallery/docs만 변경합니다. 빈 상세의 controls는 부재, 연결된 다른 상세의 전체 공개 props completeness는 미평가입니다. schema·전용 controls·필요 API·최종검증은 별도 유지합니다.
- 현재 빈 canonical 상세: GNB, LNB, Breadcrumb, Drawer, Popover, Table, Pagination, List, ListItem, Stack, Shell, ActionGroup, FormSection, ListPanel, FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate, DesktopWorkspaceTemplate, MobileWorkspaceTemplate, Icon, IconAction.
- 나머지 탐색/overlay/data/layout/template/icon과 Chart/keypad/SDK·동일 final-tree 전체 gate·외부 provider 수락은 잔여입니다. 다음 범위는 기존 API 재사용 소규모 그룹으로 유지하며 새 writer를 시작하지 않습니다.

## 피드백 5종 canonical 상세 checkpoint

- 후속 copy 교정: Switch 기본 hint를 빈 문자열로 바꾸고 hint prop control은 유지합니다. 초기화도 빈 hint로 복원하며 나머지 동작/상태·API 제약은 보존합니다.

- `hasFeedbackDetail`은 LoadingSpinner/ErrorState/Toast/Accordion/Collapse 자기 route에 실제 공개 core, 필요한 props controls, 현재 코드와 API 제약을 연결합니다. core 재작성·상태 엔진·서버/queue/타이머 추가가 아닙니다.
- LoadingSpinner label과 부모 표시를 수동으로 조작합니다. ErrorState의 onRetry는 로컬 부모가 오류 대신 LoadingSpinner를 보여 주는 예제이며 서버 재시도/자동 완료가 아닙니다. Toast message/onDismiss 및 부모 조건부 렌더링을 연결하여 실제 닫기 콜백에서 제거하고 다시 표시할 수 있습니다.
- Accordion items[0].title/content, multiple, 항목 disabled를 제어합니다. Collapse title/children을 제어하며 펼침은 기존 내부 상태 소유입니다. 현재 코드는 props/콜백·부모 상태를 나타내고 외부 open/defaultOpen/onOpenChange API를 만들거나 내부 펼침을 외부 값처럼 표현하지 않습니다. multiple 변경은 기존 열린 배열을 자동 정규화하지 않고 이후 클릭에 적용됩니다. 명시적 초기화는 preview를 다시 마운트해 접힘/표시/설정을 초기 상태로 돌립니다.
- bounded Chrome 390/1440px 5 route에서 수동 spinner hide/show, ErrorState retry→로딩 및 오류 다시 표시, Toast dismiss→언마운트 및 다시 표시, Accordion 단일/복수/disabled 항목·초기화, Collapse 실제 Enter 펼침·초기화, 문구/내용 편집을 확인했습니다. 해당 범위 document overflow/runtime exception 발견 없고 표시 TSX 30개 typecheck 오류 0입니다. full suite·전체 상태/AT/브라우저·디자인/독립 수락은 미완료입니다.
- current route source: registry **80 / mounted-source 53 / blank-source 27**. 이전 선택 checkpoint의 48/32는 과거 이력입니다. core 부재는 기존 frozen source 대조에서 발견 없었고 이번 변경은 gallery/docs만입니다. 빈 상세의 개별 controls는 부재, 연결된 다른 상세의 전체 공개 props completeness는 미평가입니다. 전용 controls/schema/필요 API/최종검증은 별도 기준입니다.
- 현재 빈 canonical 상세: FileInput, AddressField, MonthPicker, TimeInput, DateTimeInput, GNB, LNB, Breadcrumb, Drawer, Popover, Table, Pagination, List, ListItem, Stack, Shell, ActionGroup, FormSection, ListPanel, FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate, DesktopWorkspaceTemplate, MobileWorkspaceTemplate, Icon, IconAction.
- 입력6 → 선택5 → 피드백5 승인 큐 연결을 보존하며 남은 목록을 계속 채웁니다. 다음 소규모 후보는 기존 MonthPicker/TimeInput/DateTimeInput/FileInput 상세이고 AddressField는 기존 adapter/provider 소유 계약을 먼저 대조합니다. 외부 주소 서비스/서버를 새로 연결하지 않습니다. 나머지 탐색/overlay/data/layout/template/icon 상세, Chart/keypad/SDK 및 동일 final-tree 전체 회귀·디자인 수락은 잔여입니다.

## 선택 5종 canonical 상세 checkpoint

- `hasSelectionDetail`은 Combobox/MultiSelect/RadioGroup/CheckboxGroup/Switch 자기 route에 기존 public core·제어형 상태·현재 코드·필요 API 문서를 mount합니다. 다른 조합 예제에 등장하는 것만으로 연결 완료라 계산하지 않습니다. 실제 core preview → 관련 controls → 현재 코드 → 접힌 API 순서이며 core 재작성·새 query prop·엔진 추가가 아닙니다.
- controls: 공통 label/hint/name/disabled/required/error, 단일 확정 value·복수 value 배열·Switch checked, options[research].disabled. 선택 callback 및 태그 제거는 owner control과 현재 코드에 반영합니다. 전체 공개 props exhaustive controls는 아니며 schema 수와 전용 상세 controls를 구분합니다.
- Combobox query/open/active는 내부 상태입니다. 검색 타이핑은 확정 값·hidden 제출값을 변경하지 않으며 선택 클릭/Enter로만 확정합니다. 표시 코드에는 확정 value가 들어가며 내부 query 상태를 외부 prop으로 꾸미지 않습니다. required는 options의 실제 확정 선택을 검사합니다. remote/portal/free-text/virtualized 기능이 아닙니다.
- MultiSelect/CheckboxGroup은 native checkbox 목록입니다. 그룹·옵션 disabled, 배열 append/filter, 태그 제거를 재사용하며 CheckboxGroup에는 태그가 없습니다. 배열의 미등록/중복 key 자동 정규화는 없고 배열 길이 기반 required와 실제 native 제출 값이 다를 수 있음을 설명합니다. Switch required는 켜짐, native 체크된 제출 기본값은 on이며 boolean true 문자열이라고 설명하지 않습니다.
- 갤러리 초기화는 제어형 value/checked·설정과 preview 내부 query/open을 되돌리는 명시적 재마운트입니다. native form.reset 자동 동기화 기능을 core에 추가하거나 검증했다고 주장하지 않습니다. error 안내·ARIA와 native/custom validity는 구분합니다.
- bounded Chrome 390/1440px 5 route에서 실제 mount, Combobox query/확정값·키보드 선택/required/disabled 닫기, MultiSelect 태그 제거·disabled 선택 태그 보존, RadioGroup/CheckboxGroup 선택, Switch Space, 빈 required/오류/초기화를 확인했습니다. 해당 범위 document overflow/runtime exception 발견 없고, 표시 TSX 40개 typecheck 오류 0입니다. full suite·전체 상태/AT·디자인/독립 수락은 미완료입니다.
- current route source: registry **80 / mounted-source 48 / blank-source 32**. 다음 목록이 현재 빈 개별 상세이며 이전 입력 checkpoint의 43/37은 과거 이력입니다. core 부재는 기존 frozen source 대조에서 발견 없었고 이번에는 gallery/docs만 변경합니다. 빈 상세의 개별 controls는 부재, 나머지 연결 상세의 전체 props completeness는 미평가입니다.
- 현재 빈 canonical 상세: FileInput, AddressField, MonthPicker, TimeInput, DateTimeInput, GNB, LNB, Breadcrumb, Drawer, Popover, Table, Pagination, List, ListItem, LoadingSpinner, ErrorState, Toast, Accordion, Collapse, Stack, Shell, ActionGroup, FormSection, ListPanel, FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate, DesktopWorkspaceTemplate, MobileWorkspaceTemplate, Icon, IconAction.
- 다음 승인 큐는 LoadingSpinner/ErrorState/Toast/Accordion/Collapse입니다. spinner는 수동 표시, retry/dismiss/펼침은 기존 core 계약으로 연결합니다. 나머지 빈 항목·Chart/keypad/SDK·동일 final-tree 전체 gate도 잔여로 유지합니다.

## 입력 6종 + 소개 검색 우선 교정 checkpoint

- PasswordInput/NumberInput/CurrencyInput/PhoneInput/EmailInput/SearchField는 `hasFormInputDetail`로 자기 canonical 상세에 기존 public core·value/disabled/required/error 설정·현재 TSX·접힌 API 문서를 mount합니다. core 재작성·엔진 추가가 아닙니다.
- PasswordInput 표시/숨김은 내부 상태이며 문서에는 실제 자격 증명이 아닌 예제 문자열만 사용합니다. NumberInput min/max/step control 및 invalid draft와 확정 callback 값의 차이를 설명합니다. CurrencyInput blur 천 단위 표시와 raw value, PhoneInput/EmailInput blur native validity를 구분합니다. SearchField 검색 결과는 소비자 예제의 로컬 문자열 필터입니다.
- 예제 값 편집과 props 설정은 실제 preview 및 현재 코드에 연결합니다. 초기화는 부모가 소유한 제어형 예제 상태와 preview 내부 draft/표시 상태를 초기 값으로 되돌리며 native form.reset 전체 계약을 검증한 것이 아닙니다. 전체 props exhaustiveness·회귀·실기기·독립 수락은 미완료입니다.
- 소개 검색은 DOM 순서도 3개 안내 섹션보다 앞입니다. 글꼴·44px 입력 터치 영역을 줄이지 않으며 desktop 안내의 기존 3열 구조를 유지합니다. 날짜/표 API 문서의 검수 진행 문구는 UI에서 제거하고 native name/form 직렬화 제약·내부 상태 소유권·로컬 샘플 안내는 보존합니다.
- 현재 route source 대조: registry **80 / mounted-source 43 / blank-source 37**. source 판정이며 43개 전체의 실제 브라우저/controls 완성 판정이 아닙니다. 이전 37/43 기록은 Overview 5개 연결 tree 기준 이력입니다. core 부재는 기존 frozen source 대조에서 발견 없었으며 이번 변경은 gallery/docs 범위입니다. 빈 상세의 개별 controls는 부재, 연결된 다른 상세의 전체 props completeness는 미평가입니다.
- 현재 빈 canonical 상세: Combobox, MultiSelect, RadioGroup, CheckboxGroup, Switch, FileInput, AddressField, MonthPicker, TimeInput, DateTimeInput, GNB, LNB, Breadcrumb, Drawer, Popover, Table, Pagination, List, ListItem, LoadingSpinner, ErrorState, Toast, Accordion, Collapse, Stack, Shell, ActionGroup, FormSection, ListPanel, FormTemplate, ListTemplate, FeedbackTemplate, DetailTemplate, DesktopWorkspaceTemplate, MobileWorkspaceTemplate, Icon, IconAction.
- 승인 큐는 selection 5종(Combobox/MultiSelect/RadioGroup/CheckboxGroup/Switch) → feedback 5종(LoadingSpinner/ErrorState/Toast/Accordion/Collapse)을 그대로 유지합니다. 다른 빈 항목도 위 목록에서 제거하지 않습니다. Chart/keypad/SDK 및 동일 final-tree 전체 회귀·디자인 수락은 별도 미완료입니다.

## Atomic 탐색 정본 교정

- 상위 Atomic 목록·sidebar 개수·Templates 진입을 galleryRegistry에서 생성하고 componentHash(id) canonical URL로 연결합니다. legacy 10/6/2 목록과 #button 같은 비정본 anchor, 분류 화면의 Playground+Demo 중복 카드는 제거했습니다.
- 원본 상태 계약은 해당 개별 상세의 접힌 “기준 상태 계약”에서 유지합니다. 기존 상태/조합 gallery는 Button/FormField/Alert/DatePicker/DataTable/Dialog의 접힌 관련 예제에서 접근 가능하며 새 개별 상세 완료 수로 중복 계산하지 않습니다.
- registry에 등록됐다는 이유로 빈 상세를 구현 완료로 계산하지 않습니다. 5bcf966 frozen source의 80 core 존재/48 빈 shell/32 canonical demo 판정은 coordinator의 과거 baseline 대조이며, 현재 후속 상세 연결 뒤의 전수 판정은 별도입니다. props schema·좁은 knobs·route API 본문·core 존재·mounted demo·최종 검증을 구분합니다.

## Overview와 우선 개별 상세 연결 checkpoint

- Overview는 무작위 저장 폼/CompositionExample 대신 Foundations·Components·Templates 진입, API/한국어 검색과 직접 상세 링크, 저장소 실행 및 소스 import 안내를 제공합니다. npm 미발행 상태, `.ds-core`/core.css와 font 자산 계약을 명시합니다.
- 이번 다섯 항목은 **기존 shared core 재사용**이며 신규 core 기능 재작성/최종 수락이 아닙니다.

| 이름 | core 소스 | 개별 상세 | 현재 controls | 최종검증 |
| --- | --- | --- | --- | --- |
| Container | 존재: layout.tsx | 실제 Container + 현재 코드 | style.maxWidth 예시 | 미완료 |
| Grid | 존재: layout.tsx | 실제 반응형 Grid + 현재 코드 | style.gap 예시 | 미완료 |
| DatePicker | 존재: date-controls.tsx | 실제 입력/달력 + 현재 코드 | disabled/readOnly/busy/error/required/min/max, 선택 값 | 미완료 |
| DateRangePicker | 존재: date-controls.tsx | 실제 시작/종료/역순 안내 + 현재 코드 | 위 상태와 start/end 값 | 미완료 |
| DataTable | 존재: data-display.tsx | 실제 검색/정렬/선택/페이지 + 현재 코드 | loading/error/empty 및 내부 검색·필터·선택·페이지 | 미완료 |

- 라우트는 `hasConnectedDetail`로 해당 다섯 상세를 실제 mount합니다. layout props는 native div 속성이며 columns/size API를 새로 만들지 않았습니다. DatePicker 편집 draft와 callback의 committed 값은 구분합니다. DataTable 내부 검색/선택/page state는 외부 props controls 또는 표시 코드와 양방향 제어되는 것으로 주장하지 않습니다.
- 날짜 API에는 native name/form 직렬화 props가 없고, 표 데이터는 로컬 샘플입니다. 배포·서버 동작·전체 props controls 완료가 아닙니다. 다른 registry의 null/API-only 개별 상세, core 부재 후보, 전체 controls 및 동일 final tree 검증은 기존 잔여로 유지하며 전수 대조는 별도 진행합니다.
- 모바일 표의 정렬 제목은 단어 단위로 유지하고 기존 이름 있는 가로 스크롤 영역으로 수용합니다. 상세 grid는 minmax(0,1fr)로 intrinsic-width 넘침 원인을 교정합니다. overflow 숨김으로 잘라내지 않습니다.
- 아래 숫자/회귀 통과는 과거 checkpoint 이력입니다. 이번 개별 상세 연결의 최종 전체 수락 근거로 재사용하지 않습니다.

## Props / 코드 / 표면 교정 checkpoint

- 갤러리의 `CodeBlock`은 Prettier TSX 포맷, Prism 토큰 색상, code-local scroll, 실제 현재 코드 복사 결과를 제공합니다. 포맷 실패 시 원문을 표시합니다. formatter/highlighter는 갤러리에만 import하며 core export에 넣지 않습니다. MIT attribution은 `docs/licenses/`에 보존합니다.
- `Playground` controls는 Button/Badge/Alert/Progress/TextField/Slider/Rating/SegmentedControl/Result/GridList/Highlight/Bubble의 실제 공개 props와 현재 코드에 연결됩니다. 초기화·선택 결과·편집 값은 로컬 데모 상태입니다. 모든 공개 API 상세에 controls가 붙었다는 의미는 아닙니다.
- `GridList` (`content-primitives.tsx`): generic items/renderItem/getKey/label + columns 1–4, native ul/li, 컨테이너 폭에 맞춘 열 축소·빈 목록. 가상 DataGrid·정렬 엔진 아님.
- `Highlight`: 원문/문자열 query·대소문자 옵션을 받아 일치 구간을 mark로 표시. query의 정규식 문자를 이스케이프하며 HTML을 실행하지 않습니다. diff/syntax engine 아님.
- `Bubble`: children/native div + neutral/info·start/end의 비모달 말풍선. tooltip/modal/chat backend/live region이 아닙니다. 세 API는 index/core/registry 및 실제 상세에 연결했습니다.
- 중첩 문서·카드·목록·템플릿 장식 보더를 줄였고 제한된 표면/shadow로 구분합니다. 기존 input/focus/error/selection 경계와 테스트는 보존합니다.
- 현재 공유 gate는 build/typecheck 및 공개 tree 안전성입니다. 아래 unit/browser/scoped PASS 숫자는 **과거 해당 소스의 이력**이며 이 시각·신규 API 변경본의 통과 결과가 아닙니다. 신규 API의 전체 회귀/independent 수락과 나머지 API controls는 잔여입니다.

## BottomCTA border-box 예약 교정 (이전 scoped 검수 불통과 후)

- 독립 검수 (내부 검수 식별자 생략)는 security0/medium logic1로 불통과했다. 실제 높이는 border-box로 읽지만 기본 content-box 관찰 때문에 padding/border만 바뀌면 예약값이 남는 결함이었다. 부모가 unit2RED와 실제 Chromium320 document/owned-scroll 2RED(footer/spacer 차이40px)로 재현했다.
- 관찰은 `observe(panel, {box:'border-box'})`로 수정했고 관찰 요청이 예외로 거부되면 observer를 해제하고 flow/예약0으로 유지한다. 단위 테스트는 관찰 옵션과 실패 fallback을 직접 단언한다. 기존 callback 직접 호출만으로 관찰 설정을 검증했다고 하지 않는다.
- 수정 뒤 root unit342/63files·build/tsc·diff-check exit0. 신규 BottomCTA Chromium20pass는 padding-only40px와 border-only8px 추가 때 내부 content 높이가 그대로임을 확인하면서 footer/spacer 동기화·실제 activeElement/초점 여유·마지막 본문을 document/owned-scroll 양쪽 및4width에서 검사했다. 기존 선택52rows도 같은 수정 production source로 재실행50pass/비모바일2skip다.
- 이전16file 검수 manifest·receipt·화면/JSON 및 v1/v2/v3 archives는 보존한다. 새 scoped manifest/evidence는 별도 파일이다. fresh independent re-review (내부 검수 식별자 생략)는 scoped PASS/security0/logic0/suggestions0이며 reviewer의 독립 메모리11사례·cleanup/SSR/native 검사가 통과했다. reviewer는 실제 Chromium/unit/build를 재실행하지 않았고, 부모의 실제70pass/2skip와 구분했다. 부모도 검수 manifest SHA 및16개 파일 byte/hash 일치를 다시 확인했다. 이전 rejection은 이력으로 보존하고 PASS receipt는 별도 파일로 둔다. 이 문서의 판정 갱신만 검수 뒤 변경이며 production/tests는 검수본과 동일하다. 수명주기/외부 초점 추가 검사 제안은 비차단 후속이고 전체 frozen-tree gate·commit/push/첨부는 여전히 미수행이다.

## 후속 BottomCTA 구현 초기 checkpoint (v3 이후 별도 작업 트리)

- `BottomCTA` / `BottomCTARegion`과 공개 타입을 `src/index.ts`에서 제공한다. `Button` + `ActionGroup` + `Container` 조합이며 overlay footer를 고정 배치 기반으로 사용하지 않는다. Single/Double은 native type/form/name/value/variant 및 액션별 disabled/loading 계약을 유지한다.
- 실제 `#/components/bottom-cta` 상세는 필수 폼·취소/제출·처리 상태·단일 동작·접힌 코드/API/접근성 문서와 gallery-free 독립 소비 iframe을 제공한다. `browser/fixtures/bottom-cta.html`은 production build의 별도 HTML 진입점이며 제품 통합/배포가 아니다.
- flow 기본. fixed는 Region cta 슬롯에서 실제 viewport 하단에 배치하며 ResizeObserver로 border-box 높이를 예약한다. safe-area CSS inset이 포함된 실제 높이를 한 번만 예약한다. Region 내부 본문/소유 scroll frame의 초점 가림을 보정하고 PC 내부 최대1200px 정렬을 제공한다. SSR/측정 전/ResizeObserver 미지원은 flow다.
- API/한계: actions 1–2개, topAccessory/bottomAccessory/safeArea/label/className, Region children/cta/className/style. 고정 영역 기본 최대50dvh 내부 스크롤. 한 viewport의 fixed CTA 하나, transform/filter/perspective/contain 없는 조상, Region 소유 스크롤이 계약이다. 임의 중첩 스크롤·Region 외부 초점·비대칭 sidebar·소프트키보드 위 고정·SDK safe-area·숨김/지연 애니메이션은 보장하지 않는다. 서버 저장/외부 requestSubmit 방지는 소유자 책임이다.
- 검사 소스: `tests/bottom-cta.test.tsx`, `tests/bottom-cta-detail.test.tsx`, `tests/core-styles.test.ts`, `browser/bottom-cta.spec.ts`. RED missing implementation/public detail → 구현 연결 후 root unit341/63files·build/tsc·diff-check 통과. Chromium320/390/768/1440 신규12pass: native validation/실제 외부 form 제출, 취소/처리 상태/DOM identity, 실제 높이 예약·한국어 줄바꿈·font-size 변경·viewport resize·마지막 본문/초점 geometry·소유 scroll frame·modal top layer·axe/가로 containment.
- 같은 production source의 기존 범위 재검사는 generic details/history/mobile focus/원리뷰 회귀/core-only scope의 선택52rows 중50pass/비모바일2skip다. 전체76-case 시도는300초에 timeout되었고 완료 판정에 포함하지 않는다. fixture의 missing await(NaN) 및 Playwright aria-disabled actionability 대기 문제는 실제 assertion/클릭을 유지한 채 고쳤다. busy click은 force pointer로 보내고 Button의 기본 동작 차단을 확인한다. 별도420초 tool timeout도 통과 증거가 아니다.
- 이는 전체 디자인 시스템 수락 또는 새 independent review PASS가 아니다. BottomCTA scoped 독립 검수는 별도이며 나머지 상세/GridList/Highlight/Bubble·최종 동일 frozen tree 전체 gate·승인 commit/push·exact SHA는 미완료다. v1/v2/v3 ZIP은 수정하지 않았고 첨부 보류도 유지한다. 아래 v3 production byte-identical 기록은 그 당시 checkpoint 이력이며 현재 BottomCTA 변경 이후 tree에 적용되지 않는다.

## 판정 범위

현재 `src/index.ts`와 실제 컴포넌트·스타일·테스트 소스를 직접 읽은 목록이다. `docs/component-inventory.md`는 보존하는 **과거 스냅샷**이며, 확장 기능의 현재 상태는 이 문서를 기준으로 읽는다. 여기서 **구현**은 실행 가능한 소스가 있다는 뜻이지 최종 승인이라는 뜻이 아니다. 아래 테스트 경로는 검사한 **테스트 소스와 그 검증 대상**이다. 이번 문서는 coverage 소스맵이며 전체 통합 테스트·동결된 최종 트리의 독립 재검토·최종 수락을 인증하지 않는다. 후속 실행 checkpoint는 그 범위만 별도로 기록하고, 과거 실행 로그의 통과 수를 현재 결과로 옮기지 않는다.

공통 React 제어·표현·슬롯만 다룬다. 갤러리의 메모리 변경은 서비스 저장이 아니다. 실행 엔진, 제품 화면·정책, GPU 작업, 배포는 포함하지 않는다. PC/모바일 공통 구성이 제품의 모바일 기능 동등성을 보장하지 않는다.

## 공개 진입점과 계층

- `src/index.ts`: 원래 `componentFamilies`의 18종과 추가 레이아웃·조합·템플릿을 별도로 export한다. 18종 레지스트리는 전체 export 개수가 아니다.
- 기초: `resolveTokens` (`src/tokens.ts`), `defaultTheme`, `themes`, `applyTheme`, `assessTheme` (`src/themes.ts`). 정식 소비 스타일은 `src/core.css`와 `.ds-core` 범위다. 현재 기본은 블루이며 역사적 API 식별자 slate는 유지한다. 교체 예시는 indigo/teal이다. `applyTheme`의 범위 적용·복원과 대비 계산은 앱 전체 접근성 적합성과 별개다.
- 아톰 → 분자 → 영역 → 템플릿은 이름이 아니라 아래 실제 중첩 관계로 분류한다. 확장 파일의 `export *`에는 공개 타입과 갤러리도 포함된다. `StateGallery`, `ThemeGallery`는 `App`에서 사용하지만 `src/index.ts`의 공개 export는 아니다.
- 기초 근거: `tests/tokens.test.ts`, `tests/generated-source.test.ts`, `tests/default-theme.test.ts`, `tests/themes.test.ts`, `tests/theme-evidence.test.ts`, `tests/core-styles.test.ts`; 브라우저 소스 `browser/core-consumer.spec.ts`, `browser/theme-integration.spec.ts`. 토큰·폰트 원본 보존과 렌더링·글리프 검증은 구분한다.

## 원래 18종: 실제 상태와 동작

아래 경로의 컴포넌트 파일은 모두 `src/components/` 아래다. 공통 브라우저 근거 `browser/core-consumer.spec.ts`는 갤러리 없는 소비 fixture에서 실제 hover/pressed/키보드 focus, busy/disabled, 필드·선택·수동 피드백을 구분하도록 작성되어 있다. 상태 카드는 그 검증을 대신하지 않는다.

| 공개 API / 소스 | 하위 구성·variant·state·동작 | 단위 테스트 소스 / 브라우저 소스 |
| --- | --- | --- |
| `Button` / `atoms.tsx` | native button. `primary/secondary/quiet/ghost/destructive`, `small/medium/large`. 기본 `type="button"`; loading은 spinner·aria-busy·aria-disabled와 중복 click 및 submit 기본 동작 차단, native disabled와 달리 초점 유지. 소비자가 submit을 명시한다. | `tests/atoms.test.tsx`, `tests/loading-submit.test.tsx`, `tests/state-gallery.test.tsx`; `browser/core-consumer.spec.ts`, `browser/design-system.spec.ts` |
| `IconButton` / `primitives.tsx` | `Button` 조합, 기본 secondary, 필수 `label`을 accessible name으로 사용. loading/disabled/size는 Button 계약. SVG pack과는 별개인 범용 children 슬롯. | `tests/iconbutton.test.tsx`; `browser/core-consumer.spec.ts` |
| `Input` / `atoms.tsx` | native input props, 기본·오류·readOnly·disabled와 loading 안내. loading은 편집을 막지 않는다. 같은 input 노드를 유지하고 기존 aria-describedby에 busy 상태 설명을 추가한다. | `tests/input-busy.test.tsx`, `tests/korean-primitive-defaults.test.tsx`; `browser/blocking-regressions.spec.ts`, `browser/core-consumer.spec.ts` |
| `Textarea` / `primitives.tsx` | native textarea, 여러 줄·오류·readOnly·disabled. 별도 loading API 없음. | `tests/textarea.test.tsx`; `browser/core-consumer.spec.ts` |
| `Select` / `primitives.tsx` | native select, option/value/onChange 및 오류·disabled. 독자적인 검색 combobox가 아니다. native popup의 실제 상태는 엔진별 확인 대상. | `tests/select.test.tsx`; `browser/core-consumer.spec.ts` |
| `Checkbox` / `primitives.tsx` | native checkbox + label. checked/defaultChecked/disabled, `mixed`는 DOM indeterminate 설정. 선택과 키보드 focus는 별개. | `tests/checkbox.test.tsx`; `browser/core-consumer.spec.ts`, `browser/design-system.spec.ts` |
| `FormField` / `molecules.tsx` | label/help/error + 기본 `Input`; 공급 children에 id/required/aria-invalid/aria-describedby를 연결. `(필수)` 표기. 오류 메시지 role=alert. 검증 규칙 자체는 소비자 책임. | `tests/form.test.tsx`; `browser/core-consumer.spec.ts` |
| `Badge` / `primitives.tsx` | `Tone`: neutral/running/success/review/error. 수동 span이며 hover/pressed/focus 동작 없음. | `tests/badge.test.tsx`; `browser/core-consumer.spec.ts` |
| `Alert` / `feedback.tsx` | `Badge` + title/content. 동일 Tone, 기본 running. error는 alert, 나머지는 status. 내부 action만 상호작용한다. | `tests/alert.test.tsx`; `browser/core-consumer.spec.ts` |
| `Progress` / `primitives.tsx` | 값은 0..100으로 제한, undefined는 불확정 진행. progressbar·한국어 기본 레이블; 작업 수행·완료 판단 없음. | `tests/progress.test.tsx`, `tests/korean-primitive-defaults.test.tsx`; `browser/core-consumer.spec.ts` |
| `Skeleton` / `primitives.tsx` | status + 읽기 안내, 장식 영역은 aria-hidden. loading 표현이며 데이터 로더 아님. reduced motion 스타일 대상. | `tests/skeleton.test.tsx`; `browser/core-consumer.spec.ts` |
| `EmptyState` / `feedback.tsx` | 제목/설명 + `Button`; action/onAction/loading. 콜백을 공급하지 않으면 실제 추가 작업은 없다. | `tests/emptystate.test.tsx`; `browser/core-consumer.spec.ts` |
| `Dialog` / `organisms.tsx` | native dialog + 제목/body/`IconButton`/footer. controlled open/onClose, showModal, Tab 양끝 순환, Escape·cancel·바깥 클릭 닫기 요청, opener 복원. 공통 modal owner stack이 중첩과 처음부터 열린 부모/자식의 top-layer 순서·body scroll lock/원래 priority 복원을 처리한다. | `tests/dialog.test.tsx`, `tests/modal-ownership.test.tsx`, `tests/navigation-regions.test.tsx`; `browser/core-consumer.spec.ts`, `browser/expanded-features.spec.ts`, `browser/design-system.spec.ts` |
| `Confirm` / `organisms.tsx` | `Dialog` + 취소/확인 `Button`. onConfirm은 요청 콜백; 실행·자동 닫기·영속 저장 없음. 확인 loading은 Button 차단 계약. | `tests/confirm.test.tsx`, `tests/korean-defaults.test.tsx`; `browser/core-consumer.spec.ts` |
| `Menu` / `navigation.tsx` | trigger + menu/menuitem buttons. open/close, 위아래/Home/End, Enter, Escape·blur, 선택 후 trigger focus 복원. **일회성 action 목록이며 지속 선택·selected item variant 없음.** | `tests/navigation.test.tsx`, `tests/navigation-form.test.tsx`; `browser/core-consumer.spec.ts`, `browser/blocking-regressions.spec.ts` |
| `Tabs` / `navigation.tsx` | 내부 active index, tablist/tab/tabpanel 연결, selected/hidden, roving tabIndex, 좌우/Home/End에서 선택과 초점 이동. controlled active API·disabled tab API 없음. | `tests/navigation.test.tsx`, `tests/navigation-form.test.tsx`; `browser/core-consumer.spec.ts`, `browser/acceptance.spec.ts` |
| `Tooltip` / `navigation.tsx` | focusable button + tooltip, hover/focus 표시·blur/mouseleave/Escape 해제, aria-describedby. 독립 비모달 설명이며 focus trap 없음. | `tests/tooltip.test.tsx`, `tests/navigation-form.test.tsx`; `browser/core-consumer.spec.ts`, `browser/acceptance.spec.ts` |
| `Separator` / `primitives.tsx` | horizontal native hr, 수동 구분자. orientation/상호작용 variant 없음. | `tests/separator.test.tsx`; `browser/core-consumer.spec.ts` |

`state-gallery.tsx`는 네 button kind(primary/secondary/ghost/destructive) × 세 크기 × default/busy/disabled를 실제 Button으로 보여 준다. quiet는 별도 호환 variant이며 이 행렬에 포함되지 않는다. hover/pressed/focus는 브라우저 소스에서 따로 다룬다. native Select option 선택 테스트는 모든 엔진의 popup pixels/키보드 동작 인증이 아니다.

## 레이아웃·조합·범용 템플릿

| 실제 공개 export / 소스 | 중첩·슬롯·행동 및 한계 | 테스트 소스 / 브라우저 소스 |
| --- | --- | --- |
| `Container`, `Stack`, `Grid`, `Shell` / `layout.tsx`, `layout.css` | 범위·수직 간격·반응형 격자·navigation/header/content 슬롯. Shell은 기본 main, `mainAs="div"`로 문서 main 중복을 피할 수 있다. 갤러리의 외형이 Shell 재사용 증거는 아니지만 현재 PC 템플릿은 실제 Shell을 사용한다. | `tests/layout.test.tsx`, `tests/core-styles.test.ts`; `browser/core-consumer.spec.ts`, `browser/expanded-features.spec.ts` |
| `ActionGroup`, `SearchField`, `FormSection`, `ListPanel`, `DetailTemplate`, `CompositionExample` / `composition.tsx` | ActionGroup=이름 있는 group, SearchField→Input(search), FormSection→Stack+ActionGroup, ListPanel=제목/toolbar/Stack, DetailTemplate→Grid(summary/content)+ActionGroup. CompositionExample→Container/Grid→FormSection/ListPanel/FormField/SearchField/Button; 메모리 저장 상태와 문자열 필터는 실제 작동한다. 상세의 복귀 슬롯은 소비자 동작 공급 대상이며 CompositionExample의 복귀 action은 상세를 닫고 목록 검색으로 초점을 돌린다. | `tests/composition.test.tsx`; `browser/core-consumer.spec.ts`, `browser/design-system.spec.ts` |
| `FormTemplate`, `ListTemplate`, `FeedbackTemplate` / `templates.tsx` | 각각 fields/actions/aside, toolbar/rows/footer, status/content/actions 슬롯. 템플릿이 자체 폼 엔진·데이터 엔진을 구현하는 것은 아니다. App의 PC/모바일 예시는 필드·검색·동작·피드백을 공급하고 목록 메뉴는 첫 항목 보관/로컬 복제 항목 추가를 실제 메모리 state로 연결한다. | `tests/formtemplate.test.tsx`, `tests/listtemplate.test.tsx`, `tests/feedbacktemplate.test.tsx`; `browser/design-system.spec.ts`, `browser/core-consumer.spec.ts` |

## 탐색과 오버레이

소스: `navigation-regions.tsx`, `navigation-regions.css`. 공개 타입은 `NavigationItem`, `NavigationProps`, `NavigationGroup`, `BreadcrumbItem`, `ModalRegionProps`(DialogProps), `PopoverProps`다.

| 실제 export·조합 | 상태·행동 / 소유권 | 테스트 소스 / 브라우저 소스 |
| --- | --- | --- |
| `GNB`→Button | controlled selectedId/onSelect, aria-current, disabled item. 모바일 펼침은 내부 state이며 선택 후 닫힘. 실제 route 전환은 owner가 처리. | `tests/navigation-regions.test.tsx`; `browser/expanded-features.spec.ts`, `browser/acceptance.spec.ts` |
| `LNB`→Button·group 목록 | controlled selectedId, 내부 전체/그룹 접힘, aria-expanded/controls, disabled item. collapse는 selection과 별개. | `tests/navigation-regions.test.tsx`; `browser/expanded-features.spec.ts`의 PC 템플릿 구성 |
| `Breadcrumb`→nav/ol/link | 마지막 항목만 aria-current=page, 앞 항목은 href 있을 때 native link. 계층과 URL 공급은 owner 책임. | `tests/navigation-regions.test.tsx`; `browser/expanded-features.spec.ts`의 PC 템플릿 구성 |
| `Drawer`, `BottomSheet`→ModalRegion→Dialog | 측면/하단 CSS 배치, controlled open/onClose. Dialog 공통 focus/scroll 소유권 사용. 닫힐 때 region은 unmount. 중첩 child만 Escape로 닫고 부모 lock 유지. | `tests/navigation-regions.test.tsx`, `tests/modal-ownership.test.tsx`; `browser/expanded-features.spec.ts`, `browser/core-consumer.spec.ts`의 처음 열린 중첩 fixture |
| `Popover`→trigger/nonmodal dialog panel | 내부 open, Escape/outside pointer/trigger 닫기와 trigger focus 복원. Tab으로 바깥 이동 가능, scroll lock 없음. 자동 위치 충돌 회피 엔진은 없음. | `tests/navigation-regions.test.tsx`; `browser/expanded-features.spec.ts`는 갤러리 통합, 전용 모든 위치/AT 검증은 미완료 |
| `NavigationRegionsGallery` | GNB/LNB/Breadcrumb/Tabs/Menu/Tooltip/Popover/Drawer/BottomSheet 실제 중첩, 선택 status 및 하단 적용. 외부 라우터·서비스 없음. | `tests/navigation-regions.test.tsx`, `tests/expanded-integration.test.tsx`; `browser/expanded-features.spec.ts` |

## 데이터 표시와 선택 정책

소스: `data-display.tsx`, `data-display.css`. 공개 타입: `DataColumn<T>`, `TableProps<T>`, `DataTableProps<T>`, `PaginationProps`, `ListProps`, `ListItemProps`.

| 실제 export·하위 구성 | 동작·상태 | 테스트 소스 / 브라우저 소스 |
| --- | --- | --- |
| `Table<T>` | native table/caption/scope=col, rowKey와 value/render column. 읽기 전용이며 sorting API 없음. | `tests/data-display.test.tsx`의 Table/caption 테스트; `browser/expanded-features.spec.ts`의 wide table 검사 |
| `DataTable<T>`→Input/Select/Checkbox/Button/Pagination | 내부 query+column filter 결합, 한국어 문자열/숫자 오름·내림 정렬과 aria-sort, page/pageSize, 행 선택·mixed 현재 페이지 전체 선택, bulk callback 후 선택 초기화. loading/error는 stale rows를 숨기고 retry 요청 가능. 일반 빈 데이터와 검색 결과 없음 구분. | `tests/data-display.test.tsx`의 sort/search/filter/page/cross-page bulk/loading/error 테스트; `browser/expanded-features.spec.ts`의 DataTable 연결 테스트 |
| `Pagination`→Button/nav | controlled page/pageCount/onPageChange, 현재·인접·처음·마지막 및 생략, 이전/다음 경계 disabled. 표시 page는 범위 제한; 실제 데이터 fetch 없음. | `tests/data-display.test.tsx`의 pagination 테스트; `browser/expanded-features.spec.ts` |
| `List`, `ListItem`→ul/li/Checkbox/Button | 기본·설명·썸네일·controlled selection·action 조합, selected 스타일. 실제 항목 열기와 선택은 소비자 콜백. | `tests/data-display.test.tsx`의 ListItem/gallery 테스트; `browser/expanded-features.spec.ts`의 모바일 템플릿 |
| `DataDisplayGallery` | 실제 bulk 제외/목록 선택·action status/loading 완료/error 복구 fixture. 네트워크 API 없음. | `tests/data-display.test.tsx`; `browser/expanded-features.spec.ts` |

**선택은 화면 필터와 다른 축이다.** DataTable의 내부 key Set은 검색·페이지 이동에 유지된다. 총 선택 수와 bulk payload는 **현재 rows와 선택 key의 교집합**이므로 제거된 행은 payload에 들어가지 않는다. 제거된 key 자체를 Set에서 자동 purge하지는 않으므로 동일 key가 다시 나타나면 선택도 다시 살아날 수 있다. owner는 안정적·고유 rowKey와 데이터 갱신/재사용 정책을 정해야 한다. 현재 페이지 전체 선택은 보이는 행만 바꾸며 전체 dataset 선택이 아니다. 서버 데이터·가상화·외부 controlled sort/filter/selection API는 구현하지 않았다.

**가로 스크롤은 표 내부에만 허용한다.** Table/DataTable은 `tabIndex=0`, 이름 있는 region인 `.ds-table-scroll`에 `overflow-x:auto`를 두고 셀 nowrap을 유지한다. 이는 좁은 화면에서 열 비교를 위한 지역 스크롤이며 문서 전체 horizontal overflow를 허용하는 정책이 아니다. toolbar/footer/list는 wrap한다. `browser/expanded-features.spec.ts`의 `wide data tables remain contained and keyboard-scrollable`이 지역 경계와 키보드 스크롤을 검증하도록 작성되어 있다.

## 펼침·피드백 확장

소스 `feedback-controls.tsx`; 공개 타입 `AccordionItem`.

- `Accordion`→Button+Icon+hidden region: 내부 open ids, 기본 단일/`multiple` 복수, disabled item, aria-expanded/controls. `Collapse`→Button+hidden panel: 독립 펼침. 둘 다 native Enter/Space 동작; 공개 controlled open API·별도 화살표 focus 관리 없음.
- `LoadingSpinner`: 이름 있는 status+장식 spinner. `ErrorState`→Alert(error)+Button+Icon: onRetry 필수. `Toast`→status+Icon+IconAction: 닫기 요청은 owner가 처리하며 자동 timeout/queue/portal 없음.
- `FeedbackGallery`: ready/loading/empty/error 내부 상태, error retry 및 empty 다시 불러오기→loading, toast 생성·해제, 단일/복수 Accordion과 Collapse. `Skeleton`, `Progress`, `EmptyState`, `Alert`를 실제 사용한다. 로딩 완료·실패 판단을 하는 외부 엔진은 아니다.
- 테스트 소스 `tests/feedback-controls.test.tsx`; 브라우저 `browser/expanded-features.spec.ts`의 `Disclosure keyboard, toast dismissal and error retry expose actual state`. 수동 feedback에 hover/pressed/focus를 만들어 붙이지 않고 내부 action을 검사한다.

## 한국어 폼과 주소

소스 `form-controls.tsx`, `form-controls.css`. 공통 private Field는 레이블·hint/error 관계와 `(필수)`를 제공하고 Input/Button/Checkbox/Select/Textarea를 재사용한다. 오류 안내와 native form validity는 함께 읽어야 한다.

| 실제 공개 API·조합 | 구현된 행동·상태 및 제한 | 테스트 소스 / 브라우저 소스 |
| --- | --- | --- |
| `PasswordInput`→Input+Button | 표시/숨기기, 기존 값 보존, aria-pressed/한국어 이름, disabled. 길이·강도 검증은 공급 props/소비자 책임; 갤러리의 8자 hint 자체가 규칙 구현은 아니다. | `tests/form-controls.test.tsx`의 password 테스트; `browser/expanded-features.spec.ts` |
| `NumberInput`, 별칭 `Stepper`→number Input+증감 Button | min 기반 step 격자, 범위·수동 값 검증, 가장 높은 정렬된 max에서 정지. 비양수/비유한 step은 버튼과 native validity로 거부. off-grid 값에서 인접 격자로 이동. | `tests/form-controls.test.tsx`의 stepper/bounds/invalid step 테스트; `browser/core-consumer.spec.ts` |
| `CurrencyInput`→FormattedInput+Input+원 표시 | 원 정수·0 이상·safe integer, 표시 쉼표, 편집 중 raw, blur 오류. 소수/음수 거부, native custom validity. 금융 계산·환율 기능 없음. | `tests/form-controls.test.tsx`의 currency/native validation 테스트; `browser/expanded-features.spec.ts` |
| `PhoneInput`, `EmailInput`→FormattedInput+Input | tel/email type, 편집 값 보존, 한국 전화 prefix·이메일 형식 검증, blur/touched 오류·native custom validity. 전화번호 자동 인증·이메일 실재 확인은 없음. | `tests/form-controls.test.tsx`의 phone/email 테스트; `browser/expanded-features.spec.ts`는 폼 통합이며 각 외부 인증은 없음 |
| `Combobox`, 별칭 `Autocomplete`→Input/listbox/hidden input | 검색 query와 확정 option value 구분, disabled 건너뛰는 위아래/Enter, Escape·blur, IME composing 중 key 처리 보류. name은 hidden input에서 option value 한 번만 제출. required는 검색문자가 아닌 확정 option으로 검증. | `tests/form-controls.test.tsx`의 combo/required/FormData/controlled reset 테스트; `browser/expanded-features.spec.ts`, `browser/core-consumer.spec.ts` |
| `MultiSelect`, `CheckboxGroup`→Checkbox/fieldset/Button | 복수 값, MultiSelect는 제거 tag, CheckboxGroup은 tag 없음. 그룹/option disabled는 tag 제거에도 적용. required는 최소 하나 선택. RadioGroup은 공유 native name으로 한 항목 선택. | `tests/form-controls.test.tsx`의 multi/disabled tag/group/radio 테스트; `browser/expanded-features.spec.ts`는 폼 통합 |
| `RadioGroup`, `Switch` | RadioGroup=fieldset/radio, Switch=native checkbox role=switch. controlled/uncontrolled 선택, required/hint/error/disabled. Switch Space 변경. | `tests/form-controls.test.tsx`; `browser/expanded-features.spec.ts`의 Switch |
| `FileInput`→file Input+status | accept 확장자/MIME/wildcard 검사, multiple, filename, onFilesChange. 거부 시 선택 비우기·custom validity로 제출 차단. 업로드·용량/악성 파일 서버 검증 없음. | `tests/form-controls.test.tsx`의 file/native submission 테스트; `browser/expanded-features.spec.ts` |
| `AddressField`→fieldset+네 Input+검색 슬롯/Button | `road/jibun/postal/detail`, 우편번호 5자리 pattern, required는 postal/road. controlled value/defaultValue/onValueChange. onSearch/select 또는 searchSlot(select) 공급. 보관된 select callback도 현재 disabled 여부와 최신 handler를 참조한다. | `tests/form-controls.test.tsx`의 postal/address/retained callback 테스트; `browser/expanded-features.spec.ts`는 상세 주소 입력이며 실제 provider 검증 아님 |
| `FormControlsGallery` | native text/search/memo/select와 위 컨트롤의 실제 조합. 주소 선택은 **명시적으로 표시된 provider fixture(데모 데이터)**이며 실제 주소 검색 API 호출이 아니다. | `tests/form-controls.test.tsx`의 fixture/id/gallery 테스트, `tests/expanded-integration.test.tsx`; `browser/expanded-features.spec.ts` |

공개 타입: `FieldProps`, `TextControlProps`, `ValidatedInputProps`, `ChoiceOption`, `PasswordInputProps`, `NumberInputProps`, `StepperProps`, `CurrencyInputProps`, `PhoneInputProps`, `EmailInputProps`, `ComboboxProps`, `AutocompleteProps`, `MultiSelectProps`, `CheckboxGroupProps`, `RadioGroupProps`, `SwitchProps`, `FileInputProps`, `AddressValue`, `AddressFieldProps`. private Field/FormattedInput은 공개 컴포넌트가 아니다. 형식 검사 통과는 실제 주소·연락처·파일의 진위 확인이 아니다.

## 실제 달력·기간·월·시간

소스 `date-controls.tsx`, `date-controls.css`. 공개 API 및 타입: `DatePicker`/`DatePickerProps`, `DateRangePicker`/`DateRangeValue`/`DateRangePickerProps`, `MonthPicker`/`MonthPickerProps`, `TimeInput`/`TimeInputProps`, `DateTimeInput`/`DateTimeInputProps`, `DateControlsGallery`.

- `DatePicker`→FormField/Input + Button + private Calendar. **한국어 달력과 YYYY-MM-DD 직접 입력**을 모두 제공한다. 연도/월 선택·이전/다음 달·일 선택·오늘·지우기, selected aria-pressed, min/max/disabledDates, 윤년·형식 오류, 유효한 값만 onChange. invalid draft는 보존하되 commit하지 않고 native custom validity와 오류를 연결한다.
- Calendar는 요일과 실제 날짜 Button, roving tabIndex, 좌우/위아래·Home/End·PageUp/PageDown, 월말 clamp·disabled 날짜 건너뛰기, Escape와 선택 후 trigger focus 복원을 가진다. 이름 있는 group이며 ARIA grid를 구현했다고 주장하지 않는다. 제한 날짜 탐색은 최대 366번으로 bounded; 무제한 예약 가능일 검색 엔진은 아니다.
- `DateRangePicker`는 **두 실제 DatePicker 달력**을 조합한다. start/end, 역순 오류, 완성·유효할 때 시작일/종료일 포함 일수 status. 잘못된 draft가 생기면 이전 정상 기간 요약을 숨긴다. 한 달력에서 drag/hover range를 고르는 별도 UX는 아니다.
- `MonthPicker`: YYYY-MM 직접 입력·연도 selector·12개월 Button·범위·지우기. `TimeInput`: 24시간 HH:mm 직접 입력·범위 검사. `DateTimeInput`→DatePicker+TimeInput: timezone 없는 YYYY-MM-DDTHH:mm, 경계일 시간 min/max, 조합 validity, incomplete/invalid 요약 억제. controlled owner가 변경을 거부하면 다음 제안에 거부된 부분을 섞지 않는다.
- disabled/readOnly/busy는 변경과 달력 열기를 막는다. busy는 Input 안내를 표시하되 readOnly로 잠근다. **기본 Input loading이 계속 편집 가능한 계약과 다르다.** required 및 onValidityChange는 native 제출과 상태 통지에 연결한다. 복합 컨트롤은 자식 validity를 알기 전 일시적 true를 통지하지 않는다.
- civil math는 Gregorian **1..9999년**의 date-only 계약이다. 내부 Date는 UTC Gregorian 날짜로 구성하고 UTC get/set으로 이동·윤년·포함 일수를 계산하므로 DST/시간대의 날짜 건너뜀에 영향받는 local instant 계산이 아니다. **오늘만 사용자의 local clock 날짜**를 읽는다. `0001`/`0099`/`9999`, 세기 윤년, 경계 selector, 건너뛴 civil day 사례가 테스트 소스에 있다. 서비스 timezone의 timestamp 변환·휴일·영업일 정책은 owner 책임이다.
- 테스트 소스 `tests/date-controls.test.tsx`: 위 각 축, native invalid draft/default/required, controlled datetime 거부, 1..9999, skipped civil day, local today, bound/keyboard/lock, 요약 억제. 브라우저 소스 `browser/expanded-features.spec.ts`의 `Korean range calendar edits dates, keyboard crosses leap-day, reversed and malformed ranges reject`, `browser/core-consumer.spec.ts`의 `consumer native validity, rejected controlled datetime, bounded step and Gregorian date stay consistent`. 이 경로들은 새 최종 실행 인증이 아니다.

## 정적 아이콘과 PC/모바일 작업 공간

- `icons.tsx`: `Icon`, `IconAction`, `iconNames`, `IconGallery`; 타입 `IconName`, `IconProps`, `IconActionProps`. 정적 named import 36종, IconAction→IconButton→Button, 기본 장식 SVG·currentColor·size/stroke 계약. 설치 버전·전체 LICENSE·실제 minified/gzip 측정과 한계는 `docs/icons-contract.md`에 기록한다. 테스트 소스 `tests/icons.test.tsx`, `tests/expanded-integration.test.tsx`; 브라우저 `browser/expanded-features.spec.ts`의 icon subset/reduced motion 검사.
- `DesktopWorkspaceTemplate<T>` (`workspace-templates.tsx`)→Container/GNB/Shell(LNB/header)/Grid/ListTemplate/DataTable 및 aside/actions/footer. 공개 타입 `DesktopWorkspaceTemplateProps<T>`. PC는 검색·filter·sort·paging·cross-page bulk를 실제 DataTable에 연결한다. PC 템플릿은 `Shell mainAs="div"`로 조합하므로 문서 main 안에 임베드해도 두 번째 main을 만들지 않는다. standalone Shell의 기본 main 의미는 보존한다.
- `MobileWorkspaceTemplate<T>`→Container/Stack/GNB/ListTemplate/SearchField/List/ListItem/Icon/Button/BottomSheet. 공개 타입 `MobileWorkspaceTemplateProps<T>`. 내부 query/detailKey, controlled selectedKeys/onSelectionChange, 검색 빈 결과·선택 action·detail/apply/cancel. 상세는 현재 rows에서 key로 다시 찾아 제거된 행은 열리지 않는다. 선택 수/payload도 현재 rows 교집합이며 검색에 숨은 기존 선택을 자동 해제하지 않는다. owner가 선택 key 정리와 적용 후 데이터 갱신을 책임진다.
- `WorkspaceTemplatesGallery`와 `WorkspaceTemplatesGalleryProps`: PC·모바일이 동일 메모리 data의 적용 결과를 공유하고, 각 탐색과 검색은 분리한다. 초기화·선택 적용·모바일 상세 적용은 실제 state 변경이지만 외부 저장·실제 API는 없다. CSS는 768/390 경계와 inherited neutral tokens로 배치한다.
- 테스트 소스 `tests/workspace-templates.test.tsx`: PC 연결, mobile selection/detail/apply/Escape/focus, 공유 변경/reset, scoped responsive CSS. 브라우저 `browser/expanded-features.spec.ts`의 `PC/mobile templates compose live search, filtered selection and BottomSheet apply`; 기존 범용 슬롯 예시는 `browser/design-system.spec.ts`에 별도 존재한다.

## TDS 첫 개별 상세 checkpoint（아직 최종 수락 아님）

- `TextField` / `text-field.tsx`·`text-field.css`, 공개 `TextFieldProps`: `FormField → FieldInput → Input`, Button/Icon 지우기와 ReactNode prefix/suffix/trailingAction. label/required/help/error 및 외부 설명 병합, native type/name/FormData, controlled owner 거절, 비제어 편집, loading DOM 유지, 지우기 후 입력 focus; disabled/readOnly/disabled fieldset 지우기 차단. `InputDetail` → 입력 유형/상태/장식/실제 이메일 검증·PasswordInput, 접힌 코드·props·접근성. 개별 주소 `#/components/text-field`. source tests `tests/text-field.test.tsx`, `tests/gallery-details-integration.test.tsx`, browser `browser/gallery-details.spec.ts`. 임의 후행 슬롯 동작과 server 검증·async 결과 순서·input ref API는 owner 책임/미지원이다.
- `ListRow`·`ListHeader`·`ListFooter` / `list-row.tsx`·`list-row.css`, 각 Props export: native li → Checkbox + leading/content/trailing + Button, Header/Footer → ActionGroup. controlled 선택과 독립 action, disabled callback 차단·긴 한국어 wrap. `ListDetail` → List + 행 + 헤더/하단, 실제 검색/분류/선택 완료/개별 action status. 주소 `#/components/list-row`, header/footer 주소도 동일 조합 예시를 사용한다. tests `tests/list-row.test.tsx`, integration, browser 상세 suite. 임의 ReactNode 슬롯의 disabled와 service side effect는 owner 책임이다.
- 기존 `BottomSheet → ModalRegion → Dialog`, `Dialog → Confirm/Drawer/Menu/Tooltip` 재사용. `OverlayDetail`의 개별 `#/components/bottom-sheet`·`#/components/dialog`는 안내·선택 draft 취소/적용·필수 입력·긴 내용·nested popup/모달 실제 예시를 제공한다. BottomSheet 상세는 **열 때** 현재 viewport에 따라 작은 화면의 실제 sheet 또는 PC의 실제 중앙 Dialog를 선택한다. 열린 동안 resize 추적·외부 서비스 저장은 구현하지 않았다. tests `tests/overlay-detail.test.tsx`, integration, browser 상세 suite.
- 단일 `src/gallery/registry.ts`·`navigation.tsx`에서 Atomic/기능군/검색이 같은 entry·canonical URL을 사용한다. `browser/gallery-navigation.spec.ts`는 직접 진입→메뉴 선택→뒤로/앞으로→refresh의 URL/h1/aria-current/history.length, 모바일 선택 h1와 Escape trigger의 실제 activeElement를 검사한다. `tests/app-fragment.test.tsx`의 초기 잘못된 hash fallback/실행 중 잘못된 hash 거절 계약을 보존한다.
- **위 연결과 inventory 대응은 전체 TDS 완료 숫자가 아니다.** 다른 신규 registry entry는 기존 구현의 export/기능 범위를 발견하기 위한 탐색 목록이며, 해당 개별 상세의 전용 live demo/API 문서 연결은 아직 진행 중이다. 기존 Atomic 대분류의 폼·달력/기간·DataTable·GNB/LNB/Drawer 및 PC/mobile templates는 유지한다. SegmentedControl은 후속 범용 보완에서 공개 native radio 조합·개별 상세로 연결했고, ProgressStepper/Slider/Rating/Result도 child 반환 후 부모가 공개 exports·core 스타일·단일 registry·실제 개별 상세에 연결하고 검증했다. BottomCTA 등의 범용 누락은 잔여이며 SDK/브랜드/font/차트/keypad 전체 복제는 승인되지 않았다. 실제 실행 결과와 snapshot fingerprint는 비공개 검수 packet에서 별도로 제출한다.

## 후속 범용 조합: SegmentedControl

- 공개 `SegmentedControl`, `SegmentedControlProps`, `SegmentedOption` / `segmented-control.tsx`·`segmented-control.css`: native fieldset/legend/radio/label 조합. controlled value와 owner 거절, 비제어 defaultValue/네이티브 reset, name/FormData/required 및 disabled option/fieldset, 외부 help/error 병합을 유지한다. 제어 모드 전환·고유 option value/name·제어 reset은 owner 계약이다. Tabs/tabpanel 또는 custom roving 엔진으로 위장하지 않는다.
- `SegmentedDetail`의 정본 `#/components/segmented-control`: 실제 목록 필터, 개별/전체 비활성, 긴 한국어 선택, 필수 native 제출/초기화와 오류/status. 기본 화면은 live demo, 코드/API/접근성은 접힘. 선택은 색 외에 장식 checkmark도 표시하고 radio 접근 이름에서는 제외한다.
- 소스 근거: `tests/segmented-control.test.tsx`, `tests/segmented-detail.test.tsx`, `tests/gallery-registry.test.ts`, `tests/core-styles.test.ts`, `browser/segmented-control.spec.ts`. 후속 부모 checkpoint에서 이 target **16 tests/4 files**, build/typecheck, Chromium **4/4 widths(320/390/768/1440)** 및 diff check가 통과했다. 실제 방향키 선택·disabled 건너뛰기·필수 제출 차단/FormData/reset·접힌 문서/scoped axe·문서 containment·computed selected/focus/48px를 검사했다. 이는 전체 최신 unit/browser·독립 최종 수락이 아니다.
- 기존 첫 상세 ZIP v1은 보존한 과거 checkpoint다. 후속 소스/화면 결과를 그 ZIP에 덮어쓰지 않으며, 다음 전체 검수 snapshot/hash는 다른 버전으로 생성한다. 첨부만 보류 중이고 ProgressStepper/Result/Slider/Rating는 child 반환 후 부모 통합·실행 검증을 마쳤다. 나머지 상세/BottomCTA 등은 별도 잔여다.

## 후속 범용 조합: Slider·Rating·ProgressStepper·Result

- `Slider`/`SliderProps`, `Rating`/`RatingProps` / `range-selection.tsx`·CSS: native range와 native radio fieldset. numeric callback, 제어 owner 거절/비제어 유지, 외부 form/name/FormData·disabled fieldset·필수 Rating·비-submit clear. Slider는 유한 범위/양수 step 또는 any 및 min 기반 격자를, Rating은 정수 0..5(0은 미선택)를 요구하며 잘못된 활성 props는 RangeError다. 서비스 경계 입력은 owner가 먼저 검증한다.
- 부모가 **비제어 native reset 불일치**를 RED2건으로 확인하고 초기 값·DOM·FormData 동기화를 보완했다. 취소된 reset/외부 폼·변경 callback 미호출과 native Chromium 복원을 검사했다. `RangeSelectionDetail`은 실제 키보드 범위/점수·필수 제출/지우기·disabled·별도 비제어 reset 예시를 `#/components/slider`, `#/components/rating`에 제공한다. source tests `tests/range-selection.test.tsx`, `tests/range-reset.test.tsx` 및 integration.
- `ProgressStepper`/Props / `progress-result.tsx`·CSS: zero-based currentStep, ordered ol/li, 완료/current/pending 텍스트·유효 current만 aria-current=step, 잘못된 index는 모두 대기+안내/빈 배열 안내. 정적 단계이며 숫자 Stepper/클릭 navigation이 아니다. `Result`/Props/Variant는 success/error/empty/info·headingLevel·본문·독립 action 슬롯과 기존 Alert/Icon을 조합한다. error guidance는 필수이며 공백일 때 안전한 복구 안내로 대체한다.
- `ProgressResultDetail`의 `#/components/progress-stepper`, `#/components/result`: 이전/다음/초기 단계, error retry→success, 빈 결과→추가, 실제 결과 확인/status와 disabled/busy 슬롯. source tests `tests/progress-result.test.tsx`, `tests/generic-details-integration.test.tsx`; browser `browser/generic-details.spec.ts`.
- 부모 검증에서 disabled→enabled 기본 Button의 **흰 전경/옅은 배경 보간 중 contrast 저하**를 직접 재현했다. 기본 fill의 보간만 제거하여 전경·배경 상태가 동시에 적용되고 기존 H/P/F 및 border motion은 보존된다. 검사 대기를 늘리거나 axe를 제외하지 않았고 즉시 computed fill 회귀를 추가했다.
- 수정 전 **v2 checkpoint**는 clean install(audit0, whatwg-encoding deprecation 경고 유지), 전체 unit330/60files, build/tsc, 상세·탐색·Segmented Chromium42pass+2비모바일skip 및 원래 리뷰 회귀/오류focus/기존템플릿20pass를 부모가 확인했다. 두 browser 결과는 같은 소스의 별도 실행이며 최초 v1의 280/42 기록과 혼합하지 않는다. 전체 final browser·새 frozen tree 독립 최종 수락/commit/push는 아직 아니다.

## 후속 scoped 리뷰 거절과 controlled reset 보완

- v2의 읽기 전용 독립 리뷰 (내부 검수 식별자 생략)는 **high 논리 결함 1건으로 불통과**였다. 제어 Rating의 최초 0/2→현재 4 이후 native reset이 예전 defaultChecked로 DOM/FormData를 되돌리고 owner의 현재 value와 불일치했다. 부모도 내부/외부 폼 4개 회귀 실패로 직접 재현했다. 따라서 v2의 330/62 통과를 독립 승인으로 바꾸지 않는다.
- 공통 reset 훅에서 취소/연결 상태를 확인하고 기본 동작 뒤 최신 owner 또는 비제어 초기값으로 native DOM과 상태를 복원한다. reset은 변경 callback을 호출하지 않는다. 추가 source `tests/controlled-range-reset.test.tsx`는 최초0/2·내부/외부form·required/FormData·owner가 reset 시0을 선택하는 경우·cancelled reset을 검사한다. 부모 target25/3files 및 전체unit336/61files·build/tsc 통과.
- `browser/generic-details.spec.ts`에 실제 controlled Rating reset→같은4점/required valid/FormData4 및 cancelled reset을 추가했다. Button 검사는 같은 evaluate 안의 disabled 해제 직후 색을 읽고, 기본색 확인 전 pointer를 옮겨 hover와 default 상태를 분리한다. 최초 강화 fixture는 pointer hover색을 default색으로 오인해 실패했으며 timeout도 발생했다. fixture 교정 후 상세·탐색46pass+2비모바일skip, 원리뷰5/오류focus/기존템플릿20pass를 최신 소스로 다시 확인했다.
- v1/v2 ZIP·소스 snapshot은 그대로 보존한다. 보완된 **v3의 읽기 전용 scoped 재리뷰 (내부 검수 식별자 생략)는 통과**했다. reviewer가 메모리 React/jsdom 10사례와 TS/TSX5파일 변환을 직접 실행했다고 보고했고, 부모는 종료된 transcript의 성공 실행과 v3 source byte/ZIP 보존을 확인했다. 이 결과는 전체최종 frozen-tree 수락·혜지 승인·commit 허가가 아니다. microtask 이후 동기화 계약이며 reset 직후 동기 FormData 읽기까지 보장하지 않는다.
- nonblocking2제안은 현재 test에 적용했다: controlled Slider도 외부 form 연결 fixture와 자체 변경 callback spy를 제공하며, 외부 비제어 reset 테스트도 실제 callback spy/calls 불변을 단언한다. production source는 v3와 byte-identical이고 두 테스트만 보강한 뒤 unit336/61·typecheck·diff check를 다시 통과했다. 문서/테스트 후속 변경을 v3 ZIP에 덮어쓰지 않는다. 나머지 상세/BottomCTA·전체최종 동일tree 검증은 별도 잔여이고 혜지의 최신 소스 독립 검수는 첨부 미전달로 미시작이다.

## owner 책임과 미완료 검증

1. controlled value/checked/selectedId/selectedKeys/open/page를 공급한 owner는 콜백 제안을 수락하고 새 props로 반영해야 한다. 컴포넌트가 요청한 close/apply/retry가 성공하거나 서버에 저장되었다고 가정하지 않는다. 옵션·row key·min/max의 올바른 입력, required/error 정책, async 상태·취소·중복 결과 조정은 소비자가 책임진다.
2. 감사 수정의 현재 소스에는 busy Input identity 유지, 폼 내부 비-submit 탐색, 공통 modal ownership/초기 중첩 top-layer, native validation, controlled datetime 거부, step 격자·invalid step, disabled tag/retained address callback, calendar civil math/year bounds가 들어 있다. 이 사실은 **모든 수정의 최종 통합 실행이 통과했다는 판정과 다르다.**
3. browser 테스트 소스와 scoped axe 대상이 존재해도 모든 브라우저 엔진·실제 보조공학(AT)·native popup·모든 글리프 fallback·제품 통합은 미인증이다. 폰트 face 로드와 per-glyph coverage를 동일시하지 않는다. 외부 주소 provider·파일 업로드·인증·서버 데이터 연결은 미구현/소비자 범위다.
4. 최종 수락은 동일한 동결 트리의 clean install/build/unit/browser 실제 실행, 좁은 화면 screenshot 직접 검토 및 독립 재검토 결과와 exact SHA 제출을 함께 판정한다. 이 문서는 coverage 소스맵이지 실행 결과 보고서가 아니며, 실제 통과 기록은 별도 제출한다.
5. ConditionRow/GraphNode/Port/Edge/Inspector, 그래프·캔버스 편집, timeline/rich editor 등은 이 export 목록에 없다. 기존 상세/폼 슬롯으로 구성할 수 있다는 설명만으로 완성 위젯이나 제품 실행 엔진을 주장하지 않는다.
