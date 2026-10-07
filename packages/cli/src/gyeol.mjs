#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {planFiles,applyPlan,safeTarget,hash} from './safety.mjs';
const payload=fileURLToPath(new URL('../payload/',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(payload,'manifest.json')));
const args=process.argv.slice(2),command=args.shift();
const overwrite=args.includes('--overwrite'),dryRun=args.includes('--dry-run');
function flag(name,fallback){const i=args.indexOf(name);return i<0?fallback:args[i+1];}
function sourceFiles(config,items){
 const names=new Set(manifest.common),runtime={...manifest.runtime},visited=new Set();
 function visit(name){if(visited.has(name))return;const item=manifest.items[name];if(!item)throw Error(`Unknown component: ${name}`);visited.add(name);for(const edge of item.requires)visit(edge);for(const file of item.files)names.add(file);Object.assign(runtime,item.runtime);}
 for(const name of items)visit(name);
 return {files:[...names].map(name=>({path:`${config.sourceRoot}/${name}`,bytes:fs.readFileSync(path.join(payload,'source',name)),hash:manifest.files[name].hash})),runtime,items:[...visited]};
}
function discover(root){
 for(const name of ['package-lock.json','node_modules','gyeol.json'])safeTarget(root,name);
 const packageFile=safeTarget(root,'package.json');if(!fs.existsSync(packageFile))throw Error('Run inside a React/Vite host with package.json');
 const pkg=JSON.parse(fs.readFileSync(packageFile)),all={...pkg.dependencies,...pkg.devDependencies};
 if(!all.react||!all['react-dom']||!all.vite)throw Error('Unsupported host: first adapter requires React, React DOM and Vite');
 if(all.tailwindcss&&!/^\^?4\./.test(all.tailwindcss))throw Error('Unsupported Tailwind version; v3 migration is outside this adapter');
 for(const name of ['react','react-dom'])if(!/^\^?19\./.test(all[name]))throw Error(`Unsupported ${name}: first adapter is tested with React 19; host is not downgraded`);
 return pkg;
}
function fontCSS(config){const base=config.basePath,dir=config.fontPath;return [['Regular',400],['Medium',500],['SemiBold',600],['Bold',700]].map(([name,weight])=>`@font-face { font-family: Pretendard; font-style: normal; font-weight: ${weight}; font-display: swap; src: url("${base}${dir}/Pretendard-${name}.woff2") format("woff2"); }`).join('\n')+'\n';}
function relativeImport(from,to){let rel=path.posix.relative(path.posix.dirname(from),to);return rel.startsWith('.')?rel:'./'+rel;}
function buildInit(root,config){
 const files=[];const graph=sourceFiles(config,[]);files.push(...graph.files);
 const base=config.basePath;if(!/^\/(?:[a-zA-Z0-9_/-]*\/)?$/.test(base)||base.includes('..'))throw Error('basePath must be an absolute URL path ending in /');
 for(const name of Object.keys(manifest.assets)){const bytes=fs.readFileSync(path.join(payload,'assets',name));files.push({path:`${config.publicRoot}/${config.fontPath}/${name}`,bytes,hash:manifest.assets[name].hash});}
 files.push({path:`${config.sourceRoot}/foundation/fonts.css`,bytes:Buffer.from(fontCSS(config))});
 const stylePath=safeTarget(root,config.stylePath),existing=fs.existsSync(stylePath)?fs.readFileSync(stylePath,'utf8'):'';
 if(/@import\s+['"]tailwindcss['"]/.test(existing)||existing.includes('preflight'))throw Error('Host stylesheet imports a reset or umbrella Tailwind import; split it explicitly before init');
 const css=`@layer theme, base, components, utilities;\n@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities);\n@import "${relativeImport(config.stylePath,`${config.sourceRoot}/foundation/theme.css`)}";\n@import "${relativeImport(config.stylePath,`${config.sourceRoot}/foundation/fonts.css`)}";\n@source "${relativeImport(config.stylePath,config.sourceRoot)}";\n`;
 const marker='/* Gyeol managed integration v1 */';
 if(existing.includes(marker)){const old=JSON.parse(fs.readFileSync(safeTarget(root,'gyeol.json')));if(old.stylePath!==config.stylePath||old.sourceRoot!==config.sourceRoot)throw Error('Changing installed roots requires a new reviewed host; no update engine in this slice');files.push({path:config.stylePath,bytes:Buffer.from(css+marker+'\n'+existing.split(marker+'\n')[1])});}
 else files.push({path:config.stylePath,bytes:Buffer.from(css+marker+'\n'+existing),integrate:!!existing});
 const configs=['vite.config.ts','vite.config.mjs','vite.config.js'].filter(p=>fs.existsSync(path.join(root,p)));
 if(configs.length){const text=fs.readFileSync(safeTarget(root,configs[0]),'utf8');if(config.alias && (!text.includes(config.alias)||!text.includes(config.sourceRoot)))throw Error('Existing Vite config must explicitly resolve the configured alias to sourceRoot');if(!text.includes('@tailwindcss/vite'))throw Error('Existing Vite config must explicitly use @tailwindcss/vite; init will not rewrite arbitrary config');}
 else files.push({path:'vite.config.ts',bytes:Buffer.from(`import {defineConfig} from 'vite';\nimport {fileURLToPath} from 'node:url';\nimport tailwindcss from '@tailwindcss/vite';\nexport default defineConfig({base:${JSON.stringify(config.basePath)},publicDir:${JSON.stringify(config.publicRoot)},${config.alias?`resolve:{alias:{${JSON.stringify(config.alias)}:fileURLToPath(new URL(${JSON.stringify('./'+config.sourceRoot)},import.meta.url))}},`:''}plugins:[tailwindcss()]});\n`)});
 if(config.alias){if(!/^@[a-zA-Z][\w/-]*$/.test(config.alias))throw Error('alias must be a safe @name path');const filename=fs.existsSync(path.join(root,'tsconfig.json'))?'tsconfig.json':'tsconfig.json';const current=fs.existsSync(path.join(root,filename))?JSON.parse(fs.readFileSync(safeTarget(root,filename),'utf8')):{};current.compilerOptions??={};current.compilerOptions.paths??={};const key=config.alias+'/*';if(current.compilerOptions.paths[key] && JSON.stringify(current.compilerOptions.paths[key])!==JSON.stringify(['./'+config.sourceRoot+'/*']))throw Error('Existing alias conflicts');current.compilerOptions.paths[key]=['./'+config.sourceRoot+'/*'];files.push({path:filename,bytes:Buffer.from(JSON.stringify(current,null,2)+'\n'),integrate:true});}
 return {files,runtime:graph.runtime,items:[]};
}
try{
 if(command==='--version'){console.log(manifest.version);process.exit(0);}
 if(!['init','add'].includes(command))throw Error('Usage: gyeol init [--source-root src/gyeol --style-path src/gyeol.css --public-root public --font-path fonts/gyeol --base-path / --alias @gyeol] | gyeol add button ... [--overwrite] [--dry-run]');
 const root=process.cwd(),pkg=discover(root),configFile=safeTarget(root,'gyeol.json');
 const previous=fs.existsSync(configFile)?JSON.parse(fs.readFileSync(configFile)):null;
 if(command==='add'&&!previous)throw Error('Run gyeol init first');
 const config=previous||{schemaVersion:1,sourceRoot:flag('--source-root','src/gyeol'),stylePath:flag('--style-path','src/gyeol.css'),publicRoot:flag('--public-root','public'),fontPath:flag('--font-path','fonts/gyeol'),basePath:flag('--base-path','/'),alias:flag('--alias',null),installed:{}};
 for(const key of ['sourceRoot','stylePath','publicRoot','fontPath']){if(typeof config[key]!=='string'||!/^[a-zA-Z0-9_./-]+$/.test(config[key]))throw Error(`Unsafe configurable path: ${key}`);safeTarget(root,config[key]);}
 const requested=command==='add'?args.filter(a=>!a.startsWith('--')):[];
 if(command==='add'&&!requested.length)throw Error('Specify at least one component');
 const result=command==='init'?buildInit(root,config):sourceFiles(config,requested);
 // All source+metadata+host integration paths/collisions/hashes are planned before ANY write or npm action.
 const sourcePlan=planFiles(root,result.files.map(f=>{if(f.integrate){const full=safeTarget(root,f.path);return {...f,previous:fs.existsSync(full)?hash(fs.readFileSync(full)):undefined};}return f;}),{overwrite});
 // Integration is additive and deliberately shown by --dry-run; ordinary arbitrary files remain conflicts.
 const deps=command==='init'?{runtime:result.runtime,build:manifest.build,types:manifest.types}:{runtime:result.runtime};
 const all={...pkg.dependencies,...pkg.devDependencies},needed={};
 for(const [kind,values] of Object.entries(deps)){needed[kind]=[];for(const [name,version]of Object.entries(values)){if(all[name]&&all[name]!==version)throw Error(`Dependency conflict: ${name} host=${all[name]} requested=${version}; resolve explicitly`);if(!all[name])needed[kind].push(`${name}@${version}`);}}
 const next=structuredClone(config);next.version=manifest.version;next.installed??={};
 for(const file of sourcePlan)next.installed[file.path]={version:manifest.version,hash:file.hash};
 next.components=[...new Set([...(config.components||[]),...result.items])];
 if(sourcePlan.some(file=>file.path==='gyeol.json'||file.path==='package.json'||file.path==='package-lock.json'))throw Error('unsafe source/metadata/dependency target overlap');
 const configBytes=Buffer.from(JSON.stringify(next,null,2)+'\n');
 // Config is owned metadata: preserve user settings, update only successful records.
 const metadataPlan=planFiles(root,[{path:'gyeol.json',bytes:configBytes}],{overwrite:true});
 const summary=sourcePlan.map(({path,action,backup,hash})=>({path,action,backup,hash}));
 console.log(JSON.stringify({command,version:manifest.version,files:summary,dependencies:needed,metadata:metadataPlan.map(({path,action})=>({path,action})),dryRun},null,2));
 if(dryRun)process.exit(0);
 applyPlan(root,sourcePlan);
 for(const [kind,values]of Object.entries(needed)){if(!values.length)continue;const install=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['install','--save-exact',...(kind==='runtime'?[]:['--save-dev']),...values],{cwd:root,stdio:'inherit'});if(install.status!==0)throw Error(`Dependency install failed (${install.status ?? install.error?.message}); source files were written and package/lock may be partial. Success metadata was NOT recorded. Review files and retry; no rollback performed.`);}
 applyPlan(root,metadataPlan);
 console.log(`SUCCESS ${command}: ${sourcePlan.filter(f=>f.action!=='noop').length} writes; ${sourcePlan.filter(f=>f.action==='noop').length} identical no-ops. Import ${config.stylePath} from your host entry. ${config.alias?'Configured TypeScript and Vite alias contract.':''}`);
}catch(error){console.error(`GYEOL ERROR: ${error.message}`);process.exitCode=1;}
