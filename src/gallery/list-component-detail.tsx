import React from 'react';
import {ListRow,ListHeader,ListFooter,List,Button,Input,Checkbox} from '../index';
import {GalleryControls,GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';

type Name='ListRow'|'ListHeader'|'ListFooter';
export function ListComponentDetail({name}:{name:Name}) {
 const [title,setTitle]=React.useState('검토 목록');
 const [description,setDescription]=React.useState('항목의 상태와 다음 동작을 확인하세요.');
 const [selected,setSelected]=React.useState(false);
 const [disabled,setDisabled]=React.useState(false);
 const [showAction,setShowAction]=React.useState(true);
 const [showSelection,setShowSelection]=React.useState(true);
 const [count,setCount]=React.useState('2');
 const [message,setMessage]=React.useState('');
 const action=()=>setMessage('관련 동작을 실행했습니다.');
 const literal=JSON.stringify;
 const preview=name==='ListRow'?<List label="ListRow를 담는 목록"><ListRow title={title} description={description} selected={selected} disabled={disabled} onSelectionChange={showSelection?setSelected:undefined} trailing={<span>오늘</span>} action={showAction?{label:'항목 열기',onClick:action}:undefined}/></List>:name==='ListHeader'?<ListHeader title={title} description={description} actions={showAction?<Button onClick={action}>항목 추가</Button>:undefined}><p>목록 검색 도구를 넣을 수 있는 children 영역입니다.</p></ListHeader>:<ListFooter actions={showAction?<Button onClick={action}>선택 완료</Button>:undefined}><span>{count}개 선택</span></ListFooter>;
 const component=name==='ListRow'?`<List label="ListRow를 담는 목록"><ListRow title={${literal(title)}} description={${literal(description)}} selected={selected} disabled={${disabled}}${showSelection?' onSelectionChange={setSelected}':''} trailing={<span>오늘</span>}${showAction?' action={{label:"항목 열기",onClick:action}}':''}/></List>`:name==='ListHeader'?`<ListHeader title={${literal(title)}} description={${literal(description)}}${showAction?' actions={<Button onClick={action}>항목 추가</Button>}':''}><p>목록 검색 도구를 넣을 수 있는 children 영역입니다.</p></ListHeader>`:`<ListFooter${showAction?' actions={<Button onClick={action}>선택 완료</Button>}':''}><span>{${literal(count)}}개 선택</span></ListFooter>`;
 const source=`import {useState} from 'react';\nimport {${name}${name==='ListRow'?', List':''}${showAction&&name!=='ListRow'?', Button':''}} from './src';\nimport './src/core.css';\nexport function Example(){\n${name==='ListRow'?`const [selected${showSelection?',setSelected':''}]=useState(${selected});\n`:''}const [message,setMessage]=useState('');\n${showAction?"const action=()=>setMessage('관련 동작을 실행했습니다.');\n":''}return <div className="ds-core">${component}<p role="status">{message}</p></div>;\n}`;
 return <section className="connected-detail stack" data-list-detail={name}>
  <div data-list-preview>{preview}<p role="status">{message}</p></div>
  <GalleryControls className="form-detail-controls">
   {name!=='ListFooter'&&<><label className="field"><span>title</span><Input aria-label="목록 제목 설정" value={title} onChange={e=>setTitle(e.currentTarget.value)}/></label><label className="field"><span>description</span><Input aria-label="목록 설명 설정" value={description} onChange={e=>setDescription(e.currentTarget.value)}/></label></>}
   {name==='ListFooter'&&<label className="field"><span>children · 선택 수 문구</span><Input aria-label="선택 수 문구 설정" value={count} onChange={e=>setCount(e.currentTarget.value)}/></label>}
   <Checkbox label={name==='ListRow'?'action 전달':'actions 전달'} checked={showAction} onChange={e=>setShowAction(e.currentTarget.checked)}/>
   {name==='ListRow'&&<><Checkbox label="selected" checked={selected} onChange={e=>setSelected(e.currentTarget.checked)}/><Checkbox label="disabled" checked={disabled} onChange={e=>setDisabled(e.currentTarget.checked)}/><Checkbox label="onSelectionChange 전달" checked={showSelection} onChange={e=>setShowSelection(e.currentTarget.checked)}/></>}
  </GalleryControls>
  <CodeBlock source={source}/>
  <GalleryDocs><summary>예제 구성</summary><p>{name==='ListRow'?'ListRow는 ul 안에 배치하는 항목입니다. 이 예제의 List는 올바른 목록 구조를 제공하며, selected와 action은 서로 독립적으로 동작합니다. onSelectionChange를 생략하면 선택 체크박스를 표시하지 않습니다.':name==='ListHeader'?'ListHeader에 목록 제목·설명과 관련 actions를 넣습니다. children에는 해당 목록의 검색 도구나 안내를 배치할 수 있습니다. 이 페이지에서는 목록 전체 기능을 함께 시연하지 않습니다.':'ListFooter의 children에는 선택 수나 부가 설명을, actions에는 목록에 대한 다음 동작을 넣습니다. 선택 수는 소비 앱이 계산한 문구이며 ListFooter가 선택을 관리하지 않습니다.'}</p><p>슬롯의 버튼은 독립적인 동작입니다. 전체 예제 초기화로 설정과 동작 결과를 되돌릴 수 있습니다.</p></GalleryDocs>
 </section>;
}
