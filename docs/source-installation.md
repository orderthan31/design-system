# Gyeol Design — 설치와 사용 시작

Gyeol Design의 컴포넌트 소스를 React 프로젝트에 추가해 사용합니다. 필요한 컴포넌트만 선택 설치하거나 저장소 전체 소스를 연결할 수 있습니다. 두 방식의 import와 스타일 설정은 아래 안내를 따르세요.

## 필요한 컴포넌트만 설치하기

프로젝트의 shadcn 설정을 준비한 뒤 프로젝트 루트에서 원하는 명령을 실행합니다. 공식 GitHub registry 경로를 사용합니다. 저장소에 접근할 수 있는 GitHub 환경이 필요합니다.

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
npx shadcn@4.21.3 add orderthan31/design-system/badge
npx shadcn@4.21.3 add orderthan31/design-system/separator
npx shadcn@4.21.3 add orderthan31/design-system/skeleton
npx shadcn@4.21.3 add orderthan31/design-system/container
npx shadcn@4.21.3 add orderthan31/design-system/stack
npx shadcn@4.21.3 add orderthan31/design-system/grid
npx shadcn@4.21.3 add orderthan31/design-system/shell
npx shadcn@4.21.3 add orderthan31/design-system/alert
npx shadcn@4.21.3 add orderthan31/design-system/empty-state
npx shadcn@4.21.3 add orderthan31/design-system/loading-spinner
npx shadcn@4.21.3 add orderthan31/design-system/error-state
npx shadcn@4.21.3 add orderthan31/design-system/toast
npx shadcn@4.21.3 add orderthan31/design-system/accordion
npx shadcn@4.21.3 add orderthan31/design-system/collapse
npx shadcn@4.21.3 add orderthan31/design-system/tabs
npx shadcn@4.21.3 add orderthan31/design-system/menu
npx shadcn@4.21.3 add orderthan31/design-system/tooltip
npx shadcn@4.21.3 add orderthan31/design-system/form-field
npx shadcn@4.21.3 add orderthan31/design-system/text-field
npx shadcn@4.21.3 add orderthan31/design-system/number-input
npx shadcn@4.21.3 add orderthan31/design-system/currency-input
npx shadcn@4.21.3 add orderthan31/design-system/phone-input
npx shadcn@4.21.3 add orderthan31/design-system/email-input
npx shadcn@4.21.3 add orderthan31/design-system/search-field
npx shadcn@4.21.3 add orderthan31/design-system/combobox
npx shadcn@4.21.3 add orderthan31/design-system/file-input
npx shadcn@4.21.3 add orderthan31/design-system/address-field
npx shadcn@4.21.3 add orderthan31/design-system/date-picker
npx shadcn@4.21.3 add orderthan31/design-system/date-range-picker
npx shadcn@4.21.3 add orderthan31/design-system/month-picker
npx shadcn@4.21.3 add orderthan31/design-system/time-input
npx shadcn@4.21.3 add orderthan31/design-system/date-time-input
```

위 목록의 48개 컴포넌트가 선택 설치를 지원합니다. 그 외 컴포넌트는 아래 전체 소스 방식으로 사용할 수 있습니다. 특정 버전으로 고정하려면 경로 뒤에 `#<commit-SHA>`를 붙입니다.

소스는 프로젝트의 `src/gyeol/`에 설치됩니다. `~/` 설치 대상은 프로젝트 루트를 뜻합니다. 경로를 옮길 때는 관련 파일과 상대 import를 함께 유지하세요.

```tsx
import { Button } from './src/gyeol/components/button';
import { Input } from './src/gyeol/components/input';

export function Example() {
  return <div className="ds-core">
    <Input name="title" aria-label="제목" />
    <Button type="button">저장</Button>
  </div>;
}
```

컴포넌트 파일이 필요한 CSS를 가져옵니다. 선택 설치에서는 별도로 전체 `core.css`나 `gallery.css`를 가져오지 않습니다. 예제에서 추가로 사용하는 컴포넌트는 각각 설치하세요. 예를 들어 Shell의 navigation에 Button을 넣으려면 button도 설치합니다.

## 의존성과 라이선스

설치 명령은 컴포넌트에 필요한 dependency·devDependency를 프로젝트의 `package.json`과 lockfile에 반영합니다. 기존 React 버전과 프로젝트 설정을 확인하고 변경한 lockfile을 함께 보관하세요.

