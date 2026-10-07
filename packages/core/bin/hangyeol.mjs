#!/usr/bin/env node
import { main } from '../dist/router.mjs';

process.exitCode = await main(process.argv.slice(2));
