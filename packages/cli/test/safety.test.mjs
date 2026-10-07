import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planFiles, applyPlan, hash } from '../src/safety.mjs';
const root=()=>fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'gyeol-safety-')));
test('complete plan rejects escape and symlink without writing earlier file',()=>{
 const dir=root(); fs.symlinkSync(os.tmpdir(),path.join(dir,'link'));
 for(const target of ['../escape','link/escape','/tmp/escape']) assert.throws(()=>planFiles(dir,[{path:'valid',bytes:Buffer.from('a')},{path:target,bytes:Buffer.from('b')}]),/unsafe|symlink/i);
 assert.equal(fs.existsSync(path.join(dir,'valid')),false);
});
test('hash validation, collisions, identical no-op, conflicts and explicit backup',()=>{
 const dir=root(),files=[{path:'nested/button.tsx',bytes:Buffer.from('canonical')}];
 assert.throws(()=>planFiles(dir,[{...files[0],hash:'wrong'}]),/hash/);
 assert.throws(()=>planFiles(dir,[...files,...files]),/duplicate/);
 applyPlan(dir,planFiles(dir,files));
 assert.equal(planFiles(dir,files)[0].action,'noop');
 fs.writeFileSync(path.join(dir,files[0].path),'consumer edits');
 assert.throws(()=>planFiles(dir,files),/conflict/);
 const plan=planFiles(dir,files,{overwrite:true}); applyPlan(dir,plan);
 assert.equal(fs.readFileSync(path.join(dir,plan[0].backup),'utf8'),'consumer edits');
 assert.equal(hash(fs.readFileSync(path.join(dir,files[0].path))),hash(files[0].bytes));
});
