import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { planFiles, applyPlan, hash } from '../src/tools/safety.mjs';
const evidence=process.env.CORE06_EVIDENCE_DIR??process.env.TMPDIR;
const repository=path.resolve(fileURLToPath(new URL('../../../',import.meta.url)));
assert.ok(evidence&&path.isAbsolute(evidence)&&path.resolve(evidence)!==repository&&!path.resolve(evidence).startsWith(repository+path.sep),'Require explicit authorized external scratch');
const root=()=>fs.realpathSync(fs.mkdtempSync(path.join(evidence,'hangyeol-safety-')));
test('complete plan rejects escape and symlink without writing earlier file',()=>{
 const dir=root(); fs.symlinkSync(evidence,path.join(dir,'link'));
 for(const target of ['../escape','link/escape','/absolute/escape']) assert.throws(()=>planFiles(dir,[{path:'valid',bytes:Buffer.from('a')},{path:target,bytes:Buffer.from('b')}]),/unsafe|symlink/i);
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

test('full lexical/path preflight and dangling/project-ancestry symlinks leave bytes/inode/mtime untouched',()=>{
 const dir=root();fs.writeFileSync(path.join(dir,'sentinel'),'owner');const before=fs.statSync(path.join(dir,'sentinel'),{bigint:true});
 for(const target of ['../escape','/absolute','a\\b','a/./b','a//b','','.hangyeol-transactions/user'])assert.throws(()=>planFiles(dir,[{path:'valid',bytes:Buffer.from('x')},{path:target,bytes:Buffer.from('x')}]),/unsafe|reserved/);
 assert.throws(()=>planFiles(dir,[{path:'A',bytes:Buffer.from('x')},{path:'a/child',bytes:Buffer.from('x')}]),/overlap/);assert.throws(()=>planFiles(dir,[{path:'A',bytes:Buffer.from('x')},{path:'a',bytes:Buffer.from('x')}]),/duplicate/);
 fs.symlinkSync(path.join(dir,'missing'),path.join(dir,'dangling'));assert.throws(()=>planFiles(dir,[{path:'dangling/child',bytes:Buffer.from('x')}]),/symlink/);
 const link=path.join(root(),'parent-link');fs.symlinkSync(dir,link);assert.throws(()=>planFiles(link,[{path:'file',bytes:Buffer.from('x')}]),/symlink/);
 const after=fs.statSync(path.join(dir,'sentinel'),{bigint:true});assert.equal(after.ino,before.ino);assert.equal(after.mtimeNs,before.mtimeNs);assert.ok(!fs.existsSync(path.join(dir,'valid')));
});
test('identical application never creates backup/journal or changes file inode/mtime; changed-since-plan is refused',()=>{
 const dir=root();fs.writeFileSync(path.join(dir,'file'),'owner');const before=fs.statSync(path.join(dir,'file'),{bigint:true}),plan=planFiles(dir,[{path:'file',bytes:Buffer.from('owner')}]);applyPlan(dir,plan);const after=fs.statSync(path.join(dir,'file'),{bigint:true});assert.equal(after.ino,before.ino);assert.equal(after.mtimeNs,before.mtimeNs);assert.ok(!fs.existsSync(path.join(dir,'.hangyeol-backups'))&&!fs.existsSync(path.join(dir,'.hangyeol-transactions')));
 const changed=planFiles(dir,[{path:'file',bytes:Buffer.from('new')}],{overwrite:true});fs.writeFileSync(path.join(dir,'file'),'new owner');assert.throws(()=>applyPlan(dir,changed),/changed since planning/);assert.equal(fs.readFileSync(path.join(dir,'file'),'utf8'),'new owner');
});
