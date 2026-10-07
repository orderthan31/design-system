import React from 'react';
import {Tabs} from '../components/tabs';
import {Menu} from '../components/menu';
import {Tooltip} from '../components/tooltip';
import {Button} from '../components/button';
import {Input} from '../components/input';
import {Textarea} from '../components/textarea';
import {GalleryControls,GalleryDocs} from './workbench';
import {CodeBlock} from './code-block';
export const nativeNavigationDetailNames=['Tabs','Menu','Tooltip'] as const;
export type NativeNavigationDetailName=typeof nativeNavigationDetailNames[number];
export function hasNativeNavigationDetail(name:string):name is NativeNavigationDetailName{return (nativeNavigationDetailNames as readonly string[]).includes(name);}
export function NativeNavigationDetail({name}:{name:NativeNavigationDetailName}){
 const initialLabel=name==='Tabs'?'예시 보기':name==='Menu'?'작업 메뉴':'간격 안내';
 const initialText=name==='Tabs'?'미리보기\n사용법\n상태':name==='Menu'?'복제\n보관':'기준 간격과 실제 상태를 확인하세요.';
 const [label,setLabel]=React.useState(initialLabel),[text,setText]=React.useState(initialText),[message,setMessage]=React.useState(''),[revision,setRevision]=React.useState(0);
 const labels=text.split('\n').filter(value=>value.trim());
 const items=labels.map((value,index)=>({label:value,content:`${index+1}번째 보기의 내용입니다.`}));
 const selected=(value:string)=>setMessage(`${value} 동작을 선택했습니다. 데이터는 변경되지 않았습니다.`);
 const preview=name==='Tabs'?<Tabs label={label} items={items}/>:name==='Menu'?<Menu label={label} items={labels} onSelect={selected}/>:<Tooltip label={label} text={text}/>;
 const source=`${name==='Menu'?"import {useState} from 'react';\n":''}import {${name}} from './src/gyeol/components/${name.toLowerCase()}';\n\nexport function Example(){\n${name==='Menu'?" const [message,setMessage]=useState('');\n":''} return <div className="ds-core">\n  <${name} label=${JSON.stringify(label)} ${name==='Tabs'?`items={${JSON.stringify(items)}}`:name==='Menu'?`items={${JSON.stringify(labels)}} onSelect={value=>setMessage(value+' 동작을 선택했습니다. 데이터는 변경되지 않았습니다.')}`:`text=${JSON.stringify(text)}`}/>\n${name==='Menu'?'  {message&&<p role="status">{message}</p>}\n':''} </div>;\n}`;
 const reset=()=>{setLabel(initialLabel);setText(initialText);setMessage('');setRevision(value=>value+1);};
 return <div className="connected-detail stack" data-native-navigation-detail={name}>
  <div className="connected-preview stack" data-native-navigation-preview key={revision}>{preview}{message&&<p role="status">{message}</p>}</div>
  <GalleryControls className="form-detail-controls">
   <label className="field"><span>label</span><Input aria-label="예제 label" value={label} onChange={event=>setLabel(event.currentTarget.value)}/></label>
   <label className="field"><span>{name==='Tooltip'?'text':'items · 줄마다 하나의 고유한 문구'}</span><Textarea aria-label="예제 내용" value={text} onChange={event=>setText(event.currentTarget.value)}/></label>
   <Button variant="ghost" onClick={reset}>초기화</Button>
  </GalleryControls>
  <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
  <GalleryDocs><summary>Props · 동작과 상태</summary>

   <p>{name==='Tabs'?'items에 label·content 배열을 전달합니다. 기본 label은 보기 전환입니다. 좌우 방향키·Home·End로 탭을 선택하고 초점을 이동합니다. 숨겨진 콘텐츠도 유지하며 선택한 인덱스가 항목 축소로 사라지면 첫 탭을 선택합니다.':name==='Menu'?'기본 label은 작업 메뉴, items는 복제·보관입니다. onSelect에서 선택한 작업을 처리하세요. ArrowDown으로 열고 방향키·Home·End로 이동합니다. 선택과 Escape 후 버튼으로 초점을 돌려줍니다.':'label은 버튼 문구, text는 보충 설명입니다. 버튼에 초점을 두거나 포인터를 올리면 표시하고 초점을 옮기거나 포인터를 벗어나거나 Escape를 누르면 닫습니다.'}</p>
  </GalleryDocs>
 </div>;
}
