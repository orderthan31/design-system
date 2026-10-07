import {GalleryDocs} from './workbench';
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
  <GalleryDocs><summary>사용 코드</summary><CodeBlock source={`import { useState } from 'react';
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
}`}/></GalleryDocs>
  <GalleryDocs><summary>속성과 조합</summary><ul>
   <li>label과 options는 필수입니다. 옵션에는 고유한 value·label과 선택적 disabled를 넣습니다.</li>
   <li>value/onValueChange로 선택을 관리하거나 defaultValue로 초기값을 지정하세요. 초기값을 생략하면 선택하지 않은 상태로 시작합니다.</li>
   <li>name·id·form으로 그룹과 폼을 연결할 수 있습니다. name을 생략하면 고유한 그룹 이름을 사용하며 정해진 제출 필드가 필요하면 name을 지정하세요.</li>
   <li>disabled와 required의 기본값은 false입니다. description·error·aria-describedby를 지정할 수 있습니다. className은 fieldset에 적용됩니다.</li>
   <li>선택값으로 필터나 표시 방식을 바꾸려면 onValueChange를 연결하세요. 콘텐츠 패널을 전환하는 화면에는 Tabs를 선택하세요.</li>
  </ul></GalleryDocs>
  <GalleryDocs><summary>접근성과 폼</summary><ul>
   <li>Tab으로 그룹에 들어가 방향키와 Space로 선택합니다. label은 그룹의 접근 가능한 이름입니다.</li>
   <li>required로 필수 선택을 지정하고 description과 error로 필요한 안내를 제공합니다.</li>
   <li>비활성 옵션과 disabled인 그룹은 조작과 제출에서 제외합니다. 필수 선택을 받을 때는 선택 가능한 옵션을 제공하세요.</li>
   <li>사용 중 제어형과 비제어형을 바꾸지 마세요. 제어 폼을 초기화할 때는 앱의 value를 갱신합니다. defaultValue는 비제어 초기값으로 사용합니다.</li>
   <li>선택 상태와 키보드 초점이 모두 보이도록 구성하세요. 색만으로 선택을 구분하지 마세요.</li>
  </ul></GalleryDocs>
 </div>;
}
