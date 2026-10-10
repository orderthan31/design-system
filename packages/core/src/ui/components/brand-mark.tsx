import { forwardRef, type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../lib/cn';
import { useThemeScope, type ThemeMode } from '../foundation/theme';
import './brand-mark.css';
type BrandMarkProps = HTMLAttributes<HTMLSpanElement> & { symbolUrl: string; wordmarkUrl: string; label?: string; decorative?: boolean; mode?: ThemeMode };
export const BrandMark = forwardRef<HTMLSpanElement, BrandMarkProps>(function BrandMark({ symbolUrl, wordmarkUrl, label, decorative = false, mode, className, ...props }, ref) {
  const scope = useThemeScope();
  return <span role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : label} {...props} ref={ref} data-ci-mode={mode ?? scope.mode} className={cn('hangyeol-brand-mark', className)}>
    <span className="hangyeol-brand-symbol" style={{ '--hangyeol-brand-mask': `url(${JSON.stringify(symbolUrl)})` } as CSSProperties}/>
    <span className="hangyeol-brand-wordmark" style={{ '--hangyeol-brand-mask': `url(${JSON.stringify(wordmarkUrl)})` } as CSSProperties}/>
  </span>;
});
