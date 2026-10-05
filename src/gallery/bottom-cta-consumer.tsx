import React from 'react';
import {createRoot} from 'react-dom/client';
import {BottomCTA,BottomCTARegion,Button,FormField,Dialog} from '../index';
import '../core.css';
function Consumer(){
 const[expanded,setExpanded]=React.useState(false),[busy,setBusy]=React.useState(false),[message,setMessage]=React.useState(''),[open,setOpen]=React.useState(false);
 const bounded=new URLSearchParams(location.search).has('bounded');
 return <div className="ds-core"><BottomCTARegion style={bounded?{height:'100dvh'}:undefined} cta={<BottomCTA placement="fixed" topAccessory={expanded?<p>긴 안내를 추가해도 마지막 입력과 본문은 고정 작업 영역 위에 남아야 합니다. 입력 내용은 그대로 유지됩니다. 긴 한국어 안내가 여러 줄로 표시되는 예시입니다.</p>:undefined} bottomAccessory={<span>입력 내용을 확인한 뒤 제출하세요.</span>} actions={[{children:'취소',onClick:()=>setMessage('취소했습니다. 입력 내용은 유지됩니다.')},{children:'신청 제출',type:'submit',form:'cta-form',loading:busy}]}/> }>
  <main><h1>고정 하단 작업</h1><form id="cta-form" onSubmit={event=>{event.preventDefault();setMessage(`제출: ${new FormData(event.currentTarget).get('title')}`);}}>
   <FormField label="신청 제목" name="title" required defaultValue="초안"/>
   <Button onClick={()=>setExpanded(value=>!value)}>안내 길이 변경</Button><Button onClick={()=>setBusy(value=>!value)}>제출 처리 상태 변경</Button><Button onClick={()=>setOpen(true)}>모달 열기</Button>
   {Array.from({length:35},(_,index)=><p key={index}>본문 항목 {index+1} · 스크롤해도 하단 동작은 화면에 유지됩니다.</p>)}
   <FormField label="마지막 입력" name="last" defaultValue="끝"/><p data-last-content>마지막 본문</p><div role="status">{message}</div>
  </form></main>
 </BottomCTARegion><Dialog title="겹침 확인" open={open} onClose={()=>setOpen(false)}><Button onClick={()=>setOpen(false)}>모달 닫기</Button></Dialog></div>;
}
createRoot(document.getElementById('root')!).render(<Consumer/>);
