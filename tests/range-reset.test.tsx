import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {test,expect,vi} from 'vitest';
import {Slider,Rating} from '../src/components/range-selection';

test('uncontrolled range/rating reset restores initial values and form data through another rerender',async()=>{
 const changed=vi.fn();const view=(label='音量')=><form><Slider label={label} name="volume" defaultValue={40} step={5} onValueChange={changed}/><Rating label="만족도" name="score" defaultValue={3} onValueChange={changed}/><button type="reset">초기화</button></form>;
 const {container,rerender}=render(view('음량'));const slider=screen.getByRole('slider');
 fireEvent.change(slider,{target:{value:'60'}});await userEvent.click(screen.getByRole('radio',{name:'4점'}));
 const calls=changed.mock.calls.length;await userEvent.click(screen.getByRole('button',{name:'초기화'}));
 expect(slider).toHaveValue('40');expect(screen.getByRole('radio',{name:'3점'})).toBeChecked();
 rerender(view('음량'));expect(screen.getByRole('slider')).toBe(slider);
 const data=new FormData(container.querySelector('form')!);expect(data.get('volume')).toBe('40');expect(data.get('score')).toBe('3');
 expect(changed.mock.calls.length).toBe(calls);
});

test('cancelled reset keeps edits and external form resets synchronize without change callbacks',async()=>{
 const changed=vi.fn();
 const {container,rerender}=render(<><form id="external" onReset={event=>event.preventDefault()}><button type="reset">외부 초기화</button></form><Slider label="음량" form="external" name="volume" defaultValue={20} onValueChange={changed}/><Rating label="평가" form="external" name="score" defaultValue={2} onValueChange={changed}/></>);
 fireEvent.change(screen.getByRole('slider'),{target:{value:'50'}});await userEvent.click(screen.getByRole('radio',{name:'5점'}));await userEvent.click(screen.getByRole('button',{name:'외부 초기화'}));
 expect(screen.getByRole('slider')).toHaveValue('50');expect(screen.getByRole('radio',{name:'5점'})).toBeChecked();expect(changed.mock.calls).toEqual([[50],[5]]);
 rerender(<><form id="external"><button type="reset">외부 초기화</button></form><Slider label="음량" form="external" name="volume" defaultValue={20} onValueChange={changed}/><Rating label="평가" form="external" name="score" defaultValue={2} onValueChange={changed}/></>);
 await userEvent.click(screen.getByRole('button',{name:'외부 초기화'}));
 const data=new FormData(container.querySelector('form')!);expect(data.get('volume')).toBe('20');expect(data.get('score')).toBe('2');expect(changed.mock.calls).toEqual([[50],[5]]);
});
