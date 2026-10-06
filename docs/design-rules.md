# Design consistency rules

## 고정 기준

공통DS 기본은 Pretendard14px/blue primary, 일반 입력 한겹1px shell·내부 input border0, 내부 eye/eye-off 토글과44px hit target이다. focus/error는 별도로 식별하고 focus outline3px는 일반 border와 구분한다. Chart는 Recharts 단일 엔진, semantic palette와 정돈된 축/grid/tooltip/legend, 원본 데이터 표를 유지한다. 공개107 token identifiers는 유지하며 `src/design-tokens.css`의 실제 scoped appearance alias는 별도 보완이다.

## 실제 실행

```sh
npm run lint:design
npm run lint:design:fixtures
npm run build
npx tsc -b --pretty false
```

`lint:design`는 @shadcn/lint ESLintflat config, 별도 PostCSS 선언/selector 검사, 실패/통과 fixture를 실제 실행한다. source 전수에 위반이 있으면 exit1이다. baseline도 숨기거나 제외하지 않는다. `--report=<path>`로 상대 경로만 포함한 JSON을 출력할 수 있다. 이 빠른 정적 검사는 runtime/full-suite/Playwright/AT/디자인 수락을 대체하지 않는다.

- exact devpins: `@shadcn/lint0.2.0`, `eslint9.39.5`, `@typescript-eslint/parser8.71.1`, `postcss8.5.28`; lockfile 보존.
- npm이 eslint9.39.5에 unsupported/deprecated 경고를 냈다. 승인된 호환pin을 임의 교체하지 않았고 이를 보안취약점 판정과 구분한다.
- 공식 upstream 기준은 `ee9391038b5dc025f01777d8dbd0f72d5b885ab4`; npm배포0.2.0/source와 실제 option/schema를 대조한다. 설치는 전체 shadcn/Tailwind 도입이 아니다.

## 소비자와 gallery: no-restyle

공개 variant/size를 사용한다. DS component의 색/radius/border/padding/font를 className/style로 다시 정의하지 않는다. 주변 배치/폭/외부 gap만 승인된 layout으로 허용한다. `settings.shadcn.ui/componentImports`는 실제 `src/components`·형제 core imports·`src/index.ts` barrel을 인식한다. alias/barrel 실패 fixture와 인식된 실제 JSXsite 수를 확인하며 미검사0건을 성공으로 처리하지 않는다.

다음 plugin 규칙은 error다: `no-restyle`, `no-raw-colors`, `no-arbitrary-values`, `no-inline-styles`, `require-static-classes`. no-restyle의 core override는 config의 명시된 스타일 정의 소유 파일에만 적용한다. 해당 파일에서도 다른 네 규칙과 별도 CSS 검사는 유지한다. 전역 disable/전체core ignore/allow*로 회피하지 않는다.

### Tailwind 한계

이 저장소에는 실제 Tailwindv4 compiler/theme가 없다. 따라서 `no-unknown-classes`는 적용하지 않는다. 가짜 components.json/@theme나 허구 class 목록으로 합격시키지 않는다. 다른 plugin 규칙은 실제 실패 fixture로 작동 여부를 확인한다. 기존 plainCSS class의 선언/용도와 소비자 appearance override는 별도 CSSchecker가 검사한다. Tailwind class 문법의 통과 fixture는 compiler가 해당 class를 생성했다는 검증이 아니다.

### 실제 옵션과 인식 범위

규칙 옵션의 `componentImports`/`ignoreImports`는 정규식 문자열이며 `mergeFunctions`/`variantFunctions`는 함수 이름이다. `no-inline-styles`에는 이 네 옵션을 전달하지 않는다. `require-static-classes`에는 allow/deny/contracts가 없다. deny만 지정하고 allow를 생략하면 나머지가 허용될 수 있으므로 strict inline 기준은 `allow: []`를 명시한다. 여러 contract는 마지막 매칭이 우선이며 contract allow는 상위 allow를 대체한다.

relative components·core sibling·public index/src barrel·named alias·namespace는 실제 ESLint Node API fixture로 확인한다. named import alias와 renamed re-export의 identity는 같다고 가정하지 않는다. 현재 저장소에는 renamed re-export 검증 fixture가 없으므로 해당 경우까지 검증했다고 보고하지 않는다. runner의 JSXsite 수는 import/AST 기반 탐색 수이며 plugin 내부 방문 계측이 아니다. namespace 규칙 동작은 별도 fixture로 확인한다.

