import lodash from 'lodash'
import { defaultConfig } from './default'
import { VunConfig, VuniversalConfig } from './type'
import { VUN_DEFAULT_HTML_TEMPLATE_PATH, resolveAppRoot } from '../../constants'

export function transformConfig(config: VunConfig): VunConfig {
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

export function mergeDefaultConfig(config: VuniversalConfig): VunConfig {
  return lodash.merge({}, defaultConfig, config)
}

export function normalizeConfig(config: VuniversalConfig): VunConfig {
  return transformConfig(mergeDefaultConfig(config))
}