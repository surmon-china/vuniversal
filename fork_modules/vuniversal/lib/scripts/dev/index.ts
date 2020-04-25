
import { VUN_DEV_CACHE_PATH } from '../../paths'
import { NodeEnv, UniversalMode } from '../../environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Development

import fs from 'fs-extra'
import { getDevServerUrl } from '../../configs/webpack/helper'
import { headBanner } from '../../services/banner'
import vunConfig from '../../configs/vuniversal'
import startSSRServer from './ssr'
import startSPAServer from './spa'

// TODO: 也许应该在 bin 入口
// Delete assets.json and chunks.json to always have a manifest up to date
fs.removeSync(VUN_DEV_CACHE_PATH)
// TODO: build 命令中清理产出文件夹
// fs.removeSync(vunConfig.dir.build)

// Banner
headBanner({
  univservalMode: vunConfig.universal
    ? UniversalMode.UNIVERSAL
    : UniversalMode.SPA,
  command: 'dev',
  memory: true,
  runningIn: NodeEnv.Development,
  listeningOn: getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
})

// Run dev server
vunConfig.universal
  ? startSSRServer()
  : startSPAServer()
