import React from 'react';
import { GNB, LNB, Breadcrumb } from '../components/navigation-regions';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';

export const navigationDetailNames=['GNB','LNB','Breadcrumb'] as const;
export type NavigationDetailName=typeof navigationDetailNames[number];
export function hasNavigationDetail(name:string):name is NavigationDetailName{return (navigationDetailNames as readonly string[]).includes(name);}
const destinations=[{id:'work',label:'작업'},{id:'library',label:'자료'},{id:'settings',label:'설정'}];
export function NavigationDetail({name}:{name:NavigationDetailName}) {
  const initialLabel=name==='GNB'?'전체 탐색':name==='LNB'?'영역 탐색':'현재 위치';
  const [label,setLabel]=React.useState(initialLabel),[selectedId,setSelectedId]=React.useState('work'),[disabled,setDisabled]=React.useState(true),[linked,setLinked]=React.useState(true),[lastHref,setLastHref]=React.useState(false),[longPath,setLongPath]=React.useState(false),[currentLabel,setCurrentLabel]=React.useState('Button'),[revision,setRevision]=React.useState(0);
  const items=destinations.map(item=>({...item,disabled:item.id==='settings'&&disabled}));
  const groups=[{id:'project',label:'프로젝트',items:items.slice(0,2)},{id:'tools',label:'도구',items:items.slice(2)}];
  const crumbs=[{label:'개요',href:linked?'#Overview':undefined},{label:'Atoms',href:linked?'#Atoms':undefined},...(longPath?[{label:'공통 컴포넌트 구성과 재사용 예시 안내',href:linked?'#/components/container':undefined},{label:'넓은 화면과 좁은 화면에서의 내용 배치',href:linked?'#/components/grid':undefined}]:[]),{label:currentLabel,href:lastHref?'#/components/button':undefined}];
  const reset=()=>{setLabel(initialLabel);setSelectedId('work');setDisabled(true);setLinked(true);setLastHref(false);setLongPath(false);setCurrentLabel('Button');setRevision(n=>n+1);};
  const data=name==='Breadcrumb'?crumbs:name==='LNB'?groups:items;
  const source=`${name==='Breadcrumb'?'':"import { useState } from 'react';\n"}import { ${name} } from './src';\nimport './src/core.css';\n\nconst ${name==='LNB'?'groups':'items'} = ${JSON.stringify(data)};\n\nexport function Example() {\n${name==='Breadcrumb'?'':`  const [selectedId, setSelectedId] = useState(${JSON.stringify(selectedId)});\n`}  return (\n    <div className="ds-core">\n      <${name} label={${JSON.stringify(label)}} ${name==='LNB'?'groups={groups}':'items={items}'}${name==='Breadcrumb'?'':' selectedId={selectedId} onSelect={setSelectedId}'} />\n${name==='Breadcrumb'?'':'      <p>selectedId: {selectedId || \'미선택\'}</p>\n'}    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-navigation-detail={name}>
    <div data-navigation-preview key={revision}>{name==='GNB'?<GNB label={label} items={items} selectedId={selectedId} onSelect={setSelectedId}/>:name==='LNB'?<LNB label={label} groups={groups} selectedId={selectedId} onSelect={setSelectedId}/>:<Breadcrumb label={label} items={crumbs}/>} {name!=='Breadcrumb'&&<p className="help" data-current-selection>selectedId: {selectedId||'미선택'}</p>}</div>
    <div className="form-detail-controls">
      <label className="field"><span>label</span><Input aria-label="탐색 label control" value={label} onChange={event=>setLabel(event.target.value)}/></label>
      {name==='Breadcrumb'?<><label className="field"><span>마지막 items[].label</span><Input aria-label="현재 위치 label control" value={currentLabel} onChange={event=>setCurrentLabel(event.target.value)}/></label><div className="wrap"><Checkbox label="긴 경로 예시" checked={longPath} onChange={event=>setLongPath(event.target.checked)}/><Checkbox label="앞 항목 href" checked={linked} onChange={event=>setLinked(event.target.checked)}/><Checkbox label="마지막 항목 href" checked={lastHref} onChange={event=>setLastHref(event.target.checked)}/></div></>:<><label className="field"><span>selectedId</span><Select aria-label="selectedId control" value={selectedId} onChange={event=>setSelectedId(event.target.value)}><option value="">미선택</option>{destinations.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</Select></label><Checkbox label="설정 항목 disabled" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/></>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </div>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 탐색과 선택</summary><p>{name==='Breadcrumb'?'items는 label과 선택적 href를 받습니다. 앞 항목의 href는 native 링크이며 실제 문서 페이지로 이동합니다. 마지막 항목은 href를 주어도 aria-current="page"인 span으로 표시합니다. 긴 경로 예시는 부모 items 배열에 설명용 단계를 더하며 링크는 기존 문서 상세로 이동합니다. 별도 경로 계층 엔진을 만들지 않습니다. 선택 callback·router·별도 focus 관리 API는 없습니다.':'selectedId/onSelect는 호출자 제어형 선택입니다. items는 id/label/선택적 disabled를 받으며 LNB는 id/label/items의 groups로 전달합니다. 이 예제의 선택은 로컬 selectedId만 바꾸며 실제 router 이동이나 heading focus를 자동 수행하지 않습니다.'}</p>
      {name!=='Breadcrumb'&&<p>{name==='GNB'?'640px 이하에서는 실제 펼침 버튼으로 목록을 엽니다. 항목을 선택하면 콜백을 호출하고 모바일 펼침을 닫습니다. 펼침은 내부 상태이며 외부 expanded 제어 prop이 없습니다.':'전체 접기와 그룹별 접기는 내부 상태이며 선택값을 바꾸지 않습니다. 외부 expanded/defaultExpanded/onExpandedChange 제어 prop은 없습니다.'} native 버튼의 Tab/Shift+Tab과 Enter/Space를 사용하며 방향키·Home/End·roving tabindex·Escape 접기 API는 없습니다. disabled는 항목별 native 버튼에 적용합니다.</p>}
      <p>초기화는 예제 설정과 소유 선택값을 초기 값으로 되돌리고 미리보기를 다시 마운트해 내부 접힘도 초기화합니다. 문서 앱의 기존 hash/history·모바일 메뉴·선택 후 제목 focus 동작은 별도 소유이며 이 컴포넌트 구현으로 대체하지 않습니다.</p>
    </details>
  </div>;
}
