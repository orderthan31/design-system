# 한결디자인

React UI를 소비 프로젝트에 editable source로 설치하는 디자인 시스템입니다.
**현재 S2 진입점은 private `hangyeol-core`를 실제 tgz devDependency로 먼저 설치한 뒤
`./node_modules/.bin/hangyeol`을 실행하는 흐름입니다.** core는 개발 도구이며 UI runtime
import 대상이 아닙니다. 공개 Release/registry 설치/PAT/standalone npx는 현재 경로가 아닙니다.

## 현재 소비 quickstart

[실제 재현 순서와 전체 코드](docs/source-installation.md#core11-quickstart)를 따라
repository 밖 disposable React19/Vite/Tailwind4 host에서 진행하세요.

1. 실제 packed tgz/SHA/SRI와 sourceRevision을 받고 supported exact dependency를 준비합니다.
2. tgz를 `npm install --save-dev --save-exact`로 물리 설치하고 package/lock/local bin을 확인합니다.
3. installed bin으로 init/add text-field를 실행합니다. 아래 명령은 dependency/host 준비 뒤의 요약입니다.
4. 생성된 로컬 TextField/cn/theme를 import·편집하고 strict local tsc/Vite build로 확인합니다.

```sh
./node_modules/.bin/hangyeol init --dry-run
./node_modules/.bin/hangyeol init
./node_modules/.bin/hangyeol add text-field
./node_modules/.bin/hangyeol lint
./node_modules/.bin/hangyeol tokens
./node_modules/.bin/hangyeol doctor
```

소비자가 색상 전체/부분 override/교체/추가 palette와 editable source를 소유합니다.
기존 설정·theme·helper·입력값을 설치 도구가 무단 reset하지 않습니다. 편집 source 재설치는
conflict/nonzero이며 update plan/diff/apply/source Reset은 미구현입니다.

재현 환경 Node22.22.2/npm10.9.7, React19.2.0/Vite7.3.6/Tailwind4.3.3/TypeScript5.9.3.
Prepared offline cache/scripts-off 결과는 빈cache/registry/Release/VPS portability나
canonical docs/default build·browser/AT/Docs Reset·S2 전체 수락을 보증하지 않습니다.
발행되지 않은 후보는 private/UNLICENSED이며 별도 라이선스/배포 판단이 필요합니다.

## 구조와 지원 문서

- `packages/core`: installed development CLI/tool/payload; [core 계약](packages/core/README.md).
- `packages/ui/src`: canonical editable UI/foundation/helper.
- `registry/items`, `registry/assets`: source graph와 원 font/라이선스.
- `apps/docs`: 문서 앱; 현재 generated/default build의 실패·유예는 별도 이력에 남아 있습니다.
- [소비 회귀 준비 조건](apps/consumer-fixture/README.md), [설치/사용](docs/source-installation.md#core11-quickstart).

기존 UI·AGENTS·WIP·history는 보존합니다. 표시 브랜드는 한결/한결디자인이며 기존 repository,
config/import 식별자를 임의 rename하지 않습니다. 최종 배포 채널/브랜드 자산 판단은 후속입니다.

## Historical first-slice README — 현재 실행 경로 아님

아래는 원문 보존용 snapshot입니다. legacy `gyeol` ephemeral CLI/Packages 우선/75 registry
설치/로컬 dev 및 generated build 안내는 현행 quickstart의 활성 지침이 아닙니다.
원 실패·미검증을 삭제하지 않으며 현재 소비는 반드시 위 installed-core 안내로 시작하세요.

<details>
<summary>기존 README 원문 (historical, 실행하지 않음)</summary>

# 한결디자인

제품에 종속되지 않는 React 디자인 시스템입니다. PC와 모바일에서 Pretendard를 사용하며, Tailwind utility로 외관을 구성하고 Select·Tabs·Dialog의 동작은 Radix primitives에 맡깁니다.

컴포넌트는 소비 프로젝트에 **소스로 설치**합니다. 설치 후에는 로컬 경로로 import하고 직접 수정합니다. 설치 CLI와 UI 소스, React/Radix 등의 외부 의존성은 서로 다른 역할입니다.

## 지원 환경

현재 첫 설치 adapter는 React 19 · Vite · Tailwind 4입니다. 개발에는 Node 22.12 이상이 필요하며 재현 버전은 `.nvmrc`에 있습니다. 다른 framework와 Tailwind 3의 자동 변환은 지원하지 않습니다.

## 로컬에서 시작하기

```sh
npm ci
npm run build:slice
npm run dev -w @gyeol/docs
```

새 문서 앱은 `apps/docs`입니다. 루트의 기존 `src`와 과거 문서는 이전 구현을 보존한 자료이며 새 구현의 소비 진입점이 아닙니다.

## 필요한 소스 설치

CLI는 아직 발행되지 않았습니다. 지금 사용할 수 있는 경로는 저장소에서 만든 tarball의 로컬 실행입니다. 먼저 저장소 루트에서 실행합니다.

```sh
npm run build:slice
npm pack --workspace @orderthan31/gyeol-cli --pack-destination /your/disposable/directory
```

독립 React/Vite 프로젝트로 이동한 뒤 `npm pack`이 출력한 실제 파일명을 사용합니다.

```sh
npm exec --yes --package /your/disposable/directory/orderthan31-gyeol-cli-0.1.0-slice.1.tgz -- gyeol init
npm exec --yes --package /your/disposable/directory/orderthan31-gyeol-cli-0.1.0-slice.1.tgz -- gyeol add button
```

`init`은 공통 테마·helper·Pretendard binary와 라이선스, Tailwind 연결을 준비합니다. `add`는 선택한 컴포넌트의 source closure와 필요한 외부 의존성만 추가합니다. 프로젝트 entry에서 출력된 `src/gyeol.css`를 import합니다.

```tsx
import './gyeol.css';
import { Button } from './gyeol/primitives/button';

export function Example() {
  return <Button onClick={() => console.log('저장')}>저장</Button>;
}
```

기존 파일과 다른 내용이 있으면 설치가 실패합니다. `--dry-run`으로 변경 계획을 확인하고, 교체가 필요한 경우에만 백업을 만드는 `--overwrite`를 선택합니다. 경로·alias·font URL 설정과 부분 실패의 한계는 [CLI 안내](packages/cli/README.md)에 있습니다.

## 테마와 확장

`foundation/theme.css`의 scoped semantic 변수를 변경하거나 로컬 컴포넌트의 `className`을 사용합니다. `Theme`은 light/dark와 중첩 테마를 제공하며 열린 Radix portal에도 적용됩니다. 기본 설치는 host 전체에 Preflight를 추가하지 않습니다. UI는 docs CSS나 CLI 런타임 import를 필요로 하지 않습니다.

## 구조와 기여

- `packages/ui/src/foundation`, `lib`: 테마와 공통 helper.
- `packages/ui/src/primitives`: native controls/layout, Radix 기반 controls.
- `packages/ui/src/components`: primitive 조합.
- `registry/items`, `registry/assets`: 선택 설치 graph와 자산 manifest.
- `packages/cli`: 설치기와 같은 버전의 source/font payload.
- `apps/docs`: 실제 설치된 source로 만든 문서·예제.

UI 수정은 canonical `packages/ui/src`에서 하고 `npm run build:slice`로 payload와 docs source를 다시 생성합니다. 생성된 docs source를 직접 고치지 않습니다. `typecheck:slice`, `lint:slice`, `test:slice`가 첫 범위의 검사 명령입니다.

## 배포와 이름

최종 배포 채널은 **GitHub Packages**이며 npmjs.com에는 publish하지 않습니다. 실제 발행·인증된 다운로드는 아직 완료되지 않았습니다. 미발행 registry 명령은 빠른 시작으로 제공하지 않습니다.

표시 브랜드는 **한결**, 디자인 시스템 표기는 **한결디자인**입니다. 영문 표기와 최종 로고는 미확정입니다. `orderthan31/design-system`, `@orderthan31/gyeol-cli`, `gyeol` bin/import/config 식별자는 표시 브랜드 변경과 별개로 유지합니다.

개발 checkpoint와 검증 한계는 [첫 슬라이스 handoff](docs/rebuild-first-slice-handoff-v1.md), [owner 검증](docs/rebuild-first-slice-owner-v2.md)에 기록합니다.

</details>