### custom property의 보완과 한계

배포 plugin은 `--*` 값에 raw color가 없으면 deny 설정만으로 거부하지 않는다. 실제로 consumer `--field-bg: "13px"`와 semantic token 주입이 기존 규칙을 통과했다. `ds/no-unowned-custom-properties`가 정적으로 읽을 수 있는 style key를 exact 파일·변수 소유권으로 추가 검사한다. 직접 object, 같은 파일의 const indirection/static spread, literal computed key와 해석되지 않는 computed key를 fixture로 확인한다. semantic 값이어도 소비자의 token override 권한을 만들지 않는다.

소유 변수는 BottomCTA measured height, GridList columns, Chart semantic series indicator 세 가지뿐이다. custom-property 소유권과 일반 style property 예외는 별도 목록이다. 소유권 허용은 값 전체 검증이 아니며 raw color는 기존 shadcn 규칙으로 계속 거부된다. opaque 함수 반환/외부 객체/객체 mutation의 transitive data flow나 runtime CSSOM은 이 보완 규칙이 분석하지 않는다. themeVariables의 동적 반환과 native style forwarding을 이 규칙만으로 검증했다고 주장하지 않는다. 기존 플러그인의 unreadable-style 진단을 숨기거나 theme gallery 전체를 면제하지 않는다.

## plainCSS 별도 검사

- 색/그림자 raw literal은 명시 token source의 custom property 정의에만 허용한다. 스타일 소비 선언은 semantic token을 쓴다.
- padding/border/radius/font 등 appearance의 길이/weight는 token을 사용한다. 0/inherit/currentColor/transparent 및 focus outline·구조기하학은 구분한다.
- normal input의 굵은 border, gallery의 core class appearance override, !important, core selector의 .ds-core scope 누락을 검사한다. 단 기존 `src/core.css`의 `.ds-core` scoped `prefers-reduced-motion: reduce`에서 animation:none/transition:none/scroll-behavior:auto를 강제하는 세 선언은 실제 접근성 안전 계약으로 보존한다. 이후 더 구체적인 animation 선언을 이겨야 하므로 이 exact file/media/property/value 조합만 구분하며 일반 precedence 면제는 아니다.
- @font-face 등록과 keyframes는 문서화된 전역 등록이다. token source file 목록은 checker에 실제 경로로 고정하며 component 전체를 예외 처리하지 않는다.
- 현재 검사는 CSS구문/규칙의 정적 근거이며 computed cascade, 전환 대비, all-control state/AT 적합성을 보장하지 않는다. 필요한 동작 검증은 별도 범위로 남긴다.

## 예외와 수정 방법

`eslint.config.mjs`의 `geometryExceptions`는 exact 파일·허용 property·이유를 함께 기록한다. Progress width, GridList columns, BottomCTA measured reservation, 소비자 width/gap/viewport region, Foundations token swatch 등 실제 동적 값만 허용한다. palette/padding/radius를 geometry 예외에 끼워 넣지 않는다. CSScustom properties는 `scripts/design-jsx-policy.mjs`의 별도 exact 소유권 목록으로 제한하고 값의 출처를 확인한다. 실제 source-read 결과에 따라 예외를 더 좁히며 baseline 발견을 이유없이 waive하지 않는다.

- appearance 오류: 공개variant/size 또는 실제 owning CSS의 semantic token으로 교정.
- 소비 class 오류: CSS실제 선언/사용 목적을 확인하고 layout-only class나 명시 variant로 전환. 동적으로 class문자열을 조립하지 말고 정적인 선택지를 사용.
- inline 오류: 정적인 표현은 owning stylesheet로 옮기고, 실제 동적geometry는 custom property 또는 정확 property 예외로 제한.
- scope/!important 오류: 부모 layout/selector ownership을 교정. clipping이나 전역 강제우선순위로 숨기지 않기.

## baseline와 checkpoint

새 검사로 드러난 기존 위반과 새 WIP의 위반을 구분한다. 최초 전수 결과와 이후 잔여를 `docs/design-lint-baseline.json`에 상대 경로로 보존한다. baseline은 면제 목록이 아니며 `lint:design`는 잔여가 있으면 계속 실패한다. 실제 lint·fixture·build/tsc 결과와 exactSHA를 보고한다. 다른 tree의 통과 기록을 합쳐 최신 전체 통과로 보고하지 않는다.
