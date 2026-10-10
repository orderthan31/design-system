import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import { readJSON } from './common.mjs';
import {safeTarget} from './safety.mjs';
import {consumerPolicy,consumerCompiler,staticClasses,hasUtility} from './lint-policy.mjs';
import {createCSSDiscovery} from './lint-css.mjs';

// Inspection remains separate from the consumer check and performs no writes.
export function inspectLint(boundary) {
  const require = createRequire(path.join(boundary.root, 'package.json'));
  const classifierRequire=createRequire(require.resolve('@shadcn/lint/package.json')),classifierConfig=classifierRequire.resolve('cn/config'),classifier=readJSON(path.join(path.dirname(path.dirname(classifierConfig)),'package.json'));
  if(classifier.version!=='0.3.2'||require.resolve('cn/config')!==classifierConfig)throw Error('Unsupported host grammar resolution; core and shadcn must resolve the same pinned cn 0.3.2 tool dependency');
  return {
    package: boundary.pkg.name,
    version: boundary.pkg.version,
    consumerPolicy: 'hangyeol.json sourceRoot; installed editable source policy, no host configuration execution',
    policy:readJSON(path.join(boundary.root,'dist/policy/manifest.json')),
    classifier:{name:classifier.name,version:classifier.version,license:classifier.license,mode:'grammar classification; not a Tailwind compiler'},
    dependencies: Object.entries(boundary.pkg.dependencies).map(([name, expected]) => {
      const file = require.resolve(`${name}/package.json`);
      const actual = readJSON(file);
      if (actual.version !== expected) throw Error(`Tool dependency mismatch: ${name}`);
      return { name, version: actual.version, license: actual.license, resolved: true };
    }),
  };
}

export async function runLint(args, boundary) {
  if (args.length === 1 && args[0] === 'inspect') {
    console.log(JSON.stringify(inspectLint(boundary), null, 2));
    return 0;
  }
  if(args.length){console.error('Use hangyeol lint or hangyeol lint inspect; no host config or path override is executed');return 2;}
  const root=process.cwd(),diagnostics=[];
  try{
   const config=readJSON(safeTarget(root,'hangyeol.json'));if(config.schemaVersion!==1||typeof config.sourceRoot!=='string'||typeof config.stylePath!=='string')throw Error('Invalid hangyeol.json: schemaVersion 1, sourceRoot and stylePath required');
   for(const key of ['sourceRoot','stylePath'])if(config[key].split('/').some(p=>['node_modules','.git','.hangyeol-backups','.hangyeol-transactions'].includes(p.toLowerCase())))throw Error(`Reserved consumer ${key}: ${config[key]}`);
   if(config.alias!=null&&(typeof config.alias!=='string'||!/^@[a-zA-Z][\w/-]*$/.test(config.alias)))throw Error('Invalid configured alias');
   const source=safeTarget(root,config.sourceRoot);safeTarget(root,config.stylePath);if(!fs.statSync(source).isDirectory())throw Error('sourceRoot must be a directory');
   const files=[];function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){if(entry.isDirectory()&&['node_modules','.git','.hangyeol-backups','.hangyeol-transactions'].includes(entry.name.toLowerCase()))continue;const full=safeTarget(root,path.relative(root,path.join(dir,entry.name)).split(path.sep).join('/'));if(entry.isDirectory())scan(full);else if(entry.isFile()&&/\.(?:ts|tsx)$/.test(entry.name))files.push(full);}}
   scan(source);if(!files.length)throw Error('No TypeScript source files inspected in configured sourceRoot');
   const inspectedPolicy=inspectLint(boundary),require=createRequire(path.join(boundary.root,'package.json')),{ESLint}=await import(pathToFileURL(require.resolve('eslint'))),{parse}=await import(pathToFileURL(require.resolve('@typescript-eslint/parser')));
   let compiler;try{compiler=await consumerCompiler(root,config,boundary.manifest.build.tailwindcss);}catch(error){compiler={mode:'unavailable',fallback:'none',reason:error.message};}
   const candidates=[],owners=[],cssSources=[],inlinePropertyOwners=[],discoverCSS=createCSSDiscovery(root,config);let sites=0;
   for(const full of files){const file=path.relative(root,full).split(path.sep).join('/'),relative=path.relative(source,full).split(path.sep).join('/'),text=fs.readFileSync(full,'utf8');let ast;
    try{ast=parse(text,{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true},loc:true});}catch(error){diagnostics.push({file,line:error.lineNumber??1,column:error.column??1,rule:'parse',message:error.message});continue;}
    const css=discoverCSS(relative,ast),policy=await consumerPolicy(boundary,config,relative,ast,compiler.semantic,css);if(policy.owner)owners.push(file);sites+=policy.imports.length;
    if(css.dependencies.length)cssSources.push({file,stylesheets:css.dependencies.map(name=>config.sourceRoot+'/'+name),classes:[...css.classes].sort()});
    if(policy.inlineProperties.length)inlinePropertyOwners.push({file,properties:policy.inlineProperties});
    // A virtual tool-local filename avoids loading consumer ESLint/cn configs.
    const eslint=new ESLint({cwd:boundary.root,overrideConfigFile:true,overrideConfig:[policy.config],ignore:false});
    const result=await eslint.lintText(text,{filePath:path.join(boundary.root,'dist/policy/lint-input.tsx')});for(const entry of result)diagnostics.push(...entry.messages.map(m=>({file,line:m.line??1,column:m.column??1,rule:m.ruleId??'parse',message:m.message.replaceAll('payload/source/foundation/theme.css',config.sourceRoot+'/foundation/theme.css')})));
    candidates.push(...staticClasses(ast).map(c=>({...c,file,sourceCSS:css.classes.has(c.value)})));
   }
   if(compiler.mode==='actual'){const css=compiler.build([...new Set(candidates.map(c=>c.value))]);for(const c of candidates)if(!c.sourceCSS&&!hasUtility(css,c.value))diagnostics.push({file:c.file,line:c.line,column:c.column,rule:'core/unknown-class',message:`Unknown Tailwind utility: ${c.value}`});}
   const {build,...compilerReport}=compiler,report={sourceRoot:config.sourceRoot,readOnly:true,coverage:{sourceFiles:files.length,componentImports:sites,staticClasses:candidates.length},owners,cssSources,inlinePropertyOwners,policy:inspectedPolicy,compiler:compilerReport,diagnostics,limitations:['Static TS/TSX and literal cn/variants/sizes value classes only; runtime strings, CSS restyling and indirect component wrappers are not proved.','Imported CSS selector presence is module-local and does not authorize component restyling, raw colors, arbitrary values or inline token overrides.','shadcn rule classifications use installed policy theme and its pinned cn grammar; editable host theme utilities are independently checked by the reported actual compiler.','Inline custom-property contracts require exact installed canonical source and CSS bytes; opaque external/function styles and runtime CSSOM are not proved.']};
   console.log(JSON.stringify(report,null,2));for(const d of diagnostics)console.error(`${d.file}:${d.line}:${d.column} ${d.rule}: ${d.message}`);if(compiler.mode!=='actual')console.error(`COMPILER UNAVAILABLE: ${compiler.reason}; no unknown-class pass claimed`);
   return diagnostics.length?1:compiler.mode==='actual'?0:2;
  }catch(error){console.error(`HANGYEOL LINT ERROR: ${error.message}`);return 1;}
}
