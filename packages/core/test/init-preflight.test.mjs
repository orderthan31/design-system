import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import test from 'node:test';
import {createHash} from 'node:crypto';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const evidence = process.env.CORE02_EVIDENCE_DIR;
assert.ok(evidence, 'Require designated CORE02 scratch');
const payload = path.join(root, 'packages/core/payload');
const manifest = JSON.parse(fs.readFileSync(path.join(payload, 'manifest.json')));
const installer = pathToFileURL(path.join(root, 'packages/cli/src/installer.mjs')).href;
const wrapper = `import {runInstaller} from ${JSON.stringify(installer)};process.exitCode=runInstaller(process.argv.slice(1),{payloadRoot:${JSON.stringify(payload)}});`;
const vite = "import {defineConfig} from 'vite';import tailwindcss from '@tailwindcss/vite';export default defineConfig({plugins:[tailwindcss()]});\n";
function host() {
  const dir = fs.mkdtempSync(path.join(evidence, 'preflight-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({name:'core02-source-host',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...manifest.runtime},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}}, null, 2));
  return dir;
}
function snapshot(dir, base=dir) {
  const files = {};
  if(dir===base)files['.']={mtime:fs.lstatSync(dir,{bigint:true}).mtimeNs.toString()};
  for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const p = path.join(dir,entry.name), stat = fs.lstatSync(p,{bigint:true});
    files[path.relative(base,p)] = {mtime:stat.mtimeNs?.toString() ?? stat.mtimeMs, ...(entry.isFile()?{hash:createHash('sha256').update(fs.readFileSync(p)).digest('hex')}:{}), ...(entry.isSymbolicLink()?{link:fs.readlinkSync(p)}:{})};
    if (entry.isDirectory()) Object.assign(files,snapshot(p,base));
  }
  return files;
}
function run(dir,args,expected,env=process.env) {
  const start=performance.now(), result=spawnSync(process.execPath,['--input-type=module','-e',wrapper,...args],{cwd:dir,encoding:'utf8',env});
  fs.writeFileSync(path.join(evidence,`source-preflight-${Date.now()}-${process.hrtime.bigint()}.json`),JSON.stringify({command:[process.execPath,'--input-type=module','-e',wrapper,...args],cwd:dir,runtime:process.version,durationMs:performance.now()-start,exit:result.status,expectedExit:expected,stdout:result.stdout,stderr:result.stderr},null,2));
  assert.equal(result.status,expected,result.stdout+'\n'+result.stderr);
  return result;
}
function rejected(dir,args=['init'],diagnostic,env=process.env) {
  const before=snapshot(dir);let result;
  try {result=run(dir,args,1,env);}
  finally {fs.writeFileSync(path.join(evidence,`source-snapshot-${process.hrtime.bigint()}.json`),JSON.stringify({host:dir,args,before,after:snapshot(dir)},null,2));}
  assert.deepEqual(snapshot(dir),before,'preflight failure must preserve bytes and mtimes for the full host');
  if(diagnostic)assert.match(result.stderr,diagnostic);
}

test('Vite inspection rejects ambiguous, dynamic, duplicate and comment-only settings without evaluation', () => {
  for (const text of [
    "// @tailwindcss/vite\nexport default {};",
    vite.replace('plugins:[tailwindcss()]','base:process.env.BASE,plugins:[tailwindcss()]'),
    vite.replace('plugins:[tailwindcss()]',"base:'/',base:'/other/',plugins:[tailwindcss()]"),
    vite.replace('plugins:[tailwindcss()]',"...settings,plugins:[tailwindcss()]"),
    vite.replace('tailwindcss()]','fake()]'),
  ]) {const dir=host();fs.writeFileSync(path.join(dir,'vite.config.ts'),text);rejected(dir);}
  const dir=host();fs.writeFileSync(path.join(dir,'vite.config.ts'),vite);fs.writeFileSync(path.join(dir,'vite.config.js'),vite);rejected(dir);
});

test('existing static compatible Vite config is preserved', () => {
  const dir=host();fs.writeFileSync(path.join(dir,'vite.config.ts'),vite);
  run(dir,['init'],0);
  assert.equal(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),vite);
});

