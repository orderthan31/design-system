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
npx shadcn@4.21.3 add orderthan31/design-system/grid-list
npx shadcn@4.21.3 add orderthan31/design-system/highlight
npx shadcn@4.21.3 add orderthan31/design-system/bubble
npx shadcn@4.21.3 add orderthan31/design-system/table
npx shadcn@4.21.3 add orderthan31/design-system/data-table
npx shadcn@4.21.3 add orderthan31/design-system/pagination
npx shadcn@4.21.3 add orderthan31/design-system/list
npx shadcn@4.21.3 add orderthan31/design-system/list-item
npx shadcn@4.21.3 add orderthan31/design-system/list-row
npx shadcn@4.21.3 add orderthan31/design-system/list-header
npx shadcn@4.21.3 add orderthan31/design-system/list-footer
npx shadcn@4.21.3 add orderthan31/design-system/action-group
npx shadcn@4.21.3 add orderthan31/design-system/dialog
npx shadcn@4.21.3 add orderthan31/design-system/confirm
npx shadcn@4.21.3 add orderthan31/design-system/bottom-sheet
npx shadcn@4.21.3 add orderthan31/design-system/drawer
npx shadcn@4.21.3 add orderthan31/design-system/popover
npx shadcn@4.21.3 add orderthan31/design-system/gnb
npx shadcn@4.21.3 add orderthan31/design-system/lnb
npx shadcn@4.21.3 add orderthan31/design-system/breadcrumb
```

위 목록의 68개 컴포넌트가 선택 설치를 지원합니다. 그 외 컴포넌트는 아래 전체 소스 방식으로 사용할 수 있습니다. 특정 버전으로 고정하려면 경로 뒤에 `#<commit-SHA>`를 붙입니다.

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


## S2 installed core: bounded local consumer checkpoint

위의 legacy source/registry 안내와 이 항목은 서로 다른 설치 경로입니다.
S2의 private UNLICENSED `hangyeol-core`는 실제 로컬 pack 파일을 consumer의
exact devDependency로 설치하며, npm install 자체는 UI를 생성하지 않습니다.
React/React DOM 19.2.0, Vite 7.3.6, TypeScript 5.9.3 및 packed manifest의
정확한 Tailwind4/common/type dependency가 준비된 supported host를 사용합니다.
Offline 검증은 준비된 cache에 한정하며 registry/Release/VPS 배포 증명이 아닙니다.

```sh
npm install --save-dev --save-exact ../artifacts/hangyeol-core-0.1.0-s2.1.tgz --offline --ignore-scripts --no-audit --no-fund
./node_modules/.bin/hangyeol init --dry-run
./node_modules/.bin/hangyeol init
./node_modules/.bin/hangyeol add text-field
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol tokens
./node_modules/.bin/hangyeol doctor
```

위 tarball 경로는 실제 pack 결과로 바꿉니다. UI는 consumer의 editable local
source와 cn/theme를 사용하고 core를 runtime import하지 않습니다. Read-only
도구는 config/token/palette/helper/source를 재설치하거나 초기화하지 않습니다.
수정된 요청 component의 기본 add는 conflict로 거절하며, 정당한 no-op과
명시적 변경의 backup을 구분합니다. update/apply/source Reset은 미구현입니다.
Core가 없으면 local bin 실행이 실패하며 npx/npm registry fallback을 하지 않습니다.

외부 physical consumer, local tsc/Vite build, 전체 snapshot 및 absent-core 회귀의
준비 조건·explicit evidence 변수·실행 명령은
[consumer fixture 안내](../apps/consumer-fixture/README.md)를 참고하세요.
브라우저/HTTP/FontFace/AT/Docs Reset과 authoring generated docs/default build는
이 bounded checkpoint의 성공 주장에 포함되지 않습니다.


<a id="core11-quickstart"></a>
## 현재 quickstart — installed core → editable source (CORE-11)

**여기부터가 현재 S2 소비 진입점입니다.** 위 원문은 기존 WIP/legacy registry 안내와
CORE-10 이력을 보존한 것입니다. 위의 75개 registry/npx/전체 legacy source 예제를
이 quickstart와 함께 실행하지 마세요. 현재 공개 Release URL은 없고 registry/Packages
자동 설치 또는 PAT 준비를 요구하지 않습니다. `hangyeol-core`는 private/UNLICENSED
로컬 후보이며 공개 이용 라이선스나 배포 완료를 뜻하지 않습니다.

### 1. 실제 tarball과 독립 host 준비

지원 adapter는 React 19/Vite/Tailwind 4이고, 재현 환경은 Node 22.22.2/npm 10.9.7입니다.
아래 exact 버전은 현재 packed manifest 및 검증 host 기준입니다. 새로운 framework,
Tailwind 3, registry의 최신 버전으로 임의 치환한 결과까지 보증하지 않습니다.

