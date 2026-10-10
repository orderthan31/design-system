import { useEffect, useState, type RefObject } from 'react';
/** Controlled values belong to the caller; native reset restores only uncontrolled defaults. */
export function useFieldState<T>(value: T | undefined, defaultValue: T, onValueChange: ((value: T) => void) | undefined, ref: RefObject<HTMLElement | null>, formId?: string) {
  const [local, setLocal] = useState(defaultValue);
  const controlled = value !== undefined;
  useEffect(() => {
    const form = formId ? document.getElementById(formId) : ref.current?.closest('form');
    if (!(form instanceof HTMLFormElement)) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented && !controlled) setLocal(defaultValue); });
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  }, [controlled, defaultValue, formId, ref]);
  return [controlled ? value : local, (next: T) => { if (!controlled) setLocal(next); onValueChange?.(next); }] as const;
}
