import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import test from 'node:test';

const evidence=process.env.CORE02_EVIDENCE_DIR;
assert.ok(evidence,'Use designated CORE02 scratch');
const fixture=JSON.parse(fs.readFileSync(path.join(evidence,'custom-installed-evidence.json')));
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

test('production Vite serves all four fonts at the configured base/public URL with original MIME/bytes',async()=>{
  const host=fixture.host,command=path.join(host,'node_modules/.bin/vite'),args=['preview','--host','127.0.0.1','--port','0'];
  const started=new Date().toISOString(),start=performance.now();
  const server=spawn(command,args,{cwd:host,stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',spawnError;const fonts={};let serverExit;
  server.stdout.on('data',chunk=>{stdout+=chunk;});server.stderr.on('data',chunk=>{stderr+=chunk;});server.on('error',error=>{spawnError=error;});
  try {
    let origin;
    for(let i=0;i<100;i++) {
      if(spawnError)throw spawnError;
      origin=stdout.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];if(origin)break;
      if(server.exitCode!==null)throw Error(stderr);
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    assert.ok(origin,'bounded own loopback server must become ready');
    const page=await fetch(origin+'design/',{signal:AbortSignal.timeout(5000)});assert.equal(page.status,200);
    for(const name of Object.keys(fixture.fonts).filter(p=>p.endsWith('.woff2'))) {
      const url=origin+'design/assets/type/'+name,response=await fetch(url,{signal:AbortSignal.timeout(5000)}),bytes=Buffer.from(await response.arrayBuffer());
      assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/font\/woff2/);assert.equal(digest(bytes),fixture.fonts[name].sha256);
      fonts[name]={url,status:response.status,mime:response.headers.get('content-type'),bytes:bytes.length,sha256:digest(bytes)};
    }
  } finally {
    if(server.exitCode!==null||server.signalCode!==null||spawnError)serverExit={exit:server.exitCode,signal:server.signalCode};
    else {
      const exited=new Promise(resolve=>server.once('exit',(exit,signal)=>resolve({exit,signal})));
      server.kill('SIGTERM');const timeout=setTimeout(()=>server.kill('SIGKILL'),2000);
      serverExit=await exited;clearTimeout(timeout);
    }
    fs.writeFileSync(path.join(evidence,`custom-preview-${process.hrtime.bigint()}.json`),JSON.stringify({command:[command,...args],cwd:host,started,pid:server.pid,runtime:process.version,durationMs:performance.now()-start,...serverExit,stdout,stderr,fonts,verified:Object.keys(fonts).length===4,browserFontLoad:'NOT RUN'},null,2));
  }
});
