import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/icon';
import { IconButton } from '../primitives/icon-button';
import { cn } from '../lib/cn';
export type AlertTone='info'|'success'|'warning'|'error';
export type AlertProps=Omit<HTMLAttributes<HTMLDivElement>,'title'> & {title:ReactNode;tone?:AlertTone;actions?:ReactNode;onDismiss?:()=>void;dismissLabel?:string;announce?:boolean};
const glyphs:Record<AlertTone,IconName>={info:'info',success:'circleCheck',warning:'alertTriangle',error:'alertCircle'};
export const Alert=forwardRef<HTMLDivElement,AlertProps>(function Alert({title,tone='info',actions,onDismiss,dismissLabel='알림 닫기',announce=false,children,className,role,...props},ref){
 const id=useId();return <div {...props} ref={ref} role={role??(announce?(tone==='error'?'alert':'status'):undefined)} aria-labelledby={props['aria-labelledby']??id} className={cn('flex min-w-0 items-start gap-3 rounded-g-panel bg-g-muted p-4 text-g-ink',className)}>
 <Icon name={glyphs[tone]} className={tone==='error'?'mt-1 text-g-danger':'mt-1 text-g-action'}/><div className="grid min-w-0 flex-1 gap-2"><h3 id={id} className="break-words font-semibold">{title}</h3>{children&&<div className="break-words text-g-small text-g-soft">{children}</div>}{actions&&<div className="flex flex-wrap items-center gap-2">{actions}</div>}</div>
 {onDismiss&&<IconButton variant="quiet" icon="close" label={dismissLabel} onClick={onDismiss}/>}
 </div>;
});
