import React from 'react';
import {Dialog,BottomSheet,Confirm,Button,Input,Textarea,Checkbox} from '../index';
import {GalleryControls,GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';

type Kind='bottom-sheet'|'dialog'|'confirm';
export function ModalComponentDetail({kind}:{kind:Kind}) {
 const name=kind==='bottom-sheet'?'BottomSheet':kind==='confirm'?'Confirm':'Dialog';
 const [open,setOpen]=React.useState(false);
 const [title,setTitle]=React.useState(kind==='confirm'?'변경 사항을 적용할까요?':'내용 확인');
 const [body,setBody]=React.useState('현재 화면의 내용을 확인한 뒤 닫아 주세요.');
 const [footer,setFooter]=React.useState(true);
 const [loading,setLoading]=React.useState(false);
 const [message,setMessage]=React.useState('');
 const close=()=>setOpen(false);
 const confirm=()=>{setMessage('변경 사항을 확인했습니다. 실제 데이터는 변경하지 않습니다.');setOpen(false);};
 const Surface=kind==='bottom-sheet'?BottomSheet:Dialog;
 const props={open,title,onClose:close,children:<p>{body}</p>};
 const source=`import {useState} from 'react';\nimport {${name}, Button} from './src';\nimport './src/core.css';\nexport function Example(){\nconst [open,setOpen]=useState(${open});\nconst [message,setMessage]=useState('');\nconst close=()=>setOpen(false);\n${kind==='confirm'?"const confirm=()=>{setMessage('변경 사항을 확인했습니다. 실제 데이터는 변경하지 않습니다.');setOpen(false);};\n":''}return <div className="ds-core"><Button onClick={()=>setOpen(true)}>${name} 열기</Button><${name} open={open} title={${JSON.stringify(title)}} onClose={close}${kind==='confirm'?` onConfirm={confirm} loading={${loading}}`:footer?' footer={<Button variant="secondary" onClick={close}>닫기</Button>}':''}><p>{${JSON.stringify(body)}}</p></${name}><p role="status">{message}</p></div>;\n}`;
 return <section className="connected-detail stack" data-overlay-detail={name}>
  <div data-overlay-preview><Button onClick={()=>setOpen(true)}>{name} 열기</Button><p role="status">{message}</p>{kind==='confirm'?<Confirm {...props} onConfirm={confirm} loading={loading}/>:<Surface {...props} footer={footer?<Button variant="secondary" onClick={close}>닫기</Button>:undefined}/>}</div>
  <GalleryControls className="form-detail-controls">
   <label className="field"><span>title</span><Input aria-label="대화상자 제목 설정" value={title} onChange={e=>setTitle(e.currentTarget.value)}/></label>
   <label className="field"><span>children · 본문</span><Textarea aria-label="대화상자 본문 설정" value={body} onChange={e=>setBody(e.currentTarget.value)}/></label>
   {kind==='confirm'?<Checkbox label="loading" checked={loading} onChange={e=>setLoading(e.currentTarget.checked)}/>:<Checkbox label="footer 전달" checked={footer} onChange={e=>setFooter(e.currentTarget.checked)}/>}
  </GalleryControls>
  <CodeBlock source={source}/>
  <GalleryDocs><summary>예제 사용</summary><p>{kind==='bottom-sheet'?'이 페이지는 화면 폭과 무관하게 실제 BottomSheet를 엽니다. 다른 모달로 바꾸는 반응형 앱 정책은 포함하지 않습니다.':kind==='confirm'?'Confirm은 실행 여부를 묻습니다. onConfirm에서 성공한 뒤 open을 false로 바꾸세요. loading은 확인 실행을 막지만 취소·닫기는 유지합니다.':'Dialog의 title과 children에 현재 작업 내용을 넣고 footer에는 관련 다음 동작을 배치합니다.'}</p><p>open과 onClose는 소비 앱이 연결합니다. 닫기·Escape·배경 클릭 시 onClose에서 open을 false로 갱신하세요. 닫으면 열기 버튼으로 초점이 돌아갑니다. 긴 본문은 내용 영역에서 스크롤하며, 입력이 필요하면 라벨과 오류를 함께 연결하세요.</p></GalleryDocs>
 </section>;
}
