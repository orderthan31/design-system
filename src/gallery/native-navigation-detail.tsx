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
   <p>선택 설치: <code>npx shadcn@4.21.3 add orderthan31/design-system/{name.toLowerCase()}</code>. 자체 owner CSS와 실제 transitive style만 가져오며 Pretendard 자산은 수동 배치합니다.</p>
   <p>{name==='Tabs'?'items는 label/content 배열이며 필수입니다. label 기본값은 보기 전환입니다. 실제 native button의 ArrowLeft/ArrowRight/Home/End가 선택과 focus를 함께 갱신하고 aria-controls/aria-labelledby 및 hidden panel을 유지합니다. 콘텐츠는 숨겨져도 계속 mounted입니다. 선택한 인덱스가 items 축소로 사라지면 기존 첫 보기 기본값으로 복원합니다. controlled value/onValueChange/disabled/방향 API는 없습니다.':name==='Menu'?'label 기본 작업 메뉴, items 기본 복제/보관이며 onSelect는 선택 콜백입니다. ArrowDown으로 열고 native menuitem의 Up/Down/Home/End로 이동합니다. 선택과 Escape는 trigger에 focus를 돌려주고 외부 blur는 외부 focus를 유지하며 닫습니다. 콜백은 서버 동작을 수행하지 않습니다. open/placement/portal/disabled API는 없습니다.':'label/text는 필수 문자열입니다. native trigger focus 또는 pointer enter로 열고 blur/leave 또는 Escape로 닫습니다. 표시 중인 tooltip id를 aria-describedby로 연결합니다. 기존 inline 위치 owner이며 portal/placement/open/타이머 API는 없습니다.'}</p>
  </GalleryDocs>
 </div>;
}
