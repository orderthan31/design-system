import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import test from 'node:test';

const evidence=process.env.CORE04_EVIDENCE_DIR;
assert.ok(evidence,'Require designated CORE04 scratch');
const root=fileURLToPath(new URL('../../../',import.meta.url));
const payload=path.join(root,'packages/core/payload');
const manifest=JSON.parse(fs.readFileSync(path.join(payload,'manifest.json')));
const wrapper=`import {runInstaller} from ${JSON.stringify(pathToFileURL(path.join(root,'packages/cli/src/installer.mjs')).href)};process.exitCode=runInstaller(process.argv.slice(1),{payloadRoot:${JSON.stringify(payload)}});`;
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
 const dir=fs.mkdtempSync(path.join(evidence,'textfield-source-'));
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'core04-source-host',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...manifest.runtime},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'sentinel.txt'),'owner settings preserved\n');
 fs.writeFileSync(path.join(dir,'gyeol.json'),JSON.stringify({schemaVersion:1,sourceRoot:'ui/system',stylePath:'styles/theme.css',publicRoot:'static',fontPath:'assets/type',basePath:'/design/',alias:'@hangyeol',ownerSetting:'kept'},null,2)+'\n');
 return dir;
}
function run(dir,args,runner=wrapper){
 const guard=fs.mkdtempSync(path.join(evidence,'npm-guard-')),trace=path.join(guard,'trace');fs.writeFileSync(trace,'');
 fs.writeFileSync(path.join(guard,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE04_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(guard,'npm'),0o755);
 const before=snapshot(dir),started=new Date().toISOString(),start=performance.now();
 const command=[process.execPath,'--input-type=module','-e',runner,...args];
 const result=spawnSync(command[0],command.slice(1),{cwd:dir,encoding:'utf8',env:{...process.env,PATH:guard+path.delimiter+process.env.PATH,CORE04_NPM_TRACE:trace}});
 const after=snapshot(dir),record={command,cwd:dir,input:args,started,runtime:process.version,durationMs:performance.now()-start,exit:result.status,stdout:result.stdout,stderr:result.stderr,before,after,npmTrace:trace,npmCalls:fs.readFileSync(trace,'utf8')};
 fs.writeFileSync(path.join(evidence,`textfield-source-${process.hrtime.bigint()}.json`),JSON.stringify(record,null,2));
 assert.equal(record.npmCalls,'','predeclared dependency hosts must never invoke npm');
 return {...result,before,after};
}
function ok(dir,args){const r=run(dir,args);assert.equal(r.status,0,r.stdout+'\n'+r.stderr);return r;}
function reject(dir,args,diagnostic){const r=run(dir,args);assert.equal(r.status,1,r.stdout+'\n'+r.stderr);assert.match(r.stderr,diagnostic);assert.deepEqual(r.after,r.before,'rejection must precede all byte/mtime/mode/link mutations');}
function init(){const dir=host();ok(dir,['init']);return dir;}
function editCommon(dir){for(const name of manifest.common)fs.appendFileSync(path.join(dir,'ui/system',name),'\n/* CORE04 local common edit */\n');}
function commonState(dir){return Object.fromEntries(manifest.common.map(name=>[name,snapshot(path.dirname(path.join(dir,'ui/system',name)))[path.basename(name)]]));}

const componentFiles=['primitives/input.tsx','primitives/button.tsx','components/text-field.tsx'];
const expectedUI=['components/text-field.tsx','foundation/theme.css','lib/cn.ts','primitives/button.tsx','primitives/input.tsx'];
function parsePlan(r){return JSON.parse(r.stdout.slice(0,r.stdout.indexOf('\n}')+2));}
function assertGraph(dir,r){
 const plan=parsePlan(r),targets=plan.files.map(f=>f.path);
 assert.equal(new Set(targets).size,targets.length,'closure must dedupe common/shared component targets');
 assert.deepEqual(targets.sort(),expectedUI.map(name=>'ui/system/'+name));assert.deepEqual(plan.dependencies,{runtime:[]});
 const graph=snapshot(path.join(dir,'ui/system'));
 assert.deepEqual(Object.keys(graph).filter(k=>graph[k].sha256).sort(),[...expectedUI,'foundation/fonts.css'].sort());
 for(const name of componentFiles)assert.equal(digest(fs.readFileSync(path.join(dir,'ui/system',name))),manifest.files[name].hash);
 const config=JSON.parse(fs.readFileSync(path.join(dir,'gyeol.json')));assert.deepEqual([...config.components].sort(),['button','input','text-field']);assert.equal(config.ownerSetting,'kept');
}
for(const request of [['text-field'],['text-field','input','button']])test(`TextField source closure dedupes request ${request.join(',')}`,()=>{
 const dir=init(),dry=ok(dir,['add',...request,'--dry-run']);assert.deepEqual(dry.before,dry.after);
 const r=ok(dir,['add',...request]);assertGraph(dir,r);
 const again=ok(dir,['add',...request]);assert.deepEqual(again.after,again.before,'second add includes metadata/package/lock and must be strict noop');
});

test('Button then TextField preserves shared Button bytes/mtime and overlapping request is noop',()=>{
 const dir=init();ok(dir,['add','button']);const before=snapshot(path.join(dir,'ui/system/primitives'))['button.tsx'];
 const r=ok(dir,['add','text-field']);assertGraph(dir,r);assert.deepEqual(snapshot(path.join(dir,'ui/system/primitives'))['button.tsx'],before);
 assert.equal(parsePlan(r).files.find(f=>f.path.endsWith('/button.tsx')).action,'noop');
 const overlap=ok(dir,['add','text-field','input','button']);assert.deepEqual(overlap.before,overlap.after);
});

for(const file of componentFiles)test(`edited ${file} conflicts before npm/writes and explicit closure overwrite preserves exact backup`,()=>{
 const dir=init(),originalRecords=JSON.parse(fs.readFileSync(path.join(dir,'gyeol.json'))).installed;
 editCommon(dir);const commons=commonState(dir);ok(dir,['add','text-field']);
 const target=path.join(dir,'ui/system',file);fs.appendFileSync(target,'\n// CORE04 consumer component edit\n');const edited=fs.readFileSync(target);
 reject(dir,['add','text-field'],new RegExp('conflict.*'+file.replaceAll('.','\\.')));
 const r=ok(dir,['add','text-field','--overwrite']),changed=parsePlan(r).files.filter(f=>f.action!=='noop');assert.deepEqual(changed.map(f=>f.path),['ui/system/'+file]);
 assert.deepEqual(fs.readFileSync(path.join(dir,changed[0].backup)),edited);
 assert.equal(digest(fs.readFileSync(target)),manifest.files[file].hash);
 assert.deepEqual(commonState(dir),commons);
 const config=JSON.parse(fs.readFileSync(path.join(dir,'gyeol.json')));for(const common of manifest.common)assert.deepEqual(config.installed['ui/system/'+common],originalRecords['ui/system/'+common],'edited commons retain original template records');
 const repeat=ok(dir,['add','text-field','--overwrite']);assert.deepEqual(repeat.before,repeat.after);
});
