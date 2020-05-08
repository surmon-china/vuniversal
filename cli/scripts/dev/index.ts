
import { VUN_DEV_CACHE_PATH } from '@cli/paths'
import { NodeEnv, UniversalMode } from '@cli/environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Development

import fs from 'fs-extra'
import { command } from '@cli/utils'
import { vunConfig } from '@cli/configs/vuniversal'
import { headBanner } from '@cli/services/banner'
import { getDevServerUrl } from '@cli/configs/webpack/helper'
import { startSSRServer } from './ssr'
import { startSPAServer } from './spa'

// Delete assets.json and chunks.json to always have a manifest up to date
fs.removeSync(VUN_DEV_CACHE_PATH)

// Banner
headBanner({
  command,
  memory: true,
  runningIn: NodeEnv.Development,
  univservalMode: vunConfig.universal
    ? UniversalMode.UNIVERSAL
    : UniversalMode.SPA,
  listeningOn: getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
})

// Run dev server
vunConfig.universal
  ? startSSRServer()
  : startSPAServer()
