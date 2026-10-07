import {GalleryDocs,GalleryControls} from './workbench';
import React from 'react';
import { MonthPicker, TimeInput, DateTimeInput } from '../components/date-controls';
import { FileInput, AddressField, type AddressValue } from '../components/form-controls';
import { Button, Input } from '../components/atoms';
import { Checkbox, Select } from '../components/primitives';
import { CodeBlock } from './code-block';

export const extendedInputDetailNames=['FileInput','AddressField','MonthPicker','TimeInput','DateTimeInput'] as const;
export type ExtendedInputDetailName=typeof extendedInputDetailNames[number];
export function hasExtendedInputDetail(name:string):name is ExtendedInputDetailName{return (extendedInputDetailNames as readonly string[]).includes(name);}
type DateName='MonthPicker'|'TimeInput'|'DateTimeInput';
const dateDefaults={MonthPicker:'2026-10',TimeInput:'10:30',DateTimeInput:'2026-10-06T10:30'};
const dateLabels={MonthPicker:'기준 월',TimeInput:'기준 시간',DateTimeInput:'기준 날짜와 시간'};
const dateLimits={MonthPicker:['2026-01','2026-12'],TimeInput:['09:00','18:00'],DateTimeInput:['2026-10-01T09:00','2026-10-31T18:00']} as const;
function DateDetail({name}:{name:DateName}) {
  const [value,setValue]=React.useState(dateDefaults[name]),[valid,setValid]=React.useState(true);
  const [disabled,setDisabled]=React.useState(false),[readOnly,setReadOnly]=React.useState(false),[busy,setBusy]=React.useState(false),[required,setRequired]=React.useState(false),[error,setError]=React.useState(false),[limited,setLimited]=React.useState(true),[blocked,setBlocked]=React.useState(false);
  const [revision,setRevision]=React.useState(0);
  const flags={label:dateLabels[name],value,onChange:setValue,onValidityChange:setValid,disabled,readOnly,busy,required,error:error?'입력 내용을 확인하세요.':undefined,min:limited?dateLimits[name][0]:undefined,max:limited?dateLimits[name][1]:undefined};
  const source=`import { useState } from 'react';\nimport { ${name} } from './src';\nimport './src/core.css';\n\nexport function Example() {\n  const [value, setValue] = useState(${JSON.stringify(value)});\n  const [valid, setValid] = useState(${valid});\n  return (\n    <div className="ds-core">\n      <${name} label=${JSON.stringify(flags.label)} value={value} onChange={setValue} onValidityChange={setValid}\n        disabled={${disabled}} readOnly={${readOnly}} busy={${busy}} required={${required}}${flags.error?` error=${JSON.stringify(flags.error)}`:''}${limited?` min=${JSON.stringify(flags.min)} max=${JSON.stringify(flags.max)}`:''}${name==='DateTimeInput'&&blocked?' disabledDates={["2026-10-10"]}':''} />\n      <p>확정 value: {value || '미선택'} · 유효성: {valid ? '유효' : '확인 필요'}</p>\n    </div>\n  );\n}`;
  const reset=()=>{setValue(dateDefaults[name]);setDisabled(false);setReadOnly(false);setBusy(false);setRequired(false);setError(false);setLimited(true);setBlocked(false);setRevision(n=>n+1);};
  return <div className="connected-detail stack" data-extended-input-detail={name}>
    <div data-extended-preview key={revision}>{name==='MonthPicker'?<MonthPicker {...flags}/>:name==='TimeInput'?<TimeInput {...flags}/>:<DateTimeInput {...flags} disabledDates={blocked?['2026-10-10']:undefined}/>}</div>
    <GalleryControls className="form-detail-controls"><label className="field"><span>확정 value</span><Input aria-label="확정 value control" value={value} onChange={event=>setValue(event.target.value)}/></label>
      <div className="wrap">{[{label:'disabled',value:disabled,set:setDisabled},{label:'readOnly',value:readOnly,set:setReadOnly},{label:'busy',value:busy,set:setBusy},{label:'required',value:required,set:setRequired},{label:'error',value:error,set:setError},{label:'범위 제한',value:limited,set:setLimited}].map(control=><Checkbox key={control.label} label={control.label} checked={control.value} onChange={event=>control.set(event.target.checked)}/>)}{name==='DateTimeInput'&&<Checkbox label="2026-10-10 선택 제한" checked={blocked} onChange={event=>setBlocked(event.target.checked)}/>}</div>
      <Button variant="ghost" onClick={reset}>초기화</Button>
<p className="help" data-committed-value>확정 value: {value||'미선택'} · 유효성: {valid?'유효':'확인 필요'}</p>
    </GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 값과 유효성</summary><p>{name==='MonthPicker'?'value는 YYYY-MM 형식입니다. 연도와 월을 선택하거나 지울 수 있으며 min·max로 범위를 지정합니다.':name==='TimeInput'?'value는 HH:mm 형식입니다. 시계나 24시간 목록에서 시·분을 조절한 뒤 확인하면 값을 확정합니다. min·max 경계도 선택 범위에 포함합니다.':'value는 시간대 없는 YYYY-MM-DDTHH:mm 형식입니다. disabledDates로 날짜를 제한하고 min·max 경계 날짜에서는 시간 범위도 제한합니다.'}</p>
      <p>value/onChange로 값을 관리하거나 defaultValue로 초기값을 지정하세요. 선택 중인 임시 값과 확정 값을 구분합니다. onChange가 발생해도 빈 값이나 부분값일 수 있으므로 제출 전에는 onValidityChange를 함께 확인하세요.</p>
      <p>disabled·readOnly·busy 상태에서는 편집과 선택을 제한합니다. busy는 선택 버튼에 진행 상태를 표시합니다. min·max는 양 끝을 포함합니다. 폼 제출에는 앱이 관리하는 확정 값을 연결하세요.</p>
    </GalleryDocs>
  </div>;
}
function FileDetail() {
  const [accept,setAccept]=React.useState('.txt'),[multiple,setMultiple]=React.useState(false),[required,setRequired]=React.useState(false),[disabled,setDisabled]=React.useState(false),[error,setError]=React.useState(false),[files,setFiles]=React.useState<File[]>([]),[revision,setRevision]=React.useState(0);
  const reset=()=>{setFiles([]);setAccept('.txt');setMultiple(false);setRequired(false);setDisabled(false);setError(false);setRevision(n=>n+1);};
  const source=`import { useState } from 'react';\nimport { FileInput, Button } from './src';\nimport './src/core.css';\n\nexport function Example() {\n  const [files, setFiles] = useState<File[]>([]);\n  const [revision, setRevision] = useState(0);\n  return (\n    <div className="ds-core">\n      <FileInput key={revision} label="첨부 파일" name="attachment" accept=${JSON.stringify(accept)} multiple={${multiple}} required={${required}} disabled={${disabled}}${error?' error="파일 선택 내용을 확인하세요."':''} hint="선택한 파일은 업로드하거나 외부로 전송하지 않습니다." onFilesChange={setFiles} />\n      <p>선택 파일: {files.map(file => file.name).join(', ') || '없음'}</p>\n      <Button variant="ghost" onClick={() => { setFiles([]); setRevision(value => value + 1); }}>선택 비우기</Button>\n    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-extended-input-detail="FileInput">
    <div data-extended-preview key={revision}><FileInput label="첨부 파일" name="attachment" hint="선택한 파일은 업로드하거나 외부로 전송하지 않습니다." accept={accept} multiple={multiple} required={required} disabled={disabled} error={error?'파일 선택 내용을 확인하세요.':undefined} onFilesChange={setFiles}/></div>
    <GalleryControls className="form-detail-controls"><label className="field"><span>accept</span><Select aria-label="허용 파일 형식" value={accept} onChange={event=>setAccept(event.target.value)}><option value=".txt">.txt</option><option value="image/*">image/*</option><option value=".txt,image/*">.txt,image/*</option><option value="">제한 없음</option></Select></label><div className="wrap">{[{label:'multiple',value:multiple,set:setMultiple},{label:'required',value:required,set:setRequired},{label:'disabled',value:disabled,set:setDisabled},{label:'error',value:error,set:setError}].map(control=><Checkbox key={control.label} label={control.label} checked={control.value} onChange={event=>control.set(event.target.checked)}/>)}</div><Button variant="ghost" onClick={reset}>초기화</Button><p className="help" data-file-result>선택 콜백: {files.map(file=>file.name).join(', ')||'없음'}</p></GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 파일 선택</summary><p>label과 accept·multiple·onFilesChange를 사용합니다. required·disabled·error·hint·id·name을 지정할 수 있습니다. 선택 결과는 실제 입력에 보관되며 onFilesChange에서 File 배열을 받습니다.</p><p>accept는 확장자, MIME 유형 또는 MIME 유형 그룹으로 지정합니다. 클릭 선택과 끌어 놓기에 같은 제한을 적용합니다. 허용하지 않는 파일이 있거나 여러 파일을 허용하지 않는 입력에 여러 파일을 놓으면 전체 선택을 비우고 오류를 안내합니다. 올바른 파일을 다시 선택하면 형식 오류를 해제합니다.</p><p>비우기 버튼은 파일 선택을 지우고 빈 배열을 전달합니다. form.reset은 입력과 표시 목록을 초기화하지만 onFilesChange를 호출하지 않습니다. 앱에서 보관하는 File 배열도 초기화하려면 폼의 onReset에서 처리하세요. 파일 전송과 용량 제한은 전송 로직에 연결합니다.</p></GalleryDocs>
  </div>;
}
const emptyAddress:AddressValue={postal:'',road:'',jibun:'',detail:''};
const sampleAddress:AddressValue={postal:'12345',road:'예시로 123',jibun:'예시동 123-4',detail:'101호'};
function AddressDetail() {
  const [value,setValue]=React.useState<AddressValue>(emptyAddress),[disabled,setDisabled]=React.useState(false),[required,setRequired]=React.useState(false),[error,setError]=React.useState(false),[revision,setRevision]=React.useState(0);
  const reset=()=>{setValue(emptyAddress);setDisabled(false);setRequired(false);setError(false);setRevision(n=>n+1);};
  const source=`import { useState } from 'react';\nimport { AddressField, Button, type AddressValue } from './src';\nimport './src/core.css';\n\nconst sample: AddressValue = ${JSON.stringify(sampleAddress)};\n\nexport function Example() {\n  const [value, setValue] = useState<AddressValue>(${JSON.stringify(value)});\n  return (\n    <div className="ds-core">\n      <AddressField label="예시 주소" name="address" value={value} onValueChange={setValue} disabled={${disabled}} required={${required}}${error?' error="주소 내용을 확인하세요."':''} hint="로컬 샘플입니다. 실제 주소 검색 서비스가 아닙니다." searchSlot={select => <Button variant="secondary" disabled={${disabled}} onClick={() => select(sample)}>로컬 샘플 선택</Button>} />\n    </div>\n  );\n}`;
  return <div className="connected-detail stack" data-extended-input-detail="AddressField">
    <div data-extended-preview key={revision}><AddressField label="예시 주소" name="address" value={value} onValueChange={setValue} disabled={disabled} required={required} error={error?'주소 내용을 확인하세요.':undefined} hint="로컬 샘플입니다. 실제 주소 검색 서비스가 아닙니다." searchSlot={select=><Button variant="secondary" disabled={disabled} onClick={()=>select(sampleAddress)}>로컬 샘플 선택</Button>}/></div>
    <GalleryControls className="form-detail-controls"><div className="selection-text-controls">{(['postal','road','jibun','detail'] as const).map(key=><label key={key} className="field"><span>value.{key}</span><Input aria-label={`확정 ${key} control`} value={value[key]} onChange={event=>{const text=event.target.value;setValue(previous=>({...previous,[key]:text}));}}/></label>)}</div><div className="wrap">{[{label:'disabled',value:disabled,set:setDisabled},{label:'required',value:required,set:setRequired},{label:'error',value:error,set:setError}].map(control=><Checkbox key={control.label} label={control.label} checked={control.value} onChange={event=>control.set(event.target.checked)}/>)}</div><Button variant="ghost" onClick={reset}>초기화</Button></GalleryControls>
    <GalleryDocs open><summary>현재 코드</summary><CodeBlock source={source}/></GalleryDocs>
    <GalleryDocs><summary>Props · 주소와 검색 어댑터</summary><p>value/defaultValue는 postal·road·jibun·detail 문자열 객체입니다. onValueChange로 전체 주소를 받습니다. name을 지정하면 필드별 이름을 연결합니다. required는 우편번호와 도로명 주소에 적용하며 우편번호는 5자리입니다.</p><p>onSearch(select) 또는 searchSlot(select)으로 주소 검색을 연결하세요. 선택한 주소를 select에 전달하면 입력값을 갱신합니다. searchSlot 안의 버튼에는 disabled 상태를 함께 지정하세요.</p><p>주소 입력의 error에는 사용자가 수정할 내용을 적으세요. 실제 주소와 배송 가능 여부는 연결한 서비스에서 확인합니다. 예제의 주소는 형식을 보여주는 샘플입니다.</p></GalleryDocs>
  </div>;
}
export function ExtendedInputDetail({name}:{name:ExtendedInputDetailName}) {return name==='FileInput'?<FileDetail/>:name==='AddressField'?<AddressDetail/>:<DateDetail name={name}/>;}
