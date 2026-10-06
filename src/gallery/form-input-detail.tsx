import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { PasswordInput, NumberInput, CurrencyInput, PhoneInput, EmailInput } from '../components/form-controls';
import { SearchField } from '../components/composition';
import { FormField } from '../components/molecules';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';

export const formInputDetailNames=['PasswordInput','NumberInput','CurrencyInput','PhoneInput','EmailInput','SearchField'] as const;
export type FormInputDetailName=typeof formInputDetailNames[number];
export function hasFormInputDetail(name:string):name is FormInputDetailName{return (formInputDetailNames as readonly string[]).includes(name);}
const defaults:Record<FormInputDetailName,string>={PasswordInput:'demo-only',NumberInput:'2',CurrencyInput:'12000',PhoneInput:'010-1234-5678',EmailInput:'demo@example.kr',SearchField:''};
const labels:Record<FormInputDetailName,string>={PasswordInput:'예시 비밀번호',NumberInput:'수량',CurrencyInput:'금액',PhoneInput:'전화번호',EmailInput:'이메일',SearchField:'컴포넌트 검색'};
const searchItems=['Button','TextField','Select','Grid','DatePicker','DataTable'];
export function FormInputDetail({name}:{name:FormInputDetailName}) {
  const [text,setText]=React.useState(defaults[name]);
  const [quantity,setQuantity]=React.useState<number|''>(2);
  const [disabled,setDisabled]=React.useState(false);
  const [readOnly,setReadOnly]=React.useState(false);
  const [busy,setBusy]=React.useState(false);
  const [required,setRequired]=React.useState(false);
  const [error,setError]=React.useState(false);
  const [limited,setLimited]=React.useState(true);
  const [step,setStep]=React.useState(1);
  const [message,setMessage]=React.useState('');
  const [revision,setRevision]=React.useState(0);
  const isNumber=name==='NumberInput';
  const label=labels[name],errorText=error?'입력 내용을 확인하세요.':undefined;
  const flags={label,disabled,required,error:errorText};
  const results=searchItems.filter(item=>item.toLowerCase().includes(text.trim().toLowerCase()));
  const reset=()=>{setText(defaults[name]);setQuantity(2);setDisabled(false);setReadOnly(false);setBusy(false);setRequired(false);setError(false);setLimited(true);setStep(1);setMessage('초기화했어요.');setRevision(previous=>previous+1);};
  const value=isNumber?quantity:text;
  const callback=name==='PasswordInput'||name==='SearchField'?'onChange={event => setValue(event.target.value)}':'onValueChange={setValue}';
  const component=name==='SearchField'?`<FormField label=${JSON.stringify(label)} required={${required}}${errorText?` error=${JSON.stringify(errorText)}`:''}>\n        <SearchField aria-label=${JSON.stringify(label)} value={value} onChange={event => setValue(event.target.value)} disabled={${disabled}} required={${required}} />\n      </FormField>\n      <ul>{items.filter(item => item.toLowerCase().includes(value.trim().toLowerCase())).map(item => <li key={item}>{item}</li>)}</ul>`:`<${name} label=${JSON.stringify(label)} name="example" value={value} ${callback}\n      disabled={${disabled}} required={${required}}${errorText?` error=${JSON.stringify(errorText)}`:''}${isNumber?` step={${step}}${limited?' min={0} max={10}':''}`:''}${name==='PasswordInput'?` hint="문서 예제입니다. 실제 비밀번호를 입력하지 마세요." readOnly={${readOnly}} aria-busy={${busy}}`:''} />`;
  const source=`import { useState } from 'react';\nimport { ${name}${name==='SearchField'?', FormField':''} } from './src';\nimport './src/core.css';\n${name==='SearchField'?`\nconst items = ${JSON.stringify(searchItems)};\n`:''}\nexport function Example() {\n  const [value, setValue] = useState${isNumber?"<number | ''>":''}(${JSON.stringify(value)});\n  return (\n    <div className="ds-core">\n      ${component}\n    </div>\n  );\n}`;
  const preview=name==='PasswordInput'?<PasswordInput {...flags} readOnly={readOnly} aria-busy={busy} name="example" hint="문서 예제입니다. 실제 비밀번호를 입력하지 마세요." value={text} onChange={event=>setText(event.target.value)}/>:isNumber?<NumberInput {...flags} name="example" value={quantity} onValueChange={setQuantity} min={limited?0:undefined} max={limited?10:undefined} step={step}/>:name==='CurrencyInput'?<CurrencyInput {...flags} name="example" value={text} onValueChange={setText}/>:name==='PhoneInput'?<PhoneInput {...flags} name="example" value={text} onValueChange={setText}/>:name==='EmailInput'?<EmailInput {...flags} name="example" value={text} onValueChange={setText}/>:<><FormField label={label} required={required} error={errorText}><SearchField aria-label={label} disabled={disabled} required={required} value={text} onChange={event=>setText(event.target.value)}/></FormField><ul aria-label="로컬 검색 결과" className="form-detail-results">{results.map(item=><li key={item}>{item}</li>)}</ul><p role="status" className="help">검색 결과 {results.length}개</p></>;
  return <div className="connected-detail stack" data-form-input-detail={name}>
    <GalleryControls className="form-detail-controls">
      <label className="field"><span>value{isNumber?' (확정 값)':''}</span><Input aria-label="예제 value" value={isNumber?quantity:text} type={isNumber?'number':'text'} onChange={event=>isNumber?setQuantity(event.target.value===''?'':event.target.valueAsNumber):setText(event.target.value)}/></label>
      <div className="wrap"><Checkbox label="disabled" checked={disabled} onChange={event=>setDisabled(event.target.checked)}/><Checkbox label="required" checked={required} onChange={event=>setRequired(event.target.checked)}/><Checkbox label="error" checked={error} onChange={event=>setError(event.target.checked)}/></div>
      {name==='PasswordInput'&&<div className="wrap"><Checkbox label="readOnly" checked={readOnly} onChange={event=>setReadOnly(event.target.checked)}/><Checkbox label="aria-busy" checked={busy} onChange={event=>setBusy(event.target.checked)}/></div>}
      {isNumber&&<div className="wrap"><Checkbox label="min 0 / max 10" checked={limited} onChange={event=>setLimited(event.target.checked)}/><label className="inline-label">step<Select aria-label="숫자 입력 단위" value={step} onChange={event=>setStep(Number(event.target.value))}><option value={1}>1</option><option value={2}>2</option></Select></label></div>}
      <Button variant="ghost" onClick={reset}>초기화</Button>
    </GalleryControls>
    <div className="connected-preview" data-input-preview key={revision}>{preview}</div>
    <p className="help" role="status">{message}</p>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 값과 검증</summary>
      <p>{name==='SearchField'?'SearchField는 native search Input을 재사용합니다. value/defaultValue/onChange와 disabled/required 등 native 속성을 전달합니다. 위 검색 결과는 소비자 예제의 로컬 문자열 필터이며 검색 엔진·서버 요청이 아닙니다.':name==='PasswordInput'?'PasswordInput은 label과 native input 속성(value/defaultValue/onChange/name/required/disabled)을 전달합니다. 입력 내부 우측 eye 버튼은 실제 Radix Toggle이며 type=button/한국어 접근성 이름/aria-pressed를 제공합니다. 표시/숨김은 내부 상태입니다. readOnly는 값 편집을 막지만 보기는 바꿀 수 있고 aria-busy가 true이면 보기 토글을 막습니다. disabled는 native input과 버튼에 전달합니다. 비밀번호 강도·인증·서버 검증을 구현하지 않습니다. 예제 문자열은 실제 자격 증명이 아닙니다.':'label은 필수이며 value/defaultValue/onValueChange와 disabled/required/error/hint/name을 받습니다. value는 제어형, defaultValue는 초기 비제어형 값입니다.'}</p>
      <p>{isNumber?'value는 number 또는 빈 문자열입니다. min/max/step 기준을 검사하고 증가·감소 버튼은 경계에서 비활성화합니다. 범위·단위에 맞지 않는 수동 편집은 내부 draft에 남고 유효한 값만 onValueChange로 전달합니다. 현재 코드·value control은 확정 값을 표시하므로 invalid draft와 다를 수 있습니다. blur 뒤 오류 안내를 확인하세요.':name==='CurrencyInput'?'value는 쉼표 없는 문자열이며 편집 후 blur에서 유효한 금액을 ko-KR 천 단위로 표시합니다. 0 이상의 안전한 정수 범위만 유효합니다. formatted 표시와 원본 value를 구분하세요.':name==='PhoneInput'?'전화번호 입력은 tel 형식이며 지역/휴대전화 패턴을 검사합니다. 빈 필수 값 또는 잘못된 값은 blur 뒤 안내하고 native validity를 함께 사용합니다. 연락처의 실제 존재·인증 여부는 확인하지 않습니다.':name==='EmailInput'?'이메일 형식과 native validity를 사용하고 blur 뒤 오류를 안내합니다. 이메일 계정의 실제 존재·인증 여부는 확인하지 않습니다.':'미리보기에서 편집한 값은 value control과 현재 코드에도 반영됩니다. 표시/숨김 등 컴포넌트 내부 상태에는 외부 제어 prop이 없습니다.'}</p>
      <p>초기화 버튼은 이 제어형 예제가 소유한 value와 설정을 초기 값으로 되돌립니다. native form.reset()과는 별도 동작입니다.</p>
    </GalleryDocs>
  </div>;
}
