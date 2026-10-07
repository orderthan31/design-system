import React from "react";
import { Field, described, type FieldProps } from "./field-frame";
import { Button } from "./button";
import { Icon } from "./icon";
import "./file-input.css";
export type FileInputProps = FieldProps & {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
};

export function FileInput({label,accept,multiple,onFilesChange,hint,error,id:supplied,...props}:FileInputProps) {
 const generated=React.useId(),id=supplied??generated;
 const input=React.useRef<HTMLInputElement>(null);
 const [files,setFiles]=React.useState<File[]>([]),[failure,setFailure]=React.useState(''),[dragging,setDragging]=React.useState(false);
 const dragDepth=React.useRef(0),callback=React.useRef(onFilesChange);callback.current=onFilesChange;
 const message=error||failure||undefined;
 const allowed=(file:File)=>!accept||accept.split(',').some(entry=>{const rule=entry.trim().toLowerCase();return rule.startsWith('.')?file.name.toLowerCase().endsWith(rule):rule.endsWith('/*')?file.type.toLowerCase().startsWith(rule.slice(0,-1)):file.type.toLowerCase()===rule;});
 const reject=(reason:string)=>{if(input.current){input.current.value='';input.current.setCustomValidity(reason);}setFiles([]);setFailure(reason);callback.current?.([]);};
 const publish=()=>{const element=input.current;if(!element||props.disabled)return;const next=Array.from(element.files??[]);if(!multiple&&next.length>1){reject('파일을 한 개만 선택해 주세요.');return;}if(next.some(file=>!allowed(file))){reject('허용된 파일 형식을 선택해 주세요.');return;}element.setCustomValidity('');setFailure('');setFiles(next);callback.current?.(next);};
 const clear=()=>{if(props.disabled)return;if(input.current){input.current.value='';input.current.setCustomValidity('');}setFailure('');setFiles([]);callback.current?.([]);};
 const choose=()=>{if(!props.disabled)input.current?.click();};
 const drop=(event:React.DragEvent)=>{event.preventDefault();dragDepth.current=0;setDragging(false);if(props.disabled)return;const next=Array.from(event.dataTransfer.files);if(!next.length)return;if(!multiple&&next.length>1){reject('파일을 한 개만 선택해 주세요.');return;}if(next.some(file=>!allowed(file))){reject('허용된 파일 형식을 선택해 주세요.');return;}
  try{const transfer=new DataTransfer();next.forEach(file=>transfer.items.add(file));const element=input.current;if(!element)throw Error('missing input');element.files=transfer.files;const actual=Array.from(element.files??[]);if(actual.length!==next.length||actual.some((file,index)=>file.name!==next[index].name||file.size!==next[index].size||file.type!==next[index].type))throw Error('FileList assignment failed');publish();}
  catch{reject('드롭한 파일을 입력에 연결하지 못했어요. 파일 선택 버튼을 사용해 주세요.');}
 };
 React.useEffect(()=>{const element=input.current,form=element?.form;if(!element||!form)return;const reset=(event:Event)=>{queueMicrotask(()=>{if(event.defaultPrevented||!element.isConnected)return;element.setCustomValidity('');setFailure('');setFiles(Array.from(element.files??[]));setDragging(false);dragDepth.current=0;});};form.addEventListener('reset',reset);return()=>form.removeEventListener('reset',reset);});
 return <Field {...props} label={label} id={id} hint={hint} error={message}>
  <input {...props} ref={input} id={id} type="file" className="fc-file-native" accept={accept} multiple={multiple} tabIndex={-1} aria-hidden="true" aria-invalid={!!message} aria-describedby={described(id,hint,message)} onChange={publish} onInvalid={event=>{event.preventDefault();event.currentTarget.parentElement?.querySelector<HTMLButtonElement>('[data-file-choose]')?.focus();}}/>
  <div className="fc-file-drop" role="group" aria-label={`${label} 파일 선택`} aria-disabled={props.disabled} aria-describedby={described(id,hint,message)} data-dragging={dragging} data-invalid={!!message}
   onClick={event=>{if(!(event.target instanceof Element)||event.target.closest('button'))return;choose();}}
   onDragEnter={event=>{if(!event.dataTransfer.types.includes('Files'))return;event.preventDefault();if(!props.disabled){dragDepth.current++;setDragging(true);}}}
   onDragOver={event=>{event.preventDefault();event.dataTransfer.dropEffect=props.disabled?'none':'copy';}}
   onDragLeave={event=>{event.preventDefault();dragDepth.current=Math.max(0,dragDepth.current-1);if(!dragDepth.current)setDragging(false);}}
   onDrop={drop}>
   <Icon name="upload" size={28}/><p>{dragging?'여기에 파일을 놓으세요':'파일을 끌어 놓거나 선택하세요'}</p>
   <Button variant="secondary" disabled={props.disabled} data-file-choose aria-label={`${label} 파일 선택${props.required?' (필수)':''}`} onClick={choose}>파일 선택</Button>
   {accept&&<p className="help">허용 형식: {accept}</p>}
  </div>
  <div className="fc-file-summary"><span role="status">{files.length?`${files.length}개 파일 선택됨`:'선택한 파일 없음'}</span>{(files.length>0||failure)&&<Button variant="ghost" disabled={props.disabled} onClick={clear}>비우기</Button>}</div>
  {files.length>0&&<ul className="fc-file-list" aria-label="선택한 파일">{files.map((file,index)=><li key={`${file.name}-${index}`}><Icon name="file"/><span>{file.name}</span></li>)}</ul>}
 </Field>;
}
