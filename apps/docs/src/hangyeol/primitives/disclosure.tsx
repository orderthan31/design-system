import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/cn';
import './disclosure.css';
export const Disclosure = forwardRef<HTMLDetailsElement, ComponentPropsWithoutRef<'details'>>(function Disclosure({ className, ...props }, ref) {
  return <details {...props} ref={ref} className={cn('hangyeol-disclosure', className)}/>;
});
export const DisclosureSummary = forwardRef<HTMLElement, ComponentPropsWithoutRef<'summary'>>(function DisclosureSummary(props, ref) {
  return <summary {...props} ref={ref}/>;
});
