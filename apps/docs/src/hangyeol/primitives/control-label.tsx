import { forwardRef, type LabelHTMLAttributes, type HTMLAttributes, type Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/cn';
import './control-label.css';
export const ControlLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(function ControlLabel({ className, ...props }, ref) {
  return <label {...props} ref={ref} className={cn('hangyeol-control-label', className)}/>;
});
/** Input focus treatment for a composed control row; layout is caller-owned. */
export const ControlGroup = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { asChild?: boolean }>(function ControlGroup({ asChild = false, className, ...props }, ref) {
  const classes = cn('hangyeol-control-group', className);
  return asChild ? <Slot {...props} ref={ref} className={classes}/> : <div {...props} ref={ref as Ref<HTMLDivElement>} className={classes}/>;
});