작성자에게서 **실제로 만든 동일 후보 tarball**과 SHA256/SRI·sourceRevision을 받으세요.
작성 repository의 `packages/core` build/pack이 후보 생성 경로이며, owner 검증에서는
canonical source를 별도 scratch build-root에 복사하여 동일 build.mjs로 pack합니다.
그때 build-only dependency link는 별개이고 아래 소비 host에는 workspace/link/hoisting을
쓰지 않습니다. canonical generated docs/default build의 과거 실패는 해소되지 않았습니다.
없는 Release 다운로드 주소나 미래 API를 실행 예제로 제공하지 않습니다.

repository 밖의 새 disposable 폴더를 만들고 그 안에서 진행합니다. `CORE_TGZ`에는
받은 실제 `.tgz`의 **절대 경로**를 지정하세요. `NPM_CACHE`도 준비된 cache의 절대 경로입니다.
두 값은 아래 명령 전에 shell 환경변수로 설정해야 합니다. 경로/파일명은 pack 결과로
확정하며 단순 문서상의 가상 파일을 설치하지 않습니다. `NODE_PATH`를 제거하세요.
Offline install은 해당 cache에 모든 pinned dependency가 있을 때만 성공합니다.
없는 cache/registry/Release/VPS 이식성은 미검증이며, 실패를 성공으로 바꾸지 않습니다.

빈 host에 다음 `package.json`을 만듭니다. npm install 자체는 UI를 생성하지 않습니다.

<!-- core11-replay: file package.json -->
```json
{
  "name": "hangyeol-core11-quickstart",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "clsx": "2.1.1",
    "tailwind-merge": "3.7.0"
  },
  "devDependencies": {
    "vite": "7.3.6",
    "typescript": "5.9.3",
    "tailwindcss": "4.3.3",
    "@tailwindcss/vite": "4.3.3",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2"
  }
}
```

아래 strict `tsconfig.json`을 만듭니다. `vite/client`는 CSS import 타입을 제공합니다.
`src` 폴더를 만들고, 아래 entry는 3단계에서 추가합니다. Vite/Tailwind 연결은 init이
정적 설정으로 준비합니다. 기존 host는 dry-run에서 계획과 backup을 먼저 확인하세요.

<!-- core11-replay: file tsconfig.json -->
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src"]
}
```

<!-- core11-replay: shell -->
```sh
: "${CORE_TGZ:?Set the absolute path of the real packed core tarball}"
: "${NPM_CACHE:?Set the absolute path of the prepared dependency cache}"
unset NODE_PATH
mkdir -p src
npm install --save-dev --save-exact "$CORE_TGZ" --cache "$NPM_CACHE" --offline --ignore-scripts --no-audit --no-fund
```

`package.json`의 core는 exact `file:` devDependency이며 package-lock의 version/resolved/SRI와
물리 `node_modules/hangyeol-core`, local bin을 대응해 보관합니다. UI가 core를 runtime
import하는 모델이 아닙니다. 설치 명령 이후 `gyeol.json`/생성 UI가 아직 없음을 확인합니다.

### 2. installed local bin으로만 init/add

<!-- core11-replay: shell -->
```sh
./node_modules/.bin/hangyeol --version
./node_modules/.bin/hangyeol init --dry-run
./node_modules/.bin/hangyeol init
./node_modules/.bin/hangyeol add text-field --dry-run
./node_modules/.bin/hangyeol add text-field
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol tokens
./node_modules/.bin/hangyeol doctor
```

`hangyeol`이 실제 bin이고 현재 후보 version은 `0.1.0-s2.1`입니다. 기본 sourceRoot는
`src/gyeol`, entry CSS는 `src/gyeol.css`, font binary/라이선스/provenance는
`public/source/fonts`입니다. `text-field`는 선택 closure인 Button/Input도 설치합니다.
별도 컴포넌트를 추가할 때는 지원 registry graph를 확인하며 과거 75개를 현재 core 지원
목록으로 간주하지 않습니다. 필요 runtime/build/type dependency를 미리 exact 설치한
위 host에서는 init/add가 npm을 추가 호출하지 않습니다. 기존 host에서 의존성이 없으면
installer의 dependency 계획을 먼저 확인하세요. 위 순서는 standalone npx가 아닙니다.

### 3. 로컬 소스를 import하고 직접 편집

다음 `index.html`과 `src/main.tsx`를 만듭니다. CSS는 한 번만 entry에서 import하며
core/CLI 또는 authoring docs CSS를 UI runtime에서 가져오지 않습니다.

<!-- core11-replay: file index.html -->
```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

<!-- core11-replay: file src/main.tsx -->
```tsx
import { createRoot } from 'react-dom/client';
import { TextField, quickstartFieldMarker } from './gyeol/components/text-field';
import { cn, quickstartCnMarker } from './gyeol/lib/cn';
import './gyeol.css';

createRoot(document.getElementById('root')!).render(
  <main data-gyeol data-theme="light" data-palette="Owner" className={cn('grid', 'gap-3')}>
    <TextField
      id="quickstart-name"
      label={quickstartCnMarker + quickstartFieldMarker}
      name="name"
      required
      clearable
      defaultValue="소비자가 정한 초기값"
    />
  </main>,
);
```

