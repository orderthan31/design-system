import fs from 'node:fs';
import {defaultTheme,themes,themeRoles,themeVariables,assessTheme,renderThemeCss,renderDefaultThemeCss} from '../src/themes.ts';
fs.writeFileSync('src/theme-roles.css',renderThemeCss());
fs.writeFileSync('src/default-theme.css',renderDefaultThemeCss());
const palettes=[defaultTheme,...themes].map(theme=>{
 const assessments=assessTheme(theme);
 const minima=Object.fromEntries(['text','nontext'].map(kind=>{const rows=assessments.filter(row=>row.kind===kind),ratio=Math.min(...rows.map(row=>row.ratio));return [kind,{ratio,threshold:kind==='text'?4.5:3,pairs:rows.filter(row=>row.ratio===ratio).map(({foreground,background})=>({foreground,background}))}];}));
 return {id:theme.id,label:theme.label,resolvedRoles:theme.roles,roles:themeRoles.length,overrides:Object.keys(themeVariables(theme)).length,minima,assessments};
});
fs.writeFileSync('docs/theme-contrast.json',JSON.stringify({scope:'Closed opaque semantic pair allowlist; not application accessibility certification',palettes},null,2)+'\n');
console.log(JSON.stringify(palettes.map(({id,roles,overrides,minima})=>({id,roles,overrides,minima})),null,2));
