import {afterEach, expect, test, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {createRef, useState} from 'react';
import {NativeSelect} from '../../src/ui/primitives/native-select';
import {ColorInput} from '../../src/ui/primitives/color-input';
import {PalettePicker} from '../../src/ui/components/palette-picker';
import {Theme} from '../../src/ui/foundation/theme';
import {Link, NavigationLink, SkipLink, LinkFocusScope} from '../../src/ui/primitives/link';
import {Disclosure, DisclosureSummary} from '../../src/ui/primitives/disclosure';
import {ControlLabel} from '../../src/ui/primitives/control-label';
import {Checkbox} from '../../src/ui/primitives/checkbox';
import {PreviewSurface} from '../../src/ui/primitives/preview-surface';
import {Specimen} from '../../src/ui/primitives/specimen';
import {BrandMark} from '../../src/ui/components/brand-mark';
afterEach(cleanup);

test('native select/color preserve refs, native props, form association and reset',()=>{
 const select=createRef<HTMLSelectElement>(),color=createRef<HTMLInputElement>();
 render(<><form id="native-owner"/><NativeSelect ref={select} name="size" form="native-owner" aria-label="Size" defaultValue="small" required data-native="yes"><option value="small">Small</option><option value="large">Large</option></NativeSelect><ColorInput ref={color} name="tint" form="native-owner" defaultValue="#112233" aria-label="Tint"/></>);
 const form=document.querySelector('form')!;
 expect(select.current).toBe(screen.getByLabelText('Size'));expect(color.current).toBe(screen.getByLabelText('Tint'));
 expect(select.current?.required).toBe(true);expect(color.current?.type).toBe('color');expect(select.current?.getAttribute('data-native')).toBe('yes');
 fireEvent.change(select.current!,{target:{value:'large'}});fireEvent.change(color.current!,{target:{value:'#abcdef'}});
 expect([...new FormData(form)]).toEqual([['size','large'],['tint','#abcdef']]);form.reset();
 expect([...new FormData(form)]).toEqual([['size','small'],['tint','#112233']]);
});
test('native controlled values keep DOM identity, native change and disabled contracts',()=>{
 const onSelect=vi.fn(),onColor=vi.fn();const view=render(<><NativeSelect value="a" onChange={onSelect} aria-label="Select"><option>a</option><option>b</option></NativeSelect><ColorInput value="#123456" onChange={onColor} aria-label="Color"/></>);
 const select=screen.getByLabelText('Select'),color=screen.getByLabelText('Color');
 fireEvent.change(select,{target:{value:'b'}});fireEvent.change(color,{target:{value:'#654321'}});expect(onSelect).toHaveBeenCalledOnce();expect(onColor).toHaveBeenCalledOnce();
 view.rerender(<><NativeSelect value="b" disabled onChange={onSelect} aria-label="Select"><option>a</option><option>b</option></NativeSelect><ColorInput value="#654321" disabled onChange={onColor} aria-label="Color"/></>);
 expect(screen.getByLabelText('Select')).toBe(select);expect(screen.getByLabelText('Color')).toBe(color);expect((select as HTMLSelectElement).disabled).toBe(true);expect((color as HTMLInputElement).disabled).toBe(true);
});
const options=[{value:'first',palette:'Indigo',label:'First'},{value:'second',palette:'Rose',label:'Second'}];
test('palette owns native radios and nested scheme scopes with native reset and external form',()=>{
 const ref=createRef<HTMLFieldSetElement>(),change=vi.fn();render(<><form id="palette-form"/><Theme mode="dark"><PalettePicker ref={ref} form="palette-form" options={options} name="palette" label="Palette" defaultValue="first" onValueChange={change}/></Theme></>);
 const first=screen.getByLabelText('First') as HTMLInputElement,second=screen.getByLabelText('Second') as HTMLInputElement;
 expect(ref.current?.tagName).toBe('FIELDSET');expect(first.type).toBe('radio');expect(first.checked).toBe(true);
 expect(second.closest('[data-palette]')?.getAttribute('data-palette')).toBe('Rose');expect(second.closest('[data-theme]')?.getAttribute('data-theme')).toBe('dark');
 fireEvent.click(second);expect(change).toHaveBeenLastCalledWith('second');expect(first.checked).toBe(false);expect(new FormData(document.querySelector('form')!).get('palette')).toBe('second');
 document.querySelector('form')!.reset();expect(first.checked).toBe(true);expect(second.checked).toBe(false);expect(change).toHaveBeenCalledTimes(1);
});
test('controlled palette follows caller state and disabled fieldset semantics',()=>{
 function Owner(){const[value,setValue]=useState('first');return <PalettePicker options={options} name="controlled" label="Palette" value={value} onValueChange={setValue}/>;}
 const view=render(<Owner/>);const second=screen.getByLabelText('Second') as HTMLInputElement;fireEvent.click(second);expect(second.checked).toBe(true);
 view.rerender(<PalettePicker disabled options={options} name="controlled" label="Palette" value="first"/>);expect((screen.getByLabelText('Second') as HTMLInputElement).disabled).toBe(true);
});
test('links preserve anchor refs, href, aria-current and modified-click event without routing policy',()=>{
 const ref=createRef<HTMLAnchorElement>(),events:boolean[]=[];render(<><Link ref={ref} href="#example" target="_blank" rel="noreferrer" onClick={e=>{events.push(e.ctrlKey);e.preventDefault();}}>Example</Link><NavigationLink href="#current" aria-current="page">Current</NavigationLink><SkipLink href="#main">Skip</SkipLink></>);
 expect(ref.current).toBe(screen.getByText('Example'));expect(ref.current?.tagName).toBe('A');expect(ref.current?.getAttribute('href')).toBe('#example');fireEvent.click(ref.current!,{ctrlKey:true});expect(events).toEqual([true]);expect(screen.getByText('Current').getAttribute('aria-current')).toBe('page');expect(screen.getByText('Skip').getAttribute('href')).toBe('#main');
});
test('opt-in link focus scope retains the original main and composed navigation anchors',()=>{
 const outer=createRef<HTMLElement>(),inner=createRef<HTMLElement>();render(<LinkFocusScope ref={outer}><main ref={inner} id="content" tabIndex={-1}><nav><a href="#nested">Nested owner anchor</a></nav></main></LinkFocusScope>);
 expect(outer.current).toBe(inner.current);expect(outer.current?.tagName).toBe('MAIN');expect(outer.current?.className).toContain('hangyeol-link-scope');expect(screen.getByRole('link').getAttribute('href')).toBe('#nested');expect(document.querySelectorAll('main')).toHaveLength(1);
});
test('disclosure remains native default-closed details and summary with refs/native props',()=>{
 const details=createRef<HTMLDetailsElement>(),summary=createRef<HTMLElement>();render(<Disclosure ref={details} id="native-details" name="examples"><DisclosureSummary ref={summary} aria-controls="body">Source</DisclosureSummary><div id="body">Body</div></Disclosure>);
 expect(details.current?.open).toBe(false);expect(summary.current?.tagName).toBe('SUMMARY');fireEvent.click(summary.current!);expect(details.current?.open).toBe(true);expect(details.current?.getAttribute('name')).toBe('examples');
});
test('preview asChild retains form currentTarget, both refs and native FormData/reset',()=>{
 const outer=createRef<HTMLElement>(),inner=createRef<HTMLFormElement>(),seen:string[]=[];
 render(<PreviewSurface asChild ref={outer}><form ref={inner} aria-label="Preview" onSubmit={event=>{event.preventDefault();seen.push(String(new FormData(event.currentTarget).get('title')));}}><input name="title" defaultValue="Initial"/><button type="submit">Save</button></form></PreviewSurface>);
 expect(outer.current).toBe(inner.current);expect(inner.current?.tagName).toBe('FORM');expect(document.querySelectorAll('form')).toHaveLength(1);fireEvent.change(document.querySelector('input')!,{target:{value:'Edited'}});fireEvent.click(screen.getByText('Save'));expect(seen).toEqual(['Edited']);inner.current!.reset();expect(new FormData(inner.current!).get('title')).toBe('Initial');expect(inner.current?.className).toContain('hangyeol-preview-surface');
});
test('control label composes existing 24px checkbox without replacing its true conversion',()=>{
 const ref=createRef<HTMLLabelElement>();function Owner(){const[checked,setChecked]=useState(false);return <ControlLabel ref={ref}><Checkbox checked={checked} onCheckedChange={next=>setChecked(next===true)}/>Enabled</ControlLabel>;}
 render(<Owner/>);const control=screen.getByRole('checkbox');expect(control.tagName).toBe('BUTTON');expect(control.className).toContain('h-6 w-6');fireEvent.click(control);expect(control.getAttribute('aria-checked')).toBe('true');expect(ref.current?.tagName).toBe('LABEL');
});
test('specimen preserves child semantics/ref/dynamic variables; layer remains static',()=>{
 const ref=createRef<HTMLSpanElement>();render(<><Specimen variant="spacing" asChild><span ref={ref} aria-hidden="true" style={{'--hangyeol-space-multiple':4} as React.CSSProperties}/></Specimen><Specimen variant="layer"><Specimen variant="overlay">Static</Specimen></Specimen></>);
 expect(ref.current?.tagName).toBe('SPAN');expect(ref.current?.style.getPropertyValue('--hangyeol-space-multiple')).toBe('4');expect(ref.current?.className).toContain('hangyeol-spacing-sample');expect(screen.queryByRole('dialog')).toBeNull();
});
test('BrandMark takes consumer URLs, accessible name, explicit/nested mode and caller sizing',()=>{
 const ref=createRef<HTMLSpanElement>();const view=render(<Theme mode="dark"><BrandMark ref={ref} symbolUrl="/consumer/symbol.svg" wordmarkUrl="/consumer/word.svg" label="Consumer brand" style={{'--hangyeol-brand-width':'176px'} as React.CSSProperties}/></Theme>);
 expect(ref.current).toBe(screen.getByRole('img'));expect(ref.current?.getAttribute('data-ci-mode')).toBe('dark');expect(ref.current?.getAttribute('aria-label')).toBe('Consumer brand');expect(ref.current?.querySelector('span')?.style.getPropertyValue('--hangyeol-brand-mask')).toBe('url("/consumer/symbol.svg")');
 view.rerender(<BrandMark symbolUrl="a.svg" wordmarkUrl="b.svg" mode="light" decorative/>);expect(screen.queryByRole('img')).toBeNull();expect(document.querySelector('[data-ci-mode]')?.getAttribute('data-ci-mode')).toBe('light');
});
