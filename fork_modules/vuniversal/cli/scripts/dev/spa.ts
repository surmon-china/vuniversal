import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getWebpackConfig } from '../../configs/webpack'
import { defaultDevServerConfig } from '../../configs/dev-server'
import { NodeEnv, VueEnv } from '../../environment'
import { compileConfig, compilerToPromise, getDevServerUrl } from '../../configs/webpack/helper'
import { spaTemplateRender } from '../../configs/html-plugin'
import { success as successNotifier } from '../../services/notifier'
import vunConfig from '../../configs/vuniversal'
import logger from '../../services/logger'

export function startSPAServer() {
  const clientConfig = getWebpackConfig({
    target: VueEnv.Client,
    environment: NodeEnv.Development
  })

  // console.log('-------clientConfig', clientConfig)

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    inject: false,
    minify: false,
    chunks: 'all',
    templateContent: spaTemplateRender
  }))

  const clientCompiler = compileConfig(clientConfig)
  const devServerConfig: WebpackDevServer.Configuration = {
    ...defaultDevServerConfig,
    port: vunConfig.dev.port,
    historyApiFallback: true,
    open: true
  }

  // https://webpack.docschina.org/configuration/dev-server
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const devServer = new WebpackDevServer(clientCompiler, devServerConfig)

  compilerToPromise(clientCompiler, VueEnv.Client).then(() => {
    devServer.listen(vunConfig.dev.port, vunConfig.dev.host, error => {
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
