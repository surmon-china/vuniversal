
import { APP_VUN_CONFIG_PATH } from '../lib/constants'
import { normalizeConfig } from '../lib/configs/vuniversal/transformer'
import { VuniversalConfig, VunConfig } from '../lib/configs/vuniversal/type'

export function getVuniversalConfig(): VuniversalConfig | null {
  try {
    // tsc: ts -> js
    // webpack: commonjs -> webpack compiler -> commonjs
    // https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
    // @ts-ignore
    return __non_webpack_require__(APP_VUN_CONFIG_PATH)
  } catch (error) {
    return null
  }
}

export function getVunConfig(): VunConfig {
  const config = getVuniversalConfig()
  return normalizeConfig(config || {})
}
