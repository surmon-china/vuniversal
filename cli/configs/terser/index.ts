import { VunLibConfig } from '../vuniversal'

export function getTerserConfig(vunConfig: VunLibConfig) {
  return {
    terserOptions: {
      compress: {
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebook/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
        // turn off flags with small gains to speed up minification
        arrows: false,
        collapse_vars: false, // 0.3kb
        computed_props: false,
        hoist_funs: false,
        hoist_props: false,
        hoist_vars: false,
        inline: false,
        loops: false,
        negate_iife: false,
        properties: false,
        reduce_funcs: false,
        reduce_vars: false,
        switches: false,
        toplevel: false,
        typeofs: false,
  
        // a few flags with noticable gains/speed ratio
        // numbers based on out of the box vendor bundle
        booleans: true, // 0.7kb
        if_return: true, // 0.4kb
        sequences: true, // 0.7kb
        unused: true, // 2.3kb
  
        // required features to drop conditional branches
        conditionals: true,
        dead_code: true,
        evaluate: true
      },
      mangle: {
        safari10: true,
      }
    },
    // Enable file caching
    cache: true,
    extractComments: false,
    // Use multi-process parallel running to improve the build speed
    // Default number of concurrent runs: os.cpus().length - 1
    parallel: vunConfig.build.parallel,
    sourceMap: vunConfig.build.productionSourceMap,
  }
}
