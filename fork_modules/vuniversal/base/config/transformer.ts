import lodash from 'lodash'
import { defaultConfig } from './default'
import { VuniversalConfig, VunLibConfig } from './interface'
import { resolveAppRoot } from '../paths'

export function transformConfig(config: VunLibConfig): VunLibConfig {
  return {
    ...config,
    clientEntry: resolveAppRoot(config.clientEntry),
    serverEntry: resolveAppRoot(config.serverEntry),
    // TODO: 或需要单独获取以便于 watch
    template: config.template
      ? resolveAppRoot(config.template)
      : defaultConfig.template,
    dir: {
      build: resolveAppRoot(config.dir.build),
      public: resolveAppRoot(config.dir.public),
      source: resolveAppRoot(config.dir.source),
      root: resolveAppRoot(config.dir.root),
      modules: config.dir.modules.map(resolveAppRoot)
    }
  }
}

export function mergeDefaultConfig(config: VuniversalConfig): VunLibConfig {
  return lodash.merge({}, defaultConfig, config)
}

export function normalizeConfig(config: VuniversalConfig): VunLibConfig {
  return transformConfig(mergeDefaultConfig(config))
}