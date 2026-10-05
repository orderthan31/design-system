# 현재 공통 색상·대비 계약 v1

## 기본값과 역사 원본을 분리

현재 소비 진입점은 `src/core.css`와 `.ds-core` 조상이다. import graph는 scoped 토큰 → **white/slate default** → theme/공통 컴포넌트 CSS다. `src/default-theme.css`가 실제 Button·폼·탐색·표·선택·피드백 상태의 기본색을 설정한다. `gallery.css`와 호환 `styles.css`는 문서 앱 전용 opt-in이며 소비 core가 import하지 않는다. Pretendard·48px 주요 동작/44px 일반 컨트롤 계약을 보존한다.

역사 원본 `public/source/tokens/core.json`은 107개(primitive 39 / semantic 29 / component 39), SHA-256 `b459f1c541d3c2e37190c745e727a4b3c2a755ac395cbd8040e4eb2a972d2d20` 그대로 보존한다. 원본 팔레트 보존은 현재 UI에 옛 색을 유지한다는 뜻이 아니다. 이전 `theme-contract.md`는 역사 snapshot이며 현재 기본값/미검증 판단의 정본이 아니다.

## 실제 상태와 적용 API

- Slate primary: default `#334155` / hover `#1e293b` / pressed `#0f172a`, text `#ffffff`; focus `#475569`.
- Selected: surface `#e2e8f0` / text `#334155`.
- Info `#f1f5f9` / `#334155`; success `#ecfdf5` / `#065f46`; warning `#fffbeb` / `#854d0e`; error `#fff1f2` / `#be123c`.
- Destructive fill `#be123c` / hover `#9f1239` / pressed `#881337`, text `#ffffff`.
- Secondary·ghost·quiet의 default/H/P와 busy/disabled는 별도 실제 CSS 계약이다. busy를 disabled로 축소하지 않는다. passive feedback 자체의 pointer H/P는 해당 없음이며 내부 action은 검증 대상이다.
- `defaultTheme`, `themes`, `applyTheme`, `assessTheme`는 `src/index.ts`에서 소비 가능하다. `src/themes.ts`는 추가 역할/allowlist/계산/generator/types를 제공한다.
- Indigo/Teal은 generic 교체 예시다. `applyTheme`는 root/body를 거부하고 prior inline value·priority·`data-ds-theme`를 보존한다. 반환 cleanup은 idempotent하며 layered 적용은 역순 해제한다. 형제/root가 아닌 지정 subtree만 교체한다.
- “기본 코어로 복원”은 **현재 slate**로 돌아온다. 역사 토큰의 색이나 Indigo/Teal pass flag를 slate 근거로 승계하지 않는다. 갤러리 대비 표는 “대비 계약”의 접힌 상세에 남는다.

## 실행 가능한 폐쇄 allowlist

`src/themes.ts`의 `textPairs`/`nonTextPairs`가 조합 정본이다. `docs/theme-contrast.json`은 각 팔레트의 모든 resolved role 색, 역할 수, 실제 override 수, pair별 full-precision ratio/threshold/passes, 모든 동률 minimum pair를 보존한다. `tests/theme-evidence.test.ts`가 module 재계산과 JSON의 일치를 검증한다.

각 팔레트: **42 roles / 88 overrides / text 47 pairs / non-text 31 pairs**. 일반 텍스트는 unrounded **4.5:1**, 의미 있는 필수 경계/상태 그래픽은 실제 인접색 대비 **3:1**. large-text shortcut은 사용하지 않는다. 근거는 W3C WCAG 2.2 SC 1.4.3 및 SC 1.4.11이고 2026-10-05 공식 설명을 대조했다:

- `https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html`
- `https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html`

현재 재계산 minimum:

- **Slate text**: `errorText #be123c` / `errorSurface #fff1f2`, **5.721379238070055**, threshold 4.5 → 수치 통과.
- **Indigo text**: `errorText #b91c1c` / `subtle #f1f5f9`, **5.905927118870345**, threshold 4.5 → 수치 통과.
- **Teal text**: `primaryText #ffffff` / `primaryDefault #0f766e`, **5.473250081210842**, threshold 4.5 → 수치 통과.
- **Slate non-text**: `controlBorder #64748b` / `errorSurface #fff1f2`, **4.331970000302035**, threshold 3 → 수치 통과.
- **Indigo/Teal non-text**: `controlBorder #64748b` / `subtle #f1f5f9`, **4.343923406321176**, threshold 3 → 수치 통과. 위 minimum은 각각 단일 pair이며 JSON은 향후 동률도 전부 기록한다.

