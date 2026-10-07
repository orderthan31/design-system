import fs from 'node:fs';
import path from 'node:path';
import {parse} from '@typescript-eslint/parser';
import {ESLint} from 'eslint';
import {compile} from '@tailwindcss/node';
import {sliceImports} from './slice-eslint-policy.mjs';
const eslint=new ESLint(),root=process.cwd();
const candidates=new Set(),diagnostics=[],patterns=sliceImports.map(p=>new RegExp(p));
let sites=0,files=0,cliFiles=0;
function walk(node,visit){if(!node||typeof node!=='object')return;visit(node);for(const [key,value]of Object.entries(node))if(!['parent','loc','range','tokens','comments'].includes(key)){if(Array.isArray(value))for(const item of value)walk(item,visit);else if(value&&typeof value==='object')walk(value,visit);}}
function literalClasses(node){if(!node)return;if(node.type==='Literal'&&typeof node.value==='string')for(const candidate of node.value.split(/\s+/))if(candidate)candidates.add(candidate);else{}else if(node.type==='ConditionalExpression'){literalClasses(node.consequent);literalClasses(node.alternate);}else if(node.type==='LogicalExpression')literalClasses(node.right);else if(node.type==='CallExpression'&&node.callee.name==='cn')node.arguments.forEach(literalClasses);}
const result=await eslint.lintFiles(['packages/ui/src/**/*.{ts,tsx}','apps/docs/src/**/*.{ts,tsx}']);
for(const entry of result){files++;const rel=path.relative(root,entry.filePath);diagnostics.push(...entry.messages.map(m=>({file:rel,line:m.line,rule:m.ruleId,message:m.message})));const text=fs.readFileSync(entry.filePath,'utf8');const ast=parse(text,{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}}),names=new Set();for(const node of ast.body)if(node.type==='ImportDeclaration'&&patterns.some(p=>p.test(node.source.value)))for(const spec of node.specifiers)names.add(spec.local.name);
 walk(ast,node=>{if(node.type==='JSXOpeningElement'&&node.name.type==='JSXIdentifier'&&names.has(node.name.name))sites++;if(node.type==='JSXAttribute'&&node.name.name==='className')literalClasses(node.value?.type==='JSXExpressionContainer'?node.value.expression:node.value);if(node.type==='CallExpression'&&node.callee.name==='cn')literalClasses(node);if(node.type==='VariableDeclarator'&&['variants','sizes'].includes(node.id.name))walk(node.init,n=>{if(n.type==='Literal'&&typeof n.value==='string')literalClasses(n);});});
}
const compiler=await compile(fs.readFileSync('apps/docs/src/gyeol.css','utf8'),{base:path.resolve('apps/docs/src'),onDependency:()=>{}});
const css=compiler.build([...candidates]),unknown=[];
for(const candidate of candidates){const escaped=candidate.replace(/[^a-zA-Z0-9_-]/g,ch=>'\\'+ch);if(!css.includes('.'+escaped))unknown.push(candidate);}
// Compiler-aware negative fixture: this class must not generate a utility.
const invented='gyeol-not-a-real-utility';if(compiler.build([invented]).includes('.'+invented))throw Error('Compiler negative fixture falsely recognized');
for(const dir of ['packages/cli/src','registry/items'])for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);if(name.endsWith('.mjs')){parse(fs.readFileSync(p,'utf8'),{ecmaVersion:'latest',sourceType:'module'});cliFiles++;}if(name.endsWith('.json')){JSON.parse(fs.readFileSync(p));cliFiles++;}}
const bad="import {Button} from './gyeol/primitives/button'; export const Bad=()=> <Button className=\"p-8 rounded-full\">Bad</Button>;";
const good="import {Button} from './gyeol/primitives/button'; export const Good=()=> <Button variant=\"secondary\" className=\"w-full\">Good</Button>;";
const badResult=await eslint.lintText(bad,{filePath:'apps/docs/src/recognition-fixture.tsx'}),goodResult=await eslint.lintText(good,{filePath:'apps/docs/src/recognition-fixture.tsx'});
const negative=badResult.flatMap(r=>r.messages).some(m=>m.ruleId==='shadcn/no-restyle'),positive=goodResult.flatMap(r=>r.messages).length===0;
const report={scope:'Approved first slice only; historical findings are reported separately',coverage:{sourceFiles:files,componentSites:sites,cliManifestFiles:cliFiles,staticClasses:candidates.size},compiler:'tailwindcss 4.3.3 actual compile/build (no grammar fallback)',unknown,diagnostics,fixtures:{recognizedComponentRestyle:negative,publicVariantLayout:positive,compilerUnknownRejected:true}};
if(process.env.GYEOL_SLICE_REPORT)fs.writeFileSync(process.env.GYEOL_SLICE_REPORT,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!files||!sites||!cliFiles||!candidates.size||diagnostics.length||unknown.length||!negative||!positive)process.exitCode=1;
