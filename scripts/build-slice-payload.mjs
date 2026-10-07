import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {hash} from '../packages/cli/src/safety.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function buildSlicePayload({packageDir='packages/cli',writeLegacyRegistry=packageDir==='packages/cli'}={}) {
const packagePath=path.resolve(root,packageDir);
if(!['packages/cli','packages/core'].includes(packageDir))throw Error('Unsupported payload owner');
const owner=JSON.parse(fs.readFileSync(path.join(packagePath,'package.json')));
const target=path.join(packagePath,'payload'),source=path.join(root,'packages/ui/src');
fs.mkdirSync(target,{recursive:true});
const items=JSON.parse(fs.readFileSync(path.join(root,'registry/items/first-slice.json')));
const common=['foundation/theme.css','lib/cn.ts'];
const paths=[...new Set([...common,...Object.values(items).flatMap(item=>item.files)])].sort();
const files={};
for(const name of paths){const bytes=fs.readFileSync(path.join(source,name));const dest=path.join(target,'source',name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);files[name]={hash:hash(bytes),bytes:bytes.length};}
// Assert complete relative import closure, not just a manually declared list.
for(const name of paths.filter(p=>/\.tsx?$/.test(p))){const text=fs.readFileSync(path.join(source,name),'utf8');for(const match of text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)){const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),match[1]));if(!paths.some(p=>p===resolved+'.ts'||p===resolved+'.tsx'))throw Error(`Missing source edge ${name} -> ${resolved}`);}}
const assets={};
for(const name of fs.readdirSync(path.join(root,'public/source/fonts'))){const bytes=fs.readFileSync(path.join(root,'public/source/fonts',name));fs.mkdirSync(`${target}/assets`,{recursive:true});fs.writeFileSync(`${target}/assets/${name}`,bytes);if(writeLegacyRegistry){fs.mkdirSync(path.join(root,'registry/assets/fonts'),{recursive:true});fs.writeFileSync(path.join(root,'registry/assets/fonts',name),bytes);}assets[name]={hash:hash(bytes),bytes:bytes.length};}
const manifest={...(packageDir==='packages/core'?{package:owner.name}:{}),version:owner.version,common,items,files,assets,runtime:{clsx:'2.1.1','tailwind-merge':'3.7.0'},build:{tailwindcss:'4.3.3','@tailwindcss/vite':'4.3.3'},types:{'@types/react':'19.2.2','@types/react-dom':'19.2.2'}};
fs.writeFileSync(`${target}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
if(writeLegacyRegistry)fs.writeFileSync(path.join(root,'registry/items/payload-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.error(`Canonical payload: ${paths.length} sources, ${Object.keys(assets).length} assets, version ${manifest.version}`);
return manifest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildSlicePayload();
