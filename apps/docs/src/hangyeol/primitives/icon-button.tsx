import { forwardRef } from 'react';
import { Button, type ButtonProps } from './button';
import { Icon, type IconName } from './icon';
import { cn } from '../lib/cn';
export type IconButtonProps = Omit<ButtonProps, 'children'> & { icon: IconName; label: string };
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ icon, label, className, ...props }, ref) {
  return <Button {...props} ref={ref} aria-label={label} className={cn('min-h-11 w-11 shrink-0 px-0 py-0', className)}><Icon name={icon}/></Button>;
});
