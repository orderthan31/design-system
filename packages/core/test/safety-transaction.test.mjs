import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath,pathToFileURL} from 'node:url';import {planFiles,applyPlan,createTransaction,hash} from '../../cli/src/safety.mjs';
for(const drift of ['bytes','inode','deleted','noop'])test(`later planned target ${drift} drift after earlier write is refused and owner state retained`,()=>{
 const dir=host();for(const name of ['a','b'])fs.writeFileSync(path.join(dir,name),'owner');
 const plan=planFiles(dir,[{path:'a',bytes:Buffer.from('tool')},{path:'b',bytes:Buffer.from(drift==='noop'?'owner':'tool')}],{overwrite:true}),before=snapshot(dir),rename=fs.renameSync;let error,changed=false;
 fs.renameSync=function(from,to){const result=rename.call(this,from,to);if(!changed&&to===path.join(dir,'a')){changed=true;if(drift==='deleted')fs.unlinkSync(path.join(dir,'b'));else if(drift==='inode'){fs.writeFileSync(path.join(dir,'replacement'),'owner');rename.call(this,path.join(dir,'replacement'),path.join(dir,'b'));}else fs.writeFileSync(path.join(dir,'b'),'concurrent owner edit');}return result;};
 try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.renameSync=rename;record('later-target-'+drift,dir,before,error);}
 assert.match(error?.message??'',/changed since planning b/);assert.equal(error.recovery.status,'recovered');assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'owner');
 if(drift==='deleted')assert.ok(!fs.existsSync(path.join(dir,'b')));else assert.equal(fs.readFileSync(path.join(dir,'b'),'utf8'),drift==='inode'?'owner':'concurrent owner edit');
 assert.ok(!fs.existsSync(path.join(dir,'.gyeol-transactions')));
});
for(const operation of ['managed replacement','external recovery'])test(`${operation} preserves original permissions despite restrictive umask`,()=>{
 const dir=host(),file=path.join(dir,'existing');fs.writeFileSync(file,'owner');fs.chmodSync(file,0o666);const before=snapshot(dir),oldMask=process.umask(0o022);let recovery;
 try{if(operation==='managed replacement')applyPlan(dir,planFiles(dir,[{path:'existing',bytes:Buffer.from('tool')}],{overwrite:true}));else{const transaction=createTransaction(dir);transaction.watch('existing');fs.writeFileSync(file,'npm effect');transaction.observeExternal();recovery=transaction.rollback();assert.equal(recovery.status,'recovered');assert.equal(fs.readFileSync(file,'utf8'),'owner');}assert.equal(fs.statSync(file).mode&0o7777,0o666);}finally{process.umask(oldMask);record('mode-'+operation.replaceAll(' ','-'),dir,before,{recovery});}
});
test('stage close failure is tracked and leaves no unreported transaction journal',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'a'),'owner');const before=snapshot(dir),plan=planFiles(dir,[{path:'a',bytes:Buffer.from('tool')}],{overwrite:true}),open=fs.openSync,close=fs.closeSync;let staged,error;
 fs.openSync=function(file,...args){const fd=open.call(this,file,...args);if(String(file).includes('/.gyeol-transactions/')&&args[0]==='wx')staged=fd;return fd;};
 fs.closeSync=function(fd){close.call(this,fd);if(fd===staged){staged=undefined;throw Error('injected stage close failure');}};
 try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.openSync=open;fs.closeSync=close;record('close-once',dir,before,error);}
 assert.match(error?.message??'',/stage close failure/);assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'owner');assert.equal(error.recovery.status,'recovered');assert.equal(error.recovery.journal,null);assert.ok(!fs.existsSync(path.join(dir,'.gyeol-transactions')),'recovered must not hide owned leftover stage');
});
for(const change of ['mode','mtime'])test(`opened original fd ${change} drift refuses recovery and retains journal`,()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'a'),'owner');const fd=fs.openSync(path.join(dir,'a'),'r'),before=snapshot(dir),plan=planFiles(dir,[{path:'a',bytes:Buffer.from('tool')},{path:'b',bytes:Buffer.from('later')}],{overwrite:true}),rename=fs.renameSync;let error;
 fs.renameSync=function(from,to){if(to===path.join(dir,'b')){if(change==='mode')fs.fchmodSync(fd,0o600);else fs.futimesSync(fd,1,1);throw Error('injected original fd drift');}return rename.call(this,from,to);};
 try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.renameSync=rename;fs.closeSync(fd);record('original-fd-'+change,dir,before,error);}
 assert.equal(error.recovery.status,'incomplete');assert.ok(error.recovery.errors.some(e=>e.path==='a'&&/original recovery state changed/.test(e.error)));assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'tool');assert.equal(fs.readFileSync(path.join(dir,plan[0].backup),'utf8'),'owner');assert.ok(fs.existsSync(path.join(dir,error.recovery.journal)));
});
test('failed stage state capture reports actual retained journal and preserves originals',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'a'),'owner');const before=snapshot(dir),plan=planFiles(dir,[{path:'a',bytes:Buffer.from('tool')}],{overwrite:true}),lstat=fs.lstatSync;let error,injected=false;
 fs.lstatSync=function(file,options){if(!injected&&String(file).includes('/.gyeol-transactions/')&&options?.bigint){injected=true;throw Error('injected stage state capture');}return lstat.call(this,file,options);};
 try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.lstatSync=lstat;record('stage-state-capture',dir,before,error);}
 assert.match(error?.message??'',/injected stage state capture/);assert.equal(error.recovery.status,'incomplete');assert.ok(error.recovery.errors.length);assert.ok(fs.existsSync(path.join(dir,error.recovery.journal)));assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'owner');assert.ok(Object.entries(snapshot(dir)).some(([p,s])=>p.startsWith(error.recovery.journal+'/')&&s.ino===before.a.ino),'uncertain cleanup retains managed original');
});
test('commit cleanup refuses mode-changed original journal',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'a'),'owner');const fd=fs.openSync(path.join(dir,'a'),'r'),tx=createTransaction(dir);let result;
 try{tx.apply(planFiles(dir,[{path:'a',bytes:Buffer.from('tool')}],{overwrite:true}));fs.fchmodSync(fd,0o600);result=tx.commit();}finally{fs.closeSync(fd);}
 assert.equal(result.status,'cleanup-incomplete');assert.ok(result.errors.length);assert.ok(fs.existsSync(path.join(dir,result.journal)));assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'tool');record('commit-original-mode',dir,{}, {recovery:result});
});
for(const flow of ['new-file drift','timestamp cleanup failure','journal check uncertain'])test(`recovery guidance matches actual material: ${flow}`,()=>{
 const dir=host(),rename=fs.renameSync,utimes=fs.utimesSync,lstat=fs.lstatSync;let result,phase=false;
 try{
  if(flow==='new-file drift'){
   const plan=planFiles(dir,[{path:'a',bytes:Buffer.from('tool')},{path:'b',bytes:Buffer.from('later')}]);
   fs.renameSync=function(from,to){if(to===path.join(dir,'b')){fs.writeFileSync(path.join(dir,'a'),'concurrent owner edit');throw Error('injected b rename failure');}return rename.call(this,from,to);};
   try{applyPlan(dir,plan);}catch(e){result=e.recovery;}
   assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'concurrent owner edit');assert.ok(!fs.existsSync(path.join(dir,'b')));assert.equal(result.status,'incomplete');
  }else{
   fs.writeFileSync(path.join(dir,'a'),'owner');const tx=createTransaction(dir);tx.watch('a');
   fs.utimesSync=function(file,...args){if(file===dir){phase=true;throw Error('injected directory timestamp restore failure');}return utimes.call(this,file,...args);};
   if(flow==='journal check uncertain')fs.lstatSync=function(file,...args){if(phase&&String(file).includes('/.gyeol-transactions/'))throw Object.assign(Error('injected journal inspection denied'),{code:'EACCES'});return lstat.call(this,file,...args);};
   result=tx.commit();assert.equal(result.status,'cleanup-incomplete');assert.equal(fs.readFileSync(path.join(dir,'a'),'utf8'),'owner');
  }
 }finally{fs.renameSync=rename;fs.utimesSync=utimes;fs.lstatSync=lstat;record('material-'+flow.replaceAll(' ','-'),dir,{}, {recovery:result});}
 assert.equal(result.journal,null,'never advertise missing/unverified material as existing');assert.equal(result.journalStatus,flow==='journal check uncertain'?'unknown':'absent');assert.ok(result.errors.length);assert.ok(!fs.existsSync(path.join(dir,'.gyeol-transactions')));
 if(flow==='journal check uncertain'){assert.ok(result.journalCandidate.startsWith('.gyeol-transactions/'));assert.ok(result.errors.some(e=>/journal inspection denied/.test(e.error)));}else assert.equal(result.journalCandidate,undefined);
});
const root=fileURLToPath(new URL('../../../',import.meta.url)),evidence=process.env.CORE06_EVIDENCE_DIR;assert.ok(evidence&&path.resolve(evidence)!==path.resolve(root)&&!path.resolve(evidence).startsWith(path.resolve(root)+path.sep));
function host(){return fs.mkdtempSync(path.join(evidence,'transaction-source-'));}
function snapshot(dir,base=dir){const s=fs.lstatSync(dir,{bigint:true}),out=dir===base?{'.':{ino:String(s.ino),mtimeNs:String(s.mtimeNs),mode:String(s.mode)}}:{};for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name),st=fs.lstatSync(full,{bigint:true});out[path.relative(base,full)]={ino:String(st.ino),mtimeNs:String(st.mtimeNs),mode:String(st.mode),...(entry.isFile()?{hash:hash(fs.readFileSync(full))}:{}),...(entry.isSymbolicLink()?{link:fs.readlinkSync(full)}:{})};if(entry.isDirectory())Object.assign(out,snapshot(full,base));}return out;}
function record(label,dir,before,error){fs.writeFileSync(path.join(evidence,`transaction-${label}-${process.hrtime.bigint()}.json`),JSON.stringify({host:dir,before,after:snapshot(dir),error:error?.message,recovery:error?.recovery},null,2));}
test('partial managed write failure restores replaced bytes and removes created target parents',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'existing'),'owner edit');const plan=planFiles(dir,[{path:'existing',bytes:Buffer.from('new')},{path:'new/deep/file',bytes:Buffer.from('later')}],{overwrite:true}),before=snapshot(dir);
 const write=fs.writeFileSync,rename=fs.renameSync;let error;
 fs.writeFileSync=function(file,...args){if(file===path.join(dir,'new/deep/file'))throw Error('injected second target write failure');return write.call(this,file,...args);};
 fs.renameSync=function(from,to){if(to===path.join(dir,'new/deep/file'))throw Error('injected second target rename failure');return rename.call(this,from,to);};
 try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.writeFileSync=write;fs.renameSync=rename;record('partial',dir,before,error);}
 assert.ok(error,'must reach intended injected write failure');assert.match(error.message,/injected second target/);assert.equal(fs.readFileSync(path.join(dir,'existing'),'utf8'),'owner edit');assert.ok(!fs.existsSync(path.join(dir,'new')),'new target parent chain must be removed');assert.equal(fs.readFileSync(path.join(dir,plan[0].backup),'utf8'),'owner edit');
});

