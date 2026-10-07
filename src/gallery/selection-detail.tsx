import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { Combobox, MultiSelect, RadioGroup, CheckboxGroup, Switch } from '../components/form-controls';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';

export const selectionDetailNames=['Combobox','MultiSelect','RadioGroup','CheckboxGroup','Switch'] as const;
export type SelectionDetailName=typeof selectionDetailNames[number];
export function hasSelectionDetail(name:string):name is SelectionDetailName{return (selectionDetailNames as readonly string[]).includes(name);}
const items=[{value:'design',label:'디자인'},{value:'development',label:'개발'},{value:'research',label:'리서치'}];
export function SelectionDetail({name}:{name:SelectionDetailName}) {
  const isSwitch=name==='Switch',isMany=name==='MultiSelect'||name==='CheckboxGroup';
  const initialLabel=isSwitch?'자동 저장':'검토 분야';
  const initialHint=isSwitch?'':'필요한 항목을 선택하세요.';
  const [label,setLabel]=React.useState(initialLabel),[hint,setHint]=React.useState(initialHint),[fieldName,setFieldName]=React.useState('review');
  const [single,setSingle]=React.useState('design'),[many,setMany]=React.useState<string[]>(['design']),[checked,setChecked]=React.useState(false);
  const [disabled,setDisabled]=React.useState(false),[required,setRequired]=React.useState(false),[error,setError]=React.useState(false),[optionDisabled,setOptionDisabled]=React.useState(true);
  const [revision,setRevision]=React.useState(0),[message,setMessage]=React.useState(''),[showTags,setShowTags]=React.useState(true);
  const options=items.map(item=>({...item,disabled:item.value==='research'&&optionDisabled}));
  const flags={label,hint,name:fieldName,disabled,required,error:error?'선택 내용을 확인하세요.':undefined};
  const value=isSwitch?checked:isMany?many:single;
  const reset=()=>{setLabel(initialLabel);setHint(initialHint);setFieldName('review');setSingle('design');setMany(['design']);setChecked(false);setDisabled(false);setRequired(false);setError(false);setOptionDisabled(true);setShowTags(true);setRevision(n=>n+1);setMessage('초기화했어요.');};
  const settings=`label=${JSON.stringify(label)} name=${JSON.stringify(fieldName)} hint=${JSON.stringify(hint)} disabled={${disabled}} required={${required}}${flags.error?` error=${JSON.stringify(flags.error)}`:''}`;
  const installName=name.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();
  const source=`import { useState } from 'react';\nimport { ${name} } from '${'./src/gyeol/components/'+installName}';\n${isSwitch?'':`\nconst options = ${JSON.stringify(options)};\n`}\nexport function Example() {\n  const [value, setValue] = useState${isMany?'<string[]>':''}(${JSON.stringify(value)});\n  return (\n    <div className="ds-core">\n      <${name} ${settings}${name==='MultiSelect'?` showTags={${showTags}}`:''} ${isSwitch?'checked={value} onCheckedChange={setValue}':'options={options} value={value} onValueChange={setValue}'} />\n      <p>${isSwitch?'현재 checked':'확정 value'}: {JSON.stringify(value)}</p>\n    </div>\n  );\n}`;
  const preview=name==='Combobox'?<Combobox {...flags} options={options} value={single} onValueChange={setSingle}/>:name==='RadioGroup'?<RadioGroup {...flags} options={options} value={single} onValueChange={setSingle}/>:name==='MultiSelect'?<MultiSelect {...flags} options={options} value={many} onValueChange={setMany} showTags={showTags}/>:name==='CheckboxGroup'?<CheckboxGroup {...flags} options={options} value={many} onValueChange={setMany}/>:<Switch {...flags} checked={checked} onCheckedChange={setChecked}/>;
  return <div className="connected-detail stack" data-selection-detail={name}>
    {name==='Combobox'&&<p className="help">검색어를 입력해도 확정 value는 유지됩니다. 목록에서 항목을 선택하면 value와 현재 코드가 바뀝니다.</p>}
    <div className="connected-preview" data-selection-preview key={revision}>{preview}<p className="help" data-committed-value>{isSwitch?'현재 checked':'확정 value'}: {JSON.stringify(value)}</p></div>
    <GalleryControls className="form-detail-controls">
      <div className="selection-text-controls">{[{key:'label',value:label,set:setLabel},{key:'hint',value:hint,set:setHint},{key:'name',value:fieldName,set:setFieldName}].map(control=><label className="field" key={control.key}><span>{control.key}</span><Input aria-label={`예제 ${control.key}`} value={control.value} onChange={event=>control.set(event.target.value)}/></label>)}</div>
      {isSwitch?<Checkbox label="checked" checked={checked} onChange={event=>setChecked(event.target.checked)}/>:isMany?<div className="wrap" aria-label="확정 value controls">{items.map(item=><Checkbox key={item.value} label={`value: ${item.value}`} checked={many.includes(item.value)} onChange={event=>{const selected=event.target.checked;setMany(previous=>selected?[...previous,item.value]:previous.filter(v=>v!==item.value));}}/>)}</div>:<label className="field"><span>확정 value</span><Select aria-label="확정 value control" value={single} onChange={event=>setSingle(event.target.value)}><option value="">미선택</option>{items.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</Select></label>}
      <div className="wrap"><Checkbox label="disabled" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/><Checkbox label="required" checked={required} onChange={event=>setRequired(event.target.checked)}/><Checkbox label="error" checked={error} onChange={event=>setError(event.target.checked)}/>{!isSwitch&&<Checkbox label="리서치 옵션 disabled" checked={optionDisabled} onChange={event=>setOptionDisabled(event.target.checked)}/>}</div>
      {name==='MultiSelect'&&<Checkbox label="showTags · 선택 태그 표시" checked={showTags} onChange={event=>setShowTags(event.target.checked)}/>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <p role="status" className="help">{message}</p>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 선택과 상태</summary>
      <p>label과 hint·error·id·name·disabled·required를 사용합니다. {isSwitch?'checked/onCheckedChange로 상태를 관리하거나 defaultChecked로 초기값을 지정합니다.':`value/onValueChange로 선택을 관리하거나 defaultValue로 초기값을 지정합니다. ${isMany?'값은 문자열 배열입니다.':'값은 문자열입니다.'} options에 value·label과 옵션별 disabled를 넣습니다.`}</p>
      <p>{name==='Combobox'?'검색어로 목록을 좁히고 방향키와 Enter로 항목을 선택합니다. disabled 옵션은 건너뜁니다. Escape나 초점 이동 후 확정 선택 이름을 표시하며 한글 조합 중에는 선택을 기다립니다. name에는 확정 선택값을 제출합니다.':isMany?'선택한 값은 배열에 추가하고 해제하면 제거합니다. MultiSelect의 showTags 기본값은 true이며 false로 지정하면 태그만 숨기고 선택은 유지합니다. CheckboxGroup은 체크박스 목록으로 보여줍니다. options에 있는 고유한 값으로 배열을 구성하세요.':name==='RadioGroup'?'같은 그룹에서 한 항목만 선택합니다. name을 지정해 다른 라디오 그룹과 구분하고 required로 선택을 요구할 수 있습니다.':'Space 또는 클릭으로 설정을 전환합니다. required는 켜진 상태를 요구합니다. 폼에서 켜진 상태의 기본 제출값은 on입니다.'}</p>
      <p>error에는 사용자가 수정할 내용을 적으세요. 폼의 required 검사와 함께 유효성을 확인합니다. 비활성 선택지는 제출값에 포함되지 않을 수 있으므로 제출 전 선택값을 확인하세요.</p>
      <p>{name==='Combobox'?'앱에서 폼을 초기화할 때는 확정 선택값과 검색 상태를 함께 고려하세요.': 'form.reset의 기본 동작 뒤 비제어 입력은 초기값, 제어 입력은 최신 value/checked로 맞춥니다. reset은 변경 콜백을 호출하지 않습니다. 제어 입력을 초기값으로 되돌리려면 앱의 값을 갱신하세요.'}</p>
    </GalleryDocs>
  </div>;
}
