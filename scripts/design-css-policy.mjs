import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

export const tokenSources=new Set(['src/default-theme.css','src/theme-roles.css','src/design-tokens.css','src/generated/scoped-tokens.css','src/generated/tokens.css']);
export const appearanceProperties=/^(?:padding(?:-.+)?|border(?:-.+)?|outline-color|background(?:-.+)?|color|fill|stroke|box-shadow|font(?:-.+)?|line-height|letter-spacing)$/;
const rawColor=/(?:#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\s*\()/i;
const literalLength=/(?<![\w-])-?(?:\d*\.)?\d+(?:px|rem|em)\b/g;
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):entry.name.endsWith('.css')?[path.join(dir,entry.name)]:[]);}
function inKeyframes(rule){for(let p=rule.parent;p;p=p.parent)if(p.type==='atrule'&&/keyframes$/i.test(p.name))return true;return false;}
const cssScope=file=>file==='src/core.css'||file.startsWith('src/components/');
export function lintCSS(text,file,{ownedClasses=new Set()}={}) {
 const findings=[],add=(node,rule,message)=>findings.push({file,line:node.source?.start?.line??1,column:node.source?.start?.column??1,rule,message,selector:node.parent?.selector??'',property:node.prop??'',value:node.value??''});
 let root;try{root=postcss.parse(text,{from:file});}catch(error){return [{file,line:error.line??1,rule:'css/parse',message:error.reason}];}
 root.walkRules(rule=>{if(cssScope(file)&&!inKeyframes(rule))for(const selector of postcss.list.comma(rule.selector))if(!/^\.ds-core(?:\b|\s|:)/.test(selector.trim()))add(rule,'css/scoped-core','Core selector must have a .ds-core ancestor; font-face/keyframes are separately scoped registrations.');});
 root.walkDecls(decl=>{
  const prop=decl.prop.toLowerCase(),value=decl.value,rule=decl.parent?.type==='rule'?decl.parent:null,selector=rule?.selector??'';
  // Existing reduced-motion safety must beat later component animation declarations.
  // Exact core scope, media preference, property and terminal value only; not gallery precedence.
  let reducedMedia=false;for(let p=decl.parent;p;p=p.parent)if(p.type==='atrule'&&p.name==='media'&&p.params.replace(/\s+/g,'')==='(prefers-reduced-motion:reduce)')reducedMedia=true;
  const reducedMotionSafety=file==='src/core.css'&&reducedMedia&&selector.split(',').every(part=>part.trim().startsWith('.ds-core'))&&({animation:'none',transition:'none','scroll-behavior':'auto'})[prop]===value;
  if(decl.important&&!reducedMotionSafety)add(decl,'css/no-important','Do not force gallery precedence; repair ownership/specificity.');
  const source=tokenSources.has(file)&&prop.startsWith('--');
  const registration=decl.parent?.type==='atrule'&&decl.parent.name==='font-face';
  if(source||registration)return;
  if(rawColor.test(value))add(decl,'css/no-raw-colors','Use an existing semantic color/shadow token; raw literals belong only in enumerated token sources.');
  if(/^(padding(?:-.+)?|border(?:-(?:width|radius|top|right|bottom|left|top-left-radius|top-right-radius|bottom-left-radius|bottom-right-radius))?|font(?:-size|-weight|-family)?|line-height|letter-spacing)$/.test(prop)) {
   if([...value.matchAll(literalLength)].some(match=>parseFloat(match[0])!==0))add(decl,'css/token-appearance','Appearance lengths must use semantic/scale tokens. Focus outline width and structural geometry are different policies.');
   if(prop==='font-weight'&&/^\d+$/.test(value))add(decl,'css/token-typography','Use a typography weight token. @font-face registration is exempt.');
  }
  if(/(?:\.control\b|\.tf-row\b|\.ds-input-group\b|input\b|select\b|textarea\b)/.test(selector)&&!/(?:focus|checked|aria-invalid)/.test(selector)&&/^border(?:-(?:width|top-width|right-width|bottom-width|left-width))?$/.test(prop)&&/\b(?:[2-9]|\d{2,})(?:\.\d+)?px\b/.test(value))add(decl,'css/single-input-border','Normal control shell must use1px; inner group input must use0. Use a separate focus outline.');
  if(file==='src/gallery.css'&&appearanceProperties.test(prop)&&[...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].some(match=>ownedClasses.has(match[1])))add(decl,'css/no-core-restyle','Gallery must not redefine a core class appearance; use public variants or move the definition to its actual core owner.');
 });
 return findings;
}
export function scanCSS(root=process.cwd()){
 const paths=files(path.join(root,'src')).sort(),ownedClasses=new Set();
 for(const absolute of paths){const relative=path.relative(root,absolute).split(path.sep).join('/');if(!cssScope(relative))continue;postcss.parse(fs.readFileSync(absolute,'utf8')).walkRules(rule=>{for(const match of rule.selector.matchAll(/\.([a-zA-Z_][\w-]*)/g))if(match[1]!=='ds-core')ownedClasses.add(match[1]);});}
 const findings=paths.flatMap(absolute=>lintCSS(fs.readFileSync(absolute,'utf8'),path.relative(root,absolute).split(path.sep).join('/'),{ownedClasses}));
 return {files:paths.length,ownedClasses:[...ownedClasses].sort(),findings};
}
