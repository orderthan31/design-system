import { forwardRef, type SVGProps } from 'react';
import { Check, X, Plus, Minus, Search, ChevronDown, ChevronRight, ArrowLeft, ArrowRight, Trash2, Settings, Star, Eye, EyeOff, Info, CircleCheck, CircleAlert, TriangleAlert, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/cn';
const icons = { check: Check, close: X, plus: Plus, minus: Minus, search: Search, chevronDown: ChevronDown, chevronRight: ChevronRight, arrowLeft: ArrowLeft, arrowRight: ArrowRight, trash: Trash2, settings: Settings, star: Star, eye: Eye, eyeOff: EyeOff, info: Info, circleCheck: CircleCheck, alertCircle: CircleAlert, alertTriangle: TriangleAlert, moon: Moon, sun: Sun };
const sizes = { small: 'h-4 w-4', medium: 'h-5 w-5', large: 'h-6 w-6' };
export type IconName = keyof typeof icons;
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> & { name: IconName; label?: string; size?: keyof typeof sizes };
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ name, label, size = 'medium', className, ...props }, ref) {
  const Glyph = icons[name], accessibleName = label ?? props['aria-label'];
  return <Glyph {...props} ref={ref} aria-label={accessibleName} aria-hidden={accessibleName ? undefined : true} role={accessibleName ? 'img' : undefined} focusable="false" className={cn('shrink-0', sizes[size], className)}/>;
});
