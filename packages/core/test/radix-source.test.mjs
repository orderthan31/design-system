import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import test from 'node:test';

const evidence=process.env.CORE05_EVIDENCE_DIR;
assert.ok(evidence,'Require designated CORE05 scratch');
const root=fileURLToPath(new URL('../../../',import.meta.url));
assert.ok(path.resolve(evidence)!==path.resolve(root)&&!path.resolve(evidence).startsWith(path.resolve(root)+path.sep),'Fixtures must be outside repository before mutation');
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
 const dir=fs.mkdtempSync(path.join(evidence,'radix-source-'));
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'core05-source-host',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...manifest.runtime,...manifest.items.icon.runtime},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'sentinel.txt'),'owner settings preserved\n');
 fs.writeFileSync(path.join(dir,'hangyeol.json'),JSON.stringify({schemaVersion:1,sourceRoot:'ui/system',stylePath:'styles/theme.css',publicRoot:'static',fontPath:'assets/type',basePath:'/design/',alias:'@hangyeol',ownerSetting:'kept'},null,2)+'\n');
 return dir;
}
function run(dir,args,runner=wrapper){
 const guard=fs.mkdtempSync(path.join(evidence,'npm-guard-')),trace=path.join(guard,'trace');fs.writeFileSync(trace,'');
 fs.writeFileSync(path.join(guard,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE05_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(guard,'npm'),0o755);
 const before=snapshot(dir),started=new Date().toISOString(),start=performance.now();
 const command=[process.execPath,'--input-type=module','-e',runner,...args];
 const result=spawnSync(command[0],command.slice(1),{cwd:dir,encoding:'utf8',env:{...process.env,PATH:guard+path.delimiter+process.env.PATH,CORE05_NPM_TRACE:trace}});
 const after=snapshot(dir),record={command,cwd:dir,input:args,started,runtime:process.version,durationMs:performance.now()-start,exit:result.status,stdout:result.stdout,stderr:result.stderr,before,after,npmTrace:trace,npmCalls:fs.readFileSync(trace,'utf8')};
 fs.writeFileSync(path.join(evidence,`radix-source-${process.hrtime.bigint()}.json`),JSON.stringify(record,null,2));
 assert.equal(record.npmCalls,'','predeclared dependency hosts must never invoke npm');
 return {...result,before,after};
}
function ok(dir,args){const r=run(dir,args);assert.equal(r.status,0,r.stdout+'\n'+r.stderr);return r;}
function reject(dir,args,diagnostic){const r=run(dir,args);assert.equal(r.status,1,r.stdout+'\n'+r.stderr);assert.match(r.stderr,diagnostic);assert.deepEqual(r.after,r.before,'rejection must precede all byte/mtime/mode/link mutations');}
function init(){const dir=host();ok(dir,['init']);return dir;}
function editCommon(dir){for(const name of manifest.common)fs.appendFileSync(path.join(dir,'ui/system',name),'\n/* CORE05 local common edit */\n');}
function commonState(dir){return Object.fromEntries(manifest.common.map(name=>[name,snapshot(path.dirname(path.join(dir,'ui/system',name)))[path.basename(name)]]));}

const graphs={select:['foundation/theme.css','lib/cn.ts','foundation/theme.tsx','primitives/icon.tsx','primitives/portal.tsx','primitives/select.tsx'],tabs:['foundation/theme.css','lib/cn.ts','primitives/tabs.tsx'],dialog:['foundation/theme.css','lib/cn.ts','foundation/theme.tsx','primitives/portal.tsx','primitives/dialog.tsx']};
function parse(r){return JSON.parse(r.stdout.slice(0,r.stdout.indexOf('\n}')+2));}
for(const item of ['select','tabs','dialog'])test(`${item} source closure is exact and repeat add is strict noop`,()=>{
 const dir=init(),pkgPath=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(pkgPath));Object.assign(pkg.dependencies,manifest.items[item].runtime);fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2)+'\n');
 const dry=ok(dir,['add',item,'--dry-run']);assert.deepEqual(dry.before,dry.after);const r=ok(dir,['add',item]),plan=parse(r);
 assert.deepEqual(plan.files.map(f=>f.path).sort(),graphs[item].map(f=>'ui/system/'+f).sort());assert.equal(new Set(plan.files.map(f=>f.path)).size,graphs[item].length);assert.deepEqual(plan.dependencies,{runtime:[]});
 for(const name of graphs[item])assert.equal(digest(fs.readFileSync(path.join(dir,'ui/system',name))),manifest.files[name].hash);
 const graph=snapshot(path.join(dir,'ui/system'));assert.deepEqual(Object.keys(graph).filter(k=>graph[k].sha256).sort(),[...graphs[item],'foundation/fonts.css'].sort());
 const repeat=ok(dir,['add',item]);assert.deepEqual(repeat.after,repeat.before);
});
test('Select/Dialog overlap dedupes shared portal/theme without unrelated Tabs or Button',()=>{
 const dir=init(),file=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(file));Object.assign(pkg.dependencies,manifest.items.select.runtime,manifest.items.dialog.runtime);fs.writeFileSync(file,JSON.stringify(pkg));
 const r=ok(dir,['add','select','dialog','theme']),plan=parse(r),expected=[...new Set([...graphs.select,...graphs.dialog])];assert.equal(plan.files.length,expected.length);assert.deepEqual(plan.files.map(f=>f.path).sort(),expected.map(f=>'ui/system/'+f).sort());
 const again=ok(dir,['add','select','dialog']);assert.deepEqual(again.after,again.before);
});
for(const target of ['primitives/select.tsx','primitives/tabs.tsx','primitives/dialog.tsx','primitives/portal.tsx','foundation/theme.tsx'])test(`edited closure ${target} conflicts and explicit overwrite backs up exact bytes, commons stay edited`,()=>{
 const item=target.includes('tabs')?'tabs':target.includes('dialog')?'dialog':'select',dir=init(),file=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(file));Object.assign(pkg.dependencies,manifest.items[item].runtime);fs.writeFileSync(file,JSON.stringify(pkg));
 const records=JSON.parse(fs.readFileSync(path.join(dir,'hangyeol.json'))).installed;editCommon(dir);const commons=commonState(dir);ok(dir,['add',item]);const full=path.join(dir,'ui/system',target);fs.appendFileSync(full,'\n// CORE05 owner closure edit\n');const edited=fs.readFileSync(full);
 reject(dir,['add',item],/conflict.*edited/);const plan=parse(ok(dir,['add',item,'--overwrite'])),changed=plan.files.filter(f=>f.action!=='noop');assert.deepEqual(changed.map(f=>f.path),['ui/system/'+target]);assert.deepEqual(fs.readFileSync(path.join(dir,changed[0].backup)),edited);assert.deepEqual(commonState(dir),commons);
 const config=JSON.parse(fs.readFileSync(path.join(dir,'hangyeol.json')));for(const common of manifest.common)assert.deepEqual(config.installed['ui/system/'+common],records['ui/system/'+common]);
});
