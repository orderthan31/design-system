import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const cli=path.join(root,'packages/cli/dist/gyeol.mjs'),cwd=path.join(root,'apps/docs');
for(const args of [['init','--overwrite'],['add','badge','button','input','theme','layout','text-field','select','tabs','dialog','composition','--overwrite']]){
 const result=spawnSync(process.execPath,[cli,...args],{cwd,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