설치된 `src/gyeol/lib/cn.ts`와 `src/gyeol/components/text-field.tsx`의 끝에 각각 아래를
추가하세요. 단순 marker도 실제 편집→import→build 경로를 확인합니다. 원 코드와 native
props/이벤트/disabled/readOnly 계약을 유지한 채 소비자 필요에 맞게 직접 수정할 수 있습니다.

<!-- core11-replay: append src/gyeol/lib/cn.ts -->
```ts
export const quickstartCnMarker = 'CORE11_README_CN';
```

<!-- core11-replay: append src/gyeol/components/text-field.tsx -->
```ts
export const quickstartFieldMarker = 'CORE11_README_FIELD';
```

### 4. 색상/팔레트는 소비자가 소유

`src/gyeol/foundation/theme.css` 끝에 다음을 추가하세요. 기존 theme/input 값을 강제로
reset하거나 core를 재설치해서 덮어쓰지 않습니다. 이 예제는 partial override와 새 Owner
palette이며, 소비자는 모든 색 수정·부분 override·전체 교체·추가 palette를 선택할 수
있습니다. Indigo/Silver/Forest/Amber/Rose는 editable preset이지 공식색 whitelist가 아닙니다.

<!-- core11-replay: append src/gyeol/foundation/theme.css -->
```css
[data-gyeol] { --g-surface: #654321; --g-danger: rebeccapurple; }
[data-gyeol][data-palette="Owner"] { --g-action: #a16207; }
```

CSS `data-palette` selector가 위 Owner 색상을 적용합니다. token tool에서도 Owner palette를
선택하려면 아래 데이터를 기존 `gyeol.json`에 **병합**합니다. `installed`/path/core identity와
기존 owner 필드는 유지하세요. 원 config 전체를 이 조각으로 교체하면 안 됩니다.

<!-- core11-replay: merge gyeol.json -->
```json
{ "tokens": { "palette": "Owner" } }
```

### 5. 읽기 전용 검사와 실제 local build

<!-- core11-replay: shell -->
```sh
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol tokens
./node_modules/.bin/hangyeol doctor
./node_modules/.bin/tsc -p tsconfig.json --pretty false
./node_modules/.bin/vite build
```

이 두 build bin도 host node_modules에서 resolve해야 합니다. 번들의 `CORE11_README_CN`,
`CORE11_README_FIELD`와 CSS의 `--g-surface:#654321`로 편집 결과가 실제 포함됐는지
확인합니다. UI bundle은 local cn/TextField 및 React dependency를 사용하고 core runtime을
요구하지 않습니다. 이 build는 disposable consumer build이지 canonical default build의
과거 FAIL을 소급 PASS로 바꾸는 명령이 아닙니다. font HTTP/FontFace·브라우저·AT·Docs Reset은
미실행이며 compiled CSS가 browser acceptance를 대신하지 않습니다.

`lint`는 설정된 sourceRoot의 지원 정적 문법을 읽기 전용 검사하며 app 전체를 무조건
검사하지 않습니다. `tokens`는 actual consumer CSS/typed roles를 검증하고 owner 색을
reset하지 않습니다. `doctor`는 설치 연결 검사이지 compiler 실행/자동 수리 기능이 아닙니다.
수정된 helper/theme/UI가 informational로 보고될 수 있으며 자동 hash adoption은 없습니다.
현재 pinned @shadcn/lint는 packed policy의 components.json 경로에 대해 grammar 관련 경고를
stderr에 출력할 수 있습니다. 이를 숨기거나 경고를 근거로 actual 검사라고 가정하지 않습니다.
이 host에서는 JSON report의 `compiler.mode: "actual"`, `fallback: "none"`과 actual
Tailwind4.3.3 compile/build·빈 diagnostics를 직접 확인했습니다. npm install의 pinned
ESLint deprecated 경고도 원 로그에 남으며 임의 tooling 버전 변경으로 덮지 않습니다.

### 6. 미지원/충돌/미설치 결과를 성공과 구분

편집한 TextField를 다시 기본 `add text-field`하면 conflict/nonzero이며 owner source를
덮어쓰지 않습니다. 필요할 때 dry-run과 명시 overwrite/backup 계획을 확인하세요.
`update`의 plan/diff/apply engine과 consumer source Reset은 미구현이며 unsupported/nonzero입니다.
CLI 오류를 무시하거나 command exit를 성공으로 재해석하지 않습니다. core가 없는 별도
host에서 `./node_modules/.bin/hangyeol --version`은 missing local bin으로 nonzero(현재
/bin/sh에서126, shell에따라127)이며 registry 다운로드/설치 prompt/fallback을 하지 않습니다.
일반 커널 network audit나 모든 비신뢰 입력 보안을 인증한 결과는 아닙니다.

기존 source/AGENTS/WIP/라이선스·font provenance와 원 실패 이력은 보존합니다. 공개 배포,
Release 다운로드, 제품 통합, S2 전체 demo/최종 수락은 이 quickstart 완료와 별개입니다.