test('installed settings, changed flags and edited integration cannot be silently adopted', () => {
  for (const change of ['flag','sourceRoot','stylePath','basePath','alias','header','tail']) {
    const dir=host();run(dir,['init'],0);
    if(change==='flag') {rejected(dir,['init','--source-root','other/ui']);continue;}
    if(['header','tail'].includes(change)) {
      const file=path.join(dir,'src/gyeol.css');
      const text=fs.readFileSync(file,'utf8');
      fs.writeFileSync(file,change==='header'?text.replace('@source "./gyeol";','@source "./elsewhere";'):text+'\n/* owner edit */\n');
    } else {const file=path.join(dir,'gyeol.json'),config=JSON.parse(fs.readFileSync(file));config[change]=change==='basePath'?'/changed/':change==='alias'?'@changed':'changed/path';fs.writeFileSync(file,JSON.stringify(config,null,2)+'\n');}
    rejected(dir);
  }
});

test('init dry-run and repeat preserve full bytes/mtime snapshot including useful host CSS', () => {
  const dir=host();fs.mkdirSync(path.join(dir,'src'));const body='body { color: chocolate; }\n.native-sentinel { padding: 13px; }\n';fs.writeFileSync(path.join(dir,'src/gyeol.css'),body);
  const before=snapshot(dir);run(dir,['init','--dry-run'],0);assert.deepEqual(snapshot(dir),before);
  run(dir,['init'],0);assert.ok(fs.readFileSync(path.join(dir,'src/gyeol.css'),'utf8').endsWith(body));
  const installed=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),installed);
});

test('unsafe roots, symlinks, reset integration and unknown flags fail before writes', () => {
  for(const args of [ ['--source-root','../outside'],['--source-root','node_modules/ui'],['--source-root','.Git'],['--public-root','SRC/gyeol'],['--style-path','package.json'],['--font-path','../fonts'],['--wat'],['--base-path'],['--source-root','a','--source-root','b'] ]) {const dir=host();rejected(dir,['init',...args]);}
  for(const css of ['@import "tailwindcss";\n','@import url(tailwindcss);\n','@import "tailwindcss/index.css";\n','@import "tailwindcss/preflight.css";\n','@tailwind base;\n','* { margin:0; padding:0; }\n']) {const dir=host();fs.mkdirSync(path.join(dir,'src'));fs.writeFileSync(path.join(dir,'src/gyeol.css'),css);rejected(dir);}
  const dir=host(),target=host();fs.symlinkSync(target,path.join(dir,'public'));rejected(dir);
});

test('generated host config edits, ambiguous TS aliases and file ancestors reject atomically', () => {
  for (const filename of ['vite.config.ts','tsconfig.json']) {
    const dir=host();run(dir,['init','--alias','@gyeol'],0);
    fs.appendFileSync(path.join(dir,filename),'\n ');rejected(dir);
  }
  for (const compilerOptions of [{baseUrl:'src'},{paths:{'@gyeol/*':['./elsewhere/*']}}]) {
    const dir=host();fs.writeFileSync(path.join(dir,'tsconfig.json'),JSON.stringify({compilerOptions}));rejected(dir,['init','--alias','@gyeol']);
  }
  const dir=host();fs.writeFileSync(path.join(dir,'blocked'),'file');rejected(dir,['init','--source-root','blocked/ui']);
});

test('all Vite config filenames and explicit host overrides are discovered before writes', () => {
  const dir=host();fs.writeFileSync(path.join(dir,'vite.config.cjs'),"module.exports = {base:'/other/'};");rejected(dir);
  const duplicate=host();fs.writeFileSync(path.join(duplicate,'vite.config.ts'),vite);fs.writeFileSync(path.join(duplicate,'vite.config.mts'),vite);rejected(duplicate);
  for(const edit of [{scripts:{dev:'vite --config custom.ts'}},{scripts:{build:'vite build --base /other/'}},{devDependencies:{vite:'7.3.6',tailwindcss:'3.4.17'}}]) {
    const target=host(),file=path.join(target,'package.json'),pkg=JSON.parse(fs.readFileSync(file));fs.writeFileSync(file,JSON.stringify({...pkg,...edit}));rejected(target);
  }
});

test('pre-authored settings and real matching alias config are honored without flags', () => {
  const dir=host();
  const config={schemaVersion:1,sourceRoot:'ui/system',stylePath:'styles/theme.css',publicRoot:'static',fontPath:'assets/type',basePath:'/design/',alias:'@hangyeol'};
  fs.writeFileSync(path.join(dir,'gyeol.json'),JSON.stringify(config,null,2)+'\n');
  const text="import {defineConfig} from 'vite';import {fileURLToPath} from 'node:url';import tw from '@tailwindcss/vite';export default defineConfig({base:'/design/',publicDir:'static',resolve:{alias:{'@hangyeol':fileURLToPath(new URL('./ui/system',import.meta.url))}},plugins:[tw()]});\n";
  fs.writeFileSync(path.join(dir,'vite.config.ts'),text);
  run(dir,['init'],0);assert.equal(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),text);
  assert.ok(fs.existsSync(path.join(dir,'ui/system/foundation/theme.css')));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir,'tsconfig.json'))).compilerOptions.paths,{'@hangyeol/*':['./ui/system/*']});
  const before=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),before);
  fs.writeFileSync(path.join(dir,'vite.config.ts'),text.replace("new URL('./ui/system'","new URL('./other'"));rejected(dir);
});

