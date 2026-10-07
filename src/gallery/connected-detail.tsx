import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { Container, Grid } from '../components/layout';
import { DatePicker, DateRangePicker, type DateRangeValue } from '../components/date-controls';
import { DataTable, type DataColumn } from '../components/data-display';
import { Checkbox, Select } from '../components/primitives';
import { Button } from '../components/atoms';
import { CodeBlock } from './code-block';

export const connectedDetailNames=['Container','Grid','DatePicker','DateRangePicker','DataTable'] as const;
export type ConnectedDetailName=typeof connectedDetailNames[number];
export function hasConnectedDetail(name:string):name is ConnectedDetailName {return (connectedDetailNames as readonly string[]).includes(name);}
function LayoutDetail({name}:{name:'Container'|'Grid'}) {
  const [narrow,setNarrow]=React.useState(false);
  const [gap,setGap]=React.useState(16);
  const description=name==='Container'?'콘텐츠를 가운데 정렬하고 기본 최대 너비를 1200px로 제한합니다. 좁은 화면에서는 부모 너비에 맞춰 줄어듭니다.':'가용 너비에 따라 열 수가 바뀌는 격자입니다. 기본 최소 항목 너비는 280px이며, 그보다 좁아지면 한 열로 배치합니다.';
  const items=['요약','최근 활동','다음 작업'];
  const children=items.map(item=><div className="layout-detail-item" key={item}>{item}</div>);
  const source=name==='Container'?`import { Container } from './src';\nimport './src/core.css';\n\n<div className="ds-core">\n  <Container style={{ maxWidth: ${narrow?"'480px'":"'1200px'"} }}>\n    <p>부모 너비에 맞춰 줄어드는 콘텐츠</p>\n  </Container>\n</div>`:`import { Grid } from './src';\nimport './src/core.css';\n\n<div className="ds-core">\n  <Grid style={{ gap: ${gap} }}>\n    ${items.map(item=>`<div>${item}</div>`).join('\n    ')}\n  </Grid>\n</div>`;
  return <div className="connected-detail stack" data-connected-detail={name}><p>{description}</p>
    <div className="wrap">{name==='Container'?<Checkbox label="maxWidth를 480px로 변경" checked={narrow} onChange={event=>setNarrow(event.target.checked)}/>:<label className="inline-label">간격 (style.gap)<Select aria-label="격자 간격" value={gap} onChange={event=>setGap(Number(event.target.value))}>{[8,16,24].map(value=><option key={value} value={value}>{value}px</option>)}</Select></label>}</div>
    <div className="connected-preview" aria-label={`${name} 미리보기`}>{name==='Container'?<Container style={{maxWidth:narrow?'480px':'1200px'}}><div className="layout-detail-item">부모 너비에 맞춰 줄어드는 콘텐츠</div></Container>:<Grid style={{gap}}>{children}</Grid>}</div>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 배치</summary><p>children과 className·style 등 div 속성을 전달합니다. style로 너비와 간격을 바꾸어 화면에 맞는 배치를 구성할 수 있습니다.</p><p>Container는 가운데 정렬과 최대 너비를 제공합니다. 좌우 여백은 화면에 맞춰 지정하세요. Grid의 기본 간격은 16px이며 공간에 따라 열 수가 바뀝니다.</p></GalleryDocs>
  </div>;
}
type DateView='default'|'disabled'|'readOnly'|'busy'|'error';
type DatePreset='initial'|'empty'|'reverse'|'outOfRange'|'blocked'|'leap'|'invalid'|'custom';
function DateDetail({range}:{range:boolean}) {
  const initialDate='2026-10-06';
  const initialPeriod={start:'2026-10-06',end:'2026-10-09'};
  const [date,setDate]=React.useState(initialDate);
  const [period,setPeriod]=React.useState<DateRangeValue>(initialPeriod);
  const [view,setView]=React.useState<DateView>('default');
  const [required,setRequired]=React.useState(false);
  const [limited,setLimited]=React.useState(false);
  const [blocked,setBlocked]=React.useState(false);
  const [preset,setPreset]=React.useState<DatePreset>('initial');
  const [validity,setValidity]=React.useState<boolean>();
  const [version,setVersion]=React.useState(0);
  const flags={disabled:view==='disabled',readOnly:view==='readOnly',busy:view==='busy',error:view==='error'?'선택 내용을 확인하세요.':undefined,required,min:limited?'2026-10-01':undefined,max:limited?'2026-10-31':undefined,disabledDates:blocked?['2026-10-08']:undefined};
  const reset=()=>{setDate(initialDate);setPeriod(initialPeriod);setView('default');setRequired(false);setLimited(false);setBlocked(false);setPreset('initial');setValidity(undefined);setVersion(current=>current+1);};
  const applyPreset=(next:DatePreset)=>{
    setPreset(next);setLimited(next==='outOfRange');setBlocked(next==='blocked');setValidity(undefined);setVersion(current=>current+1);
    const samples={initial:[initialDate,initialPeriod.end],empty:['',''],reverse:['2026-10-09','2026-10-06'],outOfRange:['2026-11-01','2026-11-03'],blocked:['2026-10-06','2026-10-08'],leap:['2024-02-29','2024-03-01'],invalid:['2026-02-30','2026-03-02'],custom:[date,period.end]};
    const [start,end]=samples[next];setDate(next==='blocked'?'2026-10-08':start);setPeriod({start,end});
  };
  const name=range?'DateRangePicker':'DatePicker';
  const source=`import { useState } from 'react';\nimport { Button } from './src/gyeol/components/button';\nimport { ${name} } from './src/gyeol/components/${name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase()}';\n\nexport function Example() {\n  const [value, setValue] = useState(${JSON.stringify(range?period:date)});\n  const [view, setView] = useState<'default' | 'disabled' | 'readOnly' | 'busy' | 'error'>(${JSON.stringify(view)});\n  const [required, setRequired] = useState(${required});\n  const [limited, setLimited] = useState(${limited});\n  const [blocked, setBlocked] = useState(${blocked});\n  const [validity, setValidity] = useState<boolean>();\n  const [version, setVersion] = useState(0);\n  const reset = () => {\n    setValue(${JSON.stringify(range?initialPeriod:initialDate)});\n    setView('default'); setRequired(false); setLimited(false); setBlocked(false);\n    setValidity(undefined); setVersion(current => current + 1);\n  };\n  return <div className="ds-core">\n    <${name} key={version} label={${JSON.stringify(range?'조회 기간':'기준 날짜')}} value={value} onChange={setValue}\n      onValidityChange={setValidity}\n      disabled={view === 'disabled'} readOnly={view === 'readOnly'} busy={view === 'busy'}\n      required={required} error={view === 'error' ? '선택 내용을 확인하세요.' : undefined}\n      min={limited ? '2026-10-01' : undefined} max={limited ? '2026-10-31' : undefined}\n      disabledDates={blocked ? ['2026-10-08'] : undefined} />\n    <p role="status">유효성: {validity === undefined ? '확인 중' : validity ? '유효' : '유효하지 않음'}</p>\n    <Button type="button" variant="secondary" onClick={reset}>초기화</Button>\n  </div>;\n}`;
  return <div className="connected-detail stack" data-connected-detail={name}>
    <GalleryControls className="wrap">
      <label className="inline-label">상태<Select aria-label="날짜 예제 상태" value={view} onChange={event=>setView(event.target.value as DateView)}><option value="default">기본</option><option value="disabled">비활성</option><option value="readOnly">읽기 전용</option><option value="busy">처리 중</option><option value="error">오류</option></Select></label>
      <label className="inline-label">샘플 값<Select aria-label="날짜 샘플 값" value={preset} onChange={event=>applyPreset(event.target.value as DatePreset)}><option value="initial">초깃값</option><option value="empty">빈 값</option>{range&&<option value="reverse">역순 기간</option>}<option value="outOfRange">선택 범위 밖</option><option value="blocked">선택 불가 날짜</option><option value="leap">윤년 날짜</option><option value="invalid">존재하지 않는 날짜</option><option value="custom" disabled>직접 편집</option></Select></label>
      <Checkbox label="required" checked={required} onChange={event=>setRequired(event.target.checked)}/><Checkbox label="10월 범위 제한" checked={limited} onChange={event=>setLimited(event.target.checked)}/><Checkbox label="10월 8일 선택 불가" checked={blocked} onChange={event=>setBlocked(event.target.checked)}/><Button type="button" variant="secondary" onClick={reset}>초기화</Button>
    <p className="help" role="status" data-date-committed>{range?`현재 값: ${period.start||'미선택'} ~ ${period.end||'미선택'}`:`현재 값: ${date||'미선택'}`}</p>
    <p className="help" role="status" data-date-validity>유효성: {validity===undefined?'확인 중':validity?'유효':'유효하지 않음'}</p>
    </GalleryControls>
    <div className="connected-preview" data-date-preview>{range?<DateRangePicker key={version} {...flags} label="조회 기간" value={period} onChange={next=>{setPeriod(next);setPreset('custom');}} onValidityChange={setValidity}/>:<DatePicker key={version} {...flags} label="기준 날짜" value={date} onChange={next=>{setDate(next);setPreset('custom');}} onValidityChange={setValidity}/>}</div>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 입력 상태</summary><p>DatePicker의 값은 YYYY-MM-DD 문자열, DateRangePicker의 값은 start·end 객체입니다. value/onChange로 관리하거나 defaultValue로 초기값을 지정하세요. 형식이 잘못된 편집 중 텍스트는 입력에 남으며 확정 값과 구분됩니다.</p><p>min·max·disabledDates로 선택 범위를 제한합니다. required·error·onValidityChange로 필수 입력과 유효성을 안내하세요. 방향키로 달력을 이동하고 Escape로 닫습니다. disabled·readOnly·busy 상태에서는 날짜 선택을 제한합니다.</p><p>예제의 초기화 버튼은 날짜와 설정을 시작 상태로 되돌립니다. 앱에서 초기화할 때도 관리하는 값과 입력의 임시 편집 상태를 함께 고려하세요.</p><p>기간의 시작일은 종료일보다 늦을 수 없습니다. 제출에는 앱이 관리하는 start와 end를 연결하고 유효성을 확인하세요.</p></GalleryDocs>
  </div>;
}
type SampleRow={id:string;title:string;state:string;count:number};
const rows:SampleRow[]=[
 {id:'a',title:'문서 정리',state:'진행 중',count:8},
 {id:'b',title:'아이콘 점검',state:'완료',count:3},
 {id:'c',title:'입력 예제',state:'진행 중',count:12},
 {id:'d',title:'색상 확인',state:'완료',count:5},
 {id:'e',title:'목록 배치',state:'대기',count:2},
 {id:'f',title:'탐색 검토',state:'진행 중',count:6},
];
const columns:DataColumn<SampleRow>[]=[{id:'title',header:'작업',value:row=>row.title,sortable:true},{id:'state',header:'상태',value:row=>row.state,sortable:true},{id:'count',header:'항목',value:row=>row.count,sortable:true}];
function TableDetail() {
  const [view,setView]=React.useState('default');
  const [message,setMessage]=React.useState('');
  const visibleRows=view==='empty'?[]:rows;
  const source=`import { useState } from 'react';\nimport { DataTable } from './src/gyeol/components/data-table';\n\ntype SampleRow = { id: string; title: string; state: string; count: number };\nconst rows: SampleRow[] = ${JSON.stringify(visibleRows,null,2)};\nconst columns = [\n  { id: 'title', header: '작업', value: (row: typeof rows[number]) => row.title, sortable: true },\n  { id: 'state', header: '상태', value: (row: typeof rows[number]) => row.state, sortable: true },\n  { id: 'count', header: '항목', value: (row: typeof rows[number]) => row.count, sortable: true },\n];\n\nexport function Example() {\n  const [view, setView] = useState(${JSON.stringify(view)});\n  const [message, setMessage] = useState('');\n  return <div className="ds-core">\n    <DataTable caption="예시 작업" rows={rows} columns={columns} rowKey={row => row.id}\n      rowLabel={row => row.title} initialPageSize={3}\n      loading={view === 'loading'} error={view === 'error' ? '데이터를 가져오지 못했어요.' : undefined}\n      onRetry={() => setView('default')}\n      filter={{ label: '상태 필터', value: row => row.state, options: ['진행 중', '완료', '대기'] }}\n      bulkAction={{ label: '선택 확인', onAction: selected => setMessage(selected.map(row => row.title).join(', ')) }} />\n    <p role="status">{message}</p>\n  </div>;\n}`;
  return <div className="connected-detail stack" data-connected-detail="DataTable">
    <GalleryControls className="form-detail-controls"><label className="inline-label">상태<Select aria-label="테이블 예제 상태" value={view} onChange={event=>{setView(event.target.value);setMessage('');}}><option value="default">기본</option><option value="loading">로딩</option><option value="error">오류</option><option value="empty">빈 데이터</option></Select></label></GalleryControls>
    <DataTable caption="예시 작업" rows={visibleRows} columns={columns} rowKey={row=>row.id} rowLabel={row=>row.title} initialPageSize={3} loading={view==='loading'} error={view==='error'?'데이터를 가져오지 못했어요.':undefined} onRetry={()=>setView('default')} filter={{label:'상태 필터',value:row=>row.state,options:['진행 중','완료','대기']}} bulkAction={{label:'선택 확인',onAction:selected=>setMessage(selected.map(row=>row.title).join(', '))}}/>
    <p className="help" role="status">{message}</p>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 검색과 선택</summary><p>rows·columns·rowKey·caption을 전달합니다. rowKey에는 고유하고 안정적인 값을 사용하세요. sortable을 지정한 열의 제목을 누르면 정렬하고 검색·filter로 항목을 좁힐 수 있습니다.</p><p>검색, 정렬, 페이지와 선택은 표에서 관리합니다. initialPageSize는 시작할 때의 페이지 크기입니다. bulkAction은 선택한 원본 행을 전달한 후 선택을 해제합니다.</p><p>loading·error·onRetry로 데이터 요청 상태를 표시하세요. 검색과 페이지 이동은 전달한 rows에 적용됩니다. 넓은 표는 내부 스크롤 영역에서 가로로 이동할 수 있습니다.</p></GalleryDocs>
  </div>;
}
export function ConnectedDetail({name}:{name:ConnectedDetailName}) {
  if(name==='Container'||name==='Grid')return <LayoutDetail name={name}/>;
  if(name==='DatePicker'||name==='DateRangePicker')return <DateDetail range={name==='DateRangePicker'}/>;
  return <TableDetail/>;
}
