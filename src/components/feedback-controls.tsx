import React,{useId,useState} from 'react';
import {Button} from './atoms';import {Alert,EmptyState} from './feedback';import {Progress,Skeleton} from './primitives';import {Icon,IconAction} from './icons';
import {Accordion} from "./accordion";
export {Accordion ,type AccordionItem} from "./accordion";
import {Collapse} from "./collapse";
export {Collapse} from "./collapse";
import {LoadingSpinner} from "./loading-spinner";
export {LoadingSpinner} from "./loading-spinner";
import {ErrorState} from "./error-state";
export {ErrorState} from "./error-state";
import {Toast} from "./toast";
export {Toast} from "./toast";
export function FeedbackGallery(){const [state,setState]=useState<'ready'|'loading'|'empty'|'error'>('ready');const [toast,setToast]=useState(false);return <section aria-label="상태와 펼침"><h2>상태</h2><div className="ds-actions"><Button onClick={()=>setState('loading')}>불러오기</Button><Button variant="secondary" onClick={()=>setState('empty')}>빈 결과 보기</Button><Button variant="secondary" onClick={()=>setState('error')}>실패 보기</Button><Button variant="secondary" onClick={()=>{setState('ready');setToast(true);}}>알림 보기</Button></div>{state==='loading'?<><LoadingSpinner/><Skeleton/><Progress label="진행 중"/></>:state==='empty'?<EmptyState title="결과 없음" action="다시 불러오기" onAction={()=>setState('loading')}>검색 조건을 바꿔 보세요.</EmptyState>:state==='error'?<ErrorState onRetry={()=>setState('loading')}/>:<Alert tone="success" title="준비 완료">내용을 불러왔습니다.</Alert>}{toast&&<Toast message="작업이 완료되었습니다" onDismiss={()=>setToast(false)}/>}<h2>펼침</h2><Accordion items={[{id:'a',title:'단일 펼침 1',content:'첫 내용'},{id:'b',title:'단일 펼침 2',content:'둘째 내용'}]}/><Accordion multiple items={[{id:'a',title:'복수 펼침 1',content:'첫 내용'},{id:'b',title:'복수 펼침 2',content:'둘째 내용'}]}/><Collapse title="상세 펼치기">독립적으로 펼치는 내용</Collapse></section>;}
