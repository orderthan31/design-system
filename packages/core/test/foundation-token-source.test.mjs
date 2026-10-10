import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {readConsumerTheme,resolveRoles,requiredRoles} from '../src/tools/token-policy.mjs';
const root=fileURLToPath(new URL('../../../apps/docs/',import.meta.url));
test('complete installed foundation validates current control color aliases',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(root,'hangyeol.json')));
 const report=readConsumerTheme(root,config);
 for(const mode of ['light','dark'])for(const name of ['control-thumb','control-track','line-hover']){
  assert.equal(report.schemes[mode].roles['--g-'+name].type,'color');
  assert.equal(report.schemes[mode].roles['--color-g-'+name].type,'color');
 }
});
test('optional control colors retain type validation without becoming required roles',()=>{
 const base=Object.fromEntries(requiredRoles.map(name=>[name,{type:'color',value:'#FFFFFF'}]));
 assert.doesNotThrow(()=>resolveRoles(base,'minimal required contract'));
 for(const name of ['control-thumb','control-track','line-hover'])assert.throws(()=>resolveRoles({...base,['--g-'+name]:{type:'dimension',value:'1px'}},'wrong control type'),/type mismatch/);
});
