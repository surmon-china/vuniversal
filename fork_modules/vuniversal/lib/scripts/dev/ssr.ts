
// import path from 'path'
// import fs from 'fs-extra'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import logger from '../../services/logger'
import { VunConfig } from '../../configs/vuniversal'
import getWebpackConfig from '../../configs/webpack'
import { getDefaultDevServerConfig } from '../../configs/webpack/base'
import { NodeEnv, VueEnv, VUN_DEV_TEMPLATE_PATH, VUN_DEV_FOLDER_PATH, SERVER_JS_NAME } from '../../constants'
import { compileConfig, compilerToPromise, getAssetsServerPort, getDevServerUrl } from '../../configs/webpack/helper'
import { args } from '../../arguments'

export default function startSSRServer(vunConfig: VunConfig) {

  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const assetsServerUrl = getDevServerUrl(vunConfig.dev.host, assetsServerPost)

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development }, vunConfig)
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development }, vunConfig)

  if (clientConfig.output) {
    // chunks url & socket url host & hot-upload url
    clientConfig.output.publicPath = '/'
    // clientConfig.output.publicPath = assetsServerUrl + '/'
  }

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE_PATH,
    inject: false
  }) as any)

  // https://webpack.docschina.org/configuration/dev-server
  const devServerConfig: WebpackDevServer.Configuration = {
    ...getDefaultDevServerConfig(vunConfig),
    port: assetsServerPost,
    historyApiFallback: false,
    open: false
  }
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const clientCompiler = compileConfig(clientConfig)
  const clientServer = new WebpackDevServer(clientCompiler, devServerConfig)


  if (serverConfig.output) {
    serverConfig.output.path = VUN_DEV_FOLDER_PATH
    serverConfig.output.publicPath = assetsServerUrl
    serverConfig.output.filename = SERVER_JS_NAME
  }
  // Auro run ssr server when build done.
  serverConfig.plugins?.push(new StartServerPlugin({
    // https://github.com/ericclemmons/start-server-webpack-plugin/blob/master/src/StartServerPlugin.js#L110
    // TODO: TEST 这里的名字需要约束与 bound name 保持一致
    name: SERVER_JS_NAME,
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
