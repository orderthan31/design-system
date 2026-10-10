import {defineConfig} from 'vitest/config';
export default defineConfig({test:{environment:'jsdom',include:['packages/core/test/ui/*.test.tsx']},esbuild:{jsx:'automatic'}});
