import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ActionGroup } from './action-group';
import { cn } from '../lib/cn';
export type ListFooterProps = HTMLAttributes<HTMLElement> & { actions?: ReactNode };
export const ListFooter = forwardRef<HTMLElement, ListFooterProps>(function ListFooter({ actions, children, className, ...props }, ref) {
  return <footer {...props} ref={ref} className={cn('flex min-w-0 flex-wrap items-center justify-between gap-3 pt-4', className)}><div className="min-w-0 break-words text-g-small text-g-soft">{children}</div>{actions && <ActionGroup>{actions}</ActionGroup>}</footer>;
});
