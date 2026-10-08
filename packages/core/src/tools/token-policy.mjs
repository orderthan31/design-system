import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import {hash,safeTarget} from './safety.mjs';

export const requiredRoles=['canvas','surface','muted','line','ink','soft','action','action-hover','on-action','focus','danger','overlay'].map(name=>'--g-'+name);
const reserved=new Set(['node_modules','.git','.gyeol-backups','.gyeol-transactions']);
export function consumerPath(root,name){
  if(typeof name!=='string'||name.split('/').some(part=>reserved.has(part)))throw Error('Unsafe consumer token path');
  return safeTarget(root,name);
}
const knownType=name=>name.startsWith('--g-export-')?knownType('--'+name.slice('--g-export-'.length)):requiredRoles.includes(name)||name.startsWith('--color-')?'color':name.startsWith('--font-')?'fontFamily':/^(--text-|--radius-|--spacing-)/.test(name)?'dimension':null;
const alias=value=>typeof value==='string'?(value.match(/^var\((--[\w-]+)\)$/)?.[1]??value.match(/^\{(--[\w-]+)\}$/)?.[1]):null;
// One canonical CSS source supplies defaults/presets to both runtime and tools.
export function presetCatalog(){
  const file=new URL('../../payload/source/foundation/theme.css',import.meta.url);
  const css=postcss.parse(fs.readFileSync(file,'utf8')),base={light:{},dark:{}},patches={};
  css.walkRules(rule=>{
    if(rule.selector==='[data-gyeol]')for(const mode of ['light','dark'])for(const d of rule.nodes??[])if(d.type==='decl'&&requiredRoles.includes(d.prop))base[mode][d.prop]={type:'color',value:d.value};
    if(rule.selector==='[data-gyeol][data-theme="dark"]')for(const d of rule.nodes??[])if(d.type==='decl'&&requiredRoles.includes(d.prop))base.dark[d.prop]={type:'color',value:d.value};
    const match=rule.selector.match(/^\[data-gyeol\]\[data-palette="([\w-]+)"\]\[data-theme="(light|dark)"\]$/);
    if(match){const [,palette,mode]=match;patches[palette]??={light:{},dark:{}};for(const d of rule.nodes??[])if(d.type==='decl'&&requiredRoles.includes(d.prop))patches[palette][mode][d.prop]={type:'color',value:d.value};}
  });
  if(!Object.hasOwn(patches,'Indigo'))throw Error('Packed canonical Indigo palette/default is missing');
  const palettes={};for(const [palette,modes]of Object.entries(patches)){palettes[palette]={};for(const mode of ['light','dark'])palettes[palette][mode]=resolveRoles({...base[mode],...modes[mode]},`canonical ${palette}/${mode}`);}
  return {schemaVersion:1,defaultPalette:'Indigo',source:'foundation/theme.css',sourceHash:hash(fs.readFileSync(file)),designStatus:'canonical editable defaults/presets; browser/contrast acceptance separate',palettes,deltas:patches};
}

export function readSemanticSource(root,name){
  const bytes=fs.readFileSync(consumerPath(root,name)),input=JSON.parse(bytes);
  if(input.schemaVersion!==1||!input.palettes||typeof input.palettes!=='object'||Array.isArray(input.palettes)||!Object.keys(input.palettes).length)throw Error(`${name}: invalid semantic source schema`);
  const defaults=presetCatalog().palettes,resolved={},active=[];
  function palette(key){
    if(Object.hasOwn(resolved,key))return resolved[key];
    if(active.includes(key))throw Error(`${name}: palette inheritance cycle ${[...active,key].join(' -> ')}`);
    const definition=input.palettes[key];
    if(!definition){if(Object.hasOwn(defaults,key))return defaults[key];throw Error(`${name}: missing palette ${key}`);}
    if(!/^[A-Za-z][\w-]*$/.test(key)||!definition||typeof definition!=='object'||Array.isArray(definition)||Object.keys(definition).some(k=>!['replacement','extends','light','dark'].includes(k)))throw Error(`${name}: invalid palette ${key}`);
    if(definition.replacement!==undefined&&typeof definition.replacement!=='boolean'||definition.replacement&&definition.extends!==undefined)throw Error(`${name}: replacement cannot inherit defaults`);
    active.push(key);let base={light:{},dark:{}};
    if(!definition.replacement){const parent=definition.extends??'Indigo';if(typeof parent!=='string')throw Error(`${name}: invalid extends ${key}`);base=parent===key&&Object.hasOwn(defaults,parent)?defaults[parent]:palette(parent);}
    const result={};for(const scheme of ['light','dark']){
      const entries=definition[scheme]??{};if(!entries||typeof entries!=='object'||Array.isArray(entries))throw Error(`${name}: invalid scheme ${key}/${scheme}`);
      const tokens=Object.fromEntries(Object.entries(base[scheme]).map(([role,t])=>[role,{type:t.type,value:t.sourceValue??t.value,...(t.unit===undefined?{}:{unit:t.unit})}]));for(const [role,t]of Object.entries(entries)){
        if(!/^--[A-Za-z][\w-]*$/.test(role)||!t||typeof t!=='object'||Array.isArray(t)||Object.keys(t).some(k=>!['$type','$value','unit'].includes(k))||!Object.hasOwn(t,'$value'))throw Error(`${name}: invalid typed token ${role}`);
        tokens[role]={type:t.$type,value:t.$value,...(t.unit===undefined?{}:{unit:t.unit})};
      }
      result[scheme]=resolveRoles(tokens,`${name} (${key}/${scheme})`);
    }
    active.pop();resolved[key]=result;return result;
  }
  for(const key of Object.keys(input.palettes))palette(key);
  return {path:name,hash:hash(bytes),bytes:bytes.length,palettes:resolved};
}

