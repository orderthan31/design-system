# Chart: Recharts + 선별 shadcn 패턴

- Recharts 정확 dependency `3.10.1`, React/ReactDOM `19.2.0`, react-is 정확 `19.2.0`. lockfile 보존. `npm ls`에서 Recharts의 React/react-is가 같은19.2.0으로 dedupe됨을 확인했다. 개발용 pretty-format의 별도 react-is17은 런타임 엔진 호환성과 구분한다.
- Recharts immutable source `ffb918798051ef040bb7f9922d3850c9c189f39f`: https://github.com/recharts/recharts/tree/ffb918798051ef040bb7f9922d3850c9c189f39f . MIT 원문은 `recharts-LICENSE.txt`.
- shadcn immutable source `0e3abd65a97707f4a9cc3ed07bf5006e1cb67b13`, `apps/v4/registry/new-york-v4/ui/chart.tsx`: https://github.com/shadcn-ui/ui/blob/0e3abd65a97707f4a9cc3ed07bf5006e1cb67b13/apps/v4/registry/new-york-v4/ui/chart.tsx . 원본 SHA256 `35e2fa755465ef8eb8ff8b483d493204d452152e7a8863474b1a69f5d44484db`. MIT/Copyright (c) 2023 shadcn 원문 `shadcn-LICENSE.txt` 유지.
- 선택 도입: ChartConfig/context, data-slot ChartContainer와 단일 ResponsiveContainer, active/payload 기반 tooltip, config indicator/label 기반 legend. 기존 공개 title/data/type/description/showLegend 계약에 맞춰 DS scoped CSS와 기존 token으로 변형. Tailwind/cn/전체 테마/global reset/CLI init은 도입하지 않았다. 원본의 focus outline 제거와 HTML CSS 문자열 삽입은 이식하지 않았다.
- Recharts LineChart/BarChart/PieChart만 geometry를 생성한다. 직접 SVG/ResizeObserver/path/arc 엔진은 생산 소스에서 제거했다. 입력은 원래 순서/원본 표·tooltip을 보존하며 내부 유한 정규화 값만 plot에 쓴다. 극단 비율 underflow와 미세 조각 소실은 해결 보증하지 않는다.
- 높이260px/min-width:0, accessibilityLayer/한국어 이름/원본 native Table 유지. 도넛에 음수가 있으면 그림 전체 대신 안내. NaN/무한값은 이유와 원본을 표에 유지하며 선은 끊는다. source-read/build는 전체 AT/디자인 수락이 아니다.
- 신규 runtime dependency로 production bundle이 증가했다. Vite의500kB chunk warning은 숨기지 않고 그대로 기록한다. 이번 수정에서 새 배포·서버나 임의의 번들 규칙/동작 변경을 추가하지 않았다.
