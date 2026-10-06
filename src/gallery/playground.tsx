import {Input,Textarea,Select,Switch} from '../index';
import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import {Button,type ButtonProps} from '../components/atoms';
import {Badge,Progress,type Tone} from '../components/primitives';
import {Alert} from '../components/feedback';
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
  case 'Badge':preview=<Badge tone={values.tone as Tone}>{children}</Badge>;source=`<Badge {...settings}>{${literal(children)}}</Badge>`;break;
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
 const usesMessage=['Button','GridList'].includes(name);
 const stateLine=usesValue?`const [value,setValue]=useState(${literal(values.value)});`:'';
 const code=`${usesValue||usesMessage?"import { useState } from 'react';\n":''}import { ${name}${name==='GridList'?', Button':''} } from './src/index';\nimport './src/core.css';\n\nexport function Example() {\n${usesMessage?"const [message,setMessage]=useState('');":''}\n${stateLine}\nconst settings=${literal(settings)} as const;\nreturn <div className="ds-core">${source}${usesMessage?'{message && <p role="status">{message}</p>}':''}</div>;\n}`;
 return <section className="gallery-playground" aria-label={`${name} 속성 시연`}>
  <div className="gallery-playground-layout">
   <div className="gallery-playground-preview" data-preview={name}>{preview}{message&&<p role="status">{message}</p>}</div>
   <GalleryControls as="fieldset" className="gallery-props"><legend>Props</legend>
    {schema.map(control=><div className="gallery-prop" key={control.name}>
     {typeof control.default!=='boolean'&&<label htmlFor={`${id}-${control.name}`}><code>{control.name}</code></label>}
     {control.options?<Select id={`${id}-${control.name}`} value={String(values[control.name])} onChange={e=>update(control.name,e.currentTarget.value)}>{control.options.map(option=><option key={option}>{option}</option>)}</Select>
      :typeof control.default==='boolean'?<Switch id={`${id}-${control.name}`} label={control.name} checked={Boolean(values[control.name])} onCheckedChange={value=>update(control.name,value)}/>
      :control.multiline?<Textarea id={`${id}-${control.name}`} rows={3} value={String(values[control.name])} onChange={e=>update(control.name,e.currentTarget.value)}/>
      :<Input id={`${id}-${control.name}`} type={typeof control.default==='number'?'range':'text'} min={control.min} max={control.max} step={1} value={String(values[control.name])} onChange={e=>update(control.name,typeof control.default==='number'?Number(e.currentTarget.value):e.currentTarget.value)}/>}
     {typeof control.default==='number'&&<output htmlFor={`${id}-${control.name}`}>{String(values[control.name])}</output>}
    </div>)}
    <span className="gallery-props-reset"><Button type="button" variant="ghost" onClick={()=>{setValues(defaults());setMessage('');}}>기본값으로 초기화</Button></span>
   </GalleryControls>
  </div>
  <GalleryDocs className="gallery-playground-code"><summary>Code</summary><CodeBlock source={code}/></GalleryDocs>
  <GalleryDocs className="gallery-props-reference"><summary>시연 설정 · API</summary>{name==='Progress'&&<p>value는 선택 숫자 prop입니다. 예제의 indeterminate control을 켜면 실제 value prop을 생략하고 진행 중 표시와 aria-valuenow 없는 progressbar를 보여줍니다. indeterminate는 Progress의 public prop이 아닙니다. 끄면 보존한 value를 다시 표시하고 초기화는 value65/label/모드를 함께 복원합니다.</p>}{name==='GridList'&&<p><code>items / renderItem / getKey / label</code>은 필수. getKey는 고유한 키를 반환하고 columns는 1~4 정수입니다. 좁은 컨테이너에서는 열을 줄입니다. 정렬·필터·선택은 소유자 로직입니다.</p>}{name==='Highlight'&&<p><code>text / query</code>는 필수 문자열. query는 정규식이 아닌 검색할 원문이며 빈 값이면 강조하지 않습니다. 기본은 대소문자를 구분하지 않습니다.</p>}{name==='Bubble'&&<p>children과 네이티브 div 속성을 받습니다. 비모달 말풍선이며 tooltip·live region·채팅 전송 기능은 포함하지 않습니다.</p>}<dl>{schema.map(item=><div key={item.name}><dt><code>{item.name}</code></dt><dd>{item.options?item.options.join(' | '):typeof item.default} · <code>{String(item.default)}</code></dd></div>)}</dl></GalleryDocs>
 </section>;
}
