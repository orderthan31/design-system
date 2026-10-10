import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type GridProps = HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4; gap?: 'small' | 'medium' | 'large' };
const columnClasses = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' };
const gaps = { small: 'gap-2', medium: 'gap-4', large: 'gap-6' };
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid({ className, columns = 2, gap = 'medium', ...props }, ref) {
  return <div {...props} ref={ref} className={cn('grid min-w-0 [&>*]:min-w-0', columnClasses[columns], gaps[gap], className)}/>;
});
