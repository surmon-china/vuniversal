// import fs from 'fs-extra'
import path from 'path'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import getWebpackConfig from '../../configs/webpack'
import { getDefaultDevServerConfig } from '../../configs/webpack/base'
import { NodeEnv, VueEnv, resolveAppRoot } from '../../constants'
import { VunConfig } from '../../configs/vuniversal'
import { compileConfig, compilerToPromise, getDevServerUrl } from '../../configs/webpack/helper'
import { success as successNotifier } from '../../services/notifier'
import logger from '../../services/logger'

export default function startSPAServer(vunConfig: VunConfig) {

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development }, vunConfig)

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    filename: resolveAppRoot(path.resolve(vunConfig.dir.build, 'index.html')),
    // TODO: 这里也许需要和 SSR 一样的处理机制
    template: vunConfig.template,
    chunks: 'all'
  }) as any)

  const clientCompiler = compileConfig(clientConfig)
  const devServerConfig: WebpackDevServer.Configuration = {
    ...getDefaultDevServerConfig(vunConfig),
    port: vunConfig.dev.port,
    historyApiFallback: true,
    open: true
  }

  // https://webpack.docschina.org/configuration/dev-server
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const server = new WebpackDevServer(clientCompiler, devServerConfig)

  compilerToPromise(clientCompiler, VueEnv.Client).then(() => {
    server.listen(vunConfig.dev.port, vunConfig.dev.host, error => {
      if (error) {
        logger.br()
        logger.error('Dev server run failed: ', error)
      } else {
        const serverUrl = getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
        successNotifier(serverUrl)
        logger.done(`Your application is running at: ${serverUrl}`)
      }
    })
  }).catch(error => {
    logger.error(`Failed to compile.`, error)
  })
}
