
import { VunLibConfig } from './interface'

export const defaultConfig: VunLibConfig = {
  universal: true,
  modern: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  template: '',
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
      return require('os').cpus().length > 1
    },
    css: {
      get extract() {
        return process.env.NODE_ENV === 'production'
      },
      requireModuleExtension: true,
      sourceMap: false,
      loaderOptions: {}
    }
  },
  generate: {
    routers: [],
    fallback: true
  },
  babel: {},
  webpack: {
  }
  // AUTO
  // typescript: {}
}
