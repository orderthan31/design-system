import React from 'react';
import { Button, Input } from '../components/atoms';
import { Badge, Checkbox, Select } from '../components/primitives';
import { TextField } from '../components/text-field';
import { RadioGroup, Switch } from '../components/form-controls';
import { Tabs } from '../components/navigation';
import { SegmentedControl } from '../components/segmented-control';
import { Icon } from '../components/icons';

// Real public components, not CSS-only state replicas. Hover, press and keyboard focus are interactive.
export function CommonControlsComparison() {
  const [segment,setSegment]=React.useState('all');
  const options=[{value:'all',label:'전체'},{value:'active',label:'진행 중'},{value:'held',label:'보류',disabled:true}];
  return <section className="common-controls-comparison stack" aria-label="공통 컨트롤 상태 비교">
    <h2>상태 비교</h2>
    <p className="help">포인터를 올리거나 누르고, Tab 키로 포커스를 확인하세요.</p>
    <div className="common-controls-grid">
      <section className="stack"><h3>Button</h3><div className="wrap"><Button><Icon name="plus"/>추가</Button><Button variant="secondary">보조 동작</Button><Button variant="ghost">더 보기</Button></div><div className="wrap"><Button disabled>사용 불가</Button><Button loading>저장 중</Button><Button variant="destructive">삭제</Button></div></section>
      <section className="stack"><h3>Input / TextField</h3><Input aria-label="기본 입력" placeholder="이름 입력"/><TextField label="검색" prefix={<Icon name="search"/>} placeholder="검색어 입력" clearable/><Input aria-label="비활성 입력" disabled placeholder="사용 불가"/><TextField label="이메일" defaultValue="invalid" error="이메일 형식을 확인하세요."/></section>
      <section className="stack"><h3>Select</h3><Select aria-label="목록 정렬" defaultValue="recent"><option value="recent">최근순</option><option value="name">이름순</option></Select><Select aria-label="비활성 정렬" disabled><option>사용 불가</option></Select><Select aria-label="오류 정렬" aria-invalid="true"><option>선택을 확인하세요.</option></Select></section>
      <section className="stack"><h3>Checkbox / Radio</h3><Checkbox label="알림 받기" defaultChecked/><Checkbox label="사용 불가" disabled defaultChecked/><RadioGroup label="표시 범위" defaultValue="all" options={options}/></section>
      <section className="stack"><h3>Switch</h3><Switch label="자동 저장" defaultChecked/><Switch label="알림"/><Switch label="사용 불가" disabled defaultChecked/></section>
      <section className="stack"><h3>Badge</h3><div className="wrap"><Badge tone="neutral">기본</Badge><Badge tone="running">진행 중</Badge><Badge tone="success">완료</Badge><Badge tone="error">오류</Badge></div></section>
      <section className="stack"><h3>Tabs</h3><Tabs label="상태 비교 탭" items={[{label:'전체',content:'전체 항목'},{label:'진행 중',content:'진행 중인 항목'}]}/></section>
      <section className="stack"><h3>SegmentedControl</h3><SegmentedControl label="목록 범위" options={options} value={segment} onValueChange={setSegment}/><p className="help" role="status">{options.find(option=>option.value===segment)?.label}</p><SegmentedControl label="사용 불가" options={options} defaultValue="all" disabled/></section>
    </div>
  </section>;
}
