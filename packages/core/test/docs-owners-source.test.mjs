import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import postcss from 'postcss';
import ts from 'typescript';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const ui=path.join(root,'packages/core/src/ui');
const read=p=>fs.readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const manifest=json(path.join(root,'packages/core/payload/manifest.json'));
const mappings=json(new URL('./fixtures/docs-style-transfer.json',import.meta.url));

test('transferred owner declarations retain frozen values, order, media context and unlayered priority',()=>{
 for(const record of mappings.filter(r=>r.file)){
  const ast=postcss.parse(read(path.join(ui,record.file)));const matches=[];
  ast.walkRules(rule=>{if(rule.selector!==record.newSelector)return;const contexts=[];for(let p=rule.parent;p&&p.type!=='root';p=p.parent)if(p.type==='atrule')contexts.unshift('@'+p.name+' '+p.params);if(JSON.stringify(contexts)!==JSON.stringify(record.contexts))return;matches.push(rule);});
  assert.ok(matches.some(rule=>{
   const actual=rule.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value,d.important??false]);
   // Brand mask URLs and width became explicit consumer custom properties.
   if(record.file==='components/brand-mark.css')return record.declarations.every(d=>actual.some(a=>JSON.stringify(a)===JSON.stringify(d)));
   return JSON.stringify(actual)===JSON.stringify(record.declarations);
  }),`${record.line}: ${record.file} ${record.newSelector}`);
 }
 const brand=read(path.join(ui,'components/brand-mark.css'));
 assert.match(brand,/width: var\(--hangyeol-brand-width\)/);assert.match(brand,/-webkit-mask: var\(--hangyeol-brand-mask\) center \/ contain no-repeat/);assert.match(brand,/mask-mode: alpha/);
 const docs=read(path.join(root,'apps/docs/src/docs.css'));
 assert.doesNotMatch(docs,/docs-(?:code|toggle|native-select|skip|swatch-option|palette-swatch|demo|details|radius-sample|container-sample|grid-cell|layer-example|overlay-example)(?:[\s.:>{-]|$)/);
 assert.doesNotMatch(read(path.join(ui,'primitives/control-label.css')),/16px|accent-color/);
});

test('each selectable owner has its source, side-effect CSS, helper and type dependency closure',()=>{
 const generated=[];function walk(dir,prefix=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const name=prefix+entry.name;if(entry.isDirectory())walk(path.join(dir,entry.name),name+'/');else generated.push(name);}}walk(path.join(root,'packages/core/payload/source'));assert.deepEqual(generated.sort(),Object.keys(manifest.files).sort());
 for(const selection of Object.keys(manifest.items)){
  const names=new Set(manifest.common),items=new Set();function visit(name){if(items.has(name))return;items.add(name);const item=manifest.items[name];item.requires.forEach(visit);item.files.forEach(f=>names.add(f));}visit(selection);
  for(const name of [...names].filter(n=>/\.tsx?$/.test(n))){
   const ast=ts.createSourceFile(name,read(path.join(ui,name)),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
   for(const node of ast.statements){if(!(ts.isImportDeclaration(node)||ts.isExportDeclaration(node))||!node.moduleSpecifier||!ts.isStringLiteral(node.moduleSpecifier))continue;const spec=node.moduleSpecifier.text;if(!spec.startsWith('.'))continue;const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(name),spec));assert.ok([resolved,resolved+'.ts',resolved+'.tsx'].some(n=>names.has(n)),`${selection}: ${name} -> ${spec}`);}
  }
 }
 assert.deepEqual(manifest.items['code-block'].runtime,{prettier:'3.6.2',prismjs:'1.30.0'});assert.deepEqual(manifest.items['code-block'].types,{'@types/prismjs':'1.26.6'});
 assert.ok(manifest.items['code-block'].files.includes('components/code-block.css'));
 assert.doesNotMatch(JSON.stringify(manifest.items.button),/prettier|prism|code-block/);
 assert.doesNotMatch(read(path.join(ui,'components/brand-mark.tsx')),/\/brand\//);
});

test('active authored Docs has zero raw controls/anchors/disclosures, without counting inert source examples',()=>{
 const forbidden=new Set(['a','input','select','button','textarea','details','summary']);const sites=[];
 const docs=path.join(root,'apps/docs/src');
 for(const name of fs.readdirSync(docs).filter(n=>n.endsWith('.tsx'))){
  const ast=ts.createSourceFile(name,read(path.join(docs,name)),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  function visit(n){if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n)){const tag=n.tagName.getText(ast);if(forbidden.has(tag))sites.push(name+':'+tag);}if(ts.isImportDeclaration(n)&&ts.isStringLiteral(n.moduleSpecifier))assert.ok(!n.moduleSpecifier.text.startsWith('@radix-ui/'),name);ts.forEachChild(n,visit);}visit(ast);
 }
 assert.deepEqual(sites,[]);assert.ok(!fs.existsSync(path.join(docs,'code-block.tsx')));assert.ok(!fs.existsSync(path.join(docs,'code-format.ts')));
});

test('installed CLI plans selected CodeBlock types, but button-only never pulls formatting engines',()=>{
 const dir=fs.mkdtempSync(path.join(process.env.TMPDIR||os.tmpdir(),'hangyeol-type-closure-'));
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:'selected-type-proof',private:true,type:'module',dependencies:{react:'19.2.0','react-dom':'19.2.0',...manifest.runtime},devDependencies:{vite:'7.3.6',...manifest.build,...manifest.types}}));
 const bin=path.join(root,'node_modules/.bin/hangyeol');
 const run=args=>{const r=spawnSync(process.execPath,[bin,...args],{cwd:dir,encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout;};
 run(['init']);const code=JSON.parse(run(['add','code-block','--dry-run']));
 assert.deepEqual(code.dependencies.types,['@types/prismjs@1.26.6']);assert.deepEqual(code.dependencies.runtime,['prettier@3.6.2','prismjs@1.30.0']);assert.ok(code.files.some(f=>f.path.endsWith('/code-block.css')));
 const button=JSON.parse(run(['add','button','--dry-run']));assert.deepEqual(button.dependencies,{runtime:[]});assert.ok(button.files.every(f=>!/(code-block|code-format|prism)/.test(f.path)));
 const pkg=json(path.join(dir,'package.json'));pkg.devDependencies['@types/prismjs']='0.0.0';fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify(pkg));const conflict=spawnSync(process.execPath,[bin,'add','code-block','--dry-run'],{cwd:dir,encoding:'utf8'});assert.equal(conflict.status,1);assert.match(conflict.stderr,/Dependency conflict: @types\/prismjs/);assert.ok(!fs.existsSync(path.join(dir,'src/hangyeol/components/code-block.tsx')));
});
