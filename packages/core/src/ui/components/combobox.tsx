import { forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Input, type InputProps } from '../primitives/input';
import { IconButton } from '../primitives/icon-button';
import { Popover, PopoverAnchor, PopoverTrigger, PopoverContent } from '../primitives/popover';
import { FormField } from './form-field';
import { cn } from '../lib/cn';
import { useFieldState } from '../lib/use-field-state';
export type ComboboxOption = { value: string; label: string; disabled?: boolean };
export type ComboboxProps = Omit<InputProps, 'value' | 'defaultValue' | 'type'> & { label: string; options: readonly ComboboxOption[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; onQueryChange?: (query: string) => void; hint?: string; error?: string; clearable?: boolean; emptyMessage?: string };
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox({ label, options, value, defaultValue = '', onValueChange, onQueryChange, hint, error, clearable = true, emptyMessage = '일치하는 항목이 없습니다.', name, id: explicitId, onChange, onKeyDown, ...props }, ref) {
  const input = useRef<HTMLInputElement>(null), root = useRef<HTMLDivElement>(null), composing = useRef(false), generated = useId(), id = explicitId ?? generated;
  useImperativeHandle(ref, () => input.current!, []);
  const [current, change] = useFieldState(value, defaultValue, onValueChange, input, props.form), [query, setQuery] = useState<string | null>(null), [open, setOpen] = useState(false), [active, setActive] = useState(-1);
  const selected = options.find(option => option.value === current), blocked = props.disabled || props.readOnly;
  const visible = options.map((option, index) => ({ ...option, index })).filter(option => option.label.toLocaleLowerCase().includes((query ?? '').trim().toLocaleLowerCase()));
  const enabled = visible.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
  const close = () => { setOpen(false); setQuery(null); setActive(-1); };
  const choose = (index: number) => { const option = visible[index]; if (!option || option.disabled || blocked) return; change(option.value); close(); input.current?.focus(); };
  useEffect(() => { if (blocked) close(); }, [blocked]);
  useEffect(() => { setActive(visible.findIndex(option => !option.disabled)); }, [query, options]);
  useEffect(() => { input.current?.setCustomValidity(current && !selected ? '목록에서 항목을 선택하세요.' : props.required && !current ? '항목을 선택하세요.' : ''); }, [current, selected, props.required]);
  useEffect(() => {
    const owner = input.current?.form; if (!owner) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) close(); });
    owner.addEventListener('reset', reset); return () => owner.removeEventListener('reset', reset);
  }, [props.form]);
  useLayoutEffect(() => { if (open && visible[active]) document.getElementById(id + '-option-' + visible[active].index)?.scrollIntoView?.({ block: 'nearest' }); }, [open, active, id, query]);
  const activeOption = open && !blocked && visible[active] && !visible[active].disabled ? id + '-option-' + visible[active].index : undefined;
  return <div ref={root}><Popover open={open && !blocked} onOpenChange={next => { if (!blocked && next) setOpen(true); else close(); }}>
    <FormField label={label} hint={hint} error={error} inputProps={{ ...props, id }}>{field => <PopoverAnchor asChild><div className="flex min-w-0 items-center gap-2">
      <Input {...field} ref={input} type="text" role="combobox" autoComplete="off" value={query ?? selected?.label ?? ''} aria-autocomplete="list" aria-haspopup="listbox" aria-expanded={open && !blocked} aria-controls={open && !blocked ? id + '-listbox' : undefined} aria-activedescendant={activeOption}
        onClick={event => { props.onClick?.(event); if (!event.defaultPrevented && !blocked) { if (!open) setActive(enabled[0] ?? -1); setOpen(true); } }}
        onChange={event => { setQuery(event.currentTarget.value); onQueryChange?.(event.currentTarget.value); if (!blocked) setOpen(true); onChange?.(event); }}
        onCompositionStart={event => { composing.current = true; props.onCompositionStart?.(event); }} onCompositionEnd={event => { composing.current = false; props.onCompositionEnd?.(event); }}
        onKeyDown={event => {
          onKeyDown?.(event); if (event.defaultPrevented || blocked) return;
          if (composing.current || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) { if (event.key === 'Enter') event.preventDefault(); return; }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault(); if (!open) { setOpen(true); setActive(event.key === 'ArrowDown' ? enabled[0] ?? -1 : enabled.at(-1) ?? -1); return; }
            const position = enabled.indexOf(active), next = event.key === 'ArrowDown' ? (position + 1) % enabled.length : (position <= 0 ? enabled.length - 1 : position - 1); setActive(enabled[next] ?? -1);
          } else if (open && (event.key === 'Home' || event.key === 'End')) { event.preventDefault(); setActive(event.key === 'Home' ? enabled[0] ?? -1 : enabled.at(-1) ?? -1); }
          else if (open && event.key === 'Enter') { event.preventDefault(); choose(active); }
          else if (open && event.key === 'Escape') { event.preventDefault(); close(); }
          else if (event.key === 'Tab') close();
        }}/>
      <PopoverTrigger asChild><IconButton icon="chevronDown" label={`${label} 선택지 열기`} tabIndex={-1} variant="quiet" disabled={blocked} aria-haspopup="listbox" aria-controls={id + '-listbox'} onClick={() => input.current?.focus()}/></PopoverTrigger>
      {clearable && current && <IconButton icon="close" label={`${label} 선택 지우기`} variant="quiet" disabled={blocked} onClick={() => { change(''); close(); input.current?.focus(); }}/>}
    </div></PopoverAnchor>}</FormField>
    <PopoverContent role="presentation" className="w-(--radix-popover-trigger-width) max-w-(--radix-popover-content-available-width) p-2" onOpenAutoFocus={event => event.preventDefault()} onCloseAutoFocus={event => event.preventDefault()}
      onInteractOutside={event => { const target = event.detail.originalEvent.target; if (target instanceof Node && root.current?.contains(target)) event.preventDefault(); }}>
      <div id={id + '-listbox'} role="listbox" aria-label={`${label} 선택지`} className="grid gap-1">
        {visible.map((option, index) => <div key={option.value} id={id + '-option-' + option.index} role="option" aria-selected={active === index} aria-disabled={option.disabled || undefined}
          className={cn('flex min-h-11 cursor-default items-center rounded-g-control px-3 py-2 text-g-body', active === index && 'bg-g-muted', current === option.value && 'font-medium text-g-action', option.disabled && 'opacity-50')}
          onPointerMove={() => { if (!option.disabled) setActive(index); }} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>{option.label}</div>)}
        {visible.length === 0 && <p role="status" className="text-g-small text-g-soft">{emptyMessage}</p>}
      </div>
    </PopoverContent>
    {name && <input type="hidden" name={name} value={current} disabled={props.disabled || selected?.disabled} form={props.form}/>}
  </Popover></div>;
});
