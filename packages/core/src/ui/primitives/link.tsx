import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/cn';
import './link.css';
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: 'inline' | 'text' | 'brand' | 'logo' };
const variants = { inline: '', text: 'hangyeol-text-link', brand: 'hangyeol-brand-link', logo: 'font-semibold' };
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ variant = 'inline', className, ...props }, ref) {
  return <a {...props} ref={ref} className={cn('hangyeol-link', variants[variant], className)}/>;
});
export const NavigationLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function NavigationLink({ className, ...props }, ref) {
  return <a {...props} ref={ref} className={cn('hangyeol-link hangyeol-navigation-link', className)}/>;
});
export const SkipLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function SkipLink({ className, ...props }, ref) {
  return <a {...props} ref={ref} className={cn('hangyeol-skip-link', className)}/>;
});
export const NavigationGroupLabel = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function NavigationGroupLabel({ className, ...props }, ref) {
  return <h2 {...props} ref={ref} className={cn('hangyeol-navigation-label', className)}/>;
});
/** Opt-in link focus appearance, including anchors nested in navigation owners. */
export const LinkFocusScope = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function LinkFocusScope({ className, ...props }, ref) {
  return <Slot {...props} ref={ref} className={cn('hangyeol-link-scope', className)}/>;
});
