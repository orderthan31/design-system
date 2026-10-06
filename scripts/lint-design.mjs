import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import { componentImports } from '../eslint.config.mjs';
import { scanCSS } from './design-css-policy.mjs';
import { verifyDesignLintFixtures } from './design-lint-fixtures.mjs';
const root=process.cwd(),relative=file=>path.relative(root,file).split(path.sep).join('/');
const eslint=new ESLint();
const results=await eslint.lintFiles(['src/**/*.{ts,tsx}']);
const jsx=results.flatMap(result=>result.messages.map(message=>({file:relative(result.filePath),line:message.line,column:message.column,rule:message.ruleId,severity:message.severity,message:message.message})));
let imports=0,sites=0;
const patterns=componentImports.map(pattern=>new RegExp(pattern));
for(const result of results){const ast=parse(fs.readFileSync(result.filePath,'utf8'),{sourceType:'module',ecmaVersion:'latest',ecmaFeatures:{jsx:true}}),names=new Set();for(const node of ast.body)if(node.type==='ImportDeclaration'&&(node.source.value==='./src'||patterns.some(pattern=>pattern.test(node.source.value))))for(const specifier of node.specifiers){if(specifier.local?.name){names.add(specifier.local.name);imports++;}}
 const walk=node=>{if(!node||typeof node!=='object')return;if(node.type==='JSXOpeningElement'&&node.name.type==='JSXIdentifier'&&names.has(node.name.name))sites++;for(const [key,value]of Object.entries(node))if(!['parent','loc','range','tokens','comments'].includes(key)){if(Array.isArray(value))for(const child of value)walk(child);else if(value&&typeof value==='object')walk(value);}};walk(ast);}
const css=scanCSS(root);
let fixtures=[],fixtureError;try{fixtures=await verifyDesignLintFixtures(eslint);}catch(error){fixtureError=error.message;}
const diagnostics=[...jsx,...css.findings];
const report={scope:'Full source consistency scan; not runtime/AT/design acceptance; baseline findings are NOT suppressed.',pins:{shadcnLint:'0.2.0',eslint:'9.39.5',parser:'8.71.1',postcss:'8.5.28'},coverage:{jsxFiles:results.length,recognizedImports:imports,recognizedComponentSites:sites,cssFiles:css.files,coreClasses:css.ownedClasses.length},unsupported:['no-unknown-classes: no real Tailwind v4 compiler/theme in this plain-CSS project','Plugin does not scan CSS declarations/@apply; separate PostCSS checker is required','Import/AST component-site count is not plugin-internal visit instrumentation; namespace recognition is checked by fixtures','Custom-property supplement reads static keys only; opaque external/function data flow and runtime CSSOM are not proved'],counts:{jsx:jsx.length,css:css.findings.length,fixtureCases:fixtures.length},diagnostics,fixtures,...(fixtureError?{fixtureError}:{})};
const output=process.argv.find(arg=>arg.startsWith('--report='))?.slice(9);if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,diagnostics:diagnostics.slice(0,20),fixtures:undefined},null,2));
if(sites===0)throw Error('No DS component sites recognized: empty inspection is not a pass.');
if(jsx.some(message=>message.severity===2)||css.findings.length||fixtureError)process.exitCode=1;