test('planned file/directory target overlaps fail before creating any source', () => {
  for(const stylePath of ['src','src/gyeol/lib','src/gyeol/foundation']) {
    const dir=host();rejected(dir,['init','--style-path',stylePath]);
  }
});

const matchingAlias="import {defineConfig} from 'vite';import {fileURLToPath} from 'node:url';import tw from '@tailwindcss/vite';export default defineConfig({resolve:{alias:{'@hangyeol':fileURLToPath(new URL('./src/gyeol',import.meta.url))}},plugins:[tw()]});\n";
test('review fix1 rejects a custom plugin with effective configuration override hooks without executing it',()=>{
  const dir=host();
  fs.writeFileSync(path.join(dir,'override.mjs'),"import fs from 'node:fs';fs.writeFileSync('plugin-executed','bad');export default ()=>({name:'override',config(){return {base:'/other/',publicDir:'other',resolve:{alias:{'@hangyeol':'./elsewhere'}}}},configResolved(config){config.base='/changed/';config.publicDir='other';config.resolve.alias=[];}});\n");
  fs.writeFileSync(path.join(dir,'vite.config.ts'),vite.replace('export default',"import override from './override.mjs';export default").replace('tailwindcss()]','tailwindcss(),override()]'));
  rejected(dir,['init'],/unreviewed|unsupported.*plugin/i);
  assert.ok(!fs.existsSync(path.join(dir,'plugin-executed')));
  for(const text of [vite.replace('export default',"import unused from './override.mjs';export default"),vite.replace('tailwindcss()]','tailwindcss({optimize:true})]'),vite.replace('export default',"import react from '@vitejs/plugin-react';export default").replace('tailwindcss()]','tailwindcss(),react()]')]) {
    const target=host();fs.writeFileSync(path.join(target,'vite.config.ts'),text);rejected(target,['init'],/unreviewed|unsupported.*plugin/i);
  }
});
test('review fix1 rejects intercepting Vite and TypeScript aliases in either ordering',()=>{
  for(const entry of ["'@hangyeol/primitives':'./elsewhere',", "'@hangyeol':'./elsewhere',"]) {
    const dir=host();const text=entry.startsWith("'@hangyeol':")?matchingAlias.replace("'@hangyeol':fileURLToPath","'@hangyeol/system':fileURLToPath"):matchingAlias;
    fs.writeFileSync(path.join(dir,'vite.config.ts'),text.replace('alias:{','alias:{'+entry));
    rejected(dir,['init','--alias',entry.startsWith("'@hangyeol':")?'@hangyeol/system':'@hangyeol'],/intercept|competing|ambiguous.*alias/i);
  }
  const dir=host();fs.writeFileSync(path.join(dir,'vite.config.ts'),matchingAlias.replace('}},plugins',",'@hangyeol/primitives':'./elsewhere'}},plugins"));rejected(dir,['init','--alias','@hangyeol'],/intercept|competing|ambiguous.*alias/i);
  for(const key of ['@hangyeol/primitives/*','@hangyeol/primitives/button','@hangyeol/primitives*']) {
    const target=host();fs.writeFileSync(path.join(target,'tsconfig.json'),JSON.stringify({compilerOptions:{paths:{[key]:['./elsewhere/*']}}}));rejected(target,['init','--alias','@hangyeol'],/intercept|competing|ambiguous.*alias/i);
  }
});
test('review fix1 reserves host config targets and rejects before any npm invocation',()=>{
  for(const [flag,value] of [['--style-path','vite.config.js'],['--style-path','vite.config.mts'],['--style-path','tsconfig.json'],['--source-root','vite.config.cts'],['--source-root','vite.config.js/ui'],['--public-root','tsconfig.json'],['--font-path','vite.config.ts/fonts']]) {
    const dir=host(),pkgFile=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(pkgFile));delete pkg.dependencies.clsx;fs.writeFileSync(pkgFile,JSON.stringify(pkg));
    const bin=path.join(dir,'fixture-bin');fs.mkdirSync(bin);const trace=path.join(evidence,`npm-trace-${process.hrtime.bigint()}.txt`);fs.writeFileSync(trace,'');fs.writeFileSync(path.join(bin,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE02_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(bin,'npm'),0o755);
    rejected(dir,['init',flag,value],/reserved.*host|host.*target/i,{...process.env,PATH:bin+path.delimiter+process.env.PATH,CORE02_NPM_TRACE:trace});assert.equal(fs.readFileSync(trace,'utf8'),'');
  }
});
test('review fix1 refuses unsupported Vite script config/base/root selection forms',()=>{
  for(const script of ['vite -c custom.ts','vite -ccustom.ts','vite build -c=custom.ts','vite -b /other/','vite -b/other/','vite other','vite build other','vite preview ./other','vite serve ./other','vite dev ./other','vite build -- ./other','vite --root other','cd other && vite','cross-env ROOT=other vite','vite --configLoader runner']) {
    const dir=host(),file=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(file));pkg.scripts={dev:script};fs.writeFileSync(file,JSON.stringify(pkg));rejected(dir,['init'],/unsupported.*(?:script|vite)|effective.*host/i);
  }
});
test('review fix1 isolated publicDir mismatch reports the publicDir branch with matching base',()=>{
  const dir=host();fs.writeFileSync(path.join(dir,'vite.config.ts'),vite.replace('plugins:',"base:'/design/',publicDir:'public',plugins:"));
  rejected(dir,['init','--base-path','/design/','--public-root','static'],/Vite publicDir conflicts/);
});
test('review fix1 preserves direct Vite compatibility and case-sensitive nonintercepting aliases',()=>{
  const dir=host(),file=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(file));
  pkg.scripts={dev:'vite',build:'vite build',preview:'vite preview',docsBuild:'tsc -p tsconfig.json && vite build',typeBuild:'tsc -b && vite build',loopback:'vite --host 127.0.0.1 --port 5173 --strictPort',previewPort:'vite preview --host=127.0.0.1 --port=4173'};
  fs.writeFileSync(file,JSON.stringify(pkg));
  const text=matchingAlias.replace('alias:{',"alias:{'@Hangyeol/primitives':'./different-case','@hangyeol-extra':'./sibling',");fs.writeFileSync(path.join(dir,'vite.config.ts'),text);
  fs.writeFileSync(path.join(dir,'tsconfig.json'),JSON.stringify({compilerOptions:{paths:{'@Hangyeol/primitives/*':['./different-case/*'],'@hangyeol-extra/*':['./sibling/*']}}}));
  run(dir,['init','--alias','@hangyeol'],0);assert.equal(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),text);
  const before=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),before);
});

