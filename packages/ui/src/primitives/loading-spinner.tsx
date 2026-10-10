import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type LoadingSpinnerProps = HTMLAttributes<HTMLSpanElement> & { label?: string; size?: 'small' | 'medium'; decorative?: boolean };
const sizes = { small: 'h-4 w-4', medium: 'h-6 w-6' };
export const LoadingSpinner = forwardRef<HTMLSpanElement, LoadingSpinnerProps>(function LoadingSpinner({ className, label = '불러오는 중', size = 'medium', decorative = false, ...props }, ref) {
  return <span {...props} ref={ref} role={decorative ? undefined : 'status'} aria-hidden={decorative || undefined} className={cn('inline-flex items-center gap-2 text-g-soft', className)}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={cn('shrink-0 stroke-current motion-safe:animate-spin', sizes[size])} strokeWidth="2"><circle cx="12" cy="12" r="9" className="opacity-25"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>{!decorative && <span className="sr-only">{label}</span>}</span>;
});