const payload=path.join(root,'packages/core/payload'),manifest=JSON.parse(fs.readFileSync(path.join(payload,'manifest.json')));
function installerHost(allDeps=false){const dir=host();fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'transaction-source',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...(allDeps?manifest.runtime:{})},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}},null,2)+'\n');return dir;}
function invoke(dir,args,inject='',env=process.env){const wrapper=`${inject}import {runInstaller} from ${JSON.stringify(pathToFileURL(path.join(root,'packages/cli/src/installer.mjs')).href)};process.exitCode=runInstaller(process.argv.slice(1),{payloadRoot:${JSON.stringify(payload)}});`,before=snapshot(dir),started=new Date().toISOString(),t=performance.now(),command=[process.execPath,'--input-type=module','-e',wrapper,...args],r=spawnSync(command[0],command.slice(1),{cwd:dir,encoding:'utf8',env});fs.writeFileSync(path.join(evidence,`transaction-command-${process.hrtime.bigint()}.json`),JSON.stringify({command,cwd:dir,started,runtime:process.version,durationMs:performance.now()-t,exit:r.status,stdout:r.stdout,stderr:r.stderr,before,after:snapshot(dir)},null,2));return r;}
test('npm failure injection restores source/config/package/lock bytes or absence and reports node_modules residue',()=>{
 const dir=installerHost(),pkg=fs.readFileSync(path.join(dir,'package.json')),g=host();fs.writeFileSync(path.join(g,'npm'),`#!${process.execPath}\nconst fs=require('node:fs');fs.writeFileSync('package.json',JSON.stringify({injected:true}));fs.writeFileSync('package-lock.json','{"injected":true}');fs.mkdirSync('node_modules',{recursive:true});fs.writeFileSync('node_modules/injected-residue','external child effect');process.exit(42);\n`);fs.chmodSync(path.join(g,'npm'),0o755);
 const r=invoke(dir,['init'],'',{...process.env,PATH:g+path.delimiter+process.env.PATH});assert.equal(r.status,1);assert.match(r.stderr,/42/);assert.deepEqual(fs.readFileSync(path.join(dir,'package.json')),pkg);assert.ok(!fs.existsSync(path.join(dir,'package-lock.json')));assert.ok(!fs.existsSync(path.join(dir,'src'))&&!fs.existsSync(path.join(dir,'public'))&&!fs.existsSync(path.join(dir,'gyeol.json')));assert.equal(fs.readFileSync(path.join(dir,'node_modules/injected-residue'),'utf8'),'external child effect');assert.match(r.stderr,/node_modules.*(?:not|unverified|remain)/i);
});
test('metadata write failure rolls back earlier source and preserves preexisting host stylesheet with exact backup',()=>{
 const dir=installerHost(true);fs.mkdirSync(path.join(dir,'src'));fs.writeFileSync(path.join(dir,'src/gyeol.css'),'body { color: chocolate; }\n');const original=fs.readFileSync(path.join(dir,'src/gyeol.css'));
 const injection=`import fs from 'node:fs';const rename=fs.renameSync;fs.renameSync=function(a,b){if(b===${JSON.stringify(path.join(dir,'gyeol.json'))})throw Error('injected metadata failure');return rename.call(this,a,b);};`;
 const r=invoke(dir,['init'],injection);assert.equal(r.status,1);assert.match(r.stderr,/injected metadata/);assert.deepEqual(fs.readFileSync(path.join(dir,'src/gyeol.css')),original);assert.ok(!fs.existsSync(path.join(dir,'src/gyeol'))&&!fs.existsSync(path.join(dir,'public'))&&!fs.existsSync(path.join(dir,'gyeol.json')));
});

