import fs from 'fs-extra'
import getVunConfig from '../../configs/vuniversal'
import { NodeEnv, UniversalMode } from '../../environment'
import { getDevServerUrl } from '../../configs/webpack/helper'
import { headBanner } from '../../utils/banner'
import startSSRServer from './ssr'
import startSPAServer from './spa'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Development

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || ''
process.env.INSPECT = process.argv.find(arg => arg.match(/--inspect(=|$)/)) || ''

// Get vuniversal config
const vunConfig = getVunConfig()

// Delete assets.json and chunks.json to always have a manifest up to date
fs.removeSync(vunConfig.dir.build)

// Banner
headBanner({
  univservalMode: vunConfig.universal
    ? UniversalMode.UNIVERSAL
    : UniversalMode.SPA,
  command: true,
  memory: true,
  runningIn: NodeEnv.Development,
  listeningOn: getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
})

// Run dev server
vunConfig.universal
  ? startSSRServer(vunConfig)
  : startSPAServer(vunConfig)
