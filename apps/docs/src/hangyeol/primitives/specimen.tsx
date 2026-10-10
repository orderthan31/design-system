import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/cn';
import './specimen.css';
const variants = {
  swatch: 'hangyeol-swatch', radius: 'hangyeol-radius-sample', spacing: 'hangyeol-spacing-sample',
  'container-track': 'hangyeol-container-track', container: 'hangyeol-container-sample', grid: 'hangyeol-grid-cell',
  elevation: 'hangyeol-elevation-example', layer: 'hangyeol-layer-example', overlay: 'hangyeol-overlay-example',
  panel: 'rounded-g-panel border border-solid border-g-line bg-g-surface p-4',
  'dialog-panel': 'rounded-g-panel border border-solid border-g-line bg-g-surface p-4 text-g-ink shadow-lg',
};
/** Static token illustrations; never introduces interactive modal behavior. */
export const Specimen = forwardRef<HTMLElement, HTMLAttributes<HTMLElement> & { variant: keyof typeof variants; asChild?: boolean }>(function Specimen({ variant, asChild = false, className, ...props }, ref) {
  const classes = cn(variants[variant], className);
  return asChild ? <Slot {...props} ref={ref} className={classes}/> : <div {...props} ref={ref as Ref<HTMLDivElement>} className={classes}/>;
});
