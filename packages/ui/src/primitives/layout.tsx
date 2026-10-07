import { forwardRef, type HTMLAttributes, type LiHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export const Stack = forwardRef<HTMLDivElement,HTMLAttributes<HTMLDivElement>>(function Stack({className,...props},ref){return <div {...props} ref={ref} className={cn('flex flex-col gap-4 min-w-0',className)} />;});
export const Row = forwardRef<HTMLDivElement,HTMLAttributes<HTMLDivElement>>(function Row({className,...props},ref){return <div {...props} ref={ref} className={cn('flex flex-wrap items-center gap-3 min-w-0',className)} />;});
export const List = forwardRef<HTMLUListElement,HTMLAttributes<HTMLUListElement>>(function List({className,...props},ref){return <ul {...props} ref={ref} className={cn('m-0 list-none p-0 divide-y divide-g-line',className)} />;});
export const ListItem = forwardRef<HTMLLIElement,LiHTMLAttributes<HTMLLIElement>>(function ListItem({className,...props},ref){return <li {...props} ref={ref} className={cn('flex flex-wrap items-center gap-4 py-5 min-w-0',className)} />;});