- Button, Input, 일반 HTML 입력·선택·배치 컴포넌트는 React를 사용합니다.
- PasswordInput은 Input·InputGroup·필드 프레임과 Radix Toggle·Lucide를 사용합니다.
- Icon과 IconAction 및 아이콘을 사용하는 ErrorState·Toast·Accordion은 필요한 아이콘 소스를 포함합니다.
- Chart는 Table·Recharts·react-is를 사용합니다. 다른 컴포넌트만 설치할 때 차트 라이브러리가 따라오지는 않습니다.

원본 소스와 의존성의 라이선스·저작권 고지를 유지하세요. Pretendard의 LICENSE와 provenance.json은 글꼴 파일과 함께 제공합니다.

## 전체 소스로 사용하기

저장소의 `src/`를 프로젝트에 복사하거나 연결하고 해당 경로의 공개 진입점과 core.css를 사용합니다. 저장소의 `package.json`을 참고해 사용하는 컴포넌트의 의존성을 준비하세요.

```tsx
import { Button, TextField } from './src/index';
import './src/core.css';

export function Example() {
  return <div className="ds-core">
    <TextField label="이름" name="name" autoComplete="name" />
    <Button type="button">확인</Button>
  </div>;
}
```

`gallery.css`는 문서 앱용입니다. 소비하는 화면에는 컴포넌트 스타일과 `.ds-core` 범위를 적용하세요.

## Pretendard 글꼴 설정

글꼴 파일은 선택 설치 명령으로 자동 복사되지 않으므로 별도로 준비합니다. 사용한 소스와 같은 버전의 `public/source/fonts/`에서 다음 파일을 앱의 `public/source/fonts/`로 복사하세요.

- `Pretendard-Regular.woff2` — 400
- `Pretendard-Medium.woff2` — 500
- `Pretendard-SemiBold.woff2` — 600
- `Pretendard-Bold.woff2` — 700
- `LICENSE`
- `provenance.json`

`font-face.css`는 `/source/fonts/`에서 네 글꼴을 요청합니다. 앱의 정적 파일 설정에 맞춰 해당 URL이 글꼴을 제공하도록 구성하세요. 하위 경로에 배포하면 font-face.css의 URL을 실제 자산 경로로 바꿉니다. 원본 글꼴 파일과 LICENSE는 그대로 유지합니다. 파일이 없으면 시스템 글꼴을 사용합니다.

선택 설치 항목의 `meta.fontAssets`에는 원본 경로, 대상 경로, URL과 SHA-256이 있습니다. 이를 사용해 복사한 파일을 확인할 수 있습니다.

## 스타일과 테마 조정

스타일 순서는 `theme → base → components → utilities`입니다. Tailwind를 함께 쓰면 이 layer 순서를 먼저 선언하세요. 컴포넌트의 className과 style은 해당 컴포넌트가 제공하는 속성에 맞춰 사용합니다. 선택·오류·키보드 초점 표시가 사라지지 않도록 조정하세요.

CSS 변수로 전체 영역이나 하위 영역의 의미 색상, 특정 컴포넌트 색상을 바꿀 수 있습니다. 컴포넌트 변수를 지정하면 해당 값이 의미 색상보다 우선합니다.

```css
.application.ds-core { --color-action-primary-bg-default: #0f766e; }
.application .nested-section { --color-action-primary-bg-default: #7c3aed; }
.application .special-button { --button-bg-default: #1e40af; }
```

중첩 영역의 의미 변수를 바꾸면 그 안의 컴포넌트에 적용됩니다. `.ds-core`를 새 영역에 다시 지정하면 기본 테마로 시작합니다. 저장소 전체 소스에서는 공개 `applyTheme`와 theme API를 사용할 수도 있습니다.

## 입력과 폼 연결

입력의 name, 필수 입력, 오류 안내를 화면의 폼에 맞춰 설정하세요. `value/checked`를 전달하는 제어 입력은 변경 콜백에서 값을 갱신합니다. `defaultValue/defaultChecked`는 비제어 입력의 초기값입니다. 컴포넌트별 지원 속성과 초기화 동작은 Docs에서 확인하세요.

Button·Input의 className과 ref는 실제 입력 요소에 연결됩니다. PasswordInput의 className·ref·input 속성은 비밀번호 입력에 적용됩니다. InputGroup·Addon은 div 속성을 전달하며, 내부 요소는 data-slot으로 구분할 수 있습니다.

## 문서 실행

저장소 루트에서 `npm ci` 후 `npm run dev`를 실행합니다. Variant에서 설정과 상태를 비교하고 Code에서 해당 설정의 예제를 확인할 수 있습니다.