function rejectedBuild(option, diagnostic) {
  const dir=host(),pkgFile=path.join(dir,'package.json'),pkg=JSON.parse(fs.readFileSync(pkgFile));
  delete pkg.dependencies.clsx;fs.writeFileSync(pkgFile,JSON.stringify(pkg));
  fs.writeFileSync(path.join(dir,'vite.config.ts'),vite.replace('plugins:',"base:'/',publicDir:'public',build:"+option+",plugins:"));
  const bin=path.join(dir,'fixture-bin'),trace=path.join(evidence,`fix2-source-npm-trace-${process.hrtime.bigint()}.txt`);
  fs.mkdirSync(bin);fs.writeFileSync(trace,'');fs.writeFileSync(path.join(bin,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE02_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(bin,'npm'),0o755);
  try {rejected(dir,['init'],diagnostic,{...process.env,PATH:bin+path.delimiter+process.env.PATH,CORE02_NPM_TRACE:trace});}
  finally {fs.writeFileSync(path.join(evidence,`fix2-source-build-${process.hrtime.bigint()}.json`),JSON.stringify({host:dir,option,trace,npmInvocations:fs.readFileSync(trace,'utf8')},null,2));}
  assert.equal(fs.readFileSync(trace,'utf8'),'','build rejection must precede npm');
}
test('review fix2 refuses disabled public asset copy before any writes or npm',()=>{
  rejectedBuild('{copyPublicDir:false}',/build\.copyPublicDir must be omitted or literal true.*public assets/i);
});
test('review fix2 refuses disabled production writes before any writes or npm',()=>{
  rejectedBuild('{write:false}',/build\.write must be omitted or literal true.*production assets/i);
});
test('review fix2 validates build object/types and refuses unsupported nested effects',()=>{
  for(const value of ['null','false','[]','0','"dist"'])rejectedBuild(value,/build must be a static object/i);
  for(const key of ['copyPublicDir','write'])for(const value of ['null','0','1','"true"','""','[]','{}'])rejectedBuild(`{${key}:${value}}`,new RegExp(`build\\.${key} must be omitted or literal true`,'i'));
  for(const option of ['{lib:{entry:"src/main.ts"}}','{ssr:true}','{rollupOptions:{output:{dir:"elsewhere"}}}','{outDir:"other"}'])rejectedBuild(option,/build\..*outside the supported subset/i);
});
test('review fix2 preserves omitted and explicit enabled build options with strict repeat no-op',()=>{
  for(const option of [null,'{}','{copyPublicDir:true}','{write:true}','{copyPublicDir:true,write:true}']) {
    const dir=host(),text=option===null?vite:vite.replace('plugins:','build:'+option+',plugins:');
    fs.writeFileSync(path.join(dir,'vite.config.ts'),text);run(dir,['init'],0);
    assert.equal(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),text);
    const before=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),before);
  }
});

