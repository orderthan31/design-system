import {GalleryDocs,GalleryControls} from './workbench';
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
  const component=name==='LoadingSpinner'?`<Button variant="secondary" onClick={() => setVisible(value => !value)}>{visible ? '로딩 숨기기' : '로딩 표시'}</Button>\n      {visible && <LoadingSpinner label={${JSON.stringify(text)}} />}`:name==='ErrorState'?`<Button variant="secondary" onClick={() => setLoading(false)}>오류 다시 표시</Button>\n      {loading ? <LoadingSpinner label="다시 불러오는 중" /> : <ErrorState message={${JSON.stringify(text)}} onRetry={() => setLoading(true)} />}`:name==='Toast'?`<Button variant="secondary" disabled={visible} onClick={() => setVisible(true)}>알림 표시</Button>\n      {visible && <Toast message={${JSON.stringify(text)}} onDismiss={() => setVisible(false)} />}`:name==='Accordion'?`<Accordion items={items} multiple={${multiple}} />`:`<Collapse title={${JSON.stringify(text)}}>{${JSON.stringify(content)}}</Collapse>`;
  const importLines=imports.split(', ').map(symbol=>`import { ${symbol} } from './src/gyeol/components/${symbol.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase()}';`).join('\n');
  const source=`${isDisclosure?'':"import { useState } from 'react';\n"}${importLines}\n${name==='Accordion'?`\nconst items = ${JSON.stringify(items)};\n`:''}\nexport function Example() {\n${state}  return (\n    <div className="ds-core">\n      ${component}\n    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-feedback-detail={name}>
    <div className="connected-preview stack" data-feedback-preview key={revision}>{preview}</div>
    <GalleryControls className="form-detail-controls">
      <label className="field"><span>{name==='Accordion'?'items[0].title':prop}</span><Input aria-label="예제 문구" value={text} onChange={event=>setText(event.target.value)}/></label>
      {isDisclosure&&<label className="field"><span>{name==='Accordion'?'items[0].content':'children'}</span><Textarea aria-label="예제 내용" value={content} onChange={event=>setContent(event.target.value)}/></label>}
      {name==='Accordion'&&<div className="wrap"><Checkbox label="multiple" checked={multiple} onChange={event=>setMultiple(event.target.checked)}/><Checkbox label="사용 제한 항목 disabled" checked={optionDisabled} onChange={event=>setOptionDisabled(event.target.checked)}/></div>}
      {(name==='Toast'||name==='LoadingSpinner')&&<Checkbox label="부모의 미리보기 표시" checked={visible} onChange={event=>setVisible(event.target.checked)}/>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <p className="help" role="status">{message}</p>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 동작과 상태</summary>
      <p>{name==='LoadingSpinner'?'label은 표시 문구와 상태 이름입니다. 작업이 시작되면 표시하고 끝나면 결과 안내로 바꾸세요.':name==='ErrorState'?'message에 실패 원인과 재시도 안내를 적으세요. onRetry에서 다시 요청하고 진행 중에는 로딩 표시로 바꾸세요.':name==='Toast'?'message와 onDismiss를 지정합니다. 닫기 버튼을 누르면 onDismiss를 호출하며 화면에서 메시지를 제거합니다.':name==='Accordion'?'각 항목에 고유한 id·title·content를 지정합니다. multiple을 켜면 여러 항목을 함께 열 수 있습니다. 제목 버튼의 Enter와 Space로 펼치고 접습니다.':'title에 내용을 요약하고 children에 상세 내용을 넣습니다. 제목 버튼의 Enter와 Space로 펼치고 접습니다.'}</p>
      <p>{isDisclosure?'처음에는 모든 내용을 접어서 표시합니다. 제목을 누르면 내용을 펼칩니다. 예제의 초기화 버튼은 접힌 상태로 되돌립니다.':'작업의 진행 상태와 결과에 맞춰 표시할 내용을 갱신하세요. 예제의 상태 버튼으로 로딩과 결과 안내를 비교할 수 있습니다.'}</p>
      {name==='Accordion'&&<p>multiple 변경은 이후의 항목 조작에 적용됩니다. 이미 펼친 항목은 유지합니다. disabled는 제목 버튼의 조작을 막으며 이미 열린 내용을 숨기지는 않습니다.</p>}
      {name==='Collapse'&&<p>여러 Collapse를 함께 배치하면 각각 독립적으로 펼치고 접을 수 있습니다.</p>}
    </GalleryDocs>
  </div>;
}
