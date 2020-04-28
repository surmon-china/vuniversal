
// import path from 'path'
// import fs from 'fs-extra'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import logger from '../../services/logger'
import vunConfig from '../../../base/config'
import getWebpackConfig from '../../configs/webpack'
import { defaultDevServerConfig } from '../../configs/dev-server'
import { VUN_DEV_TEMPLATE_PATH, SERVER_ENTRY, SERVER_JS_FILE } from '../../../base/paths'
import { compileConfig, compilerToPromise, getAssetsServerPort } from '../../configs/webpack/helper'
import { NodeEnv, VueEnv } from '../../../base/environment'
import { args } from '../../utils'

export function startSSRServer() {
  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development })
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development })

  clientConfig.output = {
    ...clientConfig.output,
    // chunks url & socket url host & hot-upload url
    // publicPath: assetsServerUrl + '/'
    publicPath: '/'
  }
  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE_PATH,
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

  // Start HMR server
  // @ts-ignore
  serverConfig.entry[SERVER_ENTRY].unshift('webpack/hot/poll?100')
  // Auro run ssr server when build done.
  serverConfig.plugins?.push(new StartServerPlugin({
    // https://github.com/ericclemmons/start-server-webpack-plugin/blob/master/src/StartServerPlugin.js#L110
    name: SERVER_JS_FILE,
    // Capture any --inspect or --inspect-brk flags (with optional values) so that we
    // can pass them when we invoke nodejs
    nodeArgs: args,
    keyboard: true
  }))
  const serverCompiler = compileConfig(serverConfig)
  serverCompiler.watch({ ignored: /node_modules/ }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      // TODO: 如果在这里打印打印，就把 webpack.log 关掉
      logger.log(stats.toString(serverConfig.stats))
      return
    }

    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }
  })

  Promise.all([
    compilerToPromise(clientCompiler, VueEnv.Client),
    compilerToPromise(serverCompiler, VueEnv.Server)
  ]).then(() => {
    clientServer.listen(assetsServerPost, vunConfig.dev.host, error => {
      if (error) {
        logger.br()
        logger.error('Dev server run failed: ', error)
      }
    })
  }).catch(error => {
    logger.error(`Failed to compile.`, error)
  })
}
