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
  const source=`import { useState } from 'react';\nimport { ${name} } from './src';\nimport './src/core.css';\n${isSwitch?'':`\nconst options = ${JSON.stringify(options)};\n`}\nexport function Example() {\n  const [value, setValue] = useState${isMany?'<string[]>':''}(${JSON.stringify(value)});\n  return (\n    <div className="ds-core">\n      <${name} ${settings}${name==='MultiSelect'?` showTags={${showTags}}`:''} ${isSwitch?'checked={value} onCheckedChange={setValue}':'options={options} value={value} onValueChange={setValue}'} />\n      <p>${isSwitch?'현재 checked':'확정 value'}: {JSON.stringify(value)}</p>\n    </div>\n  );\n}`;
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
      <p>label은 필수입니다. hint/error/id/name/disabled/required를 전달합니다. {isSwitch?'checked/onCheckedChange는 boolean 제어형, defaultChecked는 비제어형 초기값입니다.':`value/onValueChange는 ${isMany?'string[]':'string'} 제어형, defaultValue는 비제어형 초기값입니다. options는 value/label 및 옵션별 disabled를 받습니다.`} readOnly/loading/size/form/query는 이 API의 props가 아닙니다.</p>
      <p>{name==='Combobox'?'검색 query/open/active는 내부 상태입니다. label 부분검색과 방향키/Enter 선택을 지원하며 disabled 옵션은 건너뜁니다. Escape 또는 blur 후 확정 label이 표시되고 IME 조합 중 선택 키 처리를 건너뜁니다. 입력한 문자열을 자유 입력 값으로 확정하지 않습니다. name은 확정 값의 hidden input에 연결되며 required는 options에 존재하는 확정 선택으로 검사합니다. 원격 검색·포털·가상화·외부 query 제어 API는 없습니다.':isMany?'options를 native 체크박스 목록으로 표시합니다. 선택은 배열 끝에 추가하고 해제는 해당 value를 제거합니다. 그룹·옵션 disabled는 변경을 막습니다. MultiSelect의 showTags는 기본 true이고 태그 제거 버튼의 표시만 제어합니다. false여도 선택 배열과 native 체크박스 제출값은 유지됩니다. CheckboxGroup은 showTags를 public prop으로 받지 않고 내부에서 false로 고정하여 목록만 표시합니다. required는 선택 배열이 비었을 때 활성화됩니다. 옵션에 없는 값이나 중복 값은 자동 정규화하지 않으므로 소비자가 유효한 배열을 전달해야 합니다.':name==='RadioGroup'?'동일 name의 native radio 그룹으로 한 항목만 선택합니다. required는 선택이 필요하다는 뜻이며 그룹 disabled와 옵션 disabled를 각각 적용합니다.':'native checkbox의 role="switch"를 사용합니다. Space 또는 클릭으로 변경합니다. required는 켜짐을 요구합니다. 체크된 native 제출값은 별도 value prop이 없어 기본 "on"이며 boolean 문자열 "true"가 아닙니다.'}</p>
      <p>error는 오류 안내·ARIA 표시입니다. Combobox의 required 검증과 별개이며 오류 문구 자체가 모든 native custom validity를 설정하지는 않습니다. disabled 선택이 현재 값에 남아 있는 것과 native 제출되는 값은 다를 수 있습니다.</p>
      <p>초기화 버튼은 제어형 value/checked와 설정을 초기 값으로 되돌리고 미리보기를 다시 열어 내부 검색·펼침 상태도 초기화합니다. native form.reset()만으로 내부 상태가 동기화되는 API는 아닙니다.</p>
    </GalleryDocs>
  </div>;
}
