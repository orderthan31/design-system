import {CodeBlock} from './code-block';
import './playground.css';
import React from 'react';
import {SegmentedControl} from '../components/segmented-control';
import {Button} from '../components/atoms';
const scopes=[{value:'all',label:'전체'},{value:'ready',label:'준비 완료'},{value:'draft',label:'초안'},{value:'archive',label:'보관',disabled:true}];
const modes=[{value:'compact',label:'간단히'},{value:'detail',label:'자세히'}];
const items=[{name:'문서 정리',state:'ready'},{name:'화면 검토',state:'ready'},{name:'초안 작성',state:'draft'}];
export function SegmentedDetail(){
 const [scope,setScope]=React.useState('all');const [submitted,setSubmitted]=React.useState('');const [error,setError]=React.useState('');
 const rows=items.filter(item=>scope==='all'||item.state===scope);
 return <div className="ds-segmented-detail">
  <section aria-label="선택과 목록"><h2>목록 필터</h2>
   <SegmentedControl label="검토 범위" options={scopes} value={scope} onValueChange={setScope}/>
   <ul aria-label="범위별 항목">{rows.map(item=><li key={item.name}>{item.name}</li>)}</ul>
   <p role="status" aria-label="필터 결과">{rows.length}개 항목</p>
  </section>
  <section aria-label="선택 상태"><h2>상태</h2>
   <SegmentedControl label="비활성 범위" name="disabled-scope" options={scopes} defaultValue="ready" disabled/>
   <SegmentedControl label="긴 선택 항목" options={[{value:'desktop',label:'PC 작업 공간 전체 보기'},{value:'mobile',label:'모바일 작업 공간 간단히 보기'}]} defaultValue="desktop"/>
  </section>
  <section aria-label="폼 선택"><h2>필수 선택</h2>
   <form aria-label="네이티브 제출 예시" onInvalid={()=>setError('표시 방식을 선택해 주세요.')} onSubmit={event=>{event.preventDefault();const mode=new FormData(event.currentTarget).get('display');setSubmitted(mode==='detail'?'자세히':'간단히');setError('');}} onReset={()=>{setSubmitted('');setError('');}}>
    <SegmentedControl label="표시 방식" name="display" options={modes} required description="제출 전에 표시 방식을 선택해 주세요." error={error} onValueChange={()=>{setError('');setSubmitted('');}}/>
    <div><Button type="submit">선택 제출</Button> <Button type="reset" variant="secondary">선택 초기화</Button></div>
    <p role="status" aria-label="제출 결과">{submitted?`제출한 표시 방식: ${submitted}`:'아직 제출 전'}</p>
   </form>
  </section>
  <details><summary>사용 코드</summary><CodeBlock source={`import { useState } from 'react';
import { SegmentedControl } from './src/index';
import './src/core.css';

export function Example() {
  const [scope, setScope] = useState('all');
  return <div className="ds-core">
    <SegmentedControl label="검토 범위" name="scope"
      options={[{ value: 'all', label: '전체' },
        { value: 'ready', label: '준비 완료' }]}
      value={scope} onValueChange={setScope} />
  </div>;
}`}/></details>
  <details><summary>속성과 조합</summary><ul>
   <li><code>label: string</code>, <code>options: readonly SegmentedOption[]</code>는 필수입니다. 옵션은 고유한 value, 문자열 label, 선택적 disabled를 가집니다.</li>
   <li><code>value?: string</code>는 제어 값, <code>defaultValue?: string</code>는 비제어 초기 값입니다. 기본 선택은 없습니다. onValueChange(value, native change event)에서 소유자가 value 갱신을 거절할 수 있습니다.</li>
   <li>name/id/form은 네이티브 그룹·폼 연결입니다. name 생략 시 그룹별 고유 이름을 생성합니다. 안정적인 FormData 필드명을 원하면 name을 지정하세요. id/name은 폼마다 충돌하지 않도록 지정하세요.</li>
   <li>disabled/required 기본값은 false, description/error/외부 aria-describedby 기본값은 undefined입니다. className은 fieldset에 적용됩니다.</li>
   <li>native fieldset·legend·radio·label 조합이며 panel을 소유하는 Tabs가 아닙니다. 콘텐츠 필터와 서버 동작은 소유자 책임입니다.</li>
  </ul></details>
  <details><summary>접근성과 폼</summary><ul>
   <li>Tab으로 그룹에 진입하고 방향키/Space로 선택합니다. 네이티브 라디오의 방향키 선택 계약을 유지하며 한국어 label이 접근 가능한 이름입니다.</li>
   <li>필수 표시·도움말·오류를 유지하고 오류는 alert로 안내합니다. required/checkValidity/FormData와 비제어 form reset은 브라우저가 처리합니다.</li>
   <li>비활성 옵션 및 disabled fieldset은 입력·제출에서 제외됩니다. 빈 옵션 목록에 required를 지정해도 존재하지 않는 입력을 검증할 수는 없으므로 필요한 옵션을 소유자가 제공해야 합니다.</li>
   <li>제어/비제어 모드를 실행 중 전환하지 마세요. 제어 폼 초기화는 소유자가 value도 초기화해야 합니다. 비제어 defaultValue는 초기 값으로 사용하세요.</li>
   <li>공통 스타일은 .ds-core 아래에서만 적용됩니다. 색만으로 선택을 구분하지 않고 native checked semantics와 focus 표시를 유지합니다.</li>
  </ul></details>
 </div>;
}
