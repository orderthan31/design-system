import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { Container, Grid, Stack, Shell } from '../components/layout';
import { ActionGroup, FormSection, ListPanel } from '../components/composition';
import { List, ListItem } from '../components/data-display';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';
import '../examples.css';

export const layoutDetailNames=['Container','Grid','Stack','Shell','ActionGroup','FormSection','ListPanel'] as const;
export type LayoutDetailName=typeof layoutDetailNames[number];
export function hasLayoutDetail(name:string):name is LayoutDetailName{return (layoutDetailNames as readonly string[]).includes(name);}
const labels={Container:'내용 컨테이너',Grid:'내용 격자',Stack:'내용 묶음',Shell:'영역 탐색',ActionGroup:'예시 동작',FormSection:'정보 입력',ListPanel:'문서 목록'};
const itemNames=['문서 정리','컴포넌트 점검','예시 확인'];
export function LayoutDetail({name}:{name:LayoutDetailName}) {
  const inputId=React.useId();
  const [label,setLabel]=React.useState(labels[name]),[body,setBody]=React.useState('재사용 가능한 내용을 배치합니다.'),[count,setCount]=React.useState(3),[className,setClassName]=React.useState('w-full'),[nativeId,setNativeId]=React.useState('layout-stack'),[header,setHeader]=React.useState('문서 작업'),[showNavigation,setShowNavigation]=React.useState(true),[showHeader,setShowHeader]=React.useState(true),[navigationChoice,setNavigationChoice]=React.useState('개요'),[primaryLabel,setPrimaryLabel]=React.useState('확인'),[secondaryLabel,setSecondaryLabel]=React.useState('취소'),[showSecond,setShowSecond]=React.useState(true),[status,setStatus]=React.useState('아직 확인 전'),[value,setValue]=React.useState(''),[showSlot,setShowSlot]=React.useState(true),[revision,setRevision]=React.useState(0);
  const reset=()=>{setLabel(labels[name]);setBody('재사용 가능한 내용을 배치합니다.');setCount(3);setClassName('w-full');setNativeId('layout-stack');setHeader('문서 작업');setShowNavigation(true);setShowHeader(true);setNavigationChoice('개요');setPrimaryLabel('확인');setSecondaryLabel('취소');setShowSecond(true);setStatus('아직 확인 전');setValue('');setShowSlot(true);setRevision(n=>n+1);};
  const text=(caption:string,current:string,set:(value:string)=>void,aria:string)=><label className="field"><span>{caption}</span><Input aria-label={aria} value={current} onChange={event=>set(event.target.value)}/></label>;
  const check=(caption:string,current:boolean,set:(value:boolean)=>void)=><Checkbox label={caption} checked={current} onChange={event=>set(event.target.checked)}/>;
  let preview:React.ReactNode,imports:string,declarations='',content:string;
  const isNativeLayout=['Container','Grid','Stack'].includes(name),isInstalled=isNativeLayout||name==='Shell';
  if(isNativeLayout) {
    const Layout=name==='Container'?Container:name==='Grid'?Grid:Stack;
    const children=Array.from({length:count},(_,i)=><p key={i} >{body} {i+1}</p>);
    preview=className==='w-full'?<Layout id={nativeId||undefined} className="w-full" aria-label={label}>{children}</Layout>:<Layout id={nativeId||undefined} aria-label={label}>{children}</Layout>;
    imports=name;declarations=`const items = ${JSON.stringify(Array.from({length:count},(_,i)=>`${body} ${i+1}`))} as string[];\n`;
    content=`<${name}${nativeId?` id={${JSON.stringify(nativeId)}}`:''} className={${JSON.stringify(className)}} aria-label={${JSON.stringify(label)}}>\n  {items.map((item, index) => <p key={index}>{item}</p>)}\n</${name}>`;
  } else if(name==='Shell') {
    preview=<Shell mainAs="div" navigation={showNavigation?<nav aria-label={label}><Button variant="secondary" onClick={()=>setNavigationChoice('개요')}>개요</Button><Button variant="secondary" onClick={()=>setNavigationChoice('자료')}>자료</Button></nav>:null} header={showHeader?<strong>{header}</strong>:null}><p>{body}</p><p role="status" className="help">선택: {navigationChoice}</p></Shell>;
    imports=showNavigation?'Shell, Button':'Shell';declarations=`const [choice${showNavigation?', setChoice':''}] = useState(${JSON.stringify(navigationChoice)});\n`;
    content=`<Shell mainAs="div" navigation={${showNavigation?`<nav aria-label={${JSON.stringify(label)}}>\n  <Button variant="secondary" onClick={() => setChoice('개요')}>개요</Button>\n  <Button variant="secondary" onClick={() => setChoice('자료')}>자료</Button>\n</nav>`:'null'}} header={${showHeader?`<strong>{${JSON.stringify(header)}}</strong>`:'null'}}>\n  <p>{${JSON.stringify(body)}}</p>\n  <p role="status">선택: {choice}</p>\n</Shell>`;
  } else if(name==='ActionGroup') {
    preview=<><ActionGroup label={label}><Button onClick={()=>setStatus(primaryLabel)}><span className="example-wrap-action">{primaryLabel}</span></Button>{showSecond&&<Button variant="secondary" onClick={()=>setStatus(secondaryLabel)}><span className="example-wrap-action">{secondaryLabel}</span></Button>}</ActionGroup><p role="status" className="help">{status}</p></>;
    imports='ActionGroup, Button';declarations=`const [status, setStatus] = useState(${JSON.stringify(status)});\n`;
    content=`<ActionGroup label={${JSON.stringify(label)}}>\n  <Button onClick={() => setStatus(${JSON.stringify(primaryLabel)})}><span className="example-wrap-action">{${JSON.stringify(primaryLabel)}}</span></Button>\n${showSecond?`  <Button variant="secondary" onClick={() => setStatus(${JSON.stringify(secondaryLabel)})}><span className="example-wrap-action">{${JSON.stringify(secondaryLabel)}}</span></Button>\n`:''}</ActionGroup>\n<p role="status">{status}</p>`;
  } else if(name==='FormSection') {
    const actions=showSlot?<Button onClick={()=>setStatus(`확인: ${value||'빈 값'}`)}><span className="example-wrap-action">{primaryLabel}</span></Button>:undefined;
    preview=<><FormSection title={label} actions={actions}><div className="field"><label htmlFor={inputId}>표시 이름</label><Input id={inputId} value={value} onChange={event=>setValue(event.target.value)}/></div></FormSection><p role="status" className="help">{status}</p></>;
    imports=showSlot?'FormSection, Button, Input':'FormSection, Input';declarations=`const inputId = useId();\nconst [value, setValue] = useState(${JSON.stringify(value)});\nconst [status${showSlot?', setStatus':''}] = useState(${JSON.stringify(status)});\n`;
    content=`<FormSection title={${JSON.stringify(label)}}${showSlot?` actions={<Button onClick={() => setStatus(\`확인: \${value || '빈 값'}\`)}><span className="example-wrap-action">{${JSON.stringify(primaryLabel)}}</span></Button>}`:''}>\n  <div className="field">\n    <label htmlFor={inputId}>표시 이름</label>\n    <Input id={inputId} value={value} onChange={event => setValue(event.target.value)} />\n  </div>\n</FormSection>\n<p role="status">{status}</p>`;
  } else {
    preview=<><ListPanel title={label} toolbar={showSlot?<Button variant="secondary" onClick={()=>setCount(n=>n===3?0:n+1)}>항목 수 바꾸기</Button>:undefined}><List label="예시 항목">{itemNames.slice(0,count).map(item=><ListItem key={item} title={item}/>)}</List></ListPanel><p role="status" className="help">항목: {count}개</p></>;
    imports=showSlot?'ListPanel, List, ListItem, Button':'ListPanel, List, ListItem';declarations=`const [count${showSlot?', setCount':''}] = useState(${count});\nconst items = ${JSON.stringify(itemNames)};\n`;
    content=`<ListPanel title={${JSON.stringify(label)}}${showSlot?' toolbar={<Button variant="secondary" onClick={() => setCount(n => n === 3 ? 0 : n + 1)}>항목 수 바꾸기</Button>}':''}>\n  <List label="예시 항목">\n    {items.slice(0, count).map(item => <ListItem key={item} title={item} />)}\n  </List>\n</ListPanel>\n<p role="status">항목: {count}개</p>`;
  }
  const hooks=isNativeLayout?'':name==='FormSection'?'useId, useState':'useState';
  const source=`${hooks?`import { ${hooks} } from 'react';\n`:''}${isInstalled?`import { ${name} } from './src/gyeol/components/${name.toLowerCase()}';${name==='Shell'&&showNavigation?"\nimport { Button } from './src/gyeol/components/button';":''}`:`import { ${imports} } from './src';\nimport './src/core.css';\nimport './src/examples.css';`}\n\n${isNativeLayout?declarations+'\n':''}export function Example() {\n${isNativeLayout?'':declarations}  return <div className="ds-core">\n${content}\n  </div>;\n}`;
  return <div className="connected-detail stack" data-layout-detail={name}>
    <div data-layout-preview key={revision}>{preview}</div>
    <GalleryControls className="form-detail-controls">
      {text(name==='FormSection'||name==='ListPanel'?'title':isNativeLayout?'native aria-label':name==='Shell'?'navigation · 자식 nav label':'label',label,setLabel,'layout label control')}
      {(isNativeLayout||name==='Shell')&&text('children · 본문 텍스트',body,setBody,'layout body control')}
      {(isNativeLayout||name==='ListPanel')&&<label className="field"><span>children · 항목 수</span><Select aria-label="layout count control" value={count} onChange={event=>setCount(Number(event.target.value))}>{[0,1,2,3].map(n=><option key={n} value={n}>{n}개</option>)}</Select></label>}
      {isNativeLayout&&<><label className="field"><span>native className · 정적 예제</span><Select aria-label="Stack className control" value={className} onChange={event=>setClassName(event.target.value)}><option value="w-full">w-full · 소비자 배치 utility</option><option value="">추가 class 없음</option></Select></label>{text('native id',nativeId,setNativeId,'Stack id control')}</>}
      {name==='Shell'&&<>{text('header · 텍스트',header,setHeader,'Shell header control')}<div className="wrap">{check('navigation 자식 표시',showNavigation,setShowNavigation)}{check('header 자식 표시',showHeader,setShowHeader)}</div></>}
      {name==='ActionGroup'&&<>{text('첫 Button label',primaryLabel,setPrimaryLabel,'primary action control')}{text('두 번째 Button label',secondaryLabel,setSecondaryLabel,'secondary action control')}{check('두 번째 자식 표시',showSecond,setShowSecond)}</>}
      {name==='FormSection'&&<>{text('자식 Input value',value,setValue,'FormSection value control')}{text('actions · Button label',primaryLabel,setPrimaryLabel,'primary action control')}{check('actions 전달',showSlot,setShowSlot)}</>}
      {name==='ListPanel'&&check('toolbar 전달',showSlot,setShowSlot)}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>속성 · 배치</summary>{isNativeLayout?<><p>children과 div 속성을 전달하며 className·style로 배치를 조정할 수 있습니다. Container는 최대 너비, Stack은 세로 간격, Grid는 반응형 열 배치를 제공합니다.</p></>:name==='Shell'?<><p>navigation·header·children을 지정합니다. mainAs는 main 또는 div이며 기본 main입니다. 이미 main 안에 배치하면 mainAs=div를 사용하세요. 빈 슬롯이어도 해당 영역의 틀은 유지됩니다.</p><p>navigation에 탐색 메뉴를, header에 페이지 공통 내용을 넣습니다. 선택 상태와 화면 이동은 탐색 메뉴의 콜백에 연결하세요.</p></>:name==='ActionGroup'?<p>children에 버튼을 넣고 label로 그룹의 이름을 지정합니다. label의 기본값은 동작입니다. 버튼별 loading·disabled·onClick을 설정하세요.</p>:name==='FormSection'?<p>title과 children을 넣고 actions에 관련 버튼을 배치합니다. 입력별 라벨과 오류를 연결하고 전체 제출은 form으로 구성하세요.</p>:<p>title과 children을 넣고 toolbar에 검색이나 추가 도구를 배치합니다. children에는 List나 필요한 목록 내용을 구성하세요.</p>}<p>화면 폭을 줄여 배치를 비교하고 예제의 초기화 버튼으로 처음 설정으로 돌아갈 수 있습니다.</p></GalleryDocs>
  </div>;
}
