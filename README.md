# Common — 공통 웹 디자인시스템

Vite·React·TypeScript 기반의 **한국어 문서와 실제 동작하는 컴포넌트 플레이그라운드**입니다. 제품 화면이나 SVG 이미지 갤러리가 아닌 독립 공통 DS입니다.

## 설치·실행·검증

Node 22.12 이상이 필요하며 검증에 사용한 버전은 `.nvmrc`에 기록했습니다. 저장소 루트에서 실행합니다.

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run check:browser
npm run dev
```

`npm run build`는 기준 토큰에서 CSS를 다시 생성하고 TypeScript 검사 후 production build를 만듭니다. 브라우저 검사는 production preview를 loopback 4173 포트에서 일시 실행하고 종료합니다. 다른 프로세스가 해당 포트를 사용하고 있다면 테스트 전에 충돌을 해소해야 합니다. 개발 서버도 loopback에만 바인딩합니다.

## 문서 구조

- **개요**: 계층별 탐색과 실제 재사용 조합.
- **기초 (Foundations)**: 기준 토큰 107개(기본값 39 / 의미 역할 29 / 컴포넌트 39), 원본 별칭·해석된 값·검색·글꼴·크기·대비 사용 계약. 범위 한정 인디고/틸 테마 전환 및 기본 코어 복원.
- **아톰 (Atoms)**: Button, IconButton, Input, Textarea, Select, Checkbox, Badge, Progress, Skeleton, Separator.
- **몰리큘 (Molecules)**: FormField, Alert, EmptyState, Menu, Tabs, Tooltip.
- **오가니즘 (Organisms)**: Dialog, Confirm.
- **템플릿 (Templates)**: 제품 중립 Form/List/Feedback 미리보기와 실제 FormSection 등 재사용 조합. PC/mobile 슬롯·입력·상태·검색 예제를 제공합니다.

각 기본 컴포넌트에는 미리보기·사용 코드·기준 계약이 연결됩니다. FormField는 Input, Alert는 Badge, EmptyState는 Button, Dialog는 IconButton, Confirm은 Dialog와 Button을 실제로 재사용합니다. API·토큰 식별자는 영문을 유지하며 설명과 기본 접근성 이름은 한국어 중심입니다.

## 다른 앱에서 재사용

```tsx
import { Button, FormField, FormTemplate } from "./src";
import "./src/generated/tokens.css";
import "./src/styles.css";

<FormTemplate
  title="공통 입력 폼"
  fields={<FormField label="이름" description="표시할 이름입니다." />}
  actions={<Button onClick={save}>변경 사항 저장</Button>}
  aside={<p>소비 앱이 제공하는 도움말 슬롯</p>}
/>;
```

`src/index.ts`가 기본 18종과 레이아웃·조합 도우미를 export합니다. npm 배포 패키지는 아닙니다. 글꼴 파일은 `/source/fonts/`에서 제공해야 합니다. 문서용 CSS에는 전역 규칙이 있으므로 소비 앱 통합 시 core 스타일을 분리하거나 scope를 적용해야 합니다.

테마는 미리보기 컨테이너의 CSS 변수만 교체하며 root와 기준 토큰을 변경하지 않습니다. 정보/주의/반전 배경/스크림 예시와 현재 조합의 명암비를 표시합니다. 기본 코어로 복원하면 교체 테마의 대비 결과를 기본 코어의 통과 근거로 승계하지 않습니다.

## 원본과 검증 근거

기존 offline v0.2의 `tokens`, `contracts`, Pretendard 4종·LICENSE·provenance를 `public/source/`에 보존했습니다. alias 누락과 순환은 토큰 생성 단계에서 거부합니다. 한글 204자·영문 446자·일문 160자 검증 본문은 원본을 유지합니다.

원본 패키지와 바이트를 직접 대조하려면 별도 로컬 경로를 명시합니다.

```sh
node scripts/check-integrity.mjs /path/to/T-DES-002-offline-v0.2
```

테스트 실행 결과와 스크린샷은 로컬 `evidence/` 아래에 생성합니다. 환경별 절대 경로나 trace가 포함될 수 있어 원시 evidence는 Git 공유 대상에서 제외합니다. 독립 검수자는 같은 SHA에서 테스트를 재실행해 근거를 생성할 수 있습니다.

검증에는 문서 탐색·한국어 접근성 이름·320/390/768/1024/1440 너비·장문 줄바꿈·48px 주요 동작/44px 일반 컨트롤·busy 상태·메뉴/탭 키보드·tooltip 닫기·dialog focus trap/복귀·템플릿 필터링·테마의 실제 렌더 색상 전환과 입력 유지가 포함됩니다.

## 한계와 범위

- Chromium을 검증했습니다. Safari/Firefox·실기기 보조기술은 미검증입니다.
- axe는 검사한 상태에 한정된 자동 검사이며 전체 WCAG 인증이 아닙니다.
- Pretendard 400/500/600/700의 로드는 확인하지만 일본어 glyph별 fallback 출처는 미검증입니다.
- 명암비 계산은 해당 수치·사용 조합의 근거이며 앱 전체 접근성 통과를 선언하지 않습니다.
- 저장 예시는 메모리 상태에만 존재합니다. 새로고침 후 영구 저장이나 backend 연결을 의미하지 않습니다.
- 제품 앱 수정·제품 업무 정책·Penpot 추가 편집·배포·GPU·유료 실행은 이 구현에 포함하지 않습니다.
- Git 공유와 reviewer 수락, 실제 배포는 서로 다른 단계입니다.
