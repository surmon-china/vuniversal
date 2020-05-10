import { getWebpackConfig } from '@cli/configs/webpack'
import { compileConfig, runPromise } from '@cli/configs/webpack/helper'
import { COMPILED_SUCCESSFULLY, compiledSuccessfully } from '@cli/texts'
import { NodeEnv, VueEnv } from '@cli/environment'
import notifier from '@cli/services/notifier'
import logger from '@cli/services/logger'

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
    runPromise(compileConfig(clientConfig)),
    runPromise(compileConfig(serverConfig))
  ]).then(() => {
    logger.done(compiledSuccessfully())
    notifier.successfully(COMPILED_SUCCESSFULLY)
    process.exit()
  })
}
