# 아이콘 계약

## 확인 대상과 공개 API

인터넷의 최신 소개가 아니라 **현재 설치물과 저장소 소스**를 기준으로 한다. `package.json`은 `lucide-react: "1.52.0"`으로 exact pin이며, `package-lock.json`의 `packages["node_modules/lucide-react"].version`과 실제 `node_modules/lucide-react/package.json`도 `1.52.0`이다. caret/tilde pin이 아니다. 설치 package의 `module`은 `dist/esm/lucide-react.mjs`, `sideEffects`는 false다. 다른 버전의 라이선스나 번들 크기로 일반화하지 않는다.

`src/index.ts`는 `src/components/icons.tsx`의 `Icon`, `IconAction`, `IconGallery`, `iconNames` 및 `IconName`, `IconProps`, `IconActionProps`를 공개한다. adapter 소스는 아래 **36종의 명시적 named import와 정적 매핑**을 사용한다. wildcard pack registry·dynamicIconImports·런타임 pack fetch를 사용하지 않는다. 모듈 이름을 export하는 barrel과 아이콘 pack 전체를 wildcard import하는 것은 다르다.

```text
menu, chevron-down, chevron-left, chevron-right, chevron-up,
close, search, plus, minus, delete, edit, save, upload, download,
copy, filter, sort, calendar, clock, file, folder, settings, user,
check, warning, info, loading, retry, eye, eye-off, link, play,
pause, volume, image, video
```

`IconName = keyof typeof icons`; `iconNames = Object.keys(icons) as IconName[]`. 개수는 실제 매핑을 읽어 계산했다. pack 전체 개수가 아니며 비표준 문자열의 런타임 fallback API도 없다. API 경계 밖에서 JSON 등의 문자열을 받을 때 owner가 허용 목록을 검증해야 한다.

## 표현·접근성·조합

- `Icon`은 이름에 해당하는 Lucide React 컴포넌트를 렌더링한다. 기본 size=20, strokeWidth=1.75, Lucide의 currentColor stroke를 사용한다. `IconProps`는 ref를 제외한 LucideProps에 typed name을 더한다. size/strokeWidth 등은 호출자가 변경할 수 있다.
- 기본은 `aria-hidden="true"`, `focusable="false"`인 **장식 SVG**다. 실제 소스는 나머지 props를 마지막에 spread하므로 caller가 aria-hidden/focusable도 덮어쓸 수 있다. 강제로 변경 불가능한 장식 계약이라고 설명하지 않는다. 의미 있는 단독 그래픽은 소비자가 별도 이름/설명 계약을 제공해야 한다.
- `IconAction`→`IconButton` (`primitives.tsx`)→`Button` (`atoms.tsx`). 필수 한국어 `label`이 버튼 accessible name이다. 내부 Icon은 기본 장식이며 SVG 이름으로 action label을 대체하지 않는다. IconAction은 children을 받지 않고 name/label 및 ButtonProps를 전달한다.
- Button의 기본 type=button, 기본 IconButton variant=secondary, size/variant/loading/disabled/onClick 계약을 재사용한다. loading은 focus를 유지하면서 중복 실행·native submit 기본 동작을 막는다. 실제 submit이 필요하면 owner가 type을 명시한다. label의 실제 업무 의미·콜백 성공·toast 제거 등은 owner 책임이다.
- `IconGallery`는 모든 허용 이름의 SVG와 code label을 보여 주는 실제 컴포넌트다. interactive action이나 제품 navigation을 자동 생성하지 않는다.

소스 근거: `src/components/icons.tsx`, `src/components/primitives.tsx`, `src/components/atoms.tsx`, `src/index.ts`. 검사한 테스트 소스는 `tests/icons.test.tsx`(decorative hiding, size/stroke/currentColor, unique names, IconAction accessible name·Button 재사용·비-submit), `tests/expanded-integration.test.tsx`(공개 API와 갤러리 연결), `tests/core-styles.test.ts`(scoped icon grid)다. 브라우저 소스 `browser/expanded-features.spec.ts`의 `slate default, icon subset and reduced motion render without document overflow`는 36 SVG·장식 속성·scoped axe·화면 경계를 다룬다. **이 문서 작업에서 이 테스트들을 새로 실행했다는 뜻은 아니다.** 전체 최종 결합 테스트와 동결 트리 재검토는 미인증이다.

## 실제 minified browser 번들 측정

저장소 루트에서 **읽기 전용 esbuild JS API, write:false**로 실행했다. 측정 파일·dist·lockfile·의존성은 쓰지 않았다. Node `v22.22.2`, 설치 esbuild `0.28.2`, browser/ESM/es2020/minify/automatic JSX 조건이다. React·react-dom·JSX runtime은 external이며 gzip은 Node `node:zlib`의 `gzipSync` 기본 옵션이다. 단위는 byte다.

| 진입점 | minified JS | gzip | 출력에 실제 기여한 Lucide icon module |
| --- | ---: | ---: | ---: |
| `export { Search } from "lucide-react";` | 4247 | 1882 | 1 |
| `export * from "./src/components/icons.tsx";` | 14682 | 5279 | 36 |

첫 행은 **pack에서 단일 static icon 직접 import**하는 기준선이다. 둘째는 Icon/모든 매핑/IconAction/IconGallery와 Button 조합을 포함한 **전체 현재 adapter**다. 같은 `Icon` adapter에서 name="search" 하나만 렌더링할 때 첫 행 크기가 된다고 주장하지 않는다. runtime name 매핑을 참조하는 adapter는 이 정적 subset 전체를 유지할 수 있다.

