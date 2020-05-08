import { NodeEnv, UniversalMode } from '@cli/environment'

// @ts-ignore
process.noDeprecation = true // turns off that loadQuery clutter.
process.env.NODE_ENV = NodeEnv.Production

import fs from 'fs-extra'
import { command } from '@cli/utils'
import { vunConfig } from '@cli/configs/vuniversal'
import { headBanner } from '@cli/services/banner'
import { startBuildSSR } from './ssr'
import { startBuildSPA } from './spa'

fs.removeSync(vunConfig.dir.build)

// Banner
headBanner({
  command,
  memory: false,
  runningIn: NodeEnv.Production,
  univservalMode: vunConfig.universal
    ? UniversalMode.UNIVERSAL
    : UniversalMode.SPA
})

vunConfig.universal
  ? startBuildSSR()
  : startBuildSPA()
