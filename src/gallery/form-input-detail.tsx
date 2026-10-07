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
  const component=name==='SearchField'?`<FormField label={${JSON.stringify(label)}} required={${required}}${errorText?` error={${JSON.stringify(errorText)}}`:''}>\n        <SearchField aria-label={${JSON.stringify(label)}} value={value} onChange={event => setValue(event.target.value)} disabled={${disabled}} required={${required}} />\n      </FormField>\n      <ul>{items.filter(item => item.toLowerCase().includes(value.trim().toLowerCase())).map(item => <li key={item}>{item}</li>)}</ul>`:`<${name} label={${JSON.stringify(label)}} name="example" value={value} ${callback}\n      disabled={${disabled}} required={${required}}${errorText?` error={${JSON.stringify(errorText)}}`:''}${isNumber?` step={${step}}${limited?' min={0} max={10}':''}`:''}${name==='PasswordInput'?` hint="문서 예제입니다. 실제 비밀번호를 입력하지 마세요." readOnly={${readOnly}} aria-busy={${busy}}`:''} />`;
  const source=`import { useState } from 'react';\nimport { ${name} } from './src/gyeol/components/${name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase()}';${name==='SearchField'?"\nimport { FormField } from './src/gyeol/components/form-field';":''}\n${name==='SearchField'?`\nconst items = ${JSON.stringify(searchItems)};\n`:''}\nexport function Example() {\n  const [value, setValue] = useState${isNumber?"<number | ''>":''}(${JSON.stringify(value)});\n  return (\n    <div className="ds-core">\n      ${component}\n    </div>\n  );\n}`;
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
    <GalleryDocs><summary>속성 · 값과 오류</summary>
      <p>{name==='SearchField'?'value/defaultValue·onChange와 input 속성을 사용합니다. 검색할 대상을 라벨로 설명하고 onChange에서 검색어를 필터나 요청에 연결하세요.':name==='PasswordInput'?'label과 input 속성을 전달합니다. 표시·숨김 버튼은 비밀번호의 보기 방식을 전환합니다. readOnly에서는 편집을 막지만 보기는 바꿀 수 있고 aria-busy가 true이면 보기 전환을 막습니다. disabled는 입력과 버튼에 적용합니다.':'label과 value/defaultValue·onValueChange를 사용합니다. value는 앱에서 관리하는 값이며 defaultValue는 초기값입니다. required·disabled·error·hint·name을 지정할 수 있습니다.'}</p>
      <p>{isNumber?'value는 숫자 또는 빈 문자열입니다. min·max·step으로 범위와 단위를 지정합니다. 범위에 맞지 않는 편집은 입력에 남고 유효한 값만 onValueChange로 전달합니다. 입력을 마친 뒤 오류 안내를 확인하세요.':name==='CurrencyInput'?'value에는 쉼표 없는 문자열을 사용합니다. 입력을 마치면 0 이상의 안전한 정수를 한국어 천 단위로 표시합니다. 저장에는 원본 value를 사용하세요.':name==='PhoneInput'?'전화번호 형식을 확인하고 입력을 마친 뒤 오류를 안내합니다. 실제 연락처 확인이 필요하면 별도 인증을 연결하세요.':name==='EmailInput'?'이메일 형식을 확인하고 입력을 마친 뒤 오류를 안내합니다. autoComplete=email로 입력을 돕고 계정 확인은 인증에 연결하세요.':'미리보기의 입력값은 현재 코드에도 반영됩니다. 비밀번호 보기 방식은 입력 옆 버튼으로 바꿀 수 있습니다.'}</p>
      <p>예제의 초기화 버튼은 입력값과 설정을 시작 상태로 되돌립니다. 앱의 폼을 초기화할 때는 관리하는 value도 함께 갱신하세요.</p>
    </GalleryDocs>
  </div>;
}
