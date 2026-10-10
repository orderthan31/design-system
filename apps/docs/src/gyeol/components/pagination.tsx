import { forwardRef, useState, type HTMLAttributes } from 'react';
import { Button } from '../primitives/button';
import { Icon } from '../primitives/icon';
import { cn } from '../lib/cn';
export type PaginationProps=HTMLAttributes<HTMLElement>&{page?:number;defaultPage?:number;totalPages:number;onPageChange?:(page:number)=>void;disabled?:boolean};
export const Pagination=forwardRef<HTMLElement,PaginationProps>(function Pagination({page,defaultPage=1,totalPages,onPageChange,disabled=false,className,...props},ref){
 const total=Number.isFinite(totalPages)?Math.max(1,Math.floor(totalPages)):1;
 const [internal,setInternal]=useState(defaultPage);const raw=page??internal;const current=Number.isFinite(raw)?Math.min(total,Math.max(1,Math.floor(raw))):1;
 const change=(next:number)=>{if(disabled||next<1||next>total||next===current)return;if(page===undefined)setInternal(next);onPageChange?.(next);};
 const pages=Array.from(new Set([1,current-1,current,current+1,total])).filter(value=>value>=1&&value<=total).sort((a,b)=>a-b);
 return <nav {...props} ref={ref} aria-label={props['aria-label']??'페이지 이동'} className={cn('flex min-w-0 flex-wrap items-center justify-center gap-1',className)}>
  <Button variant="quiet" size="small" disabled={disabled||current===1} onClick={()=>change(current-1)} aria-label="이전 페이지"><Icon name="arrowLeft"/></Button>
  {pages.map((value,index)=><span key={value} className="inline-flex items-center gap-1">{index>0&&value-pages[index-1]>1&&<span aria-hidden="true" className="px-1 text-g-soft">…</span>}<Button variant={value===current?'primary':'quiet'} size="small" disabled={disabled} aria-label={`${value}페이지`} aria-current={value===current?'page':undefined} onClick={()=>change(value)}>{value}</Button></span>)}
  <Button variant="quiet" size="small" disabled={disabled||current===total} onClick={()=>change(current+1)} aria-label="다음 페이지"><Icon name="arrowRight"/></Button>
 </nav>;
});
