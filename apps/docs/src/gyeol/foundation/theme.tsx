import { createContext, useContext, type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
export type ThemeMode = 'light' | 'dark';
const ThemeContext = createContext<ThemeMode>('light');
export function useTheme() { return useContext(ThemeContext); }
export function Theme({ mode = 'light', className, ...props }: HTMLAttributes<HTMLDivElement> & { mode?: ThemeMode }) {
  return <ThemeContext.Provider value={mode}><div {...props} data-gyeol="" data-theme={mode} className={cn('font-g-sans text-g-body text-g-ink bg-g-canvas', className)} /></ThemeContext.Provider>;
}
