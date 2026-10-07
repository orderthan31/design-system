import React from "react";
// Reset after the native default action; cancelled resets and controlled owners remain authoritative.
export function useNativeFormReset<T extends HTMLElement>(ref: React.RefObject<T | null>, formId: string | undefined, reset: () => void) {
  const latest = React.useRef(reset);
  latest.current = reset;
  React.useEffect(() => {
    const node = ref.current;
    const input = node instanceof HTMLInputElement ? node : node?.querySelector('input');
    const form = input?.form;
    if (!form) return;
    const onReset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && node?.isConnected) latest.current();
    });
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [ref, formId]);
}
