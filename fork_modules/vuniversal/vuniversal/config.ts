import { APP_VUN_CONFIG_PATH } from '../lib/constants'
import { VuniversalConfig, VunConfig } from '../lib/configs/vuniversal/type'
import { normalizeConfig } from '../lib/configs/vuniversal/transformer'

export function getVunConfig(): VunConfig {
  let vunConfig: VuniversalConfig = {}
  try {
    // - dev: tsc -> ts -> js
    // - prod: app -> webpack -> commonjs -> webpack compiler -> commonjs
    // For webpack env
    // https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
    // @ts-ignore
    vunConfig = __non_webpack_require__(APP_VUN_CONFIG_PATH)
  } catch (_) {
    try {
      // For other nodejs env
      // TODO: 待分析测试
      vunConfig = module.require(APP_VUN_CONFIG_PATH)
    } catch (__) {
      vunConfig = {}
    }
  }
  return normalizeConfig(vunConfig)
}

export default getVunConfig()
