import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import test from 'node:test';

const evidence=process.env.CORE03_EVIDENCE_DIR;
assert.ok(evidence,'Require designated CORE03 scratch');
const root=fileURLToPath(new URL('../../../',import.meta.url));
const payload=path.join(root,'packages/core/payload');
const manifest=JSON.parse(fs.readFileSync(path.join(payload,'manifest.json')));
const wrapper=`import {runInstaller} from ${JSON.stringify(pathToFileURL(path.join(root,'packages/core/src/tools/installer.mjs')).href)};process.exitCode=runInstaller(process.argv.slice(1),{payloadRoot:${JSON.stringify(payload)}});`;
const digest=b=>createHash('sha256').update(b).digest('hex');
function snapshot(dir,base=dir){
 const s=fs.lstatSync(dir,{bigint:true}),result=dir===base?{'.':{mtimeNs:String(s.mtimeNs),mode:String(s.mode)}}:{};
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const p=path.join(dir,entry.name),stat=fs.lstatSync(p,{bigint:true});
  result[path.relative(base,p)]={mtimeNs:String(stat.mtimeNs),mode:String(stat.mode),...(entry.isFile()?{sha256:digest(fs.readFileSync(p))}:{}),...(entry.isSymbolicLink()?{link:fs.readlinkSync(p)}:{})};
  if(entry.isDirectory())Object.assign(result,snapshot(p,base));
 }return result;
}
function host(){
 const dir=fs.mkdtempSync(path.join(evidence,'button-source-'));
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'core03-source-host',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...manifest.runtime},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'sentinel.txt'),'owner settings preserved\n');
 return dir;
}
function run(dir,args,runner=wrapper){
 const guard=fs.mkdtempSync(path.join(evidence,'npm-guard-')),trace=path.join(guard,'trace');fs.writeFileSync(trace,'');
 fs.writeFileSync(path.join(guard,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE03_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(guard,'npm'),0o755);
 const before=snapshot(dir),started=new Date().toISOString(),start=performance.now();
 const command=[process.execPath,'--input-type=module','-e',runner,...args];
 const result=spawnSync(command[0],command.slice(1),{cwd:dir,encoding:'utf8',env:{...process.env,PATH:guard+path.delimiter+process.env.PATH,CORE03_NPM_TRACE:trace}});
 const after=snapshot(dir),record={command,cwd:dir,input:args,started,runtime:process.version,durationMs:performance.now()-start,exit:result.status,stdout:result.stdout,stderr:result.stderr,before,after,npmTrace:trace,npmCalls:fs.readFileSync(trace,'utf8')};
 fs.writeFileSync(path.join(evidence,`button-source-${process.hrtime.bigint()}.json`),JSON.stringify(record,null,2));
 assert.equal(record.npmCalls,'','predeclared dependency hosts must never invoke npm');
 return {...result,before,after};
}
function ok(dir,args){const r=run(dir,args);assert.equal(r.status,0,r.stdout+'\n'+r.stderr);return r;}
function reject(dir,args,diagnostic){const r=run(dir,args);assert.equal(r.status,1,r.stdout+'\n'+r.stderr);assert.match(r.stderr,diagnostic);assert.deepEqual(r.after,r.before,'rejection must precede all byte/mtime/mode/link mutations');}
function init(){const dir=host();ok(dir,['init']);return dir;}
function editCommon(dir){for(const name of manifest.common)fs.appendFileSync(path.join(dir,'src/hangyeol',name),'\n/* CORE03 local common edit */\n');}
function commonState(dir){return Object.fromEntries(manifest.common.map(name=>[name,snapshot(path.dirname(path.join(dir,'src/hangyeol',name)))[path.basename(name)]]));}

test('Button graph is only local Button plus essential common files',()=>{
 const dir=init();const r=ok(dir,['add','button']);const plan=JSON.parse(r.stdout.slice(0,r.stdout.indexOf('\nSUCCESS')));
 assert.deepEqual(plan.files.map(f=>f.path).sort(),['src/hangyeol/foundation/theme.css','src/hangyeol/lib/cn.ts','src/hangyeol/primitives/button.tsx']);
 assert.deepEqual(plan.dependencies,{runtime:[]});
 assert.deepEqual(Object.keys(snapshot(path.join(dir,'src/hangyeol'))).filter(k=>k.endsWith('.tsx')),['primitives/button.tsx']);
 assert.equal(digest(fs.readFileSync(path.join(dir,'src/hangyeol/primitives/button.tsx'))),manifest.files['primitives/button.tsx'].hash);
 const before=snapshot(dir);ok(dir,['add','button']);assert.deepEqual(snapshot(dir),before);
});
for(const overwrite of [false,true])test(`add preserves edited initialized commons and their original records (overwrite=${overwrite})`,()=>{
 const dir=init(),records=JSON.parse(fs.readFileSync(path.join(dir,'hangyeol.json'))).installed;
 editCommon(dir);const commons=commonState(dir);
 const dry=ok(dir,['add','button','--dry-run',...(overwrite?['--overwrite']:[])]);assert.deepEqual(dry.after,dry.before);
 ok(dir,['add','button',...(overwrite?['--overwrite']:[])]);
 assert.deepEqual(commonState(dir),commons,'add must preserve local theme/helper bytes and mtimes');
 const config=JSON.parse(fs.readFileSync(path.join(dir,'hangyeol.json')));
 for(const name of manifest.common)assert.deepEqual(config.installed['src/hangyeol/'+name],records['src/hangyeol/'+name],'local edits must not become canonical installed hashes');
 const backups=snapshot(path.join(dir,'.hangyeol-backups'));
 assert.ok(!Object.keys(backups).some(name=>manifest.common.some(common=>name.endsWith('/src/hangyeol/'+common))),'common preservation must not create common-source backups; metadata backup is separate');
 const before=snapshot(dir);ok(dir,['add','button']);assert.deepEqual(snapshot(dir),before);
});

test('add fails closed on unowned, missing, incompatible or unsafe initialized commons',()=>{
 for(const change of ['empty-records','missing-record','hash','version','missing-file','directory','symlink']){
  const dir=init(),configFile=path.join(dir,'hangyeol.json'),config=JSON.parse(fs.readFileSync(configFile)),target='src/hangyeol/lib/cn.ts',full=path.join(dir,target);
  if(change==='empty-records')config.installed={};
  if(change==='missing-record')delete config.installed[target];
  if(change==='hash')config.installed[target].hash='0'.repeat(64);
  if(change==='version')config.installed[target].version='0.0.0';
  fs.writeFileSync(configFile,JSON.stringify(config,null,2)+'\n');
  if(['missing-file','directory','symlink'].includes(change))fs.unlinkSync(full);
  if(change==='directory')fs.mkdirSync(full);
  if(change==='symlink')fs.symlinkSync(path.join(dir,'sentinel.txt'),full);
  reject(dir,['add','button','--overwrite'],/record|common source|symlink/i);
 }
});

test('component conflict remains atomic and overwrite backs up only the edited component',()=>{
 const dir=init();editCommon(dir);ok(dir,['add','button']);
 const file=path.join(dir,'src/hangyeol/primitives/button.tsx');fs.appendFileSync(file,'\n// CORE03 local Button edit\n');
 const edited=fs.readFileSync(file),commons=commonState(dir);
 reject(dir,['add','button'],/conflict.*button/i);
 const r=ok(dir,['add','button','--overwrite']),plan=JSON.parse(r.stdout.slice(0,r.stdout.indexOf('\nSUCCESS')));
 assert.deepEqual(plan.files.filter(f=>f.action!=='noop').map(f=>f.path),['src/hangyeol/primitives/button.tsx']);
 const backup=plan.files.find(f=>f.path.endsWith('button.tsx')).backup;
 assert.deepEqual(fs.readFileSync(path.join(dir,backup)),edited);
 assert.equal(digest(fs.readFileSync(file)),manifest.files['primitives/button.tsx'].hash);
 assert.deepEqual(commonState(dir),commons);
 const before=snapshot(dir);ok(dir,['add','button','--overwrite']);assert.deepEqual(snapshot(dir),before);
 reject(dir,['init'],/conflict.*(?:theme|cn)/i);
});

test('add overwrite refuses a common source changed while collecting its noop plan',()=>{
 const dir=init(),target=path.join(dir,'src/hangyeol/lib/cn.ts'),original=fs.readFileSync(target),metadata=fs.readFileSync(path.join(dir,'hangyeol.json'));
 const injected=`import fs from 'node:fs';const read=fs.readFileSync;let reads=0;fs.readFileSync=function(file,...args){if(file===${JSON.stringify(target)}&&++reads===2)fs.appendFileSync(file,'\\n// changed while planning\\n');return read.call(this,file,...args);};`+wrapper;
 const r=run(dir,['add','button','--overwrite'],injected);
 assert.equal(r.status,1,'common drift must fail rather than overwrite the newer local bytes');assert.match(r.stderr,/changed.*planning|planning.*changed/i);
 assert.equal(fs.readFileSync(target,'utf8'),original.toString()+'\n// changed while planning\n');
 assert.deepEqual(fs.readFileSync(path.join(dir,'hangyeol.json')),metadata);
 assert.ok(!fs.existsSync(path.join(dir,'src/hangyeol/primitives'))&&!fs.existsSync(path.join(dir,'.hangyeol-backups')),'controlled fixture edit must be the only mutation');
});
