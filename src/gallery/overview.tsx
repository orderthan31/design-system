import React from 'react';
import { Button, Input } from '../components/atoms';
import { Icon } from '../components/icons';
import { galleryRegistry, searchComponents, componentHash } from './registry';
import { CodeBlock } from './code-block';

type OverviewPage='Foundations'|'Overview';
const featured=['Button','TextField','Select','DatePicker','DataTable','Grid'];
const startCode=`import { Button } from './src';
import './src/core.css';

export function Example() {
  return (
    <div className="ds-core">
      <Button onClick={() => window.alert('선택했어요.')}>시작하기</Button>
    </div>
  );
}`;
export function Overview({navigate}:{navigate:(page:OverviewPage)=>void}) {
  const [query,setQuery]=React.useState('');
  const entries=query.trim()?searchComponents(query):galleryRegistry.filter(entry=>featured.includes(entry.name));
  return <div className="gallery-overview stack">
    <header className="page-heading"><h1>Gyeol Design</h1><p>한국어 입력과 안내, PC와 모바일 화면을 위한 React 컴포넌트입니다. 필요한 컴포넌트를 찾아 예제를 조정하고 화면에 적용하세요.</p></header>
    <section className="stack" aria-label="컴포넌트 찾기"><h2>컴포넌트 찾기</h2>
      <Input type="search" aria-label="컴포넌트 검색" value={query} onChange={event=>setQuery(event.target.value)} placeholder="API 이름 또는 한국어로 검색"/>
      {query.trim()&&<p className="help" role="status">검색 결과 {entries.length}개</p>}
      <div className="overview-component-links">{entries.map(entry=><a key={entry.id} href={componentHash(entry.id)}>{entry.name}<Icon name="chevron-right" size={16}/></a>)}</div>
      {query.trim()&&entries.length===0&&<p>다른 이름으로 검색해 보세요.</p>}
    </section>
    <section className="overview-entrypoints" aria-label="문서 시작점">
      <div><h2>Foundations</h2><p>색상, 글꼴, 간격과 테마를 확인하세요.</p><Button variant="ghost" onClick={()=>navigate('Foundations')}>기초 보기 <Icon name="chevron-right"/></Button></div>
    </section>
    <section className="stack" aria-label="사용 시작"><h2>사용 시작</h2><p>컴포넌트 페이지에서 Variant로 모양과 상태를 조정하고 Code에서 사용 예제를 가져오세요. Docs에는 선택 기준과 주요 속성, 사용 시 주의사항을 설명합니다.</p>
      <details><summary>전체 소스로 사용하기</summary><CodeBlock source={startCode}/><p className="help">복사하거나 연결한 소스 경로에 맞춰 import를 바꾸고 core.css와 .ds-core를 함께 적용하세요. Pretendard 글꼴과 LICENSE는 앱의 /source/fonts/에서 제공합니다.</p></details>
      <details><summary>필요한 컴포넌트 소스로 시작하기</summary><p>선택 설치를 지원하는 컴포넌트는 필요한 소스와 의존성만 프로젝트에 추가할 수 있습니다. 설치한 파일을 직접 가져오고 .ds-core 안에 배치하세요.</p><p><a href="https://github.com/orderthan31/design-system/blob/main/docs/source-installation.md">설치 명령 · 지원 목록 · 글꼴과 테마 설정 ↗</a></p></details>
      <details><summary>문서와 예제를 로컬에서 실행하기</summary><p>저장소 루트에서 <code>npm ci</code> 후 <code>npm run dev</code>를 실행하세요.</p></details>
    </section>
  </div>;
}
