import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './color-input.css';
export const ColorInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(function ColorInput({ className, ...props }, ref) {
  return <input {...props} type="color" ref={ref} className={cn('hangyeol-color-input', className)}/>;
});
