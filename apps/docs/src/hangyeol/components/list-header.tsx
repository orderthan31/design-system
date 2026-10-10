import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ActionGroup } from './action-group';
import { cn } from '../lib/cn';
export type ListHeaderProps = HTMLAttributes<HTMLElement> & { heading: string; headingId?: string; description?: string; descriptionId?: string; count?: number; leading?: ReactNode; actions?: ReactNode };
export const ListHeader = forwardRef<HTMLElement, ListHeaderProps>(function ListHeader({ heading, headingId, description, descriptionId, count, leading, actions, className, ...props }, ref) {
  return <header {...props} ref={ref} className={cn('flex min-w-0 flex-wrap items-start justify-between gap-3', className)}><div className="flex min-w-0 flex-1 items-start gap-3">{leading}<div className="min-w-0"><h2 id={headingId} className="break-words text-lg font-semibold">{heading}{count !== undefined && <span className="ml-2 text-g-small font-normal text-g-soft">{count}개</span>}</h2>{description && <p id={descriptionId} className="mt-1 break-words text-g-small text-g-soft">{description}</p>}</div></div>{actions && <ActionGroup>{actions}</ActionGroup>}</header>;
});
