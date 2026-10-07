import {defineConfig} from 'vitest/config';
export default defineConfig({test:{environment:'jsdom',include:['packages/ui/test/behavior.test.tsx']},esbuild:{jsx:'automatic'}});
