import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hash} from '../packages/core/src/tools/safety.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function buildSlicePayload() {
const packagePath=path.join(root,'packages/core');
const owner=JSON.parse(fs.readFileSync(path.join(packagePath,'package.json')));
const target=path.join(packagePath,'payload'),source=path.join(root,'packages/core/src/ui');
// Generated output must not retain retired source names from previous inventories.
fs.rmSync(target,{recursive:true,force:true});
fs.mkdirSync(target,{recursive:true});
const items=JSON.parse(fs.readFileSync(path.join(root,'packages/core/registry/items.json')));
const common=['foundation/theme.css','lib/cn.ts'];
const paths=[...new Set([...common,...Object.values(items).flatMap(item=>item.files)])].sort();
const files={};
for(const name of paths){const bytes=fs.readFileSync(path.join(source,name));const dest=path.join(target,'source',name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);files[name]={hash:hash(bytes),bytes:bytes.length};}
// Validate EACH selectable closure, including side-effect owner CSS, not just the full payload.
for(const selection of Object.keys(items)){
 const closure=new Set(common),visited=new Set();
 function visit(name){if(visited.has(name))return;visited.add(name);const item=items[name];if(!item)throw Error(`Unknown item edge ${selection} -> ${name}`);item.files.forEach(f=>closure.add(f));item.requires.forEach(visit);}
 visit(selection);
 for(const name of [...closure].filter(p=>/\.tsx?$/.test(p))){
  const text=fs.readFileSync(path.join(source,name),'utf8');
  for(const match of text.matchAll(/(?:from\s+|import\s*)['"](\.[^'"]+)['"]/g)){
   const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),match[1]));
   if(![resolved,resolved+'.ts',resolved+'.tsx'].some(p=>closure.has(p)))throw Error(`Missing selected source/CSS edge ${selection}: ${name} -> ${resolved}`);
  }
 }
}
const assets={};
for(const name of fs.readdirSync(path.join(packagePath,'assets/fonts'))){const bytes=fs.readFileSync(path.join(packagePath,'assets/fonts',name));fs.mkdirSync(`${target}/assets`,{recursive:true});fs.writeFileSync(`${target}/assets/${name}`,bytes);assets[name]={hash:hash(bytes),bytes:bytes.length};}
const manifest={package:owner.name,version:owner.version,common,items,files,assets,runtime:{clsx:'2.1.1','tailwind-merge':'3.7.0'},build:{tailwindcss:'4.3.3','@tailwindcss/vite':'4.3.3'},types:{'@types/react':'19.2.2','@types/react-dom':'19.2.2'}};
fs.writeFileSync(`${target}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');

console.error(`Canonical payload: ${paths.length} sources, ${Object.keys(assets).length} assets, version ${manifest.version}`);
return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildSlicePayload();
