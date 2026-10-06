import React from 'react';
import { Drawer, Popover } from '../components/navigation-regions';
import { Button, Input } from '../components/atoms';
import { Checkbox } from '../components/primitives';
import { CodeBlock } from './code-block';

export const regionOverlayDetailNames=['Drawer','Popover'] as const;
export type RegionOverlayDetailName=typeof regionOverlayDetailNames[number];
export function hasRegionOverlayDetail(name:string):name is RegionOverlayDetailName{return (regionOverlayDetailNames as readonly string[]).includes(name);}
export function RegionOverlayDetail({name}:{name:RegionOverlayDetailName}) {
  const isDrawer=name==='Drawer';
  const [open,setOpen]=React.useState(false),[label,setLabel]=React.useState('안내 보기'),[title,setTitle]=React.useState('추가 안내'),[body,setBody]=React.useState('현재 화면의 안내를 확인하세요.'),[footer,setFooter]=React.useState(true),[footerLabel,setFooterLabel]=React.useState('닫기'),[status,setStatus]=React.useState('아직 확인 전'),[revision,setRevision]=React.useState(0);
  const close=()=>setOpen(false);
  const reset=()=>{close();setLabel('안내 보기');setTitle('추가 안내');setBody('현재 화면의 안내를 확인하세요.');setFooter(true);setFooterLabel('닫기');setStatus('아직 확인 전');setRevision(n=>n+1);};
  const children=<><p>{body}</p>{!isDrawer&&<Button variant="secondary" onClick={()=>setStatus('본문 확인')}>내용 확인</Button>}</>;
  const source=`import { useState } from 'react';\nimport { ${name}, Button } from './src';\nimport './src/core.css';\n\nexport function Example() {\n${isDrawer?`  const [open, setOpen] = useState(${open});\n  const close = () => setOpen(false);\n`:`  const [status, setStatus] = useState(${JSON.stringify(status)});\n`}  return (\n    <div className="ds-core">\n${isDrawer?`      <Button onClick={() => setOpen(true)}>Drawer 열기</Button>\n      <p>open: {String(open)}</p>\n      <Drawer open={open} title={${JSON.stringify(title)}} onClose={close}${footer?` footer={<Button variant="secondary" onClick={close}>{${JSON.stringify(footerLabel)}}</Button>}`:''}>\n        <p>{${JSON.stringify(body)}}</p>\n      </Drawer>`:`      <div style={{ maxWidth: 320 }}>\n      <Popover label={${JSON.stringify(label)}} title={${JSON.stringify(title)}}>\n        <p>{${JSON.stringify(body)}}</p>\n        <Button variant="secondary" onClick={() => setStatus('본문 확인')}>내용 확인</Button>\n      </Popover>\n      </div>\n      <p role="status">{status}</p>`}\n    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-region-overlay-detail={name}>
    <div data-region-overlay-preview key={revision}>{isDrawer?<><Button onClick={()=>setOpen(true)}>Drawer 열기</Button><p className="help" data-region-overlay-state>open: {String(open)}</p><Drawer open={open} title={title} onClose={close} footer={footer?<Button variant="secondary" onClick={close}>{footerLabel}</Button>:undefined}>{children}</Drawer></>:<><div style={{maxWidth:320}}><Popover label={label} title={title}>{children}</Popover></div><p role="status" className="help">{status}</p></>}</div>
    <div className="form-detail-controls">
      {!isDrawer&&<label className="field"><span>label</span><Input aria-label="Popover label control" value={label} onChange={event=>setLabel(event.target.value)}/></label>}
      <label className="field"><span>title</span><Input aria-label="overlay title control" value={title} onChange={event=>setTitle(event.target.value)}/></label>
      <label className="field"><span>children · 본문 텍스트</span><Input aria-label="overlay children control" value={body} onChange={event=>setBody(event.target.value)}/></label>
      {isDrawer&&<><div className="wrap"><Checkbox label="open" checked={open} onChange={event=>setOpen(event.target.checked)}/><Checkbox label="footer" checked={footer} onChange={event=>setFooter(event.target.checked)}/></div><label className="field"><span>footer · 버튼 label</span><Input aria-label="Drawer footer label control" value={footerLabel} onChange={event=>setFooterLabel(event.target.value)}/></label></>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </div>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 열림과 닫기</summary>{isDrawer?<><p>open/title/children/onClose는 필수이며 footer는 선택적 ReactNode입니다. open은 호출자 소유이고 onClose는 닫기 요청입니다. 이 예제는 요청을 받으면 부모 setOpen(false)로 반영합니다. open=false면 wrapper와 내용이 언마운트됩니다.</p><p>기존 native Dialog를 재사용합니다. 기본 닫기 버튼·Escape·native cancel·backdrop에서 닫기를 요청하며, 기본 첫 focus는 헤더 닫기 버튼입니다. Tab 경계와 최상위 modal 소유권·닫은 뒤 opener focus·공유 scroll lock은 기존 Dialog 계약입니다. descendant가 처리한 Escape는 존중합니다. 오른쪽 Drawer이며 모바일은 화면 너비를 사용합니다. placement/width/portal/router prop은 없습니다.</p></>:<><p>label/title/children이 모두 필수입니다. 열림은 내부 state이며 open/defaultOpen/onClose/onOpenChange prop은 없습니다. trigger가 열림을 토글하고 외부 pointerdown 또는 미처리 Escape로 닫힐 때 trigger에 focus를 반환합니다.</p><p>본문의 내용 확인은 부모의 로컬 status만 바꿉니다. 본문 클릭이나 Tab-out은 자체적으로 닫지 않으며 focus trap·모달 scroll lock이 없습니다. 예제는 너비를 제한한 소비자 컨테이너 안에 놓았습니다. 패널은 inline absolute로 배치하며 자체 스크롤을 사용합니다. portal/collision/flip/placement API나 viewport 충돌 해결을 약속하지 않습니다.</p></>}<p>초기화는 예제 props·부모 state를 되돌리고 미리보기를 다시 마운트합니다. 서버 저장·외부 전송·router 연결은 하지 않습니다.</p></details>
  </div>;
}
