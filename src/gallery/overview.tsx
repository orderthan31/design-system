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
    <header className="page-heading"><h1>Overview</h1><p>컴포넌트를 찾아 동작을 확인하고, 필요한 코드와 스타일을 가져오세요.</p></header>
    <section className="stack" aria-label="컴포넌트 찾기"><h2>컴포넌트 찾기</h2>
      <Input type="search" aria-label="소개 화면 컴포넌트 검색" value={query} onChange={event=>setQuery(event.target.value)} placeholder="API 이름 또는 한국어로 검색"/>
      {query.trim()&&<p className="help" role="status">검색 결과 {entries.length}개</p>}
      <div className="overview-component-links">{entries.map(entry=><a key={entry.id} href={componentHash(entry.id)}>{entry.name}<Icon name="chevron-right" size={16}/></a>)}</div>
      {query.trim()&&entries.length===0&&<p>다른 이름으로 검색해 보세요.</p>}
    </section>
    <section className="overview-entrypoints" aria-label="문서 시작점">
      <div><h2>Foundations</h2><p>색상, 글꼴, 간격과 테마를 확인하세요.</p><Button variant="ghost" onClick={()=>navigate('Foundations')}>기초 보기 <Icon name="chevron-right"/></Button></div>
    </section>
    <section className="stack" aria-label="사용 시작"><h2>사용 시작</h2><p>현재는 npm에 배포된 패키지가 아닌 저장소 소스입니다. 저장소 루트에서 <code>npm ci</code> 후 <code>npm run dev</code>로 문서를 실행하세요.</p>
      <details><summary>소스 import · 스타일 범위</summary><CodeBlock source={startCode}/><p className="help">예시는 저장소 루트 기준 경로입니다. 다른 앱에서는 복사·연결한 소스 경로로 바꾸고, core.css와 .ds-core를 함께 적용하세요. gallery.css는 문서 앱 전용입니다. 글꼴 파일은 /source/fonts/에서 제공해야 합니다.</p></details>
    </section>
  </div>;
}
