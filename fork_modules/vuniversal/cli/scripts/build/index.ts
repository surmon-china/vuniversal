
import { NodeEnv, UniversalMode } from '../../../base/environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Production

import fs from 'fs-extra'
import { headBanner } from '../../services/banner'
import vunConfig from '../../../base/config'
import startSSRServer from './ssr'
import startSPAServer from './spa'

fs.removeSync(vunConfig.dir.build)

// Banner
headBanner({
  univservalMode: vunConfig.universal
    ? UniversalMode.UNIVERSAL
    : UniversalMode.SPA,
  command: 'build',
  memory: false,
  runningIn: NodeEnv.Production
})

// Run dev server
vunConfig.universal
  ? startSSRServer()
  : startSPAServer()
