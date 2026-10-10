import { forwardRef, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Alert } from './alert';
import { Button } from '../primitives/button';
import { cn } from '../lib/cn';
export type ErrorStateProps=Omit<HTMLAttributes<HTMLElement>,'title'> & {title?:string;message:string;details?:ReactNode;actions?:ReactNode;onRetry?:()=>void|Promise<void>;retryLabel?:string;busy?:boolean;disabled?:boolean};
export const ErrorState=forwardRef<HTMLElement,ErrorStateProps>(function ErrorState({title='내용을 불러오지 못했어요.',message,details,actions,onRetry,retryLabel='다시 시도',busy=false,disabled=false,className,...props},ref){
 const [pending,setPending]=useState(false),[retryError,setRetryError]=useState('');const running=useRef(false);
 const retry=async()=>{if(!onRetry||disabled||busy||running.current)return;running.current=true;setPending(true);setRetryError('');try{await onRetry();}catch{setRetryError('다시 시도하지 못했어요. 잠시 후 다시 시도해 주세요.');}finally{running.current=false;setPending(false);}};
 return <section {...props} ref={ref} aria-busy={busy||pending||undefined} className={cn('grid min-w-0 gap-4',className)}><Alert tone="error" title={title}>{message}</Alert>
 {details&&<details className="break-words text-g-small text-g-soft"><summary className="cursor-pointer py-2 focus-visible:outline-3 focus-visible:outline-g-focus">자세한 안내</summary><div className="py-2">{details}</div></details>}
 {(onRetry||actions)&&<div className="flex flex-wrap gap-3">{onRetry&&<Button variant="secondary" disabled={disabled} loading={busy||pending} onClick={()=>void retry()}>{retryLabel}</Button>}{actions}</div>}
 {retryError&&<p role="alert" className="text-g-small text-g-danger">{retryError}</p>}
 </section>;
});
