import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../lib/cn';
export type ActionGroupProps = HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' | 'between' };

export const ActionGroup = forwardRef<HTMLDivElement, ActionGroupProps>(function ActionGroup({ className, align = 'end', ...props }, ref) {
  return <div {...props} ref={ref} className={cn('flex min-w-0 flex-wrap items-center gap-3', align === 'start' ? 'justify-start' : align === 'between' ? 'justify-between' : 'justify-end', className)}/>;
});
