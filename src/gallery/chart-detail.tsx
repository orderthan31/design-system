import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { Chart, type ChartDatum, type ChartType } from '../components/chart';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';
export const chartDetailNames=['Chart'] as const;
export function hasChartDetail(name:string):name is 'Chart'{return name==='Chart';}
const normal:ChartDatum[]=[{label:'자료 정리',value:12},{label:'검토',value:7},{label:'공유',value:4},{label:'대기',value:0}];
const fixtures:Record<string,ChartDatum[]>={normal,empty:[],zero:[{label:'첫 항목',value:0},{label:'둘째 항목',value:0}],negative:[{label:'감소',value:-8},{label:'기준',value:0},{label:'증가',value:12}],invalid:[{label:'정상',value:5},{label:'숫자 아님',value:Number.NaN},{label:'무한값',value:Number.POSITIVE_INFINITY},{label:'음수',value:-3}],extreme:[{label:'큰 음수',value:-Number.MAX_VALUE},{label:'0',value:0},{label:'큰 양수',value:Number.MAX_VALUE}],long:[{label:'공백없는긴한국어항목이줄바꿈되는지확인하는예시'.repeat(4),value:12},{label:'같은 이름',value:3},{label:'같은 이름',value:6}]};
const literal=(value:number)=>Number.isNaN(value)?'Number.NaN':value===Infinity?'Number.POSITIVE_INFINITY':value===-Infinity?'Number.NEGATIVE_INFINITY':String(value);
export function ChartDetail(){
 const [type,setType]=React.useState<ChartType>('bar'),[title,setTitle]=React.useState('문서 처리 현황'),[description,setDescription]=React.useState('로컬 데이터 예시입니다.'),[showLegend,setShowLegend]=React.useState(true),[mode,setMode]=React.useState('normal'),[data,setData]=React.useState(normal);
 const reset=()=>{setType('bar');setTitle('문서 처리 현황');setDescription('로컬 데이터 예시입니다.');setShowLegend(true);setMode('normal');setData(normal);};
 const source=`import { Chart, type ChartDatum } from './src';\nimport './src/core.css';\n\nconst data: ChartDatum[] = [\n${data.map(row=>`  { label: ${JSON.stringify(row.label)}, value: ${literal(row.value)} },`).join('\n')}\n];\n\nexport function Example() {\n  return <div className="ds-core">\n    <Chart title={${JSON.stringify(title)}} type=${JSON.stringify(type)} data={data}${description?` description={${JSON.stringify(description)}}`:''} showLegend={${showLegend}} />\n  </div>;\n}`;
 return <div className="connected-detail stack" data-chart-detail>
  <div data-chart-preview><Chart title={title} type={type} data={data} description={description} showLegend={showLegend}/></div>
  <GalleryControls className="form-detail-controls">
   <label className="field"><span>type</span><Select aria-label="chart type control" value={type} onChange={e=>setType(e.target.value as ChartType)}><option value="line">선</option><option value="bar">막대</option><option value="donut">도넛</option></Select></label>
   <label className="field"><span>title · 접근성 이름</span><Input aria-label="chart title control" value={title} onChange={e=>setTitle(e.target.value)}/></label>
   <label className="field"><span>description · 소비자 설명</span><Input aria-label="chart description control" value={description} onChange={e=>setDescription(e.target.value)}/></label>
   <label className="field"><span>data · 로컬 예시</span><Select aria-label="chart fixture control" value={mode} onChange={e=>{setMode(e.target.value);setData(fixtures[e.target.value]);}}>{Object.entries({normal:'기본',empty:'빈 배열',zero:'모두 0',negative:'음수/0/양수',invalid:'NaN/무한값',extreme:'유한 극값',long:'긴 한국어/중복 label'}).map(([value,label])=><option key={value} value={value}>{label}</option>)}</Select></label>
   {data.map((row,index)=><div className="wrap" key={index}><label className="field"><span>data[{index}].label</span><Input aria-label={`chart label ${index}`} value={row.label} onChange={e=>{const label=e.target.value;setData(current=>current.map((item,i)=>i===index?{...item,label}:item));}}/></label><label className="field"><span>data[{index}].value</span><Input aria-label={`chart value ${index}`} inputMode="decimal" value={String(row.value)} onChange={e=>{const value=e.target.value.trim()?Number(e.target.value):Number.NaN;setData(current=>current.map((item,i)=>i===index?{...item,value}:item));}}/></label></div>)}
   <Checkbox label="showLegend" checked={showLegend} onChange={e=>setShowLegend(e.target.checked)}/><Button variant="ghost" onClick={reset}>초기화</Button>
  </GalleryControls>
  <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
  <GalleryDocs><summary>Props · 데이터 정책</summary><p>필수 title/data, 선택 type(line/bar/donut, 기본bar)/description/showLegend(기본true)입니다. Recharts 단일 엔진과 선별 적용한 shadcn ChartContainer/tooltip/legend 패턴, 기존 Table을 조합합니다. tooltip은 포인터 및 Recharts 키보드 탐색으로 원본 값을 표시합니다. zoom/선택/서버/실시간/금융 SDK API는 없습니다. label/value 입력 순서와 중복 label을 보존하고 빈 이름은 이름 없음, 공백 title은 차트로 표시합니다.</p><p>선/막대는 유한 음수와0을 포함합니다. NaN/무한값은 그림에서 제외하지만 원본 표와 이유를 보존하고 선은 그 지점에서 끊습니다. 도넛에 유한 음수가 하나라도 있으면 전체 그림 대신 안내를 표시하며 표는 남습니다. 양수 합이0이면 그릴 값 없음입니다. 음수를0이나 절댓값으로 바꾸지 않습니다. 도넛 비율은 소수1자리 반올림입니다. 내부 plotValue를 최대 절댓값으로 정규화하여 극값의 축/geometry overflow를 줄이고 표와 tooltip은 원본 값을 사용합니다. 극단적인 비율에서는 부동소수점 underflow로 작은 값이0으로 표시되거나 조각이 보이지 않을 수 있습니다. 원본 표는 생략하지 않습니다.</p><p>축의 항목 번호와 도넛 번호/경계·범례의 전체 label·원본 데이터 표·텍스트 요약으로 색 외의 대안을 제공합니다. Recharts accessibilityLayer와 차트별 짧은 이름을 유지하고 native table을 별도로 제공합니다. 키보드 layer는 표나 실제 AT 검증을 대신하지 않습니다. 소비자는 description에 맥락/추세를 설명할 수 있습니다.</p><p>실제 높이260px인 부모와 min-width:0, 단일 ResponsiveContainer로 반응형 크기를 구성합니다. 축은 번호를 쓰고 긴 한국어는 범례/표에서 줄바꿈합니다. 범례를 숨겨도 요약과 원본 표는 유지됩니다. W3C WAI Complex Images의 짧은 이름+구조적 텍스트 대안 원칙을 참고했으며 전체 접근성 적합성 판정은 아닙니다. 이 예제는 로컬 부모 data만 변경하며 외부 전송/저장하지 않습니다.</p></GalleryDocs>
 </div>;
}
