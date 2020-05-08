// import path from 'path'
// import fs from 'fs-extra'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import logger from '@cli/services/logger'
import { vunConfig } from '@cli/configs/vuniversal'
import { getWebpackConfig } from '@cli/configs/webpack'
import { defaultDevServerConfig } from '@cli/configs/dev-server'
import { VUN_DEV_TEMPLATE, SERVER_ENTRY, WEBPACK_HOT_POLL_ENTRY, SERVER_JS_FILE } from '@cli/paths'
import { compileConfig, compilerToPromise, handleCompiler, getAssetsServerPort } from '@cli/configs/webpack/helper'
import { DEV_SERVER_RUN_FAILED, FAILED_TO_COMPILE } from '@cli/texts'
import { NodeEnv, VueEnv } from '@cli/environment'
import { args } from '@cli/utils'

export function startSSRServer() {
  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development })
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development })

  // Client --------------------------------------------------------------
  clientConfig.output = {
    ...clientConfig.output,
    // chunks url & socket url host & hot-upload url
    // publicPath: assetsServerUrl + '/'
    publicPath: '/'
  }
  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE,
    inject: false
  }))

  // https://webpack.docschina.org/configuration/dev-server
  const devServerConfig: WebpackDevServer.Configuration = {
    ...defaultDevServerConfig,
    port: assetsServerPost,
    historyApiFallback: false,
    open: false
  }
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const clientCompiler = compileConfig(clientConfig)
  const clientServer = new WebpackDevServer(clientCompiler, devServerConfig)

  // Server --------------------------------------------------------------
  // Start HMR server
  // @ts-ignore
  serverConfig.entry[SERVER_ENTRY].unshift(WEBPACK_HOT_POLL_ENTRY)
  // Auro run ssr server when build done.
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
  serverCompiler.watch({}, handleCompiler(stats => {
    // TODO: 如果在这里打印打印，就把 webpack.log 关掉
    logger.log(stats?.toString(serverConfig.stats))
  }, VueEnv.Server))

  // Run
  Promise.all([
    compilerToPromise(clientCompiler, VueEnv.Client),
    compilerToPromise(serverCompiler, VueEnv.Server)
  ])
    .then(() => {
      clientServer.listen(assetsServerPost, vunConfig.dev.host, error => {
        if (error) {
          logger.br()
          logger.error(DEV_SERVER_RUN_FAILED, error)
          process.exit(1)
        }
      })
    })
    .catch(errors => {
      logger.br()
      logger.errors(FAILED_TO_COMPILE, errors)
      process.exit(1)
    })
}
