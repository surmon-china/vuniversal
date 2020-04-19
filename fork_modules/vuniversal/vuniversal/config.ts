
// import { APP_VUN_CONFIG } from '../lib/constants'
import { VuniversalConfig, VunConfig, normalizeConfig } from '../lib/configs/vuniversal'

export function getVuniversalConfig(): VuniversalConfig | null {
  try {
    // TODO: 到时候看怎么办，也许这个文件是需要移除的
    return require('/Users/surmon/Projects/JavaScript/NPM/vuniversal/vun.config.js')
  } catch (error) {
    return null
  }
}

export function getVunConfig(): VunConfig {
  const config = getVuniversalConfig()
  return normalizeConfig(config || {})
}
