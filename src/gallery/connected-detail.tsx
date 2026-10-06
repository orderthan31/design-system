import React from 'react';
import { Container, Grid } from '../components/layout';
import { DatePicker, DateRangePicker, type DateRangeValue } from '../components/date-controls';
import { DataTable, type DataColumn } from '../components/data-display';
import { Checkbox, Select } from '../components/primitives';
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
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 배치</summary><p>children, className, style 등 native div 속성을 전달합니다. 별도 columns·size prop은 없습니다. 위 controls는 style 속성으로 기본 CSS를 덮어쓰는 예시입니다.</p><p>Container는 좌우 padding을 추가하지 않습니다. Grid는 기본 gap 16px이며 항목 너비에 따라 자동으로 열을 구성합니다. 화면 폭을 줄여 배치를 비교하세요. 샘플 색상과 내부 여백은 문서 예시이며 레이아웃 API의 기본 배경이 아닙니다.</p></details>
  </div>;
}
type DateView='default'|'disabled'|'readOnly'|'busy'|'error';
function DateDetail({range}:{range:boolean}) {
  const [date,setDate]=React.useState('2026-10-06');
  const [period,setPeriod]=React.useState<DateRangeValue>({start:'2026-10-06',end:'2026-10-09'});
  const [view,setView]=React.useState<DateView>('default');
  const [required,setRequired]=React.useState(false);
  const [limited,setLimited]=React.useState(false);
  const flags={disabled:view==='disabled',readOnly:view==='readOnly',busy:view==='busy',error:view==='error'?'선택 내용을 확인하세요.':undefined,required,min:limited?'2026-10-01':undefined,max:limited?'2026-10-31':undefined};
  const name=range?'DateRangePicker':'DatePicker';
  const source=`import { useState } from 'react';\nimport { ${name} } from './src';\nimport './src/core.css';\n\nexport function Example() {\n  const [value, setValue] = useState(${JSON.stringify(range?period:date)});\n  return <div className="ds-core">\n    <${name} label=${JSON.stringify(range?'조회 기간':'기준 날짜')} value={value} onChange={setValue}\n      disabled={${flags.disabled}} readOnly={${flags.readOnly}} busy={${flags.busy}} required={${required}}${flags.error?`\n      error=${JSON.stringify(flags.error)}`:''}${limited?'\n      min="2026-10-01" max="2026-10-31"':''} />\n  </div>;\n}`;
  return <div className="connected-detail stack" data-connected-detail={name}>
    <div className="wrap"><label className="inline-label">상태<Select aria-label="날짜 예제 상태" value={view} onChange={event=>setView(event.target.value as DateView)}><option value="default">기본</option><option value="disabled">비활성</option><option value="readOnly">읽기 전용</option><option value="busy">처리 중</option><option value="error">오류</option></Select></label><Checkbox label="required" checked={required} onChange={event=>setRequired(event.target.checked)}/><Checkbox label="10월 범위 제한" checked={limited} onChange={event=>setLimited(event.target.checked)}/></div>
    <div className="connected-preview">{range?<DateRangePicker {...flags} label="조회 기간" value={period} onChange={setPeriod}/>:<DatePicker {...flags} label="기준 날짜" value={date} onChange={setDate}/>}</div>
    <p className="help" role="status">{range?`현재 값: ${period.start||'미선택'} ~ ${period.end||'미선택'}`:`현재 값: ${date||'미선택'}`}</p>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 입력 상태</summary><p>DatePicker는 YYYY-MM-DD 문자열, DateRangePicker는 start/end 문자열 객체를 받습니다. value/onChange는 제어형, defaultValue는 비제어형 초기값입니다. 형식이 잘못된 편집 중 텍스트는 내부 draft에 남고 현재 코드에는 콜백으로 전달된 값이 표시됩니다.</p><p>min/max·disabledDates는 선택 범위를 제한합니다. required·error·onValidityChange를 사용해 유효성을 전달할 수 있습니다. 달력은 키보드 방향키로 이동하고 Escape로 닫습니다. 비활성·읽기 전용·busy는 편집 및 달력 선택을 잠급니다.</p><p>기간 예제는 역순 날짜를 오류로 표시하고 시작일·종료일 포함 일수를 계산합니다. 이 API에는 native name/form 직렬화 prop이 없으므로 제출 데이터 연결은 소비자가 구현해야 합니다.</p></details>
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
  const source=`import { useState } from 'react';\nimport { DataTable } from './src';\nimport './src/core.css';\n\ntype SampleRow = { id: string; title: string; state: string; count: number };\nconst rows: SampleRow[] = ${JSON.stringify(visibleRows,null,2)};\nconst columns = [\n  { id: 'title', header: '작업', value: (row: typeof rows[number]) => row.title, sortable: true },\n  { id: 'state', header: '상태', value: (row: typeof rows[number]) => row.state, sortable: true },\n  { id: 'count', header: '항목', value: (row: typeof rows[number]) => row.count, sortable: true },\n];\n\nexport function Example() {\n  const [view, setView] = useState(${JSON.stringify(view)});\n  const [message, setMessage] = useState('');\n  return <div className="ds-core">\n    <DataTable caption="예시 작업" rows={rows} columns={columns} rowKey={row => row.id}\n      rowLabel={row => row.title} initialPageSize={3}\n      loading={view === 'loading'} error={view === 'error' ? '데이터를 가져오지 못했어요.' : undefined}\n      onRetry={() => setView('default')}\n      filter={{ label: '상태 필터', value: row => row.state, options: ['진행 중', '완료', '대기'] }}\n      bulkAction={{ label: '선택 확인', onAction: selected => setMessage(selected.map(row => row.title).join(', ')) }} />\n    <p role="status">{message}</p>\n  </div>;\n}`;
  return <div className="connected-detail stack" data-connected-detail="DataTable">
    <label className="inline-label">상태<Select aria-label="테이블 예제 상태" value={view} onChange={event=>{setView(event.target.value);setMessage('');}}><option value="default">기본</option><option value="loading">로딩</option><option value="error">오류</option><option value="empty">빈 데이터</option></Select></label>
    <DataTable caption="예시 작업" rows={visibleRows} columns={columns} rowKey={row=>row.id} rowLabel={row=>row.title} initialPageSize={3} loading={view==='loading'} error={view==='error'?'데이터를 가져오지 못했어요.':undefined} onRetry={()=>setView('default')} filter={{label:'상태 필터',value:row=>row.state,options:['진행 중','완료','대기']}} bulkAction={{label:'선택 확인',onAction:selected=>setMessage(selected.map(row=>row.title).join(', '))}}/>
    <p className="help" role="status">{message}</p>
    <details open><summary>현재 코드</summary><CodeBlock source={source}/></details>
    <details><summary>Props · 검색과 선택</summary><p>rows/columns/rowKey/caption이 필수입니다. rowKey는 고유하고 안정적인 키, columns.value는 문자열 또는 숫자를 반환합니다. sortable 열 제목을 눌러 정렬하고 검색·filter로 목록을 좁힙니다.</p><p>검색·정렬·페이지·선택은 컴포넌트 내부 상태입니다. 표시 코드의 props로 초기화되며 내부 검색값·페이지까지 제어하는 API는 없습니다. initialPageSize는 초기값입니다. bulkAction은 선택한 원본 행을 전달하고 선택을 해제합니다.</p><p>이 예제의 행은 로컬 샘플이며 서버 요청·저장·삭제는 없습니다. loading/error/onRetry는 소비자가 공급합니다. 넓은 표는 이름 있는 스크롤 영역에서 가로로 이동합니다. 가상 DataGrid나 서버 페이지네이션 API가 아닙니다.</p></details>
  </div>;
}
export function ConnectedDetail({name}:{name:ConnectedDetailName}) {
  if(name==='Container'||name==='Grid')return <LayoutDetail name={name}/>;
  if(name==='DatePicker'||name==='DateRangePicker')return <DateDetail range={name==='DateRangePicker'}/>;
  return <TableDetail/>;
}
