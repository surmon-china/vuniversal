
import fs from 'fs-extra'
import lodash from 'lodash'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { defaultConfig } from './default'
import { APP_VUN_CONFIG_PATH, VUN_DEFAULT_HTML_TEMPLATE_PATH, resolveAppRoot } from '../../constants'
import { BuildContext } from '../webpack'
import logger from '../../utils/logger'

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

function transformConfig(config: VunConfig): VunConfig {
  return {
    ...config,
    clientEntry: resolveAppRoot(config.clientEntry),
    serverEntry: resolveAppRoot(config.serverEntry),
    // TODO: 或需要单独获取以便于 watch
    template: config.template
      ? resolveAppRoot(config.template)
      : VUN_DEFAULT_HTML_TEMPLATE_PATH,
    dir: {
      build: resolveAppRoot(config.dir.build),
      static: resolveAppRoot(config.dir.static),
      source: resolveAppRoot(config.dir.source),
      root: resolveAppRoot(config.dir.root),
      modules: config.dir.modules.map(resolveAppRoot)
    }
  }
}

function mergeDefaultConfig(config: VuniversalConfig): VunConfig {
  return lodash.merge({}, defaultConfig, config)
}

export function normalizeConfig(config: VuniversalConfig): VunConfig {
  return transformConfig(mergeDefaultConfig(config))
}

export default function getVunConfig(): VunConfig {
  // Check for vuniversal.config.js file
  if (!fs.existsSync(APP_VUN_CONFIG_PATH)) {
    return transformConfig(defaultConfig)
  }

  try {
    return normalizeConfig(require(APP_VUN_CONFIG_PATH))
  } catch (error) {
    logger.error('Invalid vuniversal config file.', error)
    process.exit(1)
  }
}
