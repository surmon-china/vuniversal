
import { VunLibConfig } from './interface'
import { VUN_DEFAULT_HTML_TEMPLATE } from '../../base/paths'
import { NodeEnv, isProd } from '../environment'

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
    }
  },
  babel: {},
  webpack: {
  }
  // AUTO
  // typescript: {}
}