const fix3Flags=['--source-root','ui/system','--style-path','styles/theme.css','--public-root','static','--font-path','assets/type','--base-path','/design/','--alias','@hangyeol'];
const fix3Vite=matchingAlias.replace("./src/gyeol","./ui/system").replace('resolve:',"base:'/design/',publicDir:'static',resolve:");
function sourceTailwindAlias(name) {
  const dir=host(),text=fix3Vite.replace('alias:{',`alias:{'${name}':'/absolute/alternate-tailwind',`);
  fs.writeFileSync(path.join(dir,'vite.config.ts'),text);
  fs.writeFileSync(path.join(dir,'package-lock.json'),JSON.stringify({name:'core02-source-host',lockfileVersion:3,packages:{}})+'\n');
  for(const [file,body] of [['styles/theme.css','body { color: chocolate; }\n'],['ui/system/owner.txt','existing source\n'],['static/assets/type/owner.txt','existing asset\n'],['.gyeol-backups/owner/checkpoint.txt','existing backup\n']]){fs.mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});fs.writeFileSync(path.join(dir,file),body);}
  const trap=path.join(dir,'fixture-bin'),trace=path.join(evidence,`fix3-source-npm-trace-${process.hrtime.bigint()}.txt`);
  fs.mkdirSync(trap);fs.writeFileSync(trace,'');fs.writeFileSync(path.join(trap,'npm'),'#!/bin/sh\nprintf "npm invoked\\n" >> "$CORE02_NPM_TRACE"\nexit 93\n');fs.chmodSync(path.join(trap,'npm'),0o755);
  try {rejected(dir,['init',...fix3Flags],/alias .*intercepts mandatory Tailwind import.*remove or rename/i,{...process.env,PATH:trap+path.delimiter+process.env.PATH,CORE02_NPM_TRACE:trace});}
  finally {fs.writeFileSync(path.join(evidence,`fix3-source-alias-${process.hrtime.bigint()}.json`),JSON.stringify({host:dir,alias:name,input:text,args:['init',...fix3Flags],trace,npmInvocations:fs.readFileSync(trace,'utf8'),fixtureKind:'source subprocess; dependency-predeclared; synthetic lock'},null,2));}
  assert.equal(fs.readFileSync(trace,'utf8'),'','alias refusal must precede npm');
}
for(const name of ['tailwindcss','tailwindcss/theme.css','tailwindcss/utilities.css'])test(`review fix3 refuses mandatory Tailwind alias ${name} before writes/npm`,()=>sourceTailwindAlias(name));
test('review fix3 preserves normal UI and unrelated near-prefix aliases individually',()=>{
  for(const name of [null,'tailwindcss-extra','tailwindcss/theme.css-extra','tailwindcss/utilities.css-extra','tailwindcss/theme.css/extra','Tailwindcss']) {
    const dir=host(),text=name===null?fix3Vite:fix3Vite.replace('alias:{',`alias:{'${name}':'/absolute/unrelated',`);
    fs.writeFileSync(path.join(dir,'vite.config.ts'),text);run(dir,['init',...fix3Flags],0);assert.equal(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),text);
    const before=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),before);
  }
});
test('review fix3 generated UI alias remains safe and cannot select mandatory imports',()=>{
  for(const name of ['tailwindcss','tailwindcss/theme.css','tailwindcss/utilities.css']){const dir=host();rejected(dir,['init','--alias',name],/alias must be a safe @name path/);}
  const dir=host();run(dir,['init','--alias','@tailwindcss'],0);assert.match(fs.readFileSync(path.join(dir,'vite.config.ts'),'utf8'),/"@tailwindcss"/);const before=snapshot(dir);run(dir,['init'],0);assert.deepEqual(snapshot(dir),before);
});
