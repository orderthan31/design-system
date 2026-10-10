export type DateParts={year:number;month:number;day:number};
export const daysInMonth=(year:number,month:number)=>[31,(year%4===0&&(year%100!==0||year%400===0))?29:28,31,30,31,30,31,31,30,31,30,31][month-1]??0;
export function parseDate(value:string):DateParts|null{if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;const [year,month,day]=value.split('-').map(Number);return year>=1&&year<=9999&&month>=1&&month<=12&&day>=1&&day<=daysInMonth(year,month)?{year,month,day}:null;}
export const dateString=({year,month,day}:DateParts)=>`${String(year).padStart(4,'0')}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
function localDate(parts:DateParts){const date=new Date(2000,0,1,12);date.setFullYear(parts.year,parts.month-1,parts.day);return date;}
export function todayString(){const date=new Date();return dateString({year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()});}
export function addDays(value:string,offset:number){const parts=parseDate(value);if(!parts)return value;const date=localDate(parts);date.setDate(date.getDate()+offset);if(date.getFullYear()<1||date.getFullYear()>9999)return value;return dateString({year:date.getFullYear(),month:date.getMonth()+1,day:date.getDate()});}
export function addMonths(value:string,offset:number){const parts=parseDate(value);if(!parts)return value;const count=(parts.year-1)*12+parts.month-1+offset;if(count<0||count>=9999*12)return value;const year=Math.floor(count/12)+1,month=count%12+1;return dateString({year,month,day:Math.min(parts.day,daysInMonth(year,month))});}
export function weekday(value:string){const parts=parseDate(value);return parts?localDate(parts).getDay():0;}
export function dateAllowed(value:string,min?:string,max?:string,disabledDates:readonly string[]=[]){return Boolean(parseDate(value))&&(!min||value>=min)&&(!max||value<=max)&&!disabledDates.includes(value);}
export function dateError(value:string,min?:string,max?:string,disabledDates:readonly string[]=[]){if(!value)return '';if(!parseDate(value))return '날짜를 YYYY-MM-DD 형식으로 입력해 주세요.';if(min&&value<min)return `${min} 이후 날짜를 선택해 주세요.`;if(max&&value>max)return `${max} 이전 날짜를 선택해 주세요.`;if(disabledDates.includes(value))return '선택할 수 없는 날짜예요.';return '';}
export function monthValid(value:string){return /^\d{4}-\d{2}$/.test(value)&&Boolean(parseDate(value+'-01'));}
export function timeMinutes(value:string){if(!/^\d{2}:\d{2}$/.test(value))return null;const [hour,minute]=value.split(':').map(Number);return hour<=23&&minute<=59?hour*60+minute:null;}
export const timeString=(minutes:number)=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export function timeError(value:string,min?:string,max?:string,step=1){if(!value)return '';const count=timeMinutes(value);if(count===null)return '시간을 HH:mm 형식으로 입력해 주세요.';if(min&&value<min)return `${min} 이후 시간을 선택해 주세요.`;if(max&&value>max)return `${max} 이전 시간을 선택해 주세요.`;if(count%step!==0)return `${step}분 간격으로 선택해 주세요.`;return '';}
