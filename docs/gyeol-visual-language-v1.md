# Gyeol Design — 시각 규칙 v1

## 작업 기준

결은 장식 질감이 아니라 관계·정렬·조작의 일관성이다. 같은 맥락은 기준선과 간격으로 묶고, 날짜·시간·파일처럼 서로 다른 선택은 목적에 맞는 실제 UI를 사용한다. 높은 강조는 주요 동작과 필요한 상태에 한정한다. 이 기준은 문서와 구현 판단용이며 기본 화면에 슬로건으로 반복하지 않는다.

## 구현된 첫 visual family

- `src/themes.ts`가 current semantic 팔레트를 소유한다. canvas #fafaf9, surface #ffffff, subtle #f5f5f4, text #1c1917, secondary #57534e, muted #6f6862, controlBorder #8c8882, separator #e7e5e4. primary blue는 #2563eb / #1d4ed8 / #1e40af를 유지한다.
- `scripts/themes.mjs`가 default/theme CSS와 closed-pair 대비 보고서를 생성한다. 생성 CSS만 수동 교정하지 않는다. historical 107-token source는 그대로다.
- 실제 조작 경계 `--ds-boundary-rest`와 `--field-border`는 같은 controlBorder 역할에 연결한다. 공개 applyTheme도 두 변수에 함께 도달한다. API 표 separator는 controlBorder가 아닌 subtleBorder를 사용한다.
- ghost text는 ghostText, 실제 link는 primaryHover를 소비한다. secondary/ghost hover·pressed는 각 action 역할을 사용한다. 실제 소비가 분리된 secondaryPressed/ghostHover의 과거 selectedSurface 동등성 제약만 제거했고 대비 allowlist/threshold는 유지했다. link text 검사 세 쌍을 추가했다.
- `core.css`의 기본 Button/Input/Select는 44px, radius 8px, control 14px/22px이다. label은 별도 13px/20px, helper 12px/18px, page 24px/32px다. explicit small/large API의 의미와 44px 최소 조작 대상은 보존한다.
- Password/InputGroup은 단일 외곽 경계와 border 없는 내부 input을 사용한다. 눈 버튼은 내부에서 44px hit와 18px glyph를 유지한다. Password 동작 source를 교체하지 않았다.
- Tabs는 단일 separator와 active indicator, SegmentedControl은 중립 배경과 실제 선택 marker를 사용한다. ListRow는 정렬·간격·divider로 관계를 드러내고 row를 카드로 감싸지 않는다. 실제 independent Section surface만 radius 12px를 사용한다. 새 Card export는 추가하지 않았다.
- gallery workbench의 field 예시 container는 max 420px, form은 max 640px, 그 외는 용도에 따른 폭을 사용한다. public Input의 width를 제한하지 않으며 gallery CSS는 component border/font/radius/state를 덧칠하지 않는다.

## 이어서 보존한 선택 UI

Date/Range는 하나의 값 trigger에서 calendar로, Month는 연도와 12개월 3×4 grid로, Time/DateTime은 실제 clock·24시간 시/분 목록·확인에서 HH:mm 확정 값으로 연결한다. 값 소유, required/min/max, blocked/disabled/readOnly/busy, Escape/focus, validity 계약을 보존한다.

FileInput은 hidden native chooser와 한 dropzone/CTA, 이름/개수/비우기/실제 오류를 제공한다. 클릭/drop에 같은 accept/multiple 정책을 적용한다. 허용된 drop은 실제 native FileList 연결 후 native 값으로 콜백을 전달한다. 연결 실패를 성공으로 표시하지 않는다. 업로드·외부 전송·가짜 progress는 없다. native reset은 내부 목록과 native FileList를 동기화하지만 사용자 change 콜백을 만들지 않는다. 소비자 배열 정책은 form onReset에서 소유해야 한다.

## 검증과 남은 범위

이는 첫 방향 checkpoint이며 최종 디자인 승인이나 전수 UI/접근성 합격이 아니다. build/typecheck/diff, frozen lint/33 fixtures와 소규모 실제 브라우저 관측을 공유한다. 대비 보고서는 closed opaque semantic pair 계산으로, 모든 상태/alpha/실제 사용 인증이 아니다. 전체 owner 확장, 실제 AT/IME/전체 대비/다른 브라우저와 gallery-free public consumer parity는 최종 디자인 승인 후 같은 final SHA에서 검증한다. Password의 환경별 selection 차이는 이 시각 수정으로 해결했다고 주장하지 않는다.