test('rollback refuses concurrent changed target and retains originals/backups with explicit incomplete result',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'existing'),'owner');const plan=planFiles(dir,[{path:'existing',bytes:Buffer.from('tool')},{path:'new/file',bytes:Buffer.from('later')}],{overwrite:true}),before=snapshot(dir),rename=fs.renameSync;let error;
 fs.renameSync=function(from,to){if(to===path.join(dir,'new/file')){fs.writeFileSync(path.join(dir,'existing'),'concurrent owner');throw Error('injected target race');}return rename.call(this,from,to);};try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.renameSync=rename;record('race',dir,before,error);}
 assert.match(error.message,/injected target race/);assert.equal(error.recovery.status,'incomplete');assert.equal(fs.readFileSync(path.join(dir,'existing'),'utf8'),'concurrent owner');assert.equal(fs.readFileSync(path.join(dir,plan[0].backup),'utf8'),'owner');assert.ok(fs.existsSync(path.join(dir,error.recovery.journal)));assert.ok(!fs.existsSync(path.join(dir,'new')));
});
test('rollback filesystem failure is reported, preserves backup and recovery journal without hiding remaining file',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'existing'),'owner');const plan=planFiles(dir,[{path:'existing',bytes:Buffer.from('tool')},{path:'new/file',bytes:Buffer.from('later')}],{overwrite:true}),before=snapshot(dir),rename=fs.renameSync;let error,count=0;
 fs.renameSync=function(from,to){if(to===path.join(dir,'existing')&&++count===2)throw Error('injected restore denied');if(to===path.join(dir,'new/file'))throw Error('injected write denied');return rename.call(this,from,to);};try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.renameSync=rename;record('restore-denied',dir,before,error);}
 assert.equal(error.recovery.status,'incomplete');assert.ok(error.recovery.errors.some(e=>e.error.includes('restore denied')));assert.equal(fs.readFileSync(path.join(dir,'existing'),'utf8'),'tool');assert.equal(fs.readFileSync(path.join(dir,plan[0].backup),'utf8'),'owner');
});
test('partial staging write never truncates consumer file and removes owned partial stage',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'existing'),'owner');const plan=planFiles(dir,[{path:'existing',bytes:Buffer.from('tool')}],{overwrite:true}),write=fs.writeFileSync,before=snapshot(dir);let error;
 fs.writeFileSync=function(file,bytes,...args){if(typeof file==='number'){write.call(this,file,Buffer.from('partial'));throw Error('injected partial stage write');}return write.call(this,file,bytes,...args);};try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.writeFileSync=write;record('partial-stage',dir,before,error);}
 assert.match(error.message,/partial stage/);assert.equal(fs.readFileSync(path.join(dir,'existing'),'utf8'),'owner');assert.equal(error.recovery.status,'recovered');assert.ok(!fs.existsSync(path.join(dir,'.gyeol-transactions')));
});
test('existing directory contents and inode are never deleted during failed new-file recovery',()=>{
 const dir=host();fs.mkdirSync(path.join(dir,'keep'));fs.writeFileSync(path.join(dir,'keep/sentinel'),'owner');const before=snapshot(dir),rename=fs.renameSync,plan=planFiles(dir,[{path:'keep/new',bytes:Buffer.from('x')},{path:'other/deep/file',bytes:Buffer.from('x')}]);let error;
 fs.renameSync=function(a,b){if(b===path.join(dir,'other/deep/file'))throw Error('injected later failure');return rename.call(this,a,b);};try{applyPlan(dir,plan);}catch(e){error=e;}finally{fs.renameSync=rename;record('parents',dir,before,error);}
 assert.equal(fs.readFileSync(path.join(dir,'keep/sentinel'),'utf8'),'owner');assert.equal(String(fs.statSync(path.join(dir,'keep'),{bigint:true}).ino),before.keep.ino);assert.ok(!fs.existsSync(path.join(dir,'keep/new'))&&!fs.existsSync(path.join(dir,'other')));assert.equal(error.recovery.status,'recovered');
});

