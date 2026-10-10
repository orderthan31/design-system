import { forwardRef, useRef } from 'react';
import { TextField, type TextFieldProps } from './text-field';
import { Icon } from '../primitives/icon';
export type SearchFieldProps = Omit<TextFieldProps, 'type' | 'prefix'> & { onSearch?: (query: string) => void };
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField({ onSearch, onKeyDown, ...props }, ref) {
  const composing = useRef(false);
  return <TextField {...props} ref={ref} type="search" prefix={<Icon name="search"/>} clearable={props.clearable ?? true}
    onCompositionStart={event => { composing.current = true; props.onCompositionStart?.(event); }}
    onCompositionEnd={event => { composing.current = false; props.onCompositionEnd?.(event); }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.key !== 'Enter') return;
      if (composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) { event.preventDefault(); return; }
      if (onSearch) { event.preventDefault(); if (!props.disabled && !props.readOnly) onSearch(event.currentTarget.value.trim()); }
    }}/>;
});
