import logger from '../../services/logger'
import { getWebpackConfig } from '../../configs/webpack'
import { compileConfig, runPromise } from '../../configs/webpack/helper'
import { NodeEnv, VueEnv } from '../../environment'

export function startBuildSSR() {
  const clientConfig = getWebpackConfig({
    target: VueEnv.Client,
    environment: NodeEnv.Production
  })
  const serverConfig = getWebpackConfig({
    target: VueEnv.Server,
    environment: NodeEnv.Production
  })

  Promise.all([
    runPromise(compileConfig(clientConfig), VueEnv.Client),
    runPromise(compileConfig(serverConfig), VueEnv.Server)
  ]).then(() => {
    logger.done(`Compiled successfully.`)
  })
}
