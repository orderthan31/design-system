import { sliceConfig } from './scripts/slice-eslint-policy.mjs';
export default [...sliceConfig, {ignores:['**/node_modules/**','**/dist/**','**/payload/**']}];
