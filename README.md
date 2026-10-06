# Gyeol Design

## 프리뷰 공유 checkpoint와 최종 수락

현재 checkpoint는 build/TypeScript 오류가 없는 구현을 먼저 Git으로 공유하고, 동일 commit의 프리뷰에서 기능을 점검하는 중간 검수본입니다. 전체 테스트·coverage·최종 독립 수락 완료를 의미하지 않으며, 프리뷰 공유와 최종 디자인 시스템 승인은 별도입니다.

GridList/Highlight/Bubble의 공개 API와 조작 가능한 상세를 추가했습니다. 일부 대표 컴포넌트는 props와 표시 코드가 함께 바뀌는 controls를 제공합니다. 남은 범위는 기존 API 일부의 전용 상세/controls 확장, 최종 전체 브라우저·동일 트리 독립 수락입니다. 새 구현은 build/typecheck 공유본이며 기능 수락을 의미하지 않습니다. Chart는 Recharts 기반 선/막대/도넛과 자기 상세를 추가한 범위 한정 checkpoint이며 전체 수락은 별도입니다. 키패드는 범위에서 제외합니다. 금융/브랜드 전용 SDK는 공통 core에 추가하지 않습니다. Safari/Firefox·실기기 보조기술·외부 주소 provider·소프트키보드 계약은 미구현 또는 미검증입니다. 현재 확인·교정된 결함과 범위별 근거는 기능 inventory에 구분해 기록합니다.

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

`npm run build`는 기준 토큰과 현재 블루 기본값/예시 테마 CSS·대비 JSON을 다시 생성하고 TypeScript 검사 후 production build를 만듭니다. `npm run themes`로 테마 출력만 재생성할 수 있습니다. 브라우저 검사는 production preview를 loopback 4173 포트에서 일시 실행하고 종료합니다. 다른 프로세스가 해당 포트를 사용하고 있다면 테스트 전에 충돌을 해소해야 합니다. 개발 서버도 loopback에만 바인딩합니다.

## 문서 구조

- **Overview**: 실제 컴포넌트 검색·상세 링크와 저장소 실행/소스 import 안내.
- **Foundations**: 기준 토큰 107개·글꼴·크기·대비·범위 한정 테마 전환.
- 좌측 검색 아래 Overview/Foundations와 Atoms → Molecules → Organisms 제목을 배치합니다. Atomic 제목은 페이지 버튼이 아니며 각 그룹은 영문 public API 이름 알파벳순 canonical 상세 링크만 제공합니다. 하위 Inputs/Feedback 그룹이나 Atomic 모아보기 페이지는 없습니다.
- 상세 페이지 제목은 public API 이름입니다. 실제 exported Shell/Container/Stack과 Tabs를 소비하며 위쪽 실제 시연, 아래쪽 Variant / Code / Docs가 같은 owner state를 공유합니다. 탭은 owner를 unmount하지 않습니다.

각 기본 컴포넌트에는 미리보기·사용 코드·기준 계약이 연결됩니다. FormField는 Input, Alert는 Badge, EmptyState는 Button, Dialog는 IconButton, Confirm은 Dialog와 Button을 실제로 재사용합니다. API·토큰 식별자는 영문을 유지하며 설명과 기본 접근성 이름은 한국어 중심입니다.

## 필요한 소스만 설치

공식 shadcn GitHub registry의 `button`, `input`, `password-input`, `chart`를 선택 설치합니다. 실제 경로·dependencies·Tailwind/semantic override·필수 Pretendard 자산 설정은 `docs/source-installation.md`에 있습니다. 폰트 binary 자동 복사는 아직 하지 않습니다. 전체 gallery를 npm 라이브러리로 발행하지 않습니다.

## 다른 앱에서 재사용

```tsx
import { Button, FormField, FormSection } from "./src";
import "./src/core.css";

<div className="ds-core">
  <FormSection title="공통 입력 폼" actions={<Button onClick={save}>변경 사항 저장</Button>}>
    <FormField label="이름" description="표시할 이름입니다." />
  </FormSection>
</div>;
```

`src/index.ts`가 기존 18종과 추가 날짜/한국형 폼/탐색/데이터/펼침/아이콘/레이아웃을 export합니다. 기존 `componentFamilies` 18종 레지스트리는 역사 기준이며 전체 public API 목록이 아닙니다. npm 배포 패키지는 아닙니다. `core.css`는 `.ds-core` 조상 범위 안의 컴포넌트와 의미 역할만 스타일링하며, 동일 원본에서 생성한 107개 기본 토큰도 그 범위에 선언합니다. 소비 앱에서 전역 `generated/tokens.css`, `gallery.css`, `styles.css`를 import할 필요가 없습니다. 글꼴 파일은 `/source/fonts/`에서 제공해야 합니다. Pretendard font-face 등록과 `ds-core-*` 애니메이션 정의는 포함하지만 외부 일반 요소에 reset·폰트·focus 규칙을 적용하지 않습니다.

**외관 동일성 계약:** 컴포넌트 자체 border·font·padding·radius·state는 exported shared core/공용 tokens가 소유합니다. gallery CSS는 문서 chrome·데모 배치만 담당하며 소비 앱에 복사하는 appearance override는 계약이 아닙니다. 사용 코드는 실제 export/props/variant/size/theme/state와 같은 소비자 조건이어야 합니다. scoped core의 기본 스타일은 소비 앱의 일반 tag reset과 분리하고 범위 밖 일반 요소를 reset하지 않습니다. 소비자가 더 강한 선택자·`!important`로 명시적으로 DS 자체를 재정의하는 경우까지 CSS 격리라고 주장하지 않습니다.

