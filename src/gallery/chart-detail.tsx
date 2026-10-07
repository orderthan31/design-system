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
  <GalleryDocs><summary>속성 · 데이터 표시</summary><p>title과 data를 지정하고 표시 목적에 맞춰 type을 선택하세요. 기본은 bar이며 line과 donut을 사용할 수 있습니다. showLegend의 기본값은 true입니다. 데이터 순서와 같은 이름의 항목을 유지하며 빈 항목 이름은 이름 없음으로 표시합니다. 포인터나 키보드 탐색으로 개별 수치를 확인할 수 있습니다.</p><p>선과 막대는 0과 음수를 표시할 수 있습니다. 유한한 숫자가 아닌 값은 그림에서 제외하고 원본 표에 이유를 표시합니다. 선은 해당 위치에서 끊어집니다. 도넛에 음수가 있거나 양수 합이 0이면 그림 대신 안내를 표시합니다. 도넛 비율은 소수 한 자리로 반올림합니다. 값의 차이가 매우 크면 작은 값이 그림에 보이지 않을 수 있으므로 원본 표를 함께 읽으세요.</p><p>항목 번호, 전체 이름을 표시하는 범례, 원본 데이터 표로 색 외에도 값을 구분합니다. description에 데이터의 기간, 단위, 주요 추세를 설명하세요. 범례를 숨겨도 요약과 표는 표시합니다.</p><p>차트는 가용 너비에 맞춰 표시됩니다. 긴 이름은 범례와 표에서 줄바꿈합니다. 차트를 넣은 화면에서 표의 읽는 순서와 키보드 탐색을 확인하고 데이터 변경 후 설명도 함께 갱신하세요.</p></GalleryDocs>
 </div>;
}
