
import { VUN_DEV_CACHE_PATH } from '../../paths'
import { NodeEnv, UniversalMode } from '../../environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Development

import fs from 'fs-extra'
import vunConfig from '../../configs/vuniversal'
import { getDevServerUrl } from '../../configs/webpack/helper'
import { headBanner } from '../../services/banner'
import { startSSRServer } from './ssr'
import { startSPAServer } from './spa'

// Delete assets.json and chunks.json to always have a manifest up to date
fs.removeSync(VUN_DEV_CACHE_PATH)

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
