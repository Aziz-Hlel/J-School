// bun.build.ts
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
});