**최종 별도 consumer fixture:** 디자인승인 후 same-final-SHA에서 gallery 없는 독립 fixture를 검증합니다. 공개 export와 정식 core CSS·Pretendard·theme 설정만 사용하여 모든 공개 컴포넌트의 동일 props/variant/size/state와 컨테이너 조건을 재현하고 외관·상태·필수 설정·범위 밖 누출/일반 host reset을 대조합니다. 지금은 이 범위만 보존하며 fixture 전수 확장·full-suite를 빠른 디자인 반복의 새 gate로 시작하지 않습니다. 아직 디자인수락·공개배포·소비 제품 앱 통합 승인이나 외관 전수동일성 검증 완료를 의미하지 않습니다.

문서 앱은 명시적으로 `gallery.css`를 사용합니다. 이 파일의 문서 reset·탐색·데모 배치는 **gallery 전용 opt-in**이며 소비 core에 포함되지 않습니다. 이전 `styles.css` 경로는 gallery 호환 진입점일 뿐 core 소비 경로가 아닙니다.

현재 `.ds-core` 기본값은 블루 라이트이며 역사적 API 식별자 slate는 유지합니다. 원본 107개 토큰은 역사 증적으로 보존하고 `default-theme.css`가 실제 공통 상태·semantic 색을 덮어씁니다. Indigo/Teal 전환은 지정 컨테이너만 바꾸며 root·형제·기준 토큰은 변경하지 않습니다. 복원 대상은 역사 색이 아닌 현재 slate 기본값이고, 세 팔레트의 대비는 각각 다시 계산합니다. 상세 표는 “대비 계약”에 접어 두었습니다.

현재 기능·조합·상태·테스트·미검증 정본: `docs/component-inventory-v1.md`, `docs/theme-contract-v1.md`, `docs/theme-contrast.json`, `docs/icons-contract.md`. 버전 없는 기존 inventory/theme 문서는 역사 이력입니다. 주소 검색 예시는 로컬 fixture이며 provider/API가 아닙니다.

## 선별 외부 패턴과 런타임 dependency

PasswordInput 내부 보기 토글은 `@radix-ui/react-toggle@1.1.19`, Chart의 단일 geometry 엔진은 `recharts@3.10.1`이며 `react-is@19.2.0`을 정확 pin/lock합니다. React/ReactDOM19.2.0은 유지합니다. shadcn InputGroup/공통 native control/Chart의 일부 구조·시각 패턴만 기존 scoped CSS/token에 적용했으며 전체 shadcn CLI 초기화·global reset·테마 교체는 하지 않았습니다. immutable source SHA와 MIT 원문은 `docs/vendor/shadcn-input-group.md`, `docs/vendor/chart-sources.md`와 같은 디렉터리의 license 파일에 기록했습니다. Recharts 추가로 bundle이 증가했고 Vite500kB chunk 경고는 현재 남아 있습니다.

## 원본과 검증 근거

기존 offline v0.2의 `tokens`, `contracts`, Pretendard 4종·LICENSE·provenance를 `public/source/`에 보존했습니다. alias 누락과 순환은 토큰 생성 단계에서 거부합니다. 한글 204자·영문 446자·일문 160자 검증 본문은 원본을 유지합니다.

원본 패키지와 바이트를 직접 대조하려면 별도 로컬 경로를 명시합니다.

```sh
node scripts/check-integrity.mjs /path/to/T-DES-002-offline-v0.2
```

테스트 실행 결과와 스크린샷은 로컬 `evidence/` 아래에 생성합니다. 환경별 절대 경로나 trace가 포함될 수 있어 원시 evidence는 Git 공유 대상에서 제외합니다. 독립 검수자는 같은 SHA에서 테스트를 재실행해 근거를 생성할 수 있습니다.

검증에는 문서 탐색·한국어 접근성 이름·320/390/768/1024/1440 너비·장문 줄바꿈·48px 주요 동작/44px 일반 컨트롤·busy 상태·메뉴/탭 키보드·tooltip 닫기·dialog focus trap/복귀·테마의 실제 렌더 색상 전환과 입력 유지가 포함됩니다.

## 한계와 범위

- Chromium을 검증했습니다. Safari/Firefox·실기기 보조기술은 미검증입니다.
- axe는 검사한 상태에 한정된 자동 검사이며 전체 WCAG 인증이 아닙니다.
- Pretendard 400/500/600/700의 로드는 확인하지만 일본어 glyph별 fallback 출처는 미검증입니다.
- 명암비 계산은 해당 수치·사용 조합의 근거이며 앱 전체 접근성 통과를 선언하지 않습니다.
- 저장 예시는 메모리 상태에만 존재합니다. 새로고침 후 영구 저장이나 backend 연결을 의미하지 않습니다.
- 제품 앱 수정·제품 업무 정책·Penpot 추가 편집·배포·GPU·유료 실행은 이 구현에 포함하지 않습니다.
- Git 공유와 reviewer 수락, 실제 배포는 서로 다른 단계입니다.
