import {Input,Textarea,Select,Switch} from '../index';
import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import {Button,type ButtonProps} from '../components/atoms';
import {Badge,Progress,Skeleton,Separator,type Tone} from '../components/primitives';
import {Alert,EmptyState} from '../components/feedback';
import {TextField} from '../components/text-field';
import {Slider,Rating} from '../components/range-selection';
import {SegmentedControl} from '../components/segmented-control';
import {Result,type ResultVariant} from '../components/progress-result';
import {GridList,Highlight,Bubble} from '../components/content-primitives';
import {CodeBlock} from './code-block';
import './playground.css';

type Value=string|boolean|number;
type Control={name:string;default:Value;options?:readonly string[];min?:number;max?:number;multiline?:boolean};
const text=(name:string,value:string):Control=>({name,default:value});
const boolean=(name:string,value=false):Control=>({name,default:value});
const choice=(name:string,value:string,options:readonly string[]):Control=>({name,default:value,options});
const number=(name:string,value:number,min:number,max:number):Control=>({name,default:value,min,max});
const tones=['neutral','running','success','review','error'];
const variants=['primary','secondary','quiet','ghost','destructive'];
const options=[{value:'all',label:'전체'},{value:'ready',label:'준비 완료'},{value:'draft',label:'초안'}];
const schemas:Record<string,readonly Control[]>={
 Button:[choice('variant','primary',variants),choice('size','medium',['small','medium','large']),boolean('disabled'),boolean('loading'),text('children','변경 사항 저장')],
 Badge:[choice('tone','neutral',tones),text('children','준비 완료')],
 Skeleton:[text('label','콘텐츠 불러오는 중')],
 Separator:[],
 EmptyState:[text('title','결과 없음'),text('children','조건을 바꾸거나 항목을 추가하세요.'),text('action','항목 추가'),boolean('loading')],
 Alert:[choice('tone','running',tones),text('title','안내'),text('children','변경 사항을 확인해 주세요.')],
 Progress:[number('value',65,0,100),text('label','진행률'),boolean('indeterminate')],
 TextField:[choice('type','text',['text','email','tel','url','search']),text('label','표시 이름'),text('placeholder','이름 입력'),text('value','디자이너'),boolean('clearable',true),boolean('required'),boolean('disabled'),boolean('readOnly'),boolean('loading'),text('error','')],
 Slider:[number('value',40,0,100),text('label','음량'),boolean('disabled')],
 Rating:[number('value',0,0,5),text('label','만족도'),boolean('clearable',true),boolean('required'),boolean('disabled')],
 SegmentedControl:[choice('value','all',['all','ready','draft']),text('label','검토 범위'),boolean('disabled'),boolean('required')],
 Result:[choice('variant','success',['success','error','empty','info']),text('heading','처리 결과'),text('children','입력 내용은 유지됩니다.'),text('guidance','연결을 확인한 뒤 다시 시도해 주세요.')],
 GridList:[choice('columns','3',['1','2','3','4']),{name:'items',default:'문서 정리\n화면 검토\n초안 작성',multiline:true},text('label','작업 목록')],
 Highlight:[text('text','디자인 시스템으로 일관된 디자인을 만듭니다.'),text('query','디자인'),boolean('caseSensitive')],
 Bubble:[choice('tone','info',['neutral','info']),choice('align','start',['start','end']),text('children','내용을 확인했어요.')],
};
export function hasPlayground(name:string){return Object.hasOwn(schemas,name);}
export function Playground({name}:{name:string}){
 const schema=schemas[name];
 const defaults=()=>Object.fromEntries(schema.map(item=>[item.name,item.default]));
 const [values,setValues]=React.useState<Record<string,Value>>(defaults);
 const [message,setMessage]=React.useState('');
 const id=React.useId();
 const update=(key:string,value:Value)=>{setValues(previous=>({...previous,[key]:value}));setMessage('');};
 const click=()=>setMessage('동작을 실행했습니다.');
 const value=Number(values.value??0);
 const label=String(values.label??'');
 const disabled=Boolean(values.disabled);
 const children=String(values.children??'');
 const literal=(v:unknown)=>JSON.stringify(v);
 let preview:React.ReactNode;let source='';
 const settings=Object.fromEntries(Object.entries(values).filter(([key])=>key!=='children'&&key!=='value'));
 switch(name){
  case 'Button':preview=<Button variant={values.variant as ButtonProps['variant']} size={values.size as ButtonProps['size']} disabled={disabled} loading={Boolean(values.loading)} onClick={click}>{children}</Button>;source=`<Button {...settings} onClick={() => setMessage('동작을 실행했습니다.')}>${'{'+literal(children)+'}'}</Button>`;break;
  case 'Skeleton':preview=<Skeleton label={label}/>;source='<Skeleton {...settings} />';break;
  case 'Separator':preview=<><p>첫 번째 그룹</p><Separator/><p>두 번째 그룹</p></>;source='<p>첫 번째 그룹</p><Separator/><p>두 번째 그룹</p>';break;
  case 'Badge':preview=<Badge tone={values.tone as Tone}>{children}</Badge>;source=`<Badge {...settings}>{${literal(children)}}</Badge>`;break;
  case 'EmptyState':preview=<EmptyState title={String(values.title)} action={String(values.action)} loading={Boolean(values.loading)} onAction={click}>{children}</EmptyState>;source=`<EmptyState {...settings} onAction={() => setMessage('동작을 실행했습니다.')}>{${literal(children)}}</EmptyState>`;break;
  case 'Alert':preview=<Alert title={String(values.title)} tone={values.tone as Tone}>{children}</Alert>;source=`<Alert {...settings}>{${literal(children)}}</Alert>`;break;
  case 'Progress':{delete settings.indeterminate;preview=Boolean(values.indeterminate)?<Progress label={label}/>:<Progress value={value} label={label}/>;source=Boolean(values.indeterminate)?'<Progress {...settings} />':'<Progress {...settings} value={value} />';break;}
  case 'TextField':preview=<TextField {...settings} label={label} type={String(values.type)} value={String(values.value)} onChange={event=>update('value',event.currentTarget.value)}/>;source='<TextField {...settings} value={value} onChange={event => setValue(event.currentTarget.value)} />';break;
  case 'Slider':preview=<Slider label={label} value={value} disabled={disabled} onValueChange={v=>update('value',v)}/>;source='<Slider {...settings} value={value} onValueChange={setValue} />';break;
  case 'Rating':preview=<Rating label={label} value={value} disabled={disabled} required={Boolean(values.required)} clearable={Boolean(values.clearable)} onValueChange={v=>update('value',v)}/>;source='<Rating {...settings} value={value} onValueChange={setValue} />';break;
  case 'SegmentedControl':preview=<SegmentedControl label={label} options={options} value={String(values.value)} disabled={disabled} required={Boolean(values.required)} onValueChange={v=>update('value',v)}/>;source=`<SegmentedControl {...settings} options={${literal(options)}} value={value} onValueChange={setValue}/>`;break;
  case 'Result':preview=<Result variant={values.variant as ResultVariant} heading={String(values.heading)} guidance={String(values.guidance)}>{children}</Result>;source=`<Result {...settings}>{${literal(children)}}</Result>`;break;
  case 'GridList':{
   const items=String(values.items).split('\n').filter(v=>v.trim()).map((title,index)=>({id:String(index),title}));
   preview=<GridList items={items} columns={Number(values.columns) as 1|2|3|4} label={label} getKey={item=>item.id} renderItem={item=><Button variant="secondary" onClick={()=>setMessage(`${item.title} 선택`)}>{item.title}</Button>}/>;
   delete settings.items;settings.columns=Number(values.columns);
   source=`<GridList {...settings} items={${literal(items)}} getKey={item => item.id} renderItem={item => <Button variant="secondary" onClick={() => setMessage(item.title + ' 선택')}>{item.title}</Button>} />`;break;
  }
  case 'Highlight':preview=<Highlight text={String(values.text)} query={String(values.query)} caseSensitive={Boolean(values.caseSensitive)}/>;source='<Highlight {...settings} />';break;
  case 'Bubble':preview=<Bubble tone={values.tone as 'neutral'|'info'} align={values.align as 'start'|'end'}>{children}</Bubble>;source=`<Bubble {...settings}>{${literal(children)}}</Bubble>`;break;
 }
 const usesValue=['TextField','Slider','Rating','SegmentedControl'].includes(name)||(name==='Progress'&&!Boolean(values.indeterminate));
 const usesMessage=['Button','GridList','EmptyState'].includes(name);
 const stateLine=usesValue?`const [value,setValue]=useState(${literal(values.value)});`:'';
 const standalone=['Button','Badge','Skeleton','Separator','Alert','EmptyState'].includes(name);
 const installedItem=name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();
 const code=`${usesValue||usesMessage?"import { useState } from 'react';\n":''}import { ${name}${name==='GridList'?', Button':''} } from '${standalone?'./src/gyeol/components/'+installedItem:'./src/index'}';${standalone?'':"\nimport './src/core.css';"}\n\nexport function Example() {\n${usesMessage?"const [message,setMessage]=useState('');":''}\n${stateLine}\n${name==='Separator'?'':`const settings=${literal(settings)} as const;`}\nreturn <div className="ds-core">${source}${usesMessage?'{message && <p role="status">{message}</p>}':''}</div>;\n}`;
 return <section className="gallery-playground" aria-label={`${name} 속성 시연`}>
  <div className="gallery-playground-layout">
   <div className="gallery-playground-preview" data-preview={name}>{preview}{message&&<p role="status">{message}</p>}</div>
   {schema.length>0&&<GalleryControls as="fieldset" className="gallery-props"><legend>Props</legend>
    {schema.map(control=><div className="gallery-prop" key={control.name}>
     {typeof control.default!=='boolean'&&<label htmlFor={`${id}-${control.name}`}><code>{control.name}</code></label>}
     {control.options?<Select id={`${id}-${control.name}`} value={String(values[control.name])} onChange={e=>update(control.name,e.currentTarget.value)}>{control.options.map(option=><option key={option}>{option}</option>)}</Select>
      :typeof control.default==='boolean'?<Switch id={`${id}-${control.name}`} label={control.name} checked={Boolean(values[control.name])} onCheckedChange={value=>update(control.name,value)}/>
      :control.multiline?<Textarea id={`${id}-${control.name}`} rows={3} value={String(values[control.name])} onChange={e=>update(control.name,e.currentTarget.value)}/>
      :<Input id={`${id}-${control.name}`} type={typeof control.default==='number'?'range':'text'} min={control.min} max={control.max} step={1} value={String(values[control.name])} onChange={e=>update(control.name,typeof control.default==='number'?Number(e.currentTarget.value):e.currentTarget.value)}/>}
     {typeof control.default==='number'&&<output htmlFor={`${id}-${control.name}`}>{String(values[control.name])}</output>}
    </div>)}
    <span className="gallery-props-reset"><Button type="button" variant="ghost" onClick={()=>{setValues(defaults());setMessage('');}}>예제 초기화</Button></span>
   </GalleryControls>}
  </div>
  <GalleryDocs className="gallery-playground-code"><summary>Code</summary><CodeBlock source={code}/></GalleryDocs>
  <GalleryDocs className="gallery-props-reference"><summary>예제 설정</summary><p>아래 값은 현재 예제를 시작할 때의 설정입니다. 컴포넌트 기본값은 위 주요 속성과 개별 속성 표를 확인하세요.</p>{name==='EmptyState'&&<p>title과 children에 빈 이유를 설명하고 onAction에 다음 동작을 연결하세요. action 기본값은 항목 추가입니다. loading으로 진행 중 상태를 표시하며 실행 중에는 버튼 클릭을 막습니다.</p>}{name==='Alert'&&<p>title과 children에 안내 내용을 적고 tone으로 성격을 지정합니다. 기본값은 running입니다. error는 오류 알림으로, 다른 tone은 상태 안내로 전달합니다.</p>}{name==='Badge'&&<p>children에 상태나 분류를 짧게 적고 tone을 선택합니다. tone 기본값은 neutral입니다. 새 작업 결과를 알릴 때는 Alert나 Toast를 사용하세요.</p>}{name==='Skeleton'&&<p>label에 불러오는 내용을 설명합니다. 기본값은 콘텐츠 불러오는 중입니다. 내용이 준비되면 실제 콘텐츠로 바꾸세요. 움직임 줄이기 설정에서는 애니메이션을 멈춥니다.</p>}{name==='Separator'&&<p>내용의 구분이 필요한 위치에 Separator를 넣습니다. 문서 구분선의 의미를 함께 제공합니다.</p>}{name==='Progress'&&<p>value로 완료 비율을 전달하고 아직 비율을 알 수 없으면 생략하세요. value를 생략하면 진행 중 표시를 사용합니다. 예제의 진행 모드 전환으로 두 방식을 비교할 수 있습니다.</p>}{name==='GridList'&&<p>items·renderItem·getKey·label은 필수입니다. getKey에는 항목별 고유한 값을 지정하세요. columns로 1~4열을 선택하며 좁은 공간에서는 열 수가 줄어듭니다.</p>}{name==='Highlight'&&<p>text에 원문을, query에 찾을 문자열을 넣습니다. 빈 검색어는 강조하지 않습니다. caseSensitive의 기본값은 false입니다.</p>}{name==='Bubble'&&<p>children과 div 속성을 전달합니다. 짧은 메시지나 부가 설명을 넣고 tone과 align으로 모양과 방향을 선택하세요.</p>}<dl>{schema.map(item=><div key={item.name}><dt><code>{item.name}</code></dt><dd>{item.options?item.options.join(' | '):typeof item.default} · <code>{String(item.default)}</code></dd></div>)}</dl></GalleryDocs>
 </section>;
}
