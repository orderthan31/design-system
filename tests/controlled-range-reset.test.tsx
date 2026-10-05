import React from 'react';
import {render,screen,act} from '@testing-library/react';
import {test,expect,vi} from 'vitest';
import {Rating,Slider} from '../src/components/range-selection';

test.each([[0,false],[2,false],[0,true],[2,true]] as const)('controlled Rating initial %s external %s keeps latest owner after reset without rerender',async(initial,external)=>{
 const changed=vi.fn(),sliderChanged=vi.fn();const controls=(value:number)=><><Slider label="음량" name="volume" form={external?'owner':undefined} value={value===initial?20:60} onValueChange={sliderChanged}/><Rating label="평가" name="score" form={external?'owner':undefined} value={value} required onValueChange={changed}/></>;
 const view=(value:number)=><><form id="owner">{!external&&controls(value)}</form>{external&&controls(value)}</>;
 const {container,rerender}=render(view(initial));rerender(view(4));const four=screen.getByRole('radio',{name:'4점'});expect(four).toBeChecked();
 const form=container.querySelector('form')!;await act(async()=>{form.reset();await Promise.resolve();});
 expect(four).toBeChecked();expect(new FormData(form).get('score')).toBe('4');expect(new FormData(form).get('volume')).toBe('60');expect(form.checkValidity()).toBe(true);expect(changed).not.toHaveBeenCalled();expect(sliderChanged).not.toHaveBeenCalled();
});
test('controlled owner may choose zero during reset; required validity follows zero without change callback',async()=>{
 const changed=vi.fn();function Owner(){const[value,setValue]=React.useState(2);return <form onReset={()=>setValue(0)}><Rating label="평가" name="score" value={value} required onValueChange={changed}/><button type="button" onClick={()=>setValue(4)}>갱신</button></form>;}
 const {container}=render(<Owner/>);await act(async()=>{screen.getByRole('button').click();});const form=container.querySelector('form')!;
 await act(async()=>{form.reset();await Promise.resolve();});expect(screen.getAllByRole('radio').every(node=>!(node as HTMLInputElement).checked)).toBe(true);expect(new FormData(form).has('score')).toBe(false);expect(form.checkValidity()).toBe(false);expect(changed).not.toHaveBeenCalled();
});
test('cancelled controlled reset keeps latest required score and does not call change',async()=>{
 const changed=vi.fn();const view=(value:number)=><form onReset={e=>e.preventDefault()}><Rating label="평가" name="score" value={value} required onValueChange={changed}/></form>;
 const {container,rerender}=render(view(2));rerender(view(4));const form=container.querySelector('form')!;await act(async()=>{form.reset();await Promise.resolve();});expect(screen.getByRole('radio',{name:'4점'})).toBeChecked();expect(new FormData(form).get('score')).toBe('4');expect(form.checkValidity()).toBe(true);expect(changed).not.toHaveBeenCalled();
});
