module.exports = [
  {
    entry: 'vuniversal/index.ts',
    outDir: './',
    fileName: 'vun',
    targets: ['cjs'],
    minimize: false
  },
  {
    entry: 'src/core/index.ts',
    outDir: 'dist',
    targets: ['cjs', 'esm'],
    minimize: false
  }
]
