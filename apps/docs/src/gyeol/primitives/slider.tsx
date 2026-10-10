import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as Primitive from '@radix-ui/react-slider';
import { cn } from '../lib/cn';
export type SliderProps = ComponentPropsWithoutRef<typeof Primitive.Root> & { label: string; thumbLabels?: string[] };
export const Slider = forwardRef<ElementRef<typeof Primitive.Root>, SliderProps>(function Slider({ className, label, thumbLabels, value, defaultValue = [50], onValueChange, orientation = 'horizontal', ...props }, forwardedRef) {
  const inner = useRef<HTMLSpanElement | null>(null);
  const [local, setLocal] = useState(defaultValue);
  const current = value ?? local;
  useEffect(() => {
    const form = props.form ? inner.current?.ownerDocument.getElementById(props.form) : inner.current?.closest('form');
    if (!form) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented && value === undefined) setLocal(defaultValue); });
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  }, [props.form, value, defaultValue]);
  // 비활성화된 Radix 숨김 입력에는 이름을 전달하지 않아 폼 제출에서 제외합니다.
  return <Primitive.Root {...props} name={props.disabled ? undefined : props.name} orientation={orientation} value={current} onValueChange={next => { if (value === undefined) setLocal(next); onValueChange?.(next); }} aria-label={label} ref={node => { inner.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; }} className={cn('relative flex min-w-0 touch-none select-none items-center data-[disabled]:opacity-50', orientation === 'horizontal' ? 'min-h-11 w-full' : 'h-48 min-w-11 flex-col', className)}>
    <Primitive.Track className={cn('relative grow overflow-hidden rounded-full bg-g-control-track', orientation === 'horizontal' ? 'h-2 w-full' : 'h-full w-2')}><Primitive.Range className={cn('absolute rounded-full bg-g-action', orientation === 'horizontal' ? 'h-full' : 'w-full')}/></Primitive.Track>
    {current.map((_, index) => <Primitive.Thumb key={index} aria-label={thumbLabels?.[index] ?? (current.length === 1 ? label : `${label} ${index === 0 ? '최솟값' : '최댓값'}`)} className="block h-6 w-6 rounded-full border border-solid border-g-line bg-g-control-thumb shadow-sm focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-g-focus data-[disabled]:cursor-not-allowed"/>)}
  </Primitive.Root>;
});
