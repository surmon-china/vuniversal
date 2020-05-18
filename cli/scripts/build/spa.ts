import { NodeEnv, VueEnv } from '@cli/environment'
import { getWebpackConfig } from '@cli/configs/webpack'
import { COMPILED_SUCCESSFULLY, compiledSuccessfully } from '@cli/texts'
import { compileConfig, runPromise } from '@cli/configs/webpack/helper'
import { modifyHTMLConfig } from '@cli/configs/html'
import { modifyPrerenderConfig } from '@cli/configs/prerender'
import { prerenderFallback, TODO_fixPrerenderMkdirp } from '@cli/configs/prerender'
import { vunConfig } from '@cli/configs/vuniversal'
import notifier from '@cli/services/notifier'
import logger from '@cli/services/logger'

export function startBuildSPA() {
  const clientConfig = getWebpackConfig({
    target: VueEnv.Client,
    environment: NodeEnv.Production
  })

  // HTML
  modifyHTMLConfig(clientConfig)

  // SPA + Prerender
  if (vunConfig.prerender) {
    modifyPrerenderConfig(clientConfig)
  }

  // TODO: prefetch & preload plugins

  // Compile
  const compiler = TODO_fixPrerenderMkdirp(compileConfig(clientConfig))

  // Run
  runPromise(compiler).then(() => {
    // Prerender fallback
    if (vunConfig.prerender) {
      prerenderFallback()
    }

    logger.done(compiledSuccessfully())
    notifier.successfully(COMPILED_SUCCESSFULLY)
    process.exit()
  })
}
