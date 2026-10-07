import {GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
import '../examples.css';
import './playground.css';
import React from 'react';
import {BottomCTA} from '../components/bottom-cta';
import {FormField} from '../components/molecules';
import {Checkbox} from '../components/primitives';
export function BottomCTADetail(){
 const[message,setMessage]=React.useState(''),[busy,setBusy]=React.useState(false);
 return <div className="bottom-cta-detail"><section aria-label="두 개의 하단 동작"><h2>취소 · 제출</h2><form id="bottom-cta-demo" onSubmit={event=>{event.preventDefault();setMessage(`제출: ${new FormData(event.currentTarget).get('title')}`);}}>
  <FormField label="신청 제목" name="title" required/><Checkbox label="제출 처리 중" checked={busy} onChange={event=>setBusy(event.currentTarget.checked)}/>
  <BottomCTA topAccessory={<span>필수 제목을 입력한 뒤 신청하세요.</span>} actions={[{children:'취소',onClick:()=>setMessage('취소했습니다. 입력 내용은 유지됩니다.')},{children:'신청하기',type:'submit',loading:busy}]}/><p role="status">{message}</p>
 </form></section><section aria-label="한 개의 하단 동작"><h2>단일 동작</h2><BottomCTA safeArea={false} actions={[{children:'다음 단계',onClick:()=>setMessage('다음 단계 예시를 선택했습니다.')} ]}/></section>
 <section aria-label="고정 배치 예시"><h2>고정 배치</h2><iframe title="고정 하단 작업 독립 예시" src="/browser/fixtures/bottom-cta.html" className="example-cta-frame"/></section>
 <GalleryDocs><summary>사용 코드</summary><CodeBlock source={`import { BottomCTA, BottomCTARegion } from './src/index';\nimport './src/core.css';\nimport './src/examples.css';\n\n<BottomCTARegion cta={<BottomCTA placement="fixed" actions={[\n  { children: '취소', onClick: cancel },\n  { children: '신청', type: 'submit', form: 'apply' },\n]}/>}>\n  <form id="apply" onSubmit={submit}>…</form>\n</BottomCTARegion>`}/></GalleryDocs>
 <GalleryDocs><summary>API · 조합 · 접근성</summary><ul><li>actions는 한 개 또는 두 개의 버튼 설정입니다. children에 버튼 문구를 넣고 type·form·variant·name·value·disabled·loading을 지정할 수 있습니다. 기본 type은 button입니다. 두 버튼을 함께 쓰면 기본적으로 보조 작업과 주요 작업을 구분합니다.</li><li>placement의 기본값은 flow입니다. 화면 아래에 고정하려면 BottomCTARegion의 cta에 placement=fixed인 BottomCTA를 넣으세요. 본문 아래 공간을 버튼의 실제 높이에 맞춰 확보합니다. safeArea의 기본값은 true입니다.</li><li>topAccessory와 bottomAccessory에 버튼 전후의 안내를 넣을 수 있습니다. label로 버튼 그룹의 이름을 지정하세요. 처리 결과는 본문이나 별도 상태 메시지로 알려주세요.</li><li>높이를 측정할 수 없는 환경에서는 본문 흐름 안에 배치합니다. 한 화면에는 고정 CTA를 하나만 두고, 고정 영역의 조상에 transform·filter·perspective·contain을 적용하지 마세요. 별도의 고정 헤더나 중첩 스크롤이 있으면 입력이 가려지지 않는지 확인하세요.</li><li>고정 영역은 기본적으로 화면 높이의 50dvh 안에서 스크롤합니다. --ds-bottom-cta-max-height로 높이를 조정할 수 있습니다. 넓은 화면의 내부 최대 너비는 1200px입니다. 모바일 키보드를 열었을 때도 입력과 마지막 버튼이 보이는지 확인하세요.</li><li>loading은 버튼 클릭을 막습니다. 저장 요청의 중복 처리는 제출 로직에서도 관리하세요. 별도 폼을 제출하려면 type=submit과 form의 id를 연결합니다. FormData에 제출 버튼의 name·value가 필요하면 해당 버튼을 함께 전달하세요.</li></ul></GalleryDocs></div>;
}
