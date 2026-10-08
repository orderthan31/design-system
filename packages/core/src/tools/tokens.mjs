import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import {consumerPath,readConsumerTheme,presetCatalog,readSemanticSource,verifySemanticParity,exportCSS,resolveRoles} from './token-policy.mjs';
import {hash,planFiles,createTransaction} from './safety.mjs';

export function inspectTokens(boundary) {
  const file = 'foundation/theme.css';
  if (!boundary.manifest.files[file]) throw Error('Canonical semantic theme is missing from core payload');
  const css = postcss.parse(fs.readFileSync(path.join(boundary.payloadRoot, 'source', file), 'utf8'));
  const declarations = [];
  css.walkDecls(declaration => {
    if (!declaration.prop.startsWith('--')) return;
    const owner = declaration.parent;
    declarations.push({
      name: declaration.prop,
      value: declaration.value,
      scope: owner.type === 'rule' ? owner.selector : `@${owner.name} ${owner.params}`,
    });
  });
  if (!declarations.length) throw Error('Empty semantic token inspection is not a pass');
  return {
    package: boundary.pkg.name,
    version: boundary.pkg.version,
    source: file,
    sourceHash: boundary.manifest.files[file].hash,
    operation: 'read-only inspection of packed canonical declarations',
    declarations,
    deferred: ['automatic synchronization/update', 'all-96 execution'],
  };
}

export function runTokens(args, boundary) {
  if (args.length === 1 && args[0] === 'inspect') {
    console.log(JSON.stringify(inspectTokens(boundary), null, 2));
    return 0;
  }
  if(args.length===1&&args[0]==='presets'){console.log(JSON.stringify(presetCatalog(),null,2));return 0;}
  const [operation='validate',...rest]=args,options={};
  const flags={'--source':'source','--palette':'palette','--preset':'preset','--scheme':'scheme','--format':'format','--output':'output'};
  if(!['validate','export'].includes(operation)){console.error('Usage: hangyeol tokens inspect | presets | validate | export [--source path --palette name --preset name --scheme light|dark --format json|css --output path]');return 2;}
  for(let i=0;i<rest.length;i++){const key=flags[rest[i]];if(!key||options[key]!==undefined||!rest[i+1]||rest[i+1].startsWith('--'))throw Error('Unsupported/duplicate/missing token option');options[key]=rest[++i];}
  if(operation==='validate'&&['preset','scheme','format','output'].some(key=>options[key]!==undefined))throw Error('Export-only option passed to validate');
  if(options.scheme&&!['light','dark'].includes(options.scheme)||options.format&&!['json','css'].includes(options.format))throw Error('Unsupported token scheme/format');
  if(options.palette&&!/^[A-Za-z][\w-]*$/.test(options.palette))throw Error('Invalid palette name');
  const root=process.cwd(),config=JSON.parse(fs.readFileSync(consumerPath(root,'gyeol.json'),'utf8'));
  if(config.schemaVersion!==1)throw Error('Unsupported gyeol.json schema');
  if(config.tokens!==undefined&&(!config.tokens||typeof config.tokens!=='object'||Array.isArray(config.tokens)||Object.keys(config.tokens).some(k=>!['source','palette'].includes(k))))throw Error('Invalid gyeol.json tokens settings');
  const source=options.source??config.tokens?.source,palette=options.palette??config.tokens?.palette;
  if(palette!==undefined&&(typeof palette!=='string'||! /^[A-Za-z][\w-]*$/.test(palette)))throw Error('Invalid configured palette name');
  const report={operation,sourceRoot:config.sourceRoot,readOnly:!options.output,validation:'bounded static CSS/type/alias analysis; not computed cascade or browser color acceptance',...readConsumerTheme(root,config,palette)};
  if(palette&&!source&&!report.declaredPalettes.includes(palette))throw Error(`Unknown/not declared consumer palette ${palette}; no fallback`);
  if(source!==undefined){report.semanticSource=readSemanticSource(root,source);verifySemanticParity(report,report.semanticSource,palette??'Indigo');}
  if(operation==='validate'){console.log(JSON.stringify(report,null,2));return 0;}
  let schemes=report.schemes,exportPalette=palette;
  if(report.semanticSource){schemes=Object.fromEntries(['light','dark'].map(mode=>[mode,{roles:{...report.schemes[mode].roles,...report.semanticSource.palettes[palette??'Indigo'][mode]}}]));}
  if(options.preset!==undefined){const catalog=presetCatalog();if(!Object.hasOwn(catalog.palettes,options.preset)||!Object.hasOwn(catalog.deltas,options.preset))throw Error(`Unknown preset ${options.preset}; no fallback`);schemes=Object.fromEntries(['light','dark'].map(mode=>[mode,{roles:{...schemes[mode].roles,...catalog.deltas[options.preset][mode]}}]));exportPalette=options.preset;}
  schemes=Object.fromEntries(Object.entries(schemes).map(([mode,{roles}])=>[mode,{roles:resolveRoles(Object.fromEntries(Object.entries(roles).map(([name,t])=>[name,{type:t.type,value:t.sourceValue??t.value,...(t.unit===undefined?{}:{unit:t.unit})}])),`export (${mode})`)}]));
  const content=options.format==='css'?exportCSS(schemes,exportPalette,options.scheme):JSON.stringify({...report,selection:{palette:exportPalette??'consumer',scheme:options.scheme??'both'},schemes:options.scheme?{[options.scheme]:schemes[options.scheme]}:schemes},null,2)+'\n';
  const bytes=Buffer.from(content),digest=hash(bytes);
  if(!options.output){console.log(content.trimEnd());console.error(JSON.stringify({exportHash:digest,bytes:bytes.length,written:false}));return 0;}
  const output=options.output;consumerPath(root,output);
  const forbidden=['gyeol.json','package.json','package-lock.json',config.stylePath,...report.inputs.map(i=>i.path),...(source?[source]:[])];
  const overlap=(a,b)=>a===b||a.startsWith(b+'/')||b.startsWith(a+'/');
  if(forbidden.some(name=>overlap(output,name))||[config.sourceRoot,config.publicRoot].filter(Boolean).some(name=>overlap(output,name)))throw Error('Unsafe token output: consumer source/config/style/public input must not be overwritten');
  const plan=planFiles(root,[{path:output,bytes}]),tx=createTransaction(root);
  try{tx.apply(plan);const committed=tx.commit();if(committed.errors?.length)throw Error('Token export cleanup failed: '+JSON.stringify(committed));}
  catch(error){const recovery=tx.rollback();throw Error(`${error.message}; token export recovery ${JSON.stringify(recovery)}`);}
  console.log(JSON.stringify({operation:'export',output,hash:digest,bytes:bytes.length,action:plan[0].action},null,2));return 0;
}
