import React from 'react';
import {test,expect,afterEach} from 'vitest';
import {render,screen} from '@testing-library/react';
import {App} from '../src/App';
import * as core from '../src/index';
afterEach(()=>window.history.replaceState(null,'','/'));
test('new reusable input and list APIs are available from the public core entry',()=>{for(const name of ['TextField','ListRow','ListHeader','ListFooter'])expect((core as Record<string,unknown>)[name],name).toBeTypeOf('function');});
test.each([
 ['text-field','입력 유형'],['list-row','검토 항목'],['bottom-sheet','BottomSheet 상세'],['dialog','Dialog 상세'],
])('individual %s route connects a real detail instead of a name-only card',(id,label)=>{
 window.history.replaceState(null,'',`/#/components/${id}`);const {container}=render(<App/>);
 expect(screen.getAllByRole('heading',{level:1})).toHaveLength(1);
 expect(screen.getByRole(id==='list-row'?'list':'region',{name:label})).toBeVisible();
 expect(container.querySelector('.component-detail')).not.toBeNull();
 expect(container.querySelectorAll('.component-detail details[open]')).toHaveLength(0);
});