esbuild가 pack barrel을 분석하며 읽은 input module 수는 출력 포함 개수와 다르다. 표의 개수는 `metafile.outputs[*].inputs[*].bytesInOutput > 0`인 icon 경로만 세었다. 실제로 단일 기준선은 1, 전체 adapter는 36으로 나왔으므로 **이 조건의 tree shaking 결과**를 확인할 수 있다. 모든 소비자 bundler/설정의 결과를 보장하지 않는다. React runtime·CSS·폰트·네트워크 전송 헤더·sourcemap은 표에 포함되지 않는다. 이 측정은 갤러리 main bundle도 core 전체 bundle도 아니며 Vite production build/최종 실행 검증을 대신하지 않는다.

실행한 명령(저장소 루트 기준, 개인 절대 경로 없음):

```sh
export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"; node --input-type=module -e 'import {build,version} from "esbuild"; import {gzipSync} from "node:zlib"; import {readFileSync} from "node:fs"; const p=JSON.parse(readFileSync("package.json","utf8")),l=JSON.parse(readFileSync("package-lock.json","utf8")),i=JSON.parse(readFileSync("node_modules/lucide-react/package.json","utf8")); console.log(JSON.stringify({node:process.version,esbuild:version,declared:p.dependencies["lucide-react"],lock:l.packages["node_modules/lucide-react"].version,installed:i.version})); for(const [label,contents] of [["one-static-icon","export { Search } from \"lucide-react\";"],["entire-adapter","export * from \"./src/components/icons.tsx\";"]]) { const result=await build({stdin:{contents,resolveDir:process.cwd(),sourcefile:"measurement.ts",loader:"ts"},bundle:true,write:false,minify:true,platform:"browser",format:"esm",target:"es2020",jsx:"automatic",external:["react","react-dom","react/jsx-runtime","react/jsx-dev-runtime"],metafile:true}); const bytes=result.outputFiles[0].contents; const emitted=Object.values(result.metafile.outputs).flatMap(x=>Object.entries(x.inputs)).filter(([path,data])=>path.includes("/icons/")&&data.bytesInOutput>0); console.log(JSON.stringify({label,minifiedBytes:bytes.length,gzipBytes:gzipSync(bytes).length,emittedIconModules:emitted.length})); }'
```

실제 stdout(exit code 0):

```jsonl
{"node":"v22.22.2","esbuild":"0.28.2","declared":"1.52.0","lock":"1.52.0","installed":"1.52.0"}
{"label":"one-static-icon","minifiedBytes":4247,"gzipBytes":1882,"emittedIconModules":1}
{"label":"entire-adapter","minifiedBytes":14682,"gzipBytes":5279,"emittedIconModules":36}
```

## 설치 LICENSE 전체를 읽은 결과와 귀속 보존

**권위 있는 로컬 원문은 `node_modules/lucide-react/LICENSE` 전체**다. package metadata의 ISC 한 단어만 보고 끝내지 않았다. 읽은 원문에는 다음 두 층이 있다.

1. ISC License 및 `Copyright (c) 2026 Lucide Icons and Contributors`. 사용·복제·수정·배포 허용과 copyright/permission notice 보존 조건, AS IS/보증 부인·책임 제한 조항이 있다.
2. Feather 유래 icon 목록 뒤 별도의 **MIT License** 및 `Copyright (c) 2013-present Cole Bemis`. 해당 목록에 calendar/check/chevrons/clock/download/info/link/minus/plus/search/trash-2/upload/x 등이 명시되어 있다. copyright/permission notice의 copies 또는 substantial portions 포함 조건과 보증·책임 제한 조항이 있다.

adapter의 close→X, delete→Trash2처럼 DS 이름과 upstream 이름은 다르다. derivative 목록의 모든 옛 이름·alias와 현재 icon의 귀속을 이 문서가 독립적으로 확정했다고 주장하지 않는다. 재배포 시 metadata의 ISC 표시나 이 요약만 남기지 말고 **설치 버전의 전체 LICENSE와 두 notice를 함께 보존**한다. minifier가 모든 notice를 자동 보존한다는 가정도 하지 않는다. 수정한 icon/복사한 SVG와 배포 산출물의 third-party notice 동봉 여부는 배포 담당자가 확인해야 한다. 이번 문서 작업은 별도 NOTICE/패키지 라이선스를 신설하거나 법률 검토·배포 권한을 부여하지 않는다.

설치 package의 homepage/repository 문자열은 출처 metadata이지 현재 인터넷 상태를 조회한 근거가 아니다. 본 문서의 버전·귀속·수치는 로컬 설치물/lockfile/소스/위 명령으로만 확인했다. 다른 버전으로 업데이트하면 원문 전체와 측정을 다시 확인해야 한다.

현재 공유/serve tree에는 `public/licenses/lucide-react.LICENSE`로 설치 LICENSE 전체의 byte-exact 복사본도 보존한다. 3208 bytes, SHA-256 `b495047bd93a9b06913511076f504daba17d5bbeb3e0650f3bb53a4220329c57`이며 ISC와 Feather-derived MIT notice를 모두 포함한다. 이는 미래 배포 산출물의 귀속 검토를 대신하지 않는다.

## 남은 범위

모든 엔진·실제 AT에서의 접근성, 의미 있는 SVG를 caller가 재정의한 경우, 각 아이콘의 제품 맥락·label 품질, 전체 glyph fallback은 미인증이다. 외부 provider·GPU/실행 엔진·제품 화면·배포·npm 공개는 이 계약의 구현 범위가 아니다. 이 문서는 신규 문서와 read-only 크기 측정 결과를 기록할 뿐 공통 DS 전체의 최종 승인 상태를 바꾸지 않는다.
