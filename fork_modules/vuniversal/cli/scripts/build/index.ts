
import { NodeEnv, UniversalMode } from '../../environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Production

import fs from 'fs-extra'
import vunConfig from '../../configs/vuniversal'
import { headBanner } from '../../services/banner'
import { startBuildSSR } from './ssr'
import { startBuildSPA } from './spa'

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

vunConfig.universal
  ? startBuildSSR()
  : startBuildSPA()
