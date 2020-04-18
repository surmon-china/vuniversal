
// import path from 'path'
// import fs from 'fs-extra'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import StartServerPlugin from 'start-server-webpack-plugin'
import logger from '../../utils/logger'
import { VunConfig } from '../../configs/vuniversal'
import getWebpackConfig from '../../configs/webpack'
import { NodeEnv, VueEnv } from '../../environment'
import { getDefaultDevServerConfig } from '../../configs/webpack/base'
import { VUN_DEV_TEMPLATE_PATH, SERVER_JS_NAME } from '../../constants'
import { compileConfig, compilerToPromise, getAssetsServerPort, getDevServerUrl } from '../../configs/webpack/helper'
import { args } from '../../arguments'

export default function startSSRServer(vunConfig: VunConfig) {

  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const assetsServerUrl = getDevServerUrl(vunConfig.dev.host, assetsServerPost)

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development }, vunConfig)
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development }, vunConfig)

  if (clientConfig.output) {
    // chunks url & socket url host & hot-upload url
    clientConfig.output.publicPath = assetsServerUrl + '/'
  }
  if (serverConfig.output) {
    serverConfig.output.publicPath = assetsServerUrl
  }

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE_PATH,
    inject: false
  }) as any)

  // Auro run ssr server when build done.
  serverConfig.plugins?.push(new StartServerPlugin({
    name: SERVER_JS_NAME,
    nodeArgs: args || []
  }))

  const clientCompiler = compileConfig(clientConfig)
  const serverCompiler = compileConfig(serverConfig)

  const devServerConfig: WebpackDevServer.Configuration = {
    ...getDefaultDevServerConfig(vunConfig),
    port: assetsServerPost,
    historyApiFallback: false,
    open: false
  }

  // https://webpack.docschina.org/configuration/dev-server
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const clientServer = new WebpackDevServer(clientCompiler, devServerConfig)

  // TODO: 内存中好办
  // serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({ ignored: /node_modules/ }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      logger.log(stats.toString(serverConfig.stats))
      // TODO: 这里可以拿到内存中的文件 dosomething
      // https://www.namecheap.com/blog/production-ready-vue-ssr-in-5-simple-steps/
      // https://github.com/vuejs/vue-hackernews-2.0/blob/master/build/setup-dev-server.js#L80
      // https://github.com/Q-Angelo/web_front_end_frame#nodejs%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%AD%A3%E5%BC%8F%E7%8E%AF%E5%A2%83%E6%B8%B2%E6%9F%93
      //  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
      return
    }

    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to compile.', stats.toJson().errors)
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
