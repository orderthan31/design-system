import React from 'react';
import { LoadingSpinner, ErrorState, Toast, Accordion, Collapse } from '../components/feedback-controls';
import { Button, Input } from '../components/atoms';
import { Checkbox, Textarea } from '../components/primitives';
import { CodeBlock } from './code-block';

export const feedbackDetailNames=['LoadingSpinner','ErrorState','Toast','Accordion','Collapse'] as const;
export type FeedbackDetailName=typeof feedbackDetailNames[number];
export function hasFeedbackDetail(name:string):name is FeedbackDetailName{return (feedbackDetailNames as readonly string[]).includes(name);}
const defaults:Record<FeedbackDetailName,string>={LoadingSpinner:'불러오는 중',ErrorState:'연결을 확인하고 다시 시도해 주세요.',Toast:'변경 내용을 확인했어요.',Accordion:'사용 방법',Collapse:'상세 내용'};
export function FeedbackDetail({name}:{name:FeedbackDetailName}) {
  const [text,setText]=React.useState(defaults[name]);
  const [content,setContent]=React.useState('필요한 내용을 펼쳐 확인하세요.');
  const [visible,setVisible]=React.useState(true),[loading,setLoading]=React.useState(false);
  const [multiple,setMultiple]=React.useState(false),[optionDisabled,setOptionDisabled]=React.useState(true);
  const [revision,setRevision]=React.useState(0),[message,setMessage]=React.useState('');
  const items=[{id:'usage',title:text,content},{id:'keyboard',title:'키보드 조작',content:'Tab으로 이동하고 Enter 또는 Space로 펼칩니다.'},{id:'restricted',title:'사용 제한',content:'제한된 항목의 내용입니다.',disabled:optionDisabled}];
  const isDisclosure=name==='Accordion'||name==='Collapse';
  const prop=name==='LoadingSpinner'?'label':isDisclosure?'title':'message';
  const reset=()=>{setText(defaults[name]);setContent('필요한 내용을 펼쳐 확인하세요.');setVisible(true);setLoading(false);setMultiple(false);setOptionDisabled(true);setRevision(n=>n+1);setMessage('초기화했어요.');};
  const retry=()=>setLoading(true),dismiss=()=>setVisible(false);
  const preview=name==='LoadingSpinner'?<><Button variant="secondary" onClick={()=>setVisible(v=>!v)}>{visible?'로딩 숨기기':'로딩 표시'}</Button>{visible&&<LoadingSpinner label={text}/>}</>:name==='ErrorState'?<><Button variant="secondary" onClick={()=>setLoading(false)}>오류 다시 표시</Button>{loading?<LoadingSpinner label="다시 불러오는 중"/>:<ErrorState message={text} onRetry={retry}/>}</>:name==='Toast'?<><Button variant="secondary" disabled={visible} onClick={()=>setVisible(true)}>알림 표시</Button>{visible&&<Toast message={text} onDismiss={dismiss}/>}</>:name==='Accordion'?<Accordion items={items} multiple={multiple}/>:<Collapse title={text}>{content}</Collapse>;
  const imports=name==='ErrorState'?'ErrorState, LoadingSpinner, Button':isDisclosure?name:`${name}, Button`;
  const state=name==='ErrorState'?`  const [loading, setLoading] = useState(${loading});\n`:isDisclosure?'':`  const [visible, setVisible] = useState(${visible});\n`;
  const component=name==='LoadingSpinner'?`<Button variant="secondary" onClick={() => setVisible(value => !value)}>{visible ? '로딩 숨기기' : '로딩 표시'}</Button>\n      {visible && <LoadingSpinner label=${JSON.stringify(text)} />}`:name==='ErrorState'?`<Button variant="secondary" onClick={() => setLoading(false)}>오류 다시 표시</Button>\n      {loading ? <LoadingSpinner label="다시 불러오는 중" /> : <ErrorState message=${JSON.stringify(text)} onRetry={() => setLoading(true)} />}`:name==='Toast'?`<Button variant="secondary" disabled={visible} onClick={() => setVisible(true)}>알림 표시</Button>\n      {visible && <Toast message=${JSON.stringify(text)} onDismiss={() => setVisible(false)} />}`:name==='Accordion'?`<Accordion items={items} multiple={${multiple}} />`:`<Collapse title=${JSON.stringify(text)}>{${JSON.stringify(content)}}</Collapse>`;
  const source=`${isDisclosure?'':"import { useState } from 'react';\n"}import { ${imports} } from './src';\nimport './src/core.css';\n${name==='Accordion'?`\nconst items = ${JSON.stringify(items)};\n`:''}\nexport function Example() {\n${state}  return (\n    <div className="ds-core">\n      ${component}\n    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-feedback-detail={name}>
    <div className="connected-preview stack" data-feedback-preview key={revision}>{preview}</div>
    <div className="form-detail-controls">
      <label className="field"><span>{name==='Accordion'?'items[0].title':prop}</span><Input aria-label="예제 문구" value={text} onChange={event=>setText(event.target.value)}/></label>
      {isDisclosure&&<label className="field"><span>{name==='Accordion'?'items[0].content':'children'}</span><Textarea aria-label="예제 내용" value={content} onChange={event=>setContent(event.target.value)}/></label>}
      {name==='Accordion'&&<div className="wrap"><Checkbox label="multiple" checked={multiple} onChange={event=>setMultiple(event.target.checked)}/><Checkbox label="사용 제한 항목 disabled" checked={optionDisabled} onChange={event=>setOptionDisabled(event.target.checked)}/></div>}
      {(name==='Toast'||name==='LoadingSpinner')&&<Checkbox label="부모의 미리보기 표시" checked={visible} onChange={event=>setVisible(event.target.checked)}/>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </div>
    <p className="help" role="status">{message}</p>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 동작과 상태</summary>
      <p>{name==='LoadingSpinner'?'label은 status의 접근성 이름과 표시 문구이며 기본값은 불러오는 중입니다. 표시 여부는 부모가 조건부 렌더링으로 정합니다. visible/loading/진행률/완료 콜백은 이 컴포넌트의 props가 아닙니다.':name==='ErrorState'?'message는 표시 문구이며 onRetry는 필수 콜백입니다. 재시도 버튼은 콜백만 호출합니다. 이 예제의 부모는 오류 대신 로딩 표시로 전환하고 오류 다시 표시 버튼으로 되돌립니다. disabled/재시도 중 상태 prop은 없습니다.':name==='Toast'?'message와 onDismiss는 필수입니다. 알림 닫기 버튼은 콜백만 호출하고 부모가 표시 상태를 false로 바꿔 제거합니다. role은 status이며 자동 닫힘·duration·타이머·알림 queue가 없습니다.':name==='Accordion'?'items는 고유한 id/title/content 및 항목 disabled를 받습니다. multiple 기본값은 false입니다. 단일 모드는 새 항목을 누르면 이전 항목을 닫고 복수 모드는 항목을 추가로 펼칩니다. 버튼의 aria-expanded/aria-controls와 hidden 패널을 사용합니다.':'title과 children은 필수입니다. 실제 버튼 클릭 또는 Enter/Space로 펼치고 접습니다. aria-expanded/aria-controls와 hidden 패널을 사용합니다.'}</p>
      <p>{isDisclosure?'펼침은 내부 상태이며 처음에는 전부 접혀 있습니다. 외부 open/defaultOpen/onOpenChange props가 없습니다. 현재 코드는 items/title/children 등의 설정을 표현하며 내부 펼침 상태를 외부 제어 값으로 보여주지 않습니다. 초기화는 미리보기를 다시 열어 접힌 상태로 되돌립니다.':'이 예제의 표시·재시도 상태는 로컬 메모리입니다. 서버 요청이나 실제 작업 완료를 실행하지 않으며 로딩을 자동으로 끝내지 않습니다.'}</p>
      {name==='Accordion'&&<p>multiple 설정 변경만으로 기존 열린 항목을 정규화하거나 접지 않습니다. 새 모드는 이후 버튼 조작에 적용됩니다. disabled 항목은 native 버튼으로 변경을 막지만 이미 열려 있던 내용 자체를 숨기지는 않습니다.</p>}
      {name==='Collapse'&&<p>collapsed/disabled 등의 외부 상태 prop은 없습니다. 여러 Collapse를 조합하면 각각 독립적으로 펼쳐집니다.</p>}
    </details>
  </div>;
}
