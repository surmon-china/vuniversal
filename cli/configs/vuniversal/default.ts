import { VunLibConfig } from './interface'
import { VUN_DEFAULT_HTML_TEMPLATE } from '@cli/paths'
import { NodeEnv, isProd, isDev } from '@cli/environment'
import { appPackageJSON } from '@cli/utils'

const dependencies = Object.keys(appPackageJSON.dependencies)
const devDependencies = Object.keys(appPackageJSON.devDependencies)
const allDependencies = [...dependencies, ...devDependencies]

export const defaultConfig: VunLibConfig = {
  universal: true,
  modern: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  template: VUN_DEFAULT_HTML_TEMPLATE,
  prerender: false,
  inspect: false,
  env: {},
  dir: {
    build: 'dist',
    public: 'public',
    source: 'src',
    root: '.',
    modules: []
  },
  get lintOnSave() {
    return isDev(process.env.NODE_ENV as NodeEnv) && allDependencies.includes('eslint')
  },
  dev: {
    host: 'localhost',
    port: 3000,
    verbose: false,
    proxy: {},
    devServer: {},
  },
  build: {
    publicPath: '/',
    assetsDir: 'vun',
    analyze: false,
    runtimeCompiler: false,
    productionSourceMap: true,
    transpileDependencies: [],
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
  webpack: {},
  typescript: !allDependencies.includes('typescript') ? false : {
    tsLoader: {},
    forkTsChecker: true
  }
}
