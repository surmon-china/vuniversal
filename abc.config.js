module.exports = [
  {
    entry: 'helper/index.ts',
    outDir: 'helper',
    targets: ['cjs', 'esm'],
    minimize: false,
    external: [
      'vue-router',
      'vue'
    ]
  }
]
