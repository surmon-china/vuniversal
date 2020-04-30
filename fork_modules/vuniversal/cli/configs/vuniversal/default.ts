
import { VunLibConfig } from './interface'
import { VUN_DEFAULT_HTML_TEMPLATE } from '../../paths'
import { NodeEnv, isProd } from '../../environment'

export const defaultConfig: VunLibConfig = {
  universal: true,
  modern: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  template: VUN_DEFAULT_HTML_TEMPLATE,
  prerender: false,
  env: {},
  dir: {
    build: 'dist',
    public: 'public',
    source: 'src',
    root: '.',
    modules: []
  },
  dev: {
    host: 'localhost',
    port: 3000,
    verbose: false,
    proxy: {},
    devServer: {}
  },
  build: {
    publicPath: '/',
    assetsDir: 'vun',
    analyze: false,
    runtimeCompiler: false,
    productionSourceMap: true,
    transpileDependencies: [],
    lintOnSave: true,
    get filenameHashing() {
      return isProd(process.env.NODE_ENV as NodeEnv)
    },
    get parallel() {
      try {
        return require('os').cpus().length > 1
      } catch (error) {
        return false
      }
    },
    css: {
      get extract() {
        return isProd(process.env.NODE_ENV as NodeEnv)
      },
      requireModuleExtension: true,
      sourceMap: false,
      loaderOptions: {} as any,
      styleResources: {
        scss: [],
        sass: [],
        less: [],
        stylus: []
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    }
  },
  babel: {},
  webpack: {}
  // AUTO
  // typescript: {}
}
