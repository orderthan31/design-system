import { Children, forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { List } from '../primitives/layout';
import { ActionGroup } from './action-group';
import { ListHeader } from './list-header';
import { ListFooter } from './list-footer';
export type SectionProps = HTMLAttributes<HTMLElement> & { heading: string; description?: string; actions?: ReactNode };
export const FormSection = forwardRef<HTMLElement, SectionProps>(function FormSection({ heading, description, actions, className, children, ...props }, ref) {
  const id = useId();
  return <section {...props} ref={ref} aria-labelledby={props['aria-labelledby'] ?? `${id}-title`} aria-describedby={props['aria-describedby'] ?? (description ? `${id}-description` : undefined)} className={cn('grid gap-5 min-w-0', className)}><header className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 id={`${id}-title`} className="break-words text-lg font-semibold">{heading}</h2>{description && <p id={`${id}-description`} className="mt-1 break-words text-g-small text-g-soft">{description}</p>}</div>{actions && <ActionGroup>{actions}</ActionGroup>}</header>{children}</section>;
});
export type ListPanelProps = SectionProps & { footer?: ReactNode; emptyState?: ReactNode; divider?: boolean; listProps?: Omit<HTMLAttributes<HTMLUListElement>, 'children'> };
export const ListPanel = forwardRef<HTMLElement, ListPanelProps>(function ListPanel({ heading, description, actions, footer, emptyState, divider, listProps, className, children, ...props }, ref) {
  const id = useId(), hasItems = Children.toArray(children).length > 0;
  return <section {...props} ref={ref} aria-labelledby={props['aria-labelledby'] ?? `${id}-title`} aria-describedby={props['aria-describedby'] ?? (description ? `${id}-description` : undefined)} className={cn('min-w-0', className)}><ListHeader heading={heading} headingId={`${id}-title`} description={description} descriptionId={`${id}-description`} actions={actions} className="border-0 border-b border-solid border-g-line pb-4"/>{hasItems ? <List {...listProps} aria-label={listProps?.['aria-label'] ?? heading} divider={divider}>{children}</List> : emptyState}{footer && <ListFooter>{footer}</ListFooter>}</section>;
});
