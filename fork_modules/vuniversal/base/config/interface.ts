import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { BuildContext } from '../../cli/configs/webpack'

// TODO: 取决于内部是否使用
// import ChainableWebpackConfig from 'webpack-chain'
// chainWebpack: (config: ChainableWebpackConfig) => void;

interface CSSLoaderOptions {
  [key: string]: any
}

export interface VunEnvObject {
  [key: string]: webpack.DefinePlugin.CodeValueObject
}

export interface CSSOptions {
  // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
  requireModuleExtension: boolean
  // mini-css-extract-plugin options
  extract: boolean | {
    filename: string;
    chunkFilename: string
  }
  sourceMap: boolean
  loaderOptions: {
    css: CSSLoaderOptions
    scss: CSSLoaderOptions
    sass: CSSLoaderOptions
    less: CSSLoaderOptions
    stylus: CSSLoaderOptions
    postcss: CSSLoaderOptions
  }
  styleResources: {
    scss: string[]
    sass: string[]
    less: string[]
    stylus: string[]
  }
}

export interface BuildOptions {
  // CDN PATH
  publicPath: string
  // 输出的 assets 文件夹，相对于 build 的路径
  assetsDir: string
  // 有关样式的配置项
  css: CSSOptions
  // 是否包含运行时编译
  runtimeCompiler: boolean
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  transpileDependencies: Array<string | RegExp>
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: boolean
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  // default: require('os').cpus().length > 1
  parallel: boolean | number 
  // crossorigin: '' | 'anonymous' | 'use-credentials';
  // integrity: boolean
  // 统计配置
  analyze: boolean | object
  lintOnSave: boolean | 'default' | 'warning' | 'error'
  // 是不是要通过插件实现啊
  // pwa: object;
}

// TODO: !!!
// type RecursiveRequired<T> = {
//   [P in keyof T]-?:
//     T[P] extends (infer U)[]
//       ? RecursiveRequired<U>[]
//       : T[P] extends object
//         ? RecursiveRequired<T[P]>
//         : Required<T[P]>
// }

type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P]
}

// For user
export type VuniversalConfig = RecursivePartial<VunLibConfig>
// For vun
export interface VunLibConfig {
  // 是否 SSR
  universal: boolean
  // 是否 modern
  modern: boolean
  // 客户端入口
  clientEntry: string
  // 服务端入口
  serverEntry: string
  // 模板
  template: string
  // 转换配置
  prerender: false | {
    // 需要转换的路由
    routes: string[]
    // 是否回退为 SPA
    fallback: boolean | string
  }
  // 目录配置
  dir: {
    // 构建出的路径
    build: string
    // 静态资源路径
    public: string
    // 项目源码路径
    source: string
    // 项目根目录
    root: string
    // node_modules 路径
    modules: string[]
  }
  // 环境配置
  env: VunEnvObject
  dev: {
    // 端口地址
    host: string
    port: number
    // 代理
    proxy: WebpackDevServer.ProxyConfigMap | WebpackDevServer.ProxyConfigArray
    devServer: WebpackDevServer.Configuration
  }
  build: BuildOptions
  // Webpack 逃生通道
  webpack: webpack.Configuration | ((config: webpack.Configuration, buildContext: BuildContext) => (webpack.Configuration | void));
  babel: any
  // typescript: {}
  // 最终似乎缺一个插件？？？？
}
