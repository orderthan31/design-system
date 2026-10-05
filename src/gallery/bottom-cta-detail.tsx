import {CodeBlock} from './code-block';
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
 <section aria-label="고정 배치 예시"><h2>고정 배치</h2><iframe title="고정 하단 작업 독립 예시" src="/browser/fixtures/bottom-cta.html" style={{width:'100%',height:480,border:'1px solid var(--color-border-control)'}}/></section>
 <details><summary>사용 코드</summary><CodeBlock source={`import { BottomCTA, BottomCTARegion } from './src/index';\nimport './src/core.css';\n\n<BottomCTARegion cta={<BottomCTA placement="fixed" actions={[\n  { children: '취소', onClick: cancel },\n  { children: '신청', type: 'submit', form: 'apply' },\n]}/>}>\n  <form id="apply" onSubmit={submit}>…</form>\n</BottomCTARegion>`}/></details>
 <details><summary>API · 조합 · 접근성</summary><ul><li>BottomCTAAction은 ButtonProps와 표시할 children을 받습니다. actions는 한 개 또는 두 개이며 Double은 기본 secondary/primary입니다. type 기본값은 button입니다. 명시한 type/form/variant/name/value와 액션별 disabled/loading을 유지합니다.</li><li>placement 기본 flow. fixed는 BottomCTARegion의 cta 슬롯에서만 사용합니다. 실제 높이를 측정해 본문 끝에 예약하고 가려진 내부 입력은 소유 스크롤 경로로 보정합니다. safeArea 기본 true이며 CSS env inset을 포함한 실제 높이를 한 번 예약합니다.</li><li>topAccessory/bottomAccessory/className/label과 Region children/cta/className/style을 제공합니다. Button·ActionGroup·Container를 재사용하며 CTA 자체는 live region이 아닙니다. 결과 안내와 서버 저장·중복 제출 방지는 소유자가 담당합니다.</li><li>서버/첫 측정 이전 또는 ResizeObserver 미지원·border-box 관찰 요청 거부이면 flow입니다. 한 viewport에 활성 fixed CTA 하나를 사용하고 transform/filter/perspective/contain 조상을 두지 마세요. Region 밖/임의 중첩 스크롤/고정 헤더는 자동 보호 범위가 아닙니다.</li><li>고정 영역은 기본 최대50dvh 내부 스크롤입니다. --ds-bottom-cta-max-height로 조정할 수 있습니다. PC 내부 최대1200px이고 비대칭 sidebar 정렬은 소유자 책임입니다. 키보드 위 고정·SDK safe-area·스크롤 숨김/지연 애니메이션은 제공하지 않습니다.</li><li>처리 중은 해당 Button 클릭 제출을 막지만 requestSubmit 등 외부 호출 전체를 막지 않습니다. 외부 form은 form id를 명시하고 submitter 필드가 필요하면 소유자가 FormData에 포함하세요.</li></ul></details></div>;
}
