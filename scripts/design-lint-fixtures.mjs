import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import { lintCSS } from './design-css-policy.mjs';

export async function verifyDesignLintFixtures(eslint=new ESLint()){
 const results=[];
 const jsx=[
  {name:'raw palette',code:'import { Button } from "../components/atoms"; export const Example=()=> <Button className="bg-red-500"/>;',rule:'shadcn/no-raw-colors'},
  {name:'arbitrary padding',code:'import { Button } from "../components/atoms"; export const Example=()=> <Button className="p-[13px]"/>;',rule:'shadcn/no-arbitrary-values'},
  {name:'restyle recognized alias',code:'import { Button as Action } from "../components/atoms"; export const Example=()=> <Action className="p-4"/>;',rule:'shadcn/no-restyle'},
  {name:'restyle public barrel',file:'src/fixture.tsx',code:'import { Button } from "./index"; export const Example=()=> <Button className="rounded-xl"/>;',rule:'shadcn/no-restyle'},
  {name:'inline padding',code:'import { Button } from "../components/atoms"; export const Example=()=> <Button style={{padding:13}}/>;',rule:'shadcn/no-inline-styles'},
  {name:'relative root components',file:'src/fixture.tsx',code:'import { Button } from "./components/atoms"; export const Example=()=> <Button className="p-4"/>;',rule:'shadcn/no-restyle'},
  {name:'core sibling recognition',file:'src/components/fixture.tsx',code:'import { Button } from "./atoms"; export const Example=()=> <Button className="p-4"/>;',rule:'shadcn/no-restyle'},
  {name:'relative src barrel alias',file:'src/fixture.tsx',code:'import { Button as Action } from "../src"; export const Example=()=> <Action className="p-4"/>;',rule:'shadcn/no-restyle'},
  {name:'namespace identity',code:'import * as Core from "../components/atoms"; export const Example=()=> <Core.Button className="p-4"/>;',rule:'shadcn/no-restyle'},
  {name:'namespace dynamic class',code:'import * as Core from "../components/atoms"; declare const classes:()=>string; export const Example=()=> <Core.Button className={classes()}/>;',rule:'shadcn/require-static-classes'},
  {name:'plain DOM recognition contrast',code:'export const Example=({classes}:{classes:string})=> <div className={classes}/>;'},
  {name:'unowned custom property length',code:'export const Example=()=> <div style={{"--field-bg":"13px"}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'unowned semantic token override',code:'export const Example=()=> <div style={{"--field-bg":"var(--color-bg-surface)"}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'custom property const indirection',code:'const injected={"--field-bg":"13px"} as const; export const Example=()=> <div style={injected}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'custom property static spread',code:'const injected={"--field-bg":"13px"}; export const Example=()=> <div style={{...injected}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'custom property computed literal',code:'const key="--field-bg"; export const Example=()=> <div style={{[key]:"13px"}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'custom property unresolved key',code:'export const Example=({key}:{key:string})=> <div style={{[key]:"13px"}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'owned GridList custom geometry',file:'src/components/content-primitives.tsx',code:'export const Example=()=> <div style={{"--ds-grid-list-columns":2}}/>;'},
  {name:'geometry ownership does not waive color',file:'src/components/content-primitives.tsx',code:'export const Example=()=> <div style={{"--ds-grid-list-columns":"#ff0000"}}/>;',rule:'shadcn/no-inline-styles'},
  {name:'owned name in wrong file',code:'export const Example=()=> <div style={{"--ds-grid-list-columns":2}}/>;',rule:'ds/no-unowned-custom-properties'},
  {name:'dynamic classes',code:'import { Button } from "../components/atoms"; export const Example=({color}:{color:string})=> <Button className={`bg-${color}`}/>;',rule:'shadcn/require-static-classes'},
  {name:'variant/size/layout',code:'import { Button } from "../components/atoms"; export const Example=()=> <Button variant="primary" size="small" className="w-full mt-4"/>;'},
  {name:'semantic token class',code:'export const Example=()=> <div className="bg-primary text-foreground"/>;'},
  {name:'approved Progress geometry',file:'src/components/primitives.tsx',code:'export const Example=()=> <div style={{width:"50%"}}/>;'},
  {name:'geometry does not waive padding',file:'src/components/primitives.tsx',code:'export const Example=()=> <div style={{width:"50%",padding:13}}/>;',rule:'shadcn/no-inline-styles'},
 ];
 for(const item of jsx){assert.ok(await eslint.calculateConfigForFile(item.file??'src/gallery/fixture.tsx'),`${item.name}: config missing`);const [result]=await eslint.lintText(item.code,{filePath:item.file??'src/gallery/fixture.tsx'});const rules=result.messages.filter(message=>message.severity===2).map(message=>message.ruleId);if(item.rule)assert(rules.includes(item.rule),`${item.name}: expected ${item.rule}, got ${JSON.stringify(result.messages)}`);else assert.equal(rules.length,0,`${item.name}: ${JSON.stringify(result.messages)}`);results.push({name:item.name,kind:'jsx',expected:item.rule??'pass',rules});}
 const css=[
  {name:'raw CSS color',text:'.ds-core .control { color:#ff0000; }',rule:'css/no-raw-colors'},
  {name:'arbitrary CSS padding',text:'.ds-core .control { padding:13px; }',rule:'css/token-appearance'},
  {name:'thick normal input border',text:'.ds-core .control { border:2px solid var(--field-border); }',rule:'css/single-input-border'},
  {name:'gallery core appearance override',file:'src/gallery.css',text:'.preview .control { border-radius:var(--radius-md); }',rule:'css/no-core-restyle'},
  {name:'important',text:'.ds-core .control { color:var(--field-fg)!important; }',rule:'css/no-important'},
  {name:'core global leak',text:'input { color:var(--field-fg); }',rule:'css/scoped-core'},
  {name:'semantic CSS and focus geometry',text:'.ds-core .control {color:var(--field-fg);padding:var(--space-2) var(--space-3);border:var(--ds-border-thin) solid var(--field-border);border-radius:var(--radius-md)} .ds-core .control:focus-visible{outline:3px solid var(--color-focus)}'},
  {name:'literal in token source',file:'src/design-tokens.css',text:'.ds-core{--ds-border-thin:1px;--ds-shadow:0 2px 6px rgb(15 23 42 / .08)}'},
 ];
 for(const item of css){const messages=lintCSS(item.text,item.file??'src/components/fixture.css',{ownedClasses:new Set(['control'])}),rules=messages.map(message=>message.rule);if(item.rule)assert(rules.includes(item.rule),`${item.name}: ${JSON.stringify(messages)}`);else assert.equal(messages.length,0,`${item.name}: ${JSON.stringify(messages)}`);results.push({name:item.name,kind:'css',expected:item.rule??'pass',rules});}
 return results;
}