test('mutated planned payload hash rejects entire batch before creating earlier file',()=>{
 const dir=host(),before=snapshot(dir),plan=planFiles(dir,[{path:'first',bytes:Buffer.from('x')},{path:'second',bytes:Buffer.from('y')}]);plan[1].bytes=Buffer.from('corrupted');let error;try{applyPlan(dir,plan);}catch(e){error=e;}record('mutated-plan',dir,before,error);assert.match(error?.message??'',/payload hash/);assert.deepEqual(snapshot(dir),before);
});
test('identical-byte inode replacement after planning is still a changed-since-plan conflict',()=>{
 const dir=host();fs.writeFileSync(path.join(dir,'existing'),'owner');const plan=planFiles(dir,[{path:'existing',bytes:Buffer.from('canonical')}],{overwrite:true});fs.writeFileSync(path.join(dir,'replacement'),'owner');fs.renameSync(path.join(dir,'replacement'),path.join(dir,'existing'));const before=snapshot(dir);let error;try{applyPlan(dir,plan);}catch(e){error=e;}record('inode-drift',dir,before,error);assert.match(error?.message??'',/changed since planning/);assert.deepEqual(snapshot(dir),before);
});

test('metadata failure after injected successful npm recovers original package/lock and reports dependency uncertainty',()=>{
 const dir=installerHost(),pkg=fs.readFileSync(path.join(dir,'package.json'));fs.writeFileSync(path.join(dir,'package-lock.json'),'{"ownerLock":true}\n');const lock=fs.readFileSync(path.join(dir,'package-lock.json')),g=host();
 fs.writeFileSync(path.join(g,'npm'),`#!${process.execPath}\nconst fs=require('node:fs');fs.writeFileSync('package.json','{"injectedSuccess":true}');fs.writeFileSync('package-lock.json','{"injectedSuccess":true}');fs.mkdirSync('node_modules',{recursive:true});fs.writeFileSync('node_modules/injected-success-residue','external effect after successful child');process.exit(0);\n`);fs.chmodSync(path.join(g,'npm'),0o755);
 const injection=`import fs from 'node:fs';const rename=fs.renameSync;fs.renameSync=function(a,b){if(b===${JSON.stringify(path.join(dir,'gyeol.json'))})throw Error('injected post-npm metadata failure');return rename.call(this,a,b);};`;
 const r=invoke(dir,['init'],injection,{...process.env,PATH:g+path.delimiter+process.env.PATH});assert.equal(r.status,1);assert.match(r.stderr,/post-npm metadata failure/);assert.deepEqual(fs.readFileSync(path.join(dir,'package.json')),pkg);assert.deepEqual(fs.readFileSync(path.join(dir,'package-lock.json')),lock);assert.ok(!fs.existsSync(path.join(dir,'src'))&&!fs.existsSync(path.join(dir,'public'))&&!fs.existsSync(path.join(dir,'gyeol.json')));assert.ok(fs.existsSync(path.join(dir,'node_modules/injected-success-residue')));assert.match(r.stderr,/"dependencyAttempted":true/);assert.match(r.stderr,/not rolled back/);
});
