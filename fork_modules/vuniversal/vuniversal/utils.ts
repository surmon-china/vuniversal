import fs from 'fs-extra'
// import { APP_VUN_CONFIG_PATH } from '../lib/paths'
// import { VunLibConfig } from '../lib/configs/vuniversal/interface'
// import { normalizeConfig } from '../lib/configs/vuniversal/transformer'

/*
export function getVunConfig(): VunLibConfig {
  let vunConfig: VunLibConfig = {} as any as VunLibConfig
  try {
    // - dev: tsc -> ts -> js
    // - prod: app -> webpack -> commonjs -> webpack compiler -> commonjs
    // For webpack env
    // https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
    // @ts-ignore
    vunConfig = __non_webpack_require__(APP_VUN_CONFIG_PATH)
  } catch (_) {
    vunConfig = {} as any as VunLibConfig
  }
  return normalizeConfig(vunConfig)
}
*/

export interface Assets {
  js: string[]
  css: string[]
}

export function getAssets(): Assets {
  // TODO:  用 ENV 进行通信才能避免两者之间的交互
  // 开发模式使用环境变量获取，生产模式，使用约定文件夹，vueConfig.dir.build + vunConfig.build.assestDir + 'server' + MANIFEST
  return fs.readJSONSync(process.env.VUN_CLIENT_MANIFEST as string)
}

