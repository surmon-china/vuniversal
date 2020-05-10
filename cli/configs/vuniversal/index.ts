import fs from 'fs-extra'
import { VunLibConfig } from './interface'
import { defaultConfig } from './default'
import { transformConfig, normalizeConfig } from './transformer'
import { APP_VUN_CONFIG_PATH } from '@cli/paths'
import logger from '@cli/services/logger'

export * from './default'
export * from './interface'
export * from './transformer'

export function getVunConfig(): VunLibConfig {
  // Check for vuniversal.config.js file
  if (!fs.existsSync(APP_VUN_CONFIG_PATH)) {
    return transformConfig(defaultConfig)
  }

  try {
    return normalizeConfig(require(APP_VUN_CONFIG_PATH))
  } catch (error) {
    logger.error('Invalid vuniversal config file!', error)
    process.exit(1)
  }
}

export const vunConfig: VunLibConfig = getVunConfig()
