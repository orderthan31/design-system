import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type ContainerProps = HTMLAttributes<HTMLDivElement> & { width?: 'reading' | 'content' | 'wide' | 'full'; gutter?: boolean };
const widths = { reading: 'max-w-2xl', content: 'max-w-5xl', wide: 'max-w-7xl', full: 'max-w-none' };
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container({ className, width = 'content', gutter = true, ...props }, ref) {
  return <div {...props} ref={ref} className={cn('mx-auto w-full min-w-0', widths[width], gutter && 'px-4 sm:px-6', className)}/>;
});
