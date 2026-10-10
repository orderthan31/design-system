import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/cn';
import './preview-surface.css';
/** asChild preserves the child's native form/section/article, events and ref. */
export const PreviewSurface = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { asChild?: boolean }>(function PreviewSurface({ asChild = false, className, ...props }, ref) {
  const classes = cn('hangyeol-preview-surface', className);
  return asChild ? <Slot {...props} ref={ref} className={classes}/> : <div {...props} ref={ref as Ref<HTMLDivElement>} className={classes}/>;
});
