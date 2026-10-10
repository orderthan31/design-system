import { Fragment, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type HighlightProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & { children: string; query: string; caseSensitive?: boolean; markClassName?: string };
export const Highlight = forwardRef<HTMLSpanElement, HighlightProps>(function Highlight({ children, query, caseSensitive = false, markClassName, ...props }, ref) {
  if (!query) return <span {...props} ref={ref}>{children}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...children.matchAll(new RegExp(escaped, caseSensitive ? 'gu' : 'giu'))];
  let end = 0;
  const pieces = matches.map(match => { const start = match.index, before = children.slice(end, start); end = start + match[0].length; return <Fragment key={start}>{before}<mark className={cn('rounded-sm bg-g-muted text-g-ink font-medium', markClassName)}>{match[0]}</mark></Fragment>; });
  return <span {...props} ref={ref}>{pieces}{children.slice(end)}</span>;
});
