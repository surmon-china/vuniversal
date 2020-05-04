import logger from '@cli/services/logger'
import { getWebpackConfig } from '@cli/configs/webpack'
import { compileConfig, runPromise } from '@cli/configs/webpack/helper'
import { NodeEnv, VueEnv } from '@cli/environment'
import { compiledSuccessfully } from '@cli/texts'

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
    logger.done(compiledSuccessfully())
  })
}
