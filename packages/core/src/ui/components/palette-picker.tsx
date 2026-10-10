import { forwardRef, type FieldsetHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { Theme, type ThemeMode } from '../foundation/theme';
import { Icon } from '../primitives/icon';
import { cn } from '../lib/cn';
import './palette-picker.css';
import '../primitives/visually-hidden.css';
export type PaletteOption = { value: string; label: string; ariaLabel?: string; palette?: string; disabled?: boolean; swatch?: ReactNode };
type PalettePickerProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> & {
  options: readonly PaletteOption[]; name: string; value?: string; defaultValue?: string;
  label: string; mode?: ThemeMode; onValueChange?: (value: string) => void;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'value' | 'checked' | 'defaultChecked'>;
};
/** Native uncontrolled radios retain form reset; controlled radios follow caller state. */
export const PalettePicker = forwardRef<HTMLFieldSetElement, PalettePickerProps>(function PalettePicker({ options, name, value, defaultValue, label, mode, onValueChange, inputProps, className, ...props }, ref) {
  return <fieldset {...props} ref={ref} className={cn('hangyeol-palette-picker', className)}>
    <legend className="hangyeol-visually-hidden">{label}</legend>
    {options.map(option => <Theme key={option.value} mode={mode} palette={option.palette ?? option.value}>
      <label className="hangyeol-swatch-option" title={option.label}>
        <input {...inputProps} type="radio" name={name} form={inputProps?.form ?? props.form} value={option.value}
          disabled={props.disabled || option.disabled || inputProps?.disabled}
          checked={value === undefined ? undefined : value === option.value}
          defaultChecked={value === undefined ? defaultValue === option.value : undefined}
          aria-label={option.ariaLabel ?? option.label}
          onChange={event => { inputProps?.onChange?.(event); if (!event.defaultPrevented && event.target.checked) onValueChange?.(option.value); }}/>
        <span className="hangyeol-palette-swatch">{option.swatch}<span className="hangyeol-palette-check"><Icon name="check" size="small"/></span></span>
      </label>
    </Theme>)}
  </fieldset>;
});
