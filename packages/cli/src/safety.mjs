import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export function safeTarget(root,relative){
 if(typeof relative!=='string'||!relative||relative.includes('\\')||path.isAbsolute(relative)||relative.split('/').some(p=>p==='..'||p==='.'||!p)) throw Error(`unsafe path: ${relative}`);
 const full=path.resolve(root,relative);
 if(!full.startsWith(path.resolve(root)+path.sep))throw Error(`unsafe target: ${relative}`);
 let current=path.resolve(root);
 // Reject symlinks in the project root ancestry too.
 while(current!==path.dirname(current)){if(fs.lstatSync(current).isSymbolicLink())throw Error('symlink project root');current=path.dirname(current);}
 current=path.resolve(root);
 const parts=relative.split('/');
 for(let i=0;i<parts.length;i++){current=path.join(current,parts[i]);let stat;try{stat=fs.lstatSync(current);}catch(error){if(error.code==='ENOENT')break;throw error;}if(stat.isSymbolicLink())throw Error(`symlink target: ${relative}`);if(i<parts.length-1&&!stat.isDirectory())throw Error(`file ancestor: ${relative}`);}
 return full;
}
export function planFiles(root,files,{overwrite=false}={}){
 const seen=new Set(),stamp=crypto.randomUUID();
 return files.map(file=>{
  if(file.path.split('/')[0]==='.gyeol-transactions')throw Error(`reserved transaction path: ${file.path}`);
  const folded=file.path.toLowerCase();
  for(const previous of seen){if(folded===previous)throw Error(`duplicate target: ${file.path}`);if(folded.startsWith(previous+'/')||previous.startsWith(folded+'/'))throw Error(`file/directory target overlap: ${file.path}`);}seen.add(folded);
  const full=safeTarget(root,file.path),bytes=Buffer.from(file.bytes),digest=hash(bytes);
  if(file.hash&&file.hash!==digest)throw Error(`payload hash mismatch: ${file.path}`);
  let action='create',previous;
  if(fs.existsSync(full)){if(!fs.statSync(full).isFile())throw Error(`conflict: not a file ${file.path}`);previous=hash(fs.readFileSync(full));action=previous===digest?'noop':'replace';if(action==='replace'&&!overwrite&&!file.integrate)throw Error(`conflict: edited/existing ${file.path}; review then use --overwrite for a backup`);}
  const backup=action==='replace'?`.gyeol-backups/${stamp}/${file.path}`:undefined;
  if(backup)safeTarget(root,backup);
  return {...file,bytes,hash:digest,action,previous,previousState:state(full),backup};
 });
}
// Journaled synchronous transactions: atomic file replacement, bounded recovery.
// This is not a crash/power-loss journal or an npm/node_modules rollback engine.
function state(full){
 let stat;try{stat=fs.lstatSync(full,{bigint:true});}catch(error){if(error.code==='ENOENT')return null;throw error;}
 if(!stat.isFile())throw Error(`conflict: not a regular file ${full}`);
 return {ino:String(stat.ino),mode:String(stat.mode),mtimeNs:String(stat.mtimeNs),hash:hash(fs.readFileSync(full))};
}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
export function createTransaction(root){
 const journal=`.gyeol-transactions/${crypto.randomUUID()}`,entries=[],temporary=[],directories=[],beforeDirs=new Map();let serial=0,closed=false;
 function mkdir(relative){
  if(relative==='.')return;
  const full=safeTarget(root,relative);if(fs.existsSync(full)){if(!fs.statSync(full).isDirectory())throw Error(`conflict: directory target ${relative}`);return;}
  const parent=path.posix.dirname(relative);if(parent!=='.')mkdir(parent);
  const parentFull=parent==='.'?path.resolve(root):safeTarget(root,parent);
  if(!beforeDirs.has(parentFull)){const st=fs.statSync(parentFull);beforeDirs.set(parentFull,{stat:st,names:fs.readdirSync(parentFull).sort()});}
  fs.mkdirSync(full);directories.push({relative,ino:String(fs.statSync(full,{bigint:true}).ino)});
 }
 function slot(){mkdir(journal);return `${journal}/${++serial}`;}
 function stage(bytes,mode){
  const relative=slot(),full=safeTarget(root,relative),owned={relative,expected:undefined};let fd;
  try{fd=fs.openSync(full,'wx',mode??0o666);temporary.push(owned);fs.writeFileSync(fd,bytes);if(mode!==undefined)fs.fchmodSync(fd,mode);}
  finally{if(fd!==undefined){try{owned.expected=state(full);}finally{fs.closeSync(fd);}}}
  return relative;
 }
 function validate(plan){
  for(const item of plan){if(hash(Buffer.from(item.bytes))!==item.hash)throw Error(`payload hash mismatch: ${item.path}`);const full=safeTarget(root,item.path),now=state(full);if(!same(now,item.previousState)||(now?.hash)!==item.previous)throw Error(`conflict: changed since planning ${item.path}`);if(item.backup)safeTarget(root,item.backup);}
 }
 function apply(plan){
  if(closed)throw Error('Transaction is closed');validate(plan);
  for(const item of plan){
   const full=safeTarget(root,item.path),before=state(full);
   if(!same(before,item.previousState)||(before?.hash)!==item.previous)throw Error(`conflict: changed since planning ${item.path}`);
   if(item.action==='noop')continue;
   const entry={path:item.path,before,expected:before,external:false};entries.push(entry);
   if(before){
    entry.original=slot();fs.linkSync(full,safeTarget(root,entry.original));
    const backup=safeTarget(root,item.backup);mkdir(path.posix.dirname(item.backup));fs.copyFileSync(full,backup,fs.constants.COPYFILE_EXCL);
    if(hash(fs.readFileSync(backup))!==before.hash)throw Error(`conflict: changed while backing up ${item.path}`);
   }
   const staged=stage(item.bytes,before?Number(before.mode)&0o7777:undefined);mkdir(path.posix.dirname(item.path));
   if(!same(state(safeTarget(root,item.path)),before))throw Error(`conflict: changed before writing ${item.path}`);
   entry.expected=state(safeTarget(root,staged));fs.renameSync(safeTarget(root,staged),safeTarget(root,item.path));
  }
 }
 function watch(relative){
  if(closed||entries.some(e=>e.path===relative))throw Error(`Duplicate/closed external watch ${relative}`);
  const full=safeTarget(root,relative),before=state(full),entry={path:relative,before,expected:before,external:true};
  if(before){entry.original=stage(fs.readFileSync(full),Number(before.mode)&0o7777);}
  entries.push(entry);
 }
 function observeExternal(){for(const entry of entries.filter(e=>e.external))entry.expected=state(safeTarget(root,entry.path));}
 function cleanup(keepOriginals,errors){
  for(const item of temporary){try{const full=safeTarget(root,item.relative);const current=state(full);if(current){if(keepOriginals&&entries.some(e=>e.original===item.relative))continue;if(!same(current,item.expected))throw Error('changed temporary file');fs.unlinkSync(full);}}catch(error){errors.push({path:item.relative,error:error.message});}}
  if(!keepOriginals&&!errors.length)for(const entry of entries.filter(e=>!e.external&&e.original)){try{const full=safeTarget(root,entry.original),current=state(full);if(current){if(!same(current,entry.before))throw Error('changed original journal');fs.unlinkSync(full);}}catch(error){errors.push({path:entry.original,error:error.message});}}
  for(const dir of [...directories].reverse()){try{const full=safeTarget(root,dir.relative);if(!fs.existsSync(full))continue;if(String(fs.lstatSync(full,{bigint:true}).ino)!==dir.ino)throw Error('changed directory identity');if(fs.readdirSync(full).length===0)fs.rmdirSync(full);else if(dir.relative===journal)throw Error('transaction journal retained');}catch(error){errors.push({path:dir.relative,error:error.message});}}
  for(const [full,before] of beforeDirs){try{if(fs.existsSync(full)&&JSON.stringify(fs.readdirSync(full).sort())===JSON.stringify(before.names))fs.utimesSync(full,before.stat.atime,before.stat.mtime);}catch(error){errors.push({path:path.relative(root,full),error:error.message});}}
 }
 function journalReport(errors){
  try{
   const full=safeTarget(root,journal);let stat;
   try{stat=fs.lstatSync(full,{bigint:true});}catch(error){if(error.code==='ENOENT')return {journal:null,journalStatus:'absent'};throw error;}
   const owned=directories.find(dir=>dir.relative===journal);
   if(!stat.isDirectory()||!owned||String(stat.ino)!==owned.ino)throw Error('journal identity changed; availability unverified');
   return {journal,journalStatus:'present'};
  }catch(error){errors.push({path:journal,error:`journal availability unknown: ${error.message}`});return {journal:null,journalStatus:'unknown',journalCandidate:journal};}
 }
 function rollback(){
  const recovered=[],untouched=[],errors=[];
  for(const entry of [...entries].reverse()){
   try{
    const full=safeTarget(root,entry.path),now=state(full);
    if(same(now,entry.before)){untouched.push(entry.path);continue;}
    if(!same(now,entry.expected))throw Error('unexpected change; retained consumer state; recovery material availability reported separately');
    if(!entry.before){if(now)fs.unlinkSync(full);}
    else{
     const original=safeTarget(root,entry.original),originalState=state(original);if(entry.external?originalState?.hash!==entry.before.hash:!same(originalState,entry.before))throw Error('original recovery state changed');
     if(entry.external){const restored=stage(fs.readFileSync(original),Number(entry.before.mode)&0o7777);const staged=safeTarget(root,restored);fs.utimesSync(staged,Number(BigInt(entry.before.mtimeNs))/1e9,Number(BigInt(entry.before.mtimeNs))/1e9);if(!same(state(safeTarget(root,entry.path)),entry.expected))throw Error('changed during recovery');fs.renameSync(staged,safeTarget(root,entry.path));}
     else fs.renameSync(original,safeTarget(root,entry.path));
    }
    recovered.push(entry.path);
   }catch(error){errors.push({path:entry.path,error:error.message});}
  }
  cleanup(errors.length>0,errors);const material=journalReport(errors);closed=true;return {status:errors.length?'incomplete':'recovered',recovered,untouched,errors,...material,backups:'explicit overwrite backups, if created, retained',externalFiles:'package/lock bytes or absence only; inode/timestamp precision may differ'};
 }
 function commit(){const errors=[];cleanup(false,errors);const material=journalReport(errors);closed=true;return {status:errors.length?'cleanup-incomplete':'committed',errors,...material};}
 return {validate,apply,watch,observeExternal,rollback,commit};
}
export function applyPlan(root,plan){
 const transaction=createTransaction(root);
 try{transaction.apply(plan);const result=transaction.commit();if(result.errors.length)throw Object.assign(Error('Committed files, transaction cleanup incomplete'),{recovery:result});return result;}
 catch(error){if(!error.recovery)error.recovery=transaction.rollback();error.message+=`
Recovery: ${JSON.stringify(error.recovery)}`;throw error;}
}
