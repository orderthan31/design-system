import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { Stack, Shell } from '../components/layout';
import { ActionGroup, FormSection, ListPanel } from '../components/composition';
import { List, ListItem } from '../components/data-display';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';
import '../examples.css';

export const layoutDetailNames=['Stack','Shell','ActionGroup','FormSection','ListPanel'] as const;
export type LayoutDetailName=typeof layoutDetailNames[number];
export function hasLayoutDetail(name:string):name is LayoutDetailName{return (layoutDetailNames as readonly string[]).includes(name);}
const labels={Stack:'내용 묶음',Shell:'영역 탐색',ActionGroup:'예시 동작',FormSection:'정보 입력',ListPanel:'문서 목록'};
const itemNames=['문서 정리','컴포넌트 점검','예시 확인'];
export function LayoutDetail({name}:{name:LayoutDetailName}) {
  const inputId=React.useId();
  const [label,setLabel]=React.useState(labels[name]),[body,setBody]=React.useState('재사용 가능한 내용을 배치합니다.'),[count,setCount]=React.useState(3),[className,setClassName]=React.useState('w-full'),[nativeId,setNativeId]=React.useState('layout-stack'),[header,setHeader]=React.useState('문서 작업'),[showNavigation,setShowNavigation]=React.useState(true),[showHeader,setShowHeader]=React.useState(true),[navigationChoice,setNavigationChoice]=React.useState('개요'),[primaryLabel,setPrimaryLabel]=React.useState('확인'),[secondaryLabel,setSecondaryLabel]=React.useState('취소'),[showSecond,setShowSecond]=React.useState(true),[status,setStatus]=React.useState('아직 확인 전'),[value,setValue]=React.useState(''),[showSlot,setShowSlot]=React.useState(true),[revision,setRevision]=React.useState(0);
  const reset=()=>{setLabel(labels[name]);setBody('재사용 가능한 내용을 배치합니다.');setCount(3);setClassName('w-full');setNativeId('layout-stack');setHeader('문서 작업');setShowNavigation(true);setShowHeader(true);setNavigationChoice('개요');setPrimaryLabel('확인');setSecondaryLabel('취소');setShowSecond(true);setStatus('아직 확인 전');setValue('');setShowSlot(true);setRevision(n=>n+1);};
  const text=(caption:string,current:string,set:(value:string)=>void,aria:string)=><label className="field"><span>{caption}</span><Input aria-label={aria} value={current} onChange={event=>set(event.target.value)}/></label>;
  const check=(caption:string,current:boolean,set:(value:boolean)=>void)=><Checkbox label={caption} checked={current} onChange={event=>set(event.target.checked)}/>;
  let preview:React.ReactNode,imports:string,declarations='',content:string;
  if(name==='Stack') {
    const children=Array.from({length:count},(_,i)=><p key={i} className="example-wrap-text">{body} {i+1}</p>);
    preview=className==='w-full'?<Stack id={nativeId||undefined} className="w-full" aria-label={label}>{children}</Stack>:<Stack id={nativeId||undefined} aria-label={label}>{children}</Stack>;
    imports='Stack';declarations=`const items = ${JSON.stringify(Array.from({length:count},(_,i)=>`${body} ${i+1}`))} as string[];\n`;
    content=`<Stack${nativeId?` id={${JSON.stringify(nativeId)}}`:''} className={${JSON.stringify(className)}} aria-label={${JSON.stringify(label)}}>\n  {items.map((item, index) => <p key={index} className="example-wrap-text">{item}</p>)}\n</Stack>`;
  } else if(name==='Shell') {
    preview=<Shell mainAs="div" navigation={showNavigation?<nav aria-label={label}><Button variant="secondary" onClick={()=>setNavigationChoice('개요')}>개요</Button><Button variant="secondary" onClick={()=>setNavigationChoice('자료')}>자료</Button></nav>:null} header={showHeader?<strong className="example-wrap-text">{header}</strong>:null}><p className="example-wrap-text">{body}</p><p role="status" className="help">선택: {navigationChoice}</p></Shell>;
    imports=showNavigation?'Shell, Button':'Shell';declarations=`const [choice${showNavigation?', setChoice':''}] = useState(${JSON.stringify(navigationChoice)});\n`;
    content=`<Shell mainAs="div" navigation={${showNavigation?`<nav aria-label={${JSON.stringify(label)}}>\n  <Button variant="secondary" onClick={() => setChoice('개요')}>개요</Button>\n  <Button variant="secondary" onClick={() => setChoice('자료')}>자료</Button>\n</nav>`:'null'}} header={${showHeader?`<strong className="example-wrap-text">{${JSON.stringify(header)}}</strong>`:'null'}}>\n  <p className="example-wrap-text">{${JSON.stringify(body)}}</p>\n  <p role="status">선택: {choice}</p>\n</Shell>`;
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
  const hooks=name==='Stack'?'':name==='FormSection'?'useId, useState':'useState';
  const source=`${hooks?`import { ${hooks} } from 'react';\n`:''}import { ${imports} } from './src';\nimport './src/core.css';\nimport './src/examples.css';\n\n${name==='Stack'?declarations+'\n':''}export function Example() {\n${name==='Stack'?'':declarations}  return <div className="ds-core">\n${content}\n  </div>;\n}`;
  return <div className="connected-detail stack" data-layout-detail={name}>
    <div data-layout-preview key={revision}>{preview}</div>
    <GalleryControls className="form-detail-controls">
      {text(name==='FormSection'||name==='ListPanel'?'title':name==='Stack'?'native aria-label':name==='Shell'?'navigation · 자식 nav label':'label',label,setLabel,'layout label control')}
      {(name==='Stack'||name==='Shell')&&text('children · 본문 텍스트',body,setBody,'layout body control')}
      {(name==='Stack'||name==='ListPanel')&&<label className="field"><span>children · 항목 수</span><Select aria-label="layout count control" value={count} onChange={event=>setCount(Number(event.target.value))}>{[0,1,2,3].map(n=><option key={n} value={n}>{n}개</option>)}</Select></label>}
      {name==='Stack'&&<><label className="field"><span>native className · 정적 예제</span><Select aria-label="Stack className control" value={className} onChange={event=>setClassName(event.target.value)}><option value="w-full">w-full · 소비자 배치 utility</option><option value="">추가 class 없음</option></Select></label>{text('native id',nativeId,setNativeId,'Stack id control')}</>}
      {name==='Shell'&&<>{text('header · 텍스트',header,setHeader,'Shell header control')}<div className="wrap">{check('navigation 자식 표시',showNavigation,setShowNavigation)}{check('header 자식 표시',showHeader,setShowHeader)}</div></>}
      {name==='ActionGroup'&&<>{text('첫 Button label',primaryLabel,setPrimaryLabel,'primary action control')}{text('두 번째 Button label',secondaryLabel,setSecondaryLabel,'secondary action control')}{check('두 번째 자식 표시',showSecond,setShowSecond)}</>}
      {name==='FormSection'&&<>{text('자식 Input value',value,setValue,'FormSection value control')}{text('actions · Button label',primaryLabel,setPrimaryLabel,'primary action control')}{check('actions 전달',showSlot,setShowSlot)}</>}
      {name==='ListPanel'&&check('toolbar 전달',showSlot,setShowSlot)}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 구성과 소유권</summary>{name==='Stack'?<><p>native div attributes/children/className만 받습니다. ds-stack과 className을 병합하고 data-layout="stack"은 고정합니다. 간격은 core CSS의 배치 계약이며 gap/direction/size 같은 전용 prop은 없습니다. 본문 줄바꿈은 예제 자식 p의 소유 CSS class입니다. 이 controls의 className 선택은 검사 가능한 정적 예제 두 가지이며 public native className API 자체를 제한하지 않습니다.</p></>:name==='Shell'?<><p>navigation/header/children은 필수 ReactNode이며 mainAs는 main 또는 div, 기본 main입니다. 갤러리는 이미 main 안이므로 preview와 코드 모두 mainAs="div"를 명시합니다. null 슬롯을 전달해도 aside/header wrapper 자체는 유지됩니다.</p><p>탐색 버튼과 선택 state는 navigation 자식·부모의 로컬 예시이며 Shell의 router/선택/권한 API가 아닙니다. header와 본문은 실제 자식 노드로 구성합니다. Shell은 native attributes/className을 상속하지 않습니다.</p></>:name==='ActionGroup'?<p>선택적 label(기본 "동작")과 필수 children으로 role="group"인 버튼행을 구성합니다. 클릭 결과는 실제 Button 자식과 부모 state가 소유하며 ActionGroup의 저장/submit/loading/disabled API가 아닙니다. 긴 label의 줄바꿈은 예제 소유 CSS class입니다.</p>:name==='FormSection'?<p>title/children과 선택적 actions를 받습니다. useId로 section aria-labelledby와 h3 제목을 연결하고 본문은 Stack, truthy actions는 ActionGroup 안에 놓습니다. 자식 Input의 값·label 연결과 확인 결과는 부모 예제 state이며 form 저장/submit/validation 기능을 wrapper에 추가하지 않습니다.</p>:<p>title/children과 선택적 toolbar를 받습니다. useId로 section 제목을 연결하고 본문은 Stack에 놓습니다. 항목 수 변경 버튼과 List children은 부모의 실제 조합이며 ListPanel의 filter/loading/저장/페이지 API가 아닙니다.</p>}<p>초기화는 예제 props·자식 구성·부모 state를 되돌리고 미리보기를 다시 마운트합니다. 서버 저장·외부 전송·router 연결은 하지 않습니다.</p></GalleryDocs>
  </div>;
}
