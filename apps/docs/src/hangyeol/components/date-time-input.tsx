import { useRef,type HTMLAttributes } from 'react';
import { DatePicker } from './date-picker';
import { TimeInput } from './time-input';
import { Button } from '../primitives/button';
import { useFieldState } from '../lib/use-field-state';
import { parseDate,timeMinutes } from '../lib/date-utils';
import { cn } from '../lib/cn';
export type DateTimeValue={date:string;time:string};
export type DateTimeInputProps=Omit<HTMLAttributes<HTMLFieldSetElement>,'defaultValue'|'onChange'> & {label:string;value?:DateTimeValue;defaultValue?:DateTimeValue;onValueChange?:(value:DateTimeValue)=>void;min?:string;max?:string;step?:number;name?:string;form?:string;disabled?:boolean;readOnly?:boolean;required?:boolean;error?:string};
const empty:DateTimeValue={date:'',time:''};
export function DateTimeInput({label,value,defaultValue=empty,onValueChange,min,max,step,name,form,disabled,readOnly,required,error,className,...props}:DateTimeInputProps){const root=useRef<HTMLFieldSetElement>(null);const [current,change]=useFieldState(value,defaultValue,onValueChange,root,form);const combined=current.date+'T'+current.time,complete=Boolean(parseDate(current.date)&&timeMinutes(current.time)!==null),range=complete&&min&&combined<min?'최소 날짜·시간 이후로 선택해 주세요.':complete&&max&&combined>max?'최대 날짜·시간 이전으로 선택해 주세요.':'';
 return <fieldset {...props} ref={root} disabled={disabled} form={form} className={cn('grid min-w-0 gap-4 border-0 p-0',className)}><legend className="mb-3 font-medium">{label}</legend><DatePicker label="날짜" name={name&&name+'.date'} form={form} required={required} value={current.date} onValueChange={date=>change({...current,date})} min={min?.slice(0,10)} max={max?.slice(0,10)} disabled={disabled} readOnly={readOnly}/><TimeInput label="시간" name={name&&name+'.time'} form={form} required={required} value={current.time} onValueChange={time=>change({...current,time})} min={min?.slice(0,10)===current.date?min.slice(11):undefined} max={max?.slice(0,10)===current.date?max.slice(11):undefined} step={step} error={error||range} disabled={disabled} readOnly={readOnly}/><div><Button variant="quiet" size="small" disabled={disabled||readOnly||(!current.date&&!current.time)} onClick={()=>change(empty)}>날짜·시간 지우기</Button></div></fieldset>;
}
