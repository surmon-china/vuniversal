import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { BuildContext } from '../webpack'

export interface IVunEnvObject {
  [key: string]: webpack.DefinePlugin.CodeValueObject
}

// For user
export type VuniversalConfig = Partial<VunConfig>
// For vun
export interface VunConfig {
  // 是否 SSR
  universal: boolean
  clientEntry: string
  serverEntry: string
  template?: string
  dir: {
    // 构建出的路径
    build: string
    // 静态资源路径
    static: string
    // 项目源码路径
    source: string
    // 项目根目录
    root: string
    // node_modules 路径
    modules: string[]
  }
  env: IVunEnvObject
  dev: {
    host: string
    port: number
    proxy?: WebpackDevServer.ProxyConfigMap | WebpackDevServer.ProxyConfigArray
  }
  build: {
    // CDN PATH
    publicPath: string
  }
  generate?: boolean | {
    routers?: string[]
  }
  typescript?: {}
  webpack?(config: Configuration, buildContext: BuildContext): Configuration
  babel?(config: any): any
}

