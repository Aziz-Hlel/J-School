import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  outDir: './dist',
  //   bundle: true,
  deps: {
    skipNodeModulesBundle: false,
  },
  clean: true,
  //   skipNodeModulesBundle:false,
  // noExternal: ['@repo/contracts', '@repo/db', '@repo/cache', '@repo/env'],

  noExternal: [/@repo\/.*/],

  unbundle: false,
});
