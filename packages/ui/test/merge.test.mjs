import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cn} from '../src/lib/cn.ts';
test('caption uses font-size conflict group',()=>assert.equal(cn('text-g-caption','text-xl'),'text-xl'));
test('semantic and standard utilities share directional conflict groups',()=>{
 assert.equal(cn('px-g-control rounded-g-control bg-g-action text-g-body text-g-on-action','px-8 rounded-none bg-red-600 text-xl text-white'),'px-8 rounded-none bg-red-600 text-xl text-white');
 assert.equal(cn('px-8 rounded-none text-xl bg-red-600 text-white','px-g-control rounded-g-control text-g-body bg-g-action text-g-ink'),'px-g-control rounded-g-control text-g-body bg-g-action text-g-ink');
 assert.equal(cn('p-6','px-3'),'p-6 px-3');
});
