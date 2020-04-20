import fs from 'fs-extra'
import { VunConfig } from './type'
import { defaultConfig } from './default'
import { transformConfig, normalizeConfig } from './transformer'
import { APP_VUN_CONFIG_PATH } from '../../constants'
import logger from '../../utils/logger'

export * from './type'
export * from './default'
export * from './package'
export * from './transformer'
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
