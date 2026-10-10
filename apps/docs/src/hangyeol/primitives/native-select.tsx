import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './native-select.css';
export const NativeSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function NativeSelect({ className, ...props }, ref) {
  return <select {...props} ref={ref} className={cn('hangyeol-native-select', className)}/>;
});
