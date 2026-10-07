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
  const folded=file.path.toLowerCase();
  for(const previous of seen){if(folded===previous)throw Error(`duplicate target: ${file.path}`);if(folded.startsWith(previous+'/')||previous.startsWith(folded+'/'))throw Error(`file/directory target overlap: ${file.path}`);}seen.add(folded);
  const full=safeTarget(root,file.path),bytes=Buffer.from(file.bytes),digest=hash(bytes);
  if(file.hash&&file.hash!==digest)throw Error(`payload hash mismatch: ${file.path}`);
  let action='create',previous;
  if(fs.existsSync(full)){if(!fs.statSync(full).isFile())throw Error(`conflict: not a file ${file.path}`);previous=hash(fs.readFileSync(full));action=previous===digest?'noop':'replace';if(action==='replace'&&!overwrite&&!file.integrate)throw Error(`conflict: edited/existing ${file.path}; review then use --overwrite for a backup`);}
  const backup=action==='replace'?`.gyeol-backups/${stamp}/${file.path}`:undefined;
  if(backup)safeTarget(root,backup);
  return {...file,bytes,hash:digest,action,previous,backup};
 });
}
export function applyPlan(root,plan){
 // Recheck the entire plan immediately before the first mutation.
 for(const item of plan){const full=safeTarget(root,item.path);const now=fs.existsSync(full)?hash(fs.readFileSync(full)):undefined;if(now!==item.previous)throw Error(`conflict: changed since planning ${item.path}`);if(item.backup)safeTarget(root,item.backup);}
 for(const item of plan){if(item.action==='noop')continue;const full=safeTarget(root,item.path);if(item.backup){const backup=safeTarget(root,item.backup);fs.mkdirSync(path.dirname(backup),{recursive:true});fs.copyFileSync(full,backup,fs.constants.COPYFILE_EXCL);}fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,item.bytes);}
}
