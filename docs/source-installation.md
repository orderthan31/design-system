# Gyeol Design — 선택 소스 설치 계약

저장소는 private gallery 앱이며 npm 배포 패키지가 아닙니다. `registry.json`은 공식 shadcn GitHub source registry입니다. 별도 registry 서버·자체 CLI·컴포넌트별 npm package는 없습니다. 실제 제품 앱 통합은 별도입니다.

```sh
npx shadcn@4.21.3 add orderthan31/design-system/button
npx shadcn@4.21.3 add orderthan31/design-system/input
npx shadcn@4.21.3 add orderthan31/design-system/password-input
npx shadcn@4.21.3 add orderthan31/design-system/chart
npx shadcn@4.21.3 add orderthan31/design-system/icon-button
npx shadcn@4.21.3 add orderthan31/design-system/textarea
npx shadcn@4.21.3 add orderthan31/design-system/select
npx shadcn@4.21.3 add orderthan31/design-system/checkbox
npx shadcn@4.21.3 add orderthan31/design-system/icon
npx shadcn@4.21.3 add orderthan31/design-system/icon-action
npx shadcn@4.21.3 add orderthan31/design-system/switch
npx shadcn@4.21.3 add orderthan31/design-system/radio-group
npx shadcn@4.21.3 add orderthan31/design-system/multi-select
npx shadcn@4.21.3 add orderthan31/design-system/checkbox-group
npx shadcn@4.21.3 add orderthan31/design-system/slider
npx shadcn@4.21.3 add orderthan31/design-system/rating
```

- 설치 위치: `src/gyeol/`. 소비 앱의 기존 경로로 옮길 때 상대 import도 함께 유지합니다. `~/` target은 프로젝트 루트 기준이며 전역 홈 설치가 아닙니다.
- `button`은 React만 필요하고 Input/PasswordInput/Chart/갤러리 소스와 Radix/Lucide/Recharts는 가져오지 않습니다.
- `input`은 React만 필요합니다. `password-input`은 실제 Input·InputGroup·필드 프레임과 Radix Toggle/Lucide만 포함합니다. `chart`는 실제 Chart·Table과 React/Recharts/react-is만 포함합니다. 다른 데이터 컨트롤·갤러리는 포함하지 않습니다.
- `icon-button`은 실제 Button과 React만, `textarea`/`select`/`checkbox`는 자신의 native owner/style과 React만 포함합니다. `icon`은 정적 Lucide subset만 포함하고 IconAction/버튼/갤러리는 가져오지 않습니다. `icon-action`은 실제 Icon→IconButton→Button만 추가합니다. native className/ref는 실제 control에 전달되며 Checkbox의 mixed는 native indeterminate로 유지합니다.
- manifest의 dependency/devDependency는 소비자의 package.json과 lockfile에 CLI가 반영합니다. npm의 저장 접두사 정책에 따라 package.json에는 `^`가 붙을 수 있으므로 실제 resolution은 lockfile로 확인합니다. 이미 설치된 React 환경과 충돌하면 소비자가 기존 환경과 조율해야 합니다.
- 컴포넌트 source가 자신의 CSS를 import합니다. 애플리케이션 범위의 `.ds-core` 안에서 사용하며 core/gallery/styles.css를 복사할 필요가 없습니다. 범위 밖 host reset은 하지 않습니다.

```tsx
import { Button } from './src/gyeol/components/button';
import { Input } from './src/gyeol/components/input';

<div className="ds-core">
  <Button className="rounded-none px-8">저장</Button>
  <Input name="title" aria-label="제목" />
</div>
```

현재 canonical gallery75항목 중 선택 설치16항목입니다. 나머지59항목은 component 부재가 아니라 standalone 설치 coverage 미완료입니다.

- Switch/RadioGroup/MultiSelect/CheckboxGroup/Slider/Rating은 필요한 field/choice/reset/checkbox/button owner와 React만 포함하며 Recharts/Lucide/Radix를 가져오지 않습니다. form.reset()은 native default action 후 microtask에서 uncontrolled 초기값 또는 latest controlled owner 값으로 DOM/표시 state를 맞추며 change callback을 만들지 않습니다. cancelled reset은 동기화하지 않습니다.

## Pretendard 자산 — 별도 필수 설정

CSS의 `font-face.css`는 400/500/600/700을 등록하고 `/source/fonts/Pretendard-{Regular,Medium,SemiBold,Bold}.woff2`를 요청합니다. **woff2 binary는 현재 CLI source item으로 자동 복사하지 않습니다.** 설치한 컴포넌트만으로 해당 자산을 확보했다고 간주하지 않습니다. registry item의 `meta.fontAssets`에 정확한 원본·소비자 경로·URL·SHA-256을 넣었습니다.

동일 Git checkpoint의 `public/source/fonts/`에서 네 woff2와 `LICENSE`, `provenance.json`을 소비자 `public/source/fonts/`에 그대로 복사하고 실제 정적 URL이 올바른 MIME/bytes로 응답하게 합니다. subpath 배포에서는 `src/gyeol/font-face.css`의 네 URL을 소비자의 실제 asset URL로 조정합니다. 원본 font bytes와 license는 바꾸지 않습니다. 자산이 없으면 system sans fallback이며 동일 외관을 주장할 수 없습니다.

## override와 native/slot 계약

순서는 `theme → base → components → utilities`입니다. Tailwind의 layer 순서를 먼저 선언하고, 소비자 unlayered CSS 또는 utilities는 기본 컴포넌트 규칙보다 우선합니다. 상태·focus를 없앤 override의 접근성 책임은 소비자에게 있습니다.

semantic 기본값은 소비 요소에서 해석합니다. 예를 들어 `background: var(--button-bg-default, var(--color-action-primary-bg-default))`입니다. 선택적 component override는 기본 `initial`로 역사 literal을 무효화하므로 조상에서 semantic만 바꾸거나 하위 컨테이너에서 semantic을 다시 바꾸어도 실제 Button에 도달합니다. component override를 명시하면 그것이 우선하며 해당 값은 후손에 상속됩니다. `.ds-core`를 다시 붙인 별도 DS root는 기본 테마를 새로 선언합니다.

```css
.application.ds-core { --color-action-primary-bg-default: #0f766e; }
.application .nested-section { --color-action-primary-bg-default: #7c3aed; }
.application .special-button { --button-bg-default: #1e40af; }
```

Button/Input의 native rest/className/ref는 실제 button/input에 도달합니다. InputGroupInput은 `input-group-control` slot을 보존하고 caller data-slot도 유지합니다. InputGroup/Addon은 native div rest/className/ref를 전달합니다. Password의 기존 className/ref/native attrs는 input 소유이며 field/label/description/error·input-group/control/addon·password-trigger는 data-slot으로 찾아 조합합니다. 별도 rootProps/portal/placement/open/timezone API를 만들지 않습니다.

현재 빠른 checkpoint의 검증과 디자인/전체 브라우저·AT/IME·전수 consumer 수락은 별개입니다. 공식 schema/사용 계약 참고: https://ui.shadcn.com/docs/registry/github 및 https://ui.shadcn.com/docs/registry/registry-item-json.