허용 text는 surface/canvas/subtle 위 primary/secondary/muted/link/ghost/error 텍스트, default/hover/pressed action, selected/inverse/info/warning/success/error/neutral/disabled 및 지정 status 표면의 body text다. non-text는 surface/canvas/subtle 위 control border·offset focus·primary/destructive fill·invalid 경계와 info/warning graphic이다. ErrorState retry의 실제 경계·offset focus와 errorSurface adjacency도 2개 non-text pair로 추가 검증한다. 실제 alias 제약은 `themeVariables`에서 검증하고 divergence/failing palette는 적용 전에 거부한다.

## 금지·장식·inactive를 혼동하지 않기

- **미등재 조합은 허용하지 않는다.** 불투명 색과 명시 배경만 대상으로 한다. opacity/fade/translucent ancestor·이미지·gradient·arbitrary colored container는 별도 재계산/검증이 필요하다.
- white inverse text를 light surface에, ghost/link를 primary fill에 놓는 것은 이 계약이 허용하지 않는다.
- `#0f172a66` scrim을 white에 합성하면 `#9fa2aa`; 그 위 white text는 **2.5538827486585394:1**이라 금지다. scrim 예시는 **decorative-only**, 텍스트를 올리지 않는다. 다른 backdrop은 다시 합성/계산해야 한다.
- subtle border/Separator는 장식이며 control identification 경계의 통과 근거가 아니다. field/secondary 경계는 `controlBorder`를 쓴다.
- 실제 inactive control에는 기준의 예외가 있지만 이는 “수치 통과”가 아니다. 이 DS는 불투명 disabled text pair도 수치 계산한다. 달력 등 실제 disabled opacity=0.4 표시의 합성 결과는 해당 불투명 pair 값과 동일하다고 주장하지 않으며 실제 inactive 예외/opacity 제외 범위로 분리한다. readonly·placeholder·disabled 이유/도움말은 active text 기준을 유지한다. busy만으로 inactive 예외를 적용하지 않는다.
- offset focus는 명시 light adjacency에서 측정한다. 채워진 색과 맞닿는 다른 geometry로 바꾸면 재검증한다.

계산은 sRGB channel 0–1, `c <= 0.04045`에서 `c/12.92`, 그 외 `((c+0.055)/1.055)^2.4`; luminance `0.2126R+0.7152G+0.0722B`; ratio `(lighter+0.05)/(darker+0.05)`다. 판정은 반올림 전 값으로 한다. alpha는 명시 opaque backdrop과 encoded-sRGB source-over로 합성한 뒤 8-bit 채널로 계산한다.

## 재생성과 검증 범위

```sh
npm run themes
npm test -- tests/themes.test.ts tests/default-theme.test.ts tests/theme-evidence.test.ts tests/theme-gallery.test.tsx tests/theme-integration.test.tsx tests/core-styles.test.ts
npm run build
npm run check:browser
```

Node 22.22.2에서 `scripts/themes.mjs`가 `theme-roles.css`, `default-theme.css`, 대비 JSON을 결정적으로 생성하며 build에도 포함된다. token/font bytes를 교체하지 않는다.

브라우저 테스트 소스는 `browser/core-consumer.spec.ts`(gallery-free host style 불변·Button kind×size×H/P/F/busy/disabled·fields/navigation/modal·native validity/owner-rejected datetime), `browser/theme-integration.spec.ts`(실제 subtree 전환/복원/입력 유지), `browser/expanded-features.spec.ts`(slate states·실제 Korean range/forms/data/중첩 overlays/templates)다. viewport 프로젝트는 320/390/768/1440이고 `acceptance.spec.ts`는 1024도 별도 검사한다. 특정 source 테스트의 존재나 과거 snapshot 통과는 frozen 최종 tree의 전체 검증/독립 리뷰 통과를 대신하지 않는다.

Chromium/jsdom 결과는 Safari/Firefox·실기기 보조기술·일본어 glyph별 fallback·native Select popup 픽셀/키보드 선택·arbitrary 소비 앱 adjacency를 인증하지 않는다. numerical pair pass는 전체 WCAG 적합성 인증이 아니다. 최초 theme browser RED 로그는 찾지 못한 이력을 유지하며 새 로그를 최초 증거로 대체하지 않는다. 별도 `FormField` external `aria-describedby` 병합 제안은 비차단 제안으로 유지한다.
