import {afterEach,expect,test} from 'vitest';
import {cleanup,render,screen,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ComponentPage} from '../src/component-pages';
afterEach(cleanup);
test('active Docs input keeps its native node and owner state across usage, code and settings panels',async()=>{
 const user=userEvent.setup();render(<ComponentPage name="Input"/>);
 const input=screen.getByRole('textbox',{name:'이메일'}) as HTMLInputElement;
 await user.clear(input);await user.type(input,'owner@example.com');
 await user.click(screen.getByRole('tab',{name:'코드',exact:true}));
 await waitFor(()=>expect(screen.getByRole('tabpanel').textContent).toContain('owner@example.com'));
 expect(screen.getByRole('textbox',{name:'이메일'})).toBe(input);
 await user.click(screen.getByRole('tab',{name:'예제 설정',exact:true}));
 expect(input.value).toBe('owner@example.com');
 await user.click(screen.getByRole('tab',{name:'사용법',exact:true}));
 expect(screen.getByRole('textbox',{name:'이메일'})).toBe(input);expect(input.value).toBe('owner@example.com');
});
