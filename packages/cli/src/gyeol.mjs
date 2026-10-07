#!/usr/bin/env node
import {fileURLToPath} from 'node:url';
import {runInstaller} from './installer.mjs';
process.exitCode=runInstaller(process.argv.slice(2),{payloadRoot:fileURLToPath(new URL('../payload/',import.meta.url))});
