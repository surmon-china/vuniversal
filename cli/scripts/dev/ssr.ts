import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import { vunConfig } from '@cli/configs/vuniversal'
import { getWebpackConfig } from '@cli/configs/webpack'
import { createWebpackDevServer } from '@cli/configs/wds'
import { VUN_DEV_TEMPLATE, SERVER_ENTRY, WEBPACK_HOT_POLL_ENTRY, SERVER_JS_FILE } from '@cli/paths'
import { compileConfig, compilerToPromise, handleCompiler, getAssetsServerPort } from '@cli/configs/webpack/helper'
import { DEV_SERVER_RUN_FAILED, COMPILED_SUCCESSFULLY } from '@cli/texts'
import { NodeEnv, VueEnv } from '@cli/environment'
import { args } from '@cli/utils'
import logger from '@cli/services/logger'
import notifier from '@cli/services/notifier'

export function startSSRServer() {
  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development })
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development })

  // Client --------------------------------------------------------------
  clientConfig.output = {
    ...clientConfig.output,
    // MARK: publicPath -> chunks url & socket url host & hot-upload url
    // publicPath: assetsServerUrl + '/'
    publicPath: '/'
  }
  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE,
    inject: false
  }))

  const clientCompiler = compileConfig(clientConfig)
  const clientServer = createWebpackDevServer(
    clientCompiler,
    {
      port: assetsServerPost,
      historyApiFallback: false,
      open: false
    },
    clientConfig
  )

  // Server --------------------------------------------------------------
  // Start HMR server
  // @ts-ignore
  serverConfig.entry[SERVER_ENTRY].unshift(WEBPACK_HOT_POLL_ENTRY)
  // Auro run ssr server when build done.
  // https://github.com/ericclemmons/start-server-webpack-plugin
  // @ts-ignore
  serverConfig.plugins?.push(new StartServerPlugin({
    // https://github.com/ericclemmons/start-server-webpack-plugin/blob/master/src/StartServerPlugin.js#L110
    name: SERVER_JS_FILE,
    // Capture any --inspect or --inspect-brk flags (with optional values) so that we
    // can pass them when we invoke nodejs
    nodeArgs: args,
    keyboard: true
  }))

  const serverCompiler = compileConfig(serverConfig)
  serverCompiler.watch(
    serverConfig.watchOptions || {},
    handleCompiler(() => {
      // logger.log(`${VueEnv.Server} status: ${stats?.toString(serverConfig.stats)}`)
    })
  )

  // Run
  Promise.all([
    compilerToPromise(clientCompiler, VueEnv.Client),
    compilerToPromise(serverCompiler, VueEnv.Server)
  ])
    .then(() => notifier.notify(COMPILED_SUCCESSFULLY))
    .catch(() => null)
    .finally(() => {
      clientServer.listen(assetsServerPost, vunConfig.dev.host, error => {
        if (error) {
          logger.br()
          logger.error(DEV_SERVER_RUN_FAILED, error)
          notifier.notify('', DEV_SERVER_RUN_FAILED)
          process.exit(1)
        }
      })
    })
}
