import React from 'react';
import { FormTemplate, ListTemplate, FeedbackTemplate } from '../components/templates';
import { DetailTemplate } from '../components/composition';
import { List, ListItem } from '../components/data-display';
import { ErrorState } from '../components/feedback-controls';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';

export const slotTemplateDetailNames=['FormTemplate','ListTemplate','FeedbackTemplate','DetailTemplate'] as const;
export type SlotTemplateDetailName=typeof slotTemplateDetailNames[number];
export function hasSlotTemplateDetail(name:string):name is SlotTemplateDetailName{return (slotTemplateDetailNames as readonly string[]).includes(name);}
const titles={FormTemplate:'이름 입력',ListTemplate:'문서 목록',FeedbackTemplate:'결과 안내',DetailTemplate:'문서 상세'};
const items=['문서 정리','컴포넌트 점검','예시 확인'];
export function SlotTemplateDetail({name}:{name:SlotTemplateDetailName}) {
  const id=React.useId();
  const [title,setTitle]=React.useState(titles[name]),[value,setValue]=React.useState(''),[result,setResult]=React.useState(''),[busy,setBusy]=React.useState(false),[query,setQuery]=React.useState(''),[phase,setPhase]=React.useState('ready'),[body,setBody]=React.useState('로컬 예시 내용을 확인하세요.'),[summary,setSummary]=React.useState('선택한 문서의 요약입니다.'),[showPrimary,setShowPrimary]=React.useState(true),[showSecondary,setShowSecondary]=React.useState(true),[revision,setRevision]=React.useState(0);
  const visible=items.filter(item=>item.toLocaleLowerCase('ko').includes(query.trim().toLocaleLowerCase('ko')));
  const reset=()=>{setTitle(titles[name]);setValue('');setResult('');setBusy(false);setQuery('');setPhase('ready');setBody('로컬 예시 내용을 확인하세요.');setSummary('선택한 문서의 요약입니다.');setShowPrimary(true);setShowSecondary(true);setRevision(n=>n+1);};
  const text=(caption:string,current:string,set:(value:string)=>void,aria:string)=><label className="field"><span>{caption}</span><Input aria-label={aria} value={current} onChange={event=>set(event.target.value)}/></label>;
  const check=(caption:string,current:boolean,set:(value:boolean)=>void)=><Checkbox label={caption} checked={current} onChange={event=>set(event.target.checked)}/>;
  const field=<div className="field"><label htmlFor={id}>표시 이름{name==='FormTemplate'?' (필수)':''}</label><Input id={id} required={name==='FormTemplate'} value={value} onChange={event=>setValue(event.target.value)}/></div>;
  const paragraph=<p style={{overflowWrap:'anywhere'}}>{body}</p>;
  let preview:React.ReactNode,imports:string,declarations:string,content:string;
  if(name==='FormTemplate') {
    preview=<><form aria-label="로컬 제출 예시" onSubmit={event=>{event.preventDefault();if(busy)return;setResult(value);}}><FormTemplate title={title} fields={field} actions={<Button type="submit" loading={busy}>로컬 확인</Button>} aside={showPrimary?paragraph:undefined}/></form><p role="status" className="help">확인값: {result||'없음'}</p></>;
    imports='FormTemplate, Button, Input';declarations=`const inputId = useId();\nconst [value, setValue] = useState(${JSON.stringify(value)});\nconst [submitted, setSubmitted] = useState(${JSON.stringify(result)});\nconst busy = ${busy};\n`;
    content=`<form aria-label="로컬 제출 예시" onSubmit={event => { event.preventDefault(); if (busy) return; setSubmitted(value); }}>\n  <FormTemplate title={${JSON.stringify(title)}}\n    fields={<div className="field"><label htmlFor={inputId}>표시 이름 (필수)</label><Input id={inputId} required value={value} onChange={event => setValue(event.target.value)} /></div>}\n    actions={<Button type="submit" loading={busy}>로컬 확인</Button>}${showPrimary?`\n    aside={<p style={{ overflowWrap: 'anywhere' }}>{${JSON.stringify(body)}}</p>}`:''}\n  />\n</form>\n<p role="status">확인값: {submitted || '없음'}</p>`;
  } else if(name==='ListTemplate') {
    preview=<ListTemplate title={title} toolbar={showPrimary?<Input type="search" aria-label="로컬 항목 검색" value={query} onChange={event=>setQuery(event.target.value)}/>:undefined} rows={<List label="로컬 문서">{visible.map(item=><ListItem key={item} title={item}/>)}</List>} footer={showSecondary?<p className="help">총 {visible.length}개</p>:undefined}/>;
    imports=showPrimary?'ListTemplate, List, ListItem, Input':'ListTemplate, List, ListItem';declarations=`const [query${showPrimary?', setQuery':''}] = useState(${JSON.stringify(query)});\nconst items = ${JSON.stringify(items)};\nconst visible = items.filter(item => item.toLocaleLowerCase('ko').includes(query.trim().toLocaleLowerCase('ko')));\n`;
    content=`<ListTemplate title={${JSON.stringify(title)}}${showPrimary?'\n  toolbar={<Input type="search" aria-label="로컬 항목 검색" value={query} onChange={event => setQuery(event.target.value)} />}':''}\n  rows={<List label="로컬 문서">{visible.map(item => <ListItem key={item} title={item} />)}</List>}${showSecondary?'\n  footer={<p>총 {visible.length}개</p>}':''}\n/>`;
  } else if(name==='FeedbackTemplate') {
    preview=<FeedbackTemplate title={title} status={phase==='error'?<ErrorState message="안내를 다시 확인하세요." onRetry={()=>setPhase('ready')}/>:<p role="status">{phase==='complete'?'내용을 확인했습니다.':'안내를 확인하세요.'}</p>} content={showSecondary?paragraph:null} actions={showPrimary?<Button onClick={()=>setPhase('complete')}>확인</Button>:undefined}/>;
    imports=showPrimary?'FeedbackTemplate, ErrorState, Button':'FeedbackTemplate, ErrorState';declarations=`const [phase, setPhase] = useState(${JSON.stringify(phase)});\n`;
    content=`<FeedbackTemplate title={${JSON.stringify(title)}}\n  status={phase === 'error' ? <ErrorState message="안내를 다시 확인하세요." onRetry={() => setPhase('ready')} /> : <p role="status">{phase === 'complete' ? '내용을 확인했습니다.' : '안내를 확인하세요.'}</p>}\n  content={${showSecondary?`<p style={{ overflowWrap: 'anywhere' }}>{${JSON.stringify(body)}}</p>`:'null'}}${showPrimary?'\n  actions={<Button onClick={() => setPhase(\'complete\')}>확인</Button>}':''}\n/>`;
  } else {
    preview=<><DetailTemplate title={title} summary={showSecondary?<p style={{overflowWrap:'anywhere'}}>{summary}</p>:null} content={field} actions={showPrimary?<Button onClick={()=>setResult(value)}>로컬 확인</Button>:undefined}/><p role="status" className="help">확인값: {result||'없음'}</p></>;
    imports=showPrimary?'DetailTemplate, Button, Input':'DetailTemplate, Input';declarations=`const inputId = useId();\nconst [value, setValue] = useState(${JSON.stringify(value)});\nconst [result${showPrimary?', setResult':''}] = useState(${JSON.stringify(result)});\n`;
    content=`<DetailTemplate title={${JSON.stringify(title)}}\n  summary={${showSecondary?`<p style={{ overflowWrap: 'anywhere' }}>{${JSON.stringify(summary)}}</p>`:'null'}}\n  content={<div className="field"><label htmlFor={inputId}>표시 이름</label><Input id={inputId} value={value} onChange={event => setValue(event.target.value)} /></div>}${showPrimary?'\n  actions={<Button onClick={() => setResult(value)}>로컬 확인</Button>}':''}\n/>\n<p role="status">확인값: {result || '없음'}</p>`;
  }
  const hooks=name==='FormTemplate'||name==='DetailTemplate'?'useId, useState':'useState';
  const source=`import { ${hooks} } from 'react';\nimport { ${imports} } from './src';\nimport './src/core.css';\n\nexport function Example() {\n${declarations}  return <div className="ds-core">\n${content}\n  </div>;\n}`;
  return <div className="connected-detail stack" data-slot-template-detail={name}>
    <div data-slot-template-preview key={revision}>{preview}</div>
    <div className="form-detail-controls">
      {text('title',title,setTitle,'template title control')}
      {(name==='FormTemplate'||name==='DetailTemplate')&&text('자식 Input value',value,setValue,'template value control')}
      {(name==='FormTemplate'||name==='FeedbackTemplate')&&text(name==='FormTemplate'?'aside · 텍스트':'content · 텍스트',body,setBody,'template body control')}
      {name==='ListTemplate'&&<>{text('부모 query',query,setQuery,'template query control')}<div className="wrap">{check('toolbar 전달',showPrimary,setShowPrimary)}{check('footer 전달',showSecondary,setShowSecondary)}</div></>}
      {name==='FormTemplate'&&<div className="wrap">{check('aside 전달',showPrimary,setShowPrimary)}{check('자식 Button loading',busy,setBusy)}</div>}
      {name==='FeedbackTemplate'&&<><label className="field"><span>status · 부모 예시 상태</span><Select aria-label="feedback phase control" value={phase} onChange={event=>setPhase(event.target.value)}><option value="ready">안내</option><option value="complete">확인됨</option><option value="error">재시도 예시</option></Select></label><div className="wrap">{check('actions 전달',showPrimary,setShowPrimary)}{check('content 자식 표시',showSecondary,setShowSecondary)}</div></>}
      {name==='DetailTemplate'&&<>{text('summary · 텍스트',summary,setSummary,'template summary control')}<div className="wrap">{check('actions 전달',showPrimary,setShowPrimary)}{check('summary 자식 표시',showSecondary,setShowSecondary)}</div></>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </div>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 슬롯과 부모 동작</summary>{name==='FormTemplate'?<><p>title/fields/actions가 필수이고 aside는 선택적 ReactNode입니다. 템플릿은 section이며 native form·onSubmit·validation/loading API가 아닙니다. 이 예제는 전체 템플릿을 native form으로 감싸고 fields의 required Input과 actions의 명시적 type="submit" Button을 같은 form에 둡니다.</p><p>Button loading과 form 중복 실행 방어는 부모 예제 소유입니다. 제출 결과는 메모리에만 남고 저장/전송하지 않습니다. fields에만 form을 넣으면 actions는 그 form 밖에 있으므로 별도 native 연결이 필요합니다.</p></>:name==='ListTemplate'?<p>title/rows가 필수, toolbar/footer가 선택적 ReactNode입니다. toolbar wrapper는 자식 없이도 유지됩니다. 실제 검색은 부모 query와 toolbar의 native search Input·로컬 배열 filter가 소유하며 rows는 List/ListItem 조합입니다. 템플릿의 filter/selection/pagination/router 기능으로 소개하지 않습니다.</p>:name==='FeedbackTemplate'?<p>title/status/content가 필수, actions는 선택적 ReactNode입니다. status는 enum이 아니라 실제 노드 슬롯입니다. 안내·오류·재시도는 전달한 status 자식과 부모 state 소유이며 actions도 실제 Button입니다. content=null도 타입상 가능한 필수 슬롯 전달입니다. 비동기 완료/서버 재시도를 약속하지 않습니다.</p>:<p>title/summary/content가 필수, actions는 선택적 ReactNode입니다. useId로 section 제목을 연결하고 summary aside와 content div를 Grid로 배치합니다. summary=null이어도 aside wrapper는 유지됩니다. 자식 Input/확인 결과는 부모 소유이고 자동 닫기/뒤로가기/focus 복귀는 제공하지 않습니다.</p>}<p>일반 native attributes/className/children API를 추가하지 않습니다. 초기화는 슬롯 구성과 부모 state를 되돌리고 미리보기를 다시 마운트합니다.</p></details>
  </div>;
}
