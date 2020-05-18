import { getWebpackConfig } from '@cli/configs/webpack'
import { compileConfig, runPromise } from '@cli/configs/webpack/helper'
import { vunConfig } from '@cli/configs/vuniversal'
import { modifyHTMLConfig } from '@cli/configs/html'
import { modifyPrerenderConfig, prerenderFallback, TODO_fixPrerenderMkdirp } from '@cli/configs/prerender'
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

  // SSR + Prerender
  if (vunConfig.prerender) {
    modifyHTMLConfig(clientConfig)
    modifyPrerenderConfig(clientConfig)
  }

  Promise.all([
    runPromise(TODO_fixPrerenderMkdirp(compileConfig(clientConfig))),
    runPromise(compileConfig(serverConfig))
  ]).then(() => {
    // Prerender fallback
    if (vunConfig.prerender) {
      prerenderFallback()
    }

    logger.done(compiledSuccessfully())
    notifier.successfully(COMPILED_SUCCESSFULLY)
    process.exit()
  })
}
