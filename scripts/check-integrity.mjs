import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const baseline=process.argv[2]||process.env.DS_BASELINE_DIR;
if(!baseline){console.error('Usage: node scripts/check-integrity.mjs <baseline-directory>');process.exit(1);}
const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rows=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const folder of ['tokens','contracts','fonts'])for(const source of walk(path.join(baseline,folder))){const relative=path.relative(baseline,source),target=path.join('public/source',relative);const original=digest(source),copied=digest(target);if(original!==copied)throw Error(`Source changed: ${relative}`);rows.push({relative,bytes:fs.statSync(target).size,sha256:copied,identical:true});}
const core=JSON.parse(fs.readFileSync('public/source/tokens/core.json'));const resolved=JSON.parse(fs.readFileSync('public/source/tokens/resolved.json'));const layers=Object.fromEntries(['primitive','semantic','component'].map(k=>[k,Object.keys(core[k]).length]));
if(Object.keys(resolved).length!==107)throw Error('Wrong token count');
const texts=JSON.parse(fs.readFileSync('src/long-text.json'));if(texts.ko.length!==204||texts.en.length!==446||texts.ja.length!==160)throw Error('Wrong long-text lengths');
const record={checkedAt:new Date().toISOString(),baseline,files:rows,totalPreservedFiles:rows.length,tokens:{total:Object.keys(resolved).length,layers},textLengths:Object.fromEntries(Object.entries(texts).map(([k,v])=>[k,v.length])),scope:'Byte integrity only; historical evidence is not a new runtime pass claim'};
fs.mkdirSync('evidence',{recursive:true});fs.writeFileSync('evidence/integrity.json',JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify({preserved:rows.length,tokens:record.tokens,textLengths:record.textLengths}));
