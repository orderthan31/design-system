// Recharts + selected shadcn ChartContainer/Tooltip/Legend patterns (MIT).
// Immutable sources/licenses: docs/vendor/chart-sources.md.
import React from 'react';
import './chart.css';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, type TooltipContentProps, type TooltipValueType } from 'recharts';
import { Table, type DataColumn } from './table';
export type ChartType='line'|'bar'|'donut';
export type ChartDatum={label:string;value:number};
export type ChartProps=Omit<React.ComponentPropsWithRef<'figure'>,'children'|'title'> & {title:string;data:readonly ChartDatum[];type?:ChartType;description?:string;showLegend?:boolean};
type PlotRow={rowId:string;index:number;label:string;originalValue:number;plotValue:number|null;reason:string;ratio:number};
type ChartConfig=Readonly<Record<string,{label:string;color:string}>>;
const ChartContext=React.createContext<ChartConfig>({});
function ChartContainer({children,config,label,summaryId}:{children:React.ReactElement;config:ChartConfig;label:string;summaryId:string}) {
 return <ChartContext.Provider value={config}><div className="ds-chart-plot" data-slot="chart" role="group" aria-label={label} aria-describedby={summaryId}><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{width:320,height:260}}>{children}</ResponsiveContainer></div></ChartContext.Provider>;
}
function isRow(value:unknown):value is PlotRow{return typeof value==='object'&&value!==null&&'label' in value&&typeof value.label==='string'&&'originalValue' in value&&typeof value.originalValue==='number'&&'index' in value&&typeof value.index==='number';}
function ChartTooltipContent({active,payload}:Partial<Pick<TooltipContentProps<TooltipValueType,string>,'active'|'payload'>>) {
 const config=React.useContext(ChartContext);
 if(!active||!payload?.length)return null;
 return <div data-slot="chart-tooltip" className="ds-chart-tooltip">{payload.map((item,index)=>{const row:unknown=item.payload;return isRow(row)?<div key={index}><strong>{row.index}. {row.label}</strong><p>{config.series.label}: {String(row.originalValue)}</p></div>:null;})}</div>;
}
function ChartLegendContent({rows,label}:{rows:readonly PlotRow[];label:string}) {
 const config=React.useContext(ChartContext);
 return <ol data-slot="chart-legend" className="ds-chart-legend" aria-label={label}>{rows.map(row=><li key={row.rowId}><span><span className="ds-chart-indicator" aria-hidden="true" style={{'--ds-chart-color':config.series.color} as React.CSSProperties}/>{row.index}. {row.label}</span><span>{row.reason||String(row.originalValue)}</span></li>)}</ol>;
}
const typeLabels:Record<ChartType,string>={line:'선',bar:'막대',donut:'도넛'};
export function Chart({title,data,type='bar',description,showLegend=true,className='',...props}:ChartProps) {
 const id=React.useId(),headingId=`${id}-heading`,summaryId=`${id}-summary`,displayTitle=title.trim()||'차트';
 let scale=0;for(const row of data)if(Number.isFinite(row.value))scale=Math.max(scale,Math.abs(row.value));
 const divisor=scale||1;
 const rows:PlotRow[]=data.map((row,index)=>{const finite=Number.isFinite(row.value),negative=finite&&type==='donut'&&row.value<0;return {rowId:`row-${index}`,index:index+1,label:typeof row.label==='string'&&row.label.trim()?row.label:'이름 없음',originalValue:row.value,plotValue:finite&&!negative?row.value/divisor:null,reason:!finite?'유효하지 않은 값':negative?'음수 · 도넛 지원 안 함':'',ratio:0};});
 const negativeDonut=type==='donut'&&rows.some(row=>Number.isFinite(row.originalValue)&&row.originalValue<0);
 const positiveTotal=rows.reduce((total,row)=>total+(row.plotValue!==null&&row.plotValue>0?row.plotValue:0),0);
 if(!negativeDonut&&positiveTotal>0)for(const row of rows)row.ratio=row.plotValue!==null&&row.plotValue>0?row.plotValue/positiveTotal:0;
 let low=0,high=0;for(const row of rows)if(row.plotValue!==null){low=Math.min(low,row.plotValue);high=Math.max(high,row.plotValue);}if(low===high)high=1;
 const empty=rows.length===0||rows.every(row=>row.plotValue===null)||(type==='donut'&&(negativeDonut||positiveTotal===0));
 const emptyText=rows.length===0?'데이터가 없습니다.':negativeDonut?'도넛은 음수를 지원하지 않습니다. 원본 표를 확인하세요.':'그릴 값이 없습니다.';
 const config:ChartConfig={series:{label:'원본 값',color:'var(--color-action-primary-bg-default)'}};
 const tooltip=<Tooltip content={props=><ChartTooltipContent active={props.active} payload={props.payload}/>} cursor={type==='line'?{stroke:'var(--color-border-subtle)'}:{fill:'var(--color-selected-bg)'}}/>;
 const tick=(value:unknown)=>{if(typeof value!=='number'||!Number.isFinite(value))return '';const original=value*divisor;if(!Number.isFinite(original))return '';const magnitude=Math.abs(original);return new Intl.NumberFormat('ko',{notation:magnitude>=1e6||(magnitude>0&&magnitude<0.001)?'scientific':'standard',maximumSignificantDigits:3}).format(original);};
 const axes=<><CartesianGrid vertical={false} stroke="var(--color-border-subtle)"/><XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={10} interval="preserveStartEnd"/><YAxis tickLine={false} axisLine={false} tickFormatter={tick} width={72} domain={[low,high]} allowDataOverflow/><ReferenceLine y={0} stroke="var(--color-text-secondary)"/>{tooltip}</>;
 const graphic=type==='line'?<LineChart data={rows} accessibilityLayer aria-label={`${displayTitle} 선 차트 · 상세 원본은 데이터 표`} margin={{top:12,right:16,bottom:12,left:0}}>{axes}<Line dataKey="plotValue" name="원본 값" type="linear" connectNulls={false} stroke={config.series.color} strokeWidth={2} dot={{r:3}} isAnimationActive={false}/></LineChart>:type==='bar'?<BarChart data={rows} accessibilityLayer aria-label={`${displayTitle} 막대 차트 · 상세 원본은 데이터 표`} margin={{top:12,right:16,bottom:12,left:0}}>{axes}<Bar dataKey="plotValue" name="원본 값" fill={config.series.color} radius={3} isAnimationActive={false}/></BarChart>:<PieChart accessibilityLayer aria-label={`${displayTitle} 도넛 차트 · 상세 원본은 데이터 표`}>{tooltip}<Pie data={rows.filter(row=>row.plotValue!==null&&row.plotValue>0)} dataKey="plotValue" nameKey="label" innerRadius="55%" outerRadius="75%" fill={config.series.color} stroke="var(--color-bg-canvas)" strokeWidth={2} isAnimationActive={false} label={props=>isRow(props.payload)?props.payload.index:''}/></PieChart>;
 const summary=`${typeLabels[type]} 차트. 입력 순서의 번호와 원본 값은 아래 표에서 확인합니다.${type==='line'?' 부적절한 지점에서는 선을 끊습니다.':''}${type==='donut'?' 비율은 소수 1자리 반올림이며 음수가 있으면 그림 대신 안내를 표시합니다.':' 0 기준선 위는 양수, 아래는 음수입니다.'}${rows.some(row=>row.reason)?' 제외 또는 부적절한 값의 이유도 표에 보존합니다.':''}`;
 const columns:DataColumn<PlotRow>[]=[{id:'index',header:'번호',value:row=>row.index},{id:'label',header:'항목',value:row=>row.label},{id:'value',header:'원본 값',value:row=>String(row.originalValue)},{id:'policy',header:type==='donut'?'비율 / 정책':'정책',value:row=>row.reason||(type==='donut'?(negativeDonut?'비율 표시 안 함':`${(row.ratio*100).toFixed(1)}%`):'표시됨')}];
 return <figure {...props} data-slot="chart-root" className={`ds-chart ${className}`} role="group" aria-labelledby={headingId}>
  <figcaption><h3 id={headingId}>{displayTitle}</h3>{description&&<p className="ds-chart-description">{description}</p>}<p id={summaryId} className="ds-chart-summary">{summary}</p></figcaption>
  <ChartContext.Provider value={config}>{empty?<p className="ds-chart-empty" role="status">{emptyText}</p>:<ChartContainer config={config} label={`${displayTitle} 그림 · ${typeLabels[type]} 차트`} summaryId={summaryId}>{graphic}</ChartContainer>}{showLegend&&rows.length>0&&<ChartLegendContent rows={rows} label={`${displayTitle} 범례`}/>}</ChartContext.Provider>
  <Table caption={`${displayTitle} 데이터`} rows={rows} columns={columns} rowKey={row=>row.rowId}/>
 </figure>;
}
