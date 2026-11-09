import test from 'node:test';import assert from 'node:assert/strict';import {readdirSync} from 'node:fs';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
test('every runtime module parses, including browser-only encounter controllers',()=>{
 const root=new URL('../dist/',import.meta.url);for(const name of readdirSync(root).filter(n=>n.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL(name,root))],{encoding:'utf8'});assert.equal(result.status,0,name+': '+result.stderr);}
});
