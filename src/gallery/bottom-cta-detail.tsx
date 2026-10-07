import React from 'react';
import {BottomCTA,FormField,Input,Checkbox,Select} from '../index';
import {GalleryControls,GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
export function BottomCTADetail(){
 const [title,setTitle]=React.useState('');
 const [count,setCount]=React.useState(2);
 const [busy,setBusy]=React.useState(false);
 const [disabled,setDisabled]=React.useState(false);
 const [safeArea,setSafeArea]=React.useState(true);
 const [accessory,setAccessory]=React.useState('필수 제목을 입력한 뒤 신청하세요.');
 const [message,setMessage]=React.useState('');
 const id=React.useId();
 const actions:React.ComponentProps<typeof BottomCTA>['actions']=count===2?[{children:'취소',onClick:()=>setMessage('취소했습니다. 입력 내용은 유지됩니다.')},{children:'신청하기',type:'submit',form:id,loading:busy,disabled}]:[{children:'신청하기',type:'submit',form:id,loading:busy,disabled}];
 const source=`import {useState,useId} from 'react';\nimport {BottomCTA,FormField} from './src';\nimport './src/core.css';\nexport function Example(){const id=useId();const [title,setTitle]=useState(${JSON.stringify(title)});const [message,setMessage]=useState('');return <div className="ds-core"><form id={id} onSubmit={e=>{e.preventDefault();setMessage('제출: '+title);}}><FormField label="신청 제목" name="title" required value={title} onChange={e=>setTitle(e.currentTarget.value)}/></form><BottomCTA placement="flow" safeArea={${safeArea}} topAccessory={<span>{${JSON.stringify(accessory)}}</span>} actions={[${count===2?"{children:'취소',onClick:()=>setMessage('취소했습니다. 입력 내용은 유지됩니다.')},":''}{children:'신청하기',type:'submit',form:id,loading:${busy},disabled:${disabled}}]}/><p role="status">{message}</p></div>;}`;
 return <section className="connected-detail stack" data-bottom-cta-detail>
  <div data-bottom-cta-preview><form id={id} onSubmit={e=>{e.preventDefault();setMessage('제출: '+title);}}><FormField label="신청 제목" name="title" required value={title} onChange={e=>setTitle(e.currentTarget.value)}/></form><BottomCTA placement="flow" safeArea={safeArea} topAccessory={<span>{accessory}</span>} actions={actions}/><p role="status">{message}</p></div>
  <GalleryControls className="form-detail-controls"><label className="field"><span>actions · 개수</span><Select aria-label="하단 동작 개수 설정" value={count} onChange={e=>setCount(Number(e.currentTarget.value))}><option value={1}>1개</option><option value={2}>2개</option></Select></label><label className="field"><span>topAccessory</span><Input aria-label="하단 안내 설정" value={accessory} onChange={e=>setAccessory(e.currentTarget.value)}/></label><Checkbox label="actions.loading" checked={busy} onChange={e=>setBusy(e.currentTarget.checked)}/><Checkbox label="actions.disabled" checked={disabled} onChange={e=>setDisabled(e.currentTarget.checked)}/><Checkbox label="safeArea" checked={safeArea} onChange={e=>setSafeArea(e.currentTarget.checked)}/></GalleryControls>
  <CodeBlock source={source}/>
  <GalleryDocs><summary>하단 동작 예제</summary><p>이 예제는 flow 배치로 한 개 또는 두 개의 BottomCTA 동작을 비교합니다. FormField는 신청 제출을 연결하기 위한 입력이며 별도의 컴포넌트 상태 시연이 아닙니다. type=submit과 form으로 동일한 폼에 연결합니다. required 검증과 실제 제출 결과를 확인하세요.</p><p>actions의 loading은 확인 실행을 막습니다. 중복 요청은 소비 앱의 제출 로직에서도 관리해야 합니다. safeArea의 기본값은 true이며 topAccessory·bottomAccessory로 관련 안내를 추가할 수 있습니다.</p><p>고정 배치는 BottomCTARegion의 cta 슬롯에 placement=fixed인 BottomCTA를 넣습니다. 실제 높이만큼 본문 공간을 확보하며, 측정할 수 없으면 흐름 배치로 돌아갑니다. 고정 영역 조상에 transform·filter·perspective·contain을 적용하지 말고, 별도 고정 헤더·중첩 스크롤·모바일 키보드 환경은 앱에서 확인하세요.</p></GalleryDocs>
 </section>;
}
