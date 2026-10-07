import {GalleryDocs,GalleryControls} from './workbench';
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
    <GalleryControls className="form-detail-controls">
      <label className="field"><span>label</span><Input aria-label="탐색 label control" value={label} onChange={event=>setLabel(event.target.value)}/></label>
      {name==='Breadcrumb'?<><label className="field"><span>마지막 items[].label</span><Input aria-label="현재 위치 label control" value={currentLabel} onChange={event=>setCurrentLabel(event.target.value)}/></label><div className="wrap"><Checkbox label="긴 경로 예시" checked={longPath} onChange={event=>setLongPath(event.target.checked)}/><Checkbox label="앞 항목 href" checked={linked} onChange={event=>setLinked(event.target.checked)}/><Checkbox label="마지막 항목 href" checked={lastHref} onChange={event=>setLastHref(event.target.checked)}/></div></>:<><label className="field"><span>selectedId</span><Select aria-label="selectedId control" value={selectedId} onChange={event=>setSelectedId(event.target.value)}><option value="">미선택</option>{destinations.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</Select></label><Checkbox label="설정 항목 disabled" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/></>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 탐색과 선택</summary><p>{name==='Breadcrumb'?'items에 label과 선택적 href를 지정합니다. 앞 항목은 상위 화면 링크, 마지막 항목은 현재 페이지로 표시합니다. 실제 탐색 경로의 순서로 항목을 구성하세요.':'selectedId와 onSelect로 선택을 관리합니다. 항목에는 id·label·disabled를 지정합니다. LNB는 관련 항목을 groups에 묶습니다. onSelect에서 선택값과 화면 이동을 연결하세요.'}</p>
      {name!=='Breadcrumb'&&<p>{name==='GNB'?'640px 이하에서는 펼침 버튼으로 목록을 엽니다. 항목 선택 후 메뉴를 닫습니다.':'전체 또는 그룹별로 접고 펼칠 수 있습니다. 접어도 선택값을 유지합니다.'} Tab과 Shift+Tab으로 이동하고 Enter 또는 Space로 선택합니다. disabled인 항목은 선택할 수 없습니다.</p>}
      <p>화면이 바뀌면 selectedId를 갱신하세요. 예제의 초기화 버튼은 선택과 펼침 상태를 처음으로 되돌립니다.</p>
    </GalleryDocs>
  </div>;
}