export function verifySemanticParity(css,semantic,palette){
  const selected=semantic.palettes[palette];if(!selected)throw Error(`${semantic.path}: requested palette ${palette} is missing; no fallback`);
  for(const scheme of ['light','dark'])for(const [name,token]of Object.entries(selected[scheme])){
    const actual=css.schemes[scheme].roles[name];if(!actual)throw Error(`${semantic.path}: CSS missing semantic role ${name} (${scheme})`);
    if(actual.type!==token.type||actual.value!==token.value)throw Error(`${semantic.path}: CSS/source parity mismatch ${name} (${scheme}): CSS ${actual.type} ${actual.value}; source ${token.type} ${token.value}`);
  }
}

export function exportCSS(schemes,palette,scheme){
  const chosen=scheme?[scheme]:['light','dark'];let css='/* Editable consumer token export; no reset or host base rules. */\n';
  const expression=t=>t.alias?`var(${t.alias})`:t.value;
  const names=[...new Set(chosen.flatMap(mode=>Object.keys(schemes[mode].roles).filter(name=>/^(--color-|--font-|--text-|--radius-|--spacing-)/.test(name))))];
  const bridges=new Map(),occupied=new Set(chosen.flatMap(mode=>Object.keys(schemes[mode].roles)));
  const theme=names.map(name=>{
    const tokens=chosen.map(mode=>schemes[mode].roles[name]);
    if(tokens.some(t=>!t))throw Error(`Cannot export inline utility ${name}: missing expression in selected scheme`);
    if(tokens.every(t=>expression(t)===expression(tokens[0])))return `  ${name}: ${expression(tokens[0])};`;
    // Inline utilities must reference a scoped variable, not freeze the light alias.
    let bridge='--g-export-'+name.slice(2),suffix=2;while(occupied.has(bridge))bridge='--g-export-'+name.slice(2)+'-'+suffix++;
    occupied.add(bridge);bridges.set(name,bridge);return `  ${name}: var(${bridge});`;
  });
  if(theme.length)css+='@theme inline {\n'+theme.join('\n')+'\n}\n';
  for(const mode of chosen){const selector=`[data-gyeol]${palette?`[data-palette="${palette}"]`:''}${mode==='dark'||scheme?`[data-theme="${mode}"]`:''}`;
    const declarations=Object.entries(schemes[mode].roles).filter(([name])=>!names.includes(name)).map(([name,t])=>`  ${name}: ${expression(t)};`);
    for(const [name,bridge]of bridges)declarations.push(`  ${bridge}: ${expression(schemes[mode].roles[name])};`);
    css+=selector+' {\n'+declarations.join('\n')+'\n}\n';
  }
  return css;
}
export function resolveRoles(tokens,label){
  for(const name of requiredRoles)if(!Object.hasOwn(tokens,name))throw Error(`${label}: missing role ${name}`);
  const resolved={},visiting=[];
  function resolve(name){
    if(Object.hasOwn(resolved,name))return resolved[name];
    if(visiting.includes(name))throw Error(`${label}: alias cycle ${[...visiting,name].join(' -> ')}`);
    const token=tokens[name];if(!token)throw Error(`${label}: missing alias target ${name}`);
    const expected=knownType(name);if(expected&&token.type!==expected)throw Error(`${label}: type mismatch ${name}: expected ${expected}, received ${token.type}`);
    if(!['color','dimension','number','fontFamily','string'].includes(token.type))throw Error(`${label}: unsupported type ${name}: ${token.type}`);
    visiting.push(name);const ref=alias(token.value);let value;
    if(ref){const target=resolve(ref);if(target.type!==token.type)throw Error(`${label}: alias type mismatch ${name} (${token.type}) -> ${ref} (${target.type})`);if(token.unit!==undefined)throw Error(`${label}: alias ${name} cannot add a unit`);value=target.value;}
    else{
      value=typeof token.value==='number'?String(token.value):token.value;
      if(typeof value!=='string'||!value.trim()||/[;{}\n\r]|var\(/.test(value))throw Error(`${label}: invalid static token value ${name}`);
      if(token.unit!==undefined){if(typeof token.value!=='number'||typeof token.unit!=='string'||!/^([a-zA-Z]+|%)$/.test(token.unit))throw Error(`${label}: invalid unit ${name}`);value+=token.unit;}
      if(token.type==='dimension'&&!/^-?(?:\d+(?:\.\d+)?|\.\d+)(?:[a-zA-Z]+|%)$/.test(value))throw Error(`${label}: type mismatch ${name}: expected dimension`);
      if(token.type==='number'&&!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value))throw Error(`${label}: type mismatch ${name}: expected number`);
      if(token.type==='color'&&!/^(?:#[\da-fA-F]{3,8}|[a-zA-Z]+|(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\([^;{}]+\))$/.test(value))throw Error(`${label}: type mismatch ${name}: expected color syntax`);
    }
    visiting.pop();return resolved[name]={type:token.type,value,sourceValue:token.value,...(token.unit===undefined?{}:{unit:token.unit}),...(ref?{alias:ref}:{})};
  }
  for(const name of Object.keys(tokens).sort())resolve(name);
  return resolved;
}

export function readConsumerTheme(root,config,palette){
  consumerPath(root,config.sourceRoot);const inputs=[],rules=[],active=[];
  function read(name){
    const full=consumerPath(root,name);if(active.includes(name))throw Error(`CSS import cycle: ${[...active,name].join(' -> ')}`);
    // Repeated imports contribute again in position; only an active-stack repeat is a cycle.
    active.push(name);
    const bytes=fs.readFileSync(full),css=postcss.parse(bytes.toString(),{from:name});inputs.push({path:name,hash:hash(bytes),bytes:bytes.length});
    // Validate grammar before following imports, including otherwise ignored host subtrees.
    function validateGrammarContext(nodes,ancestors=[]){for(const node of nodes??[]){
      const parent=ancestors.at(-1);
      if(node.type==='atrule'&&node.name==='theme'&&!['','inline'].includes(node.params.trim()))throw Error(`${name}:${node.source.start.line}: unsupported @theme parameters ${node.params}; use @theme or @theme inline`);
      // Scoped nesting retains its existing diagnostic; bare/root/layer declarations are placement errors.
      if(node.type==='decl'&&(node.prop.startsWith('--g-')||knownType(node.prop))&&!ancestors.slice(0,-1).some(scope=>scope.type==='rule'||scope.type==='atrule'&&scope.name==='theme')&&parent?.type!=='rule'&&!(parent?.type==='atrule'&&parent.name==='theme'&&knownType(node.prop)))throw Error(`${name}:${node.source.start.line}: unsupported semantic declaration placement ${node.prop} under ${parent?'@'+parent.name:'stylesheet root'}; use a supported scope rule or known typed @theme token`);
      if(node.type==='atrule'&&node.name==='import'&&ancestors.some(parent=>parent.type!=='atrule'||parent.name!=='layer'))throw Error(`${name}:${node.source.start.line}: unsupported CSS import context under ${ancestors.map(parent=>parent.type==='rule'?parent.selector:'@'+parent.name).join(' -> ')}; imports require root or only @layer ancestry`);
      if(node.nodes)validateGrammarContext(node.nodes,[...ancestors,node]);
    }}
    validateGrammarContext(css.nodes);
    function rejectSemanticNesting(node){for(const child of node.nodes??[]){
      if(!['rule','atrule'].includes(child.type))continue;let semantic=false;
      child.walkDecls?.(d=>{if(d.prop.startsWith('--g-')||knownType(d.prop))semantic=true;});
      if(semantic)throw Error(`${name}:${child.source.start.line}: unsupported semantic nesting under ${node.type==='rule'?node.selector:'@'+node.name}`);
    }}
    function walk(nodes){for(const node of nodes??[]){
      if(node.type==='atrule'&&node.name==='import'){
        const match=node.params.match(/^['"]([^'"]+)['"](?:\s+layer\([\w-]+\))?$/);if(!match)throw Error(`${name}:${node.source.start.line}: unsupported static CSS import`);
        const spec=match[1];if(['tailwindcss/theme.css','tailwindcss/utilities.css'].includes(spec))continue;
        if(!spec.startsWith('./')&&!spec.startsWith('../'))throw Error(`${name}: unsupported package/external CSS import ${spec}`);
        const imported=path.posix.normalize(path.posix.join(path.posix.dirname(name),spec));read(imported);
      }else if(node.type==='atrule'&&['plugin','config'].includes(node.name))throw Error(`${name}: executable CSS @${node.name} is unsupported`);
      else if(node.type==='rule'){
        rejectSemanticNesting(node);
        const decls=(node.nodes??[]).filter(d=>d.type==='decl'&&(d.prop.startsWith('--g-')||knownType(d.prop)));
        if(decls.length||/\[\s*data-gyeol\s*\]/.test(node.selector)&&/\[\s*data-(?:palette|theme)\s*=/.test(node.selector))rules.push({name,line:node.source.start.line,selector:node.selector,decls});
      }else if(node.type==='atrule'){
        if(node.name==='theme'){
          rejectSemanticNesting(node);
          for(const d of node.nodes??[])if(d.type==='decl'&&knownType(d.prop))rules.push({name,line:node.source.start.line,selector:'[data-gyeol]',decls:[d],theme:true});
        }else {
          if(node.name!=='layer'){
            let semantic=false;node.walkDecls?.(d=>{if(d.prop.startsWith('--g-')||knownType(d.prop))semantic=true;});
            if(semantic)throw Error(`${name}:${node.source.start.line}: unsupported conditional/nested semantic @${node.name}`);
          }
          walk(node.nodes);
        }
      }
    }}walk(css.nodes);active.pop();
  }
  read(config.stylePath);
  // Validate every scope once, including declaration-free palette registrations.
  for(const rule of rules){
    const s=rule.selector.trim();
    if(!/^\[\s*data-gyeol\s*\](?:\[\s*data-(?:theme|palette)\s*=\s*(?:"[\w-]+"|'[\w-]+'|[\w-]+)\s*\])*$/.test(s))throw Error(`${rule.name}:${rule.line}: unsupported semantic selector structure ${rule.selector}; only one adjacent compound scope is supported, not descendants/combinators`);
    const attributes=[...s.matchAll(/\[\s*data-(theme|palette)\s*=\s*["']?([\w-]+)/g)],scope={};
    for(const [,name,value]of attributes){
      if(Object.hasOwn(scope,name))throw Error(`${rule.name}:${rule.line}: duplicate semantic ${name} attribute in ${rule.selector}; use one ${name} attribute per compound scope`);
      scope[name]=value;
    }
    if(scope.theme&&!['light','dark'].includes(scope.theme))throw Error(`${rule.name}:${rule.line}: unsupported scheme selector ${scope.theme}`);
    rule.scope=scope;
  }
  const schemes={};
  for(const scheme of ['light','dark']){
    const tokens={};for(const rule of rules){
      const {theme:mode,palette:owner}=rule.scope;
      if(mode&&mode!==scheme||owner&&owner!==palette)continue;
      for(const d of rule.decls){if(d.important)throw Error(`${rule.name}:${d.source.start.line}: important semantic declaration is unsupported`);tokens[d.prop]={type:knownType(d.prop)??'string',value:d.value,file:rule.name,line:d.source.start.line};}
    }
    schemes[scheme]={roles:resolveRoles(tokens,`${config.stylePath} (${palette??'consumer'}/${scheme})`)};
  }
  const declaredPalettes=[...new Set(rules.map(rule=>rule.scope.palette).filter(Boolean))];
  return {inputs,schemes,declaredPalettes};
}
