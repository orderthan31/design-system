import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { Icon } from '../primitives/icon';
import { Button } from '../primitives/button';
export type ResultProps=Omit<HTMLAttributes<HTMLElement>,'title'> & {title:string;message?:string;status?:'success'|'error'|'info';actions?:ReactNode;onRetry?:()=>void|Promise<void>;onNext?:()=>void;nextLabel?:string;busy?:boolean;disabled?:boolean};
export const Result=forwardRef<HTMLElement,ResultProps>(function Result({title,message,status='success',actions,onRetry,onNext,nextLabel='다음으로',busy=false,disabled=false,...props},ref){
 if(status==='error')return <ErrorState {...props} ref={ref} title={title} message={message??'잠시 후 다시 시도해 주세요.'} onRetry={onRetry} busy={busy} disabled={disabled} actions={actions}/>;
 return <EmptyState {...props} ref={ref} heading={title} description={message} illustration={<Icon name={status==='success'?'circleCheck':'info'} size="large" className="text-g-action"/>} actions={<>{actions}{onNext&&<Button onClick={onNext} loading={busy} disabled={disabled}>{nextLabel}</Button>}</>}/>;
});
