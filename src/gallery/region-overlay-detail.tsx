import {GalleryDocs,GalleryControls} from './workbench';
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
    <GalleryControls className="form-detail-controls">
      {!isDrawer&&<label className="field"><span>label</span><Input aria-label="Popover label control" value={label} onChange={event=>setLabel(event.target.value)}/></label>}
      <label className="field"><span>title</span><Input aria-label="overlay title control" value={title} onChange={event=>setTitle(event.target.value)}/></label>
      <label className="field"><span>children · 본문 텍스트</span><Input aria-label="overlay children control" value={body} onChange={event=>setBody(event.target.value)}/></label>
      {isDrawer&&<><div className="wrap"><Checkbox label="open" checked={open} onChange={event=>setOpen(event.target.checked)}/><Checkbox label="footer" checked={footer} onChange={event=>setFooter(event.target.checked)}/></div><label className="field"><span>footer · 버튼 label</span><Input aria-label="Drawer footer label control" value={footerLabel} onChange={event=>setFooterLabel(event.target.value)}/></label></>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 열림과 닫기</summary>{isDrawer?<><p>open·title·children·onClose를 전달합니다. footer에는 작업 버튼을 넣을 수 있습니다. onClose에서 open을 false로 갱신하면 대화상자를 닫습니다.</p><p>Drawer는 오른쪽에서 펼치고 작은 화면에서는 화면 너비를 사용합니다. 닫기 버튼·Escape·배경 클릭으로 닫기를 요청합니다. 닫을 때 열기 버튼으로 초점을 돌려줍니다.</p></>:<><p>Popover의 label·title·children은 필수입니다. 버튼으로 열고 닫으며 외부를 누르거나 Escape를 누르면 버튼으로 초점을 돌려줍니다.</p><p>Popover는 모달이 아니므로 펼친 상태에서도 주변 내용을 사용할 수 있습니다. 패널은 버튼 가까이에 배치하며 긴 내용은 내부에서 스크롤합니다. 화면 가장자리와 잘림이 있는 조상 요소에서 위치를 확인하세요.</p></>}<p>예제의 초기화 버튼으로 열림 상태와 내용을 시작 상태로 되돌릴 수 있습니다.</p></GalleryDocs>
  </div>;
}
