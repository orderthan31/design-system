import { forwardRef } from 'react';
import { IconButton, type IconButtonProps } from '../primitives/icon-button';
import { Tooltip } from '../primitives/tooltip';
export type IconActionProps = Omit<IconButtonProps, 'type'> & { showLabel?: boolean; tooltip?: string };
export const IconAction = forwardRef<HTMLButtonElement, IconActionProps>(function IconAction({ showLabel = false, tooltip, label, ...props }, ref) {
  return <span className="inline-flex min-w-0 items-center gap-2"><Tooltip content={tooltip ?? label}><IconButton {...props} ref={ref} type="button" label={label}/></Tooltip>{showLabel && <span aria-hidden="true" className="text-g-small text-g-ink">{label}</span>}</span>;
});
