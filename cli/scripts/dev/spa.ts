import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getWebpackConfig } from '@cli/configs/webpack'
import { defaultDevServerConfig } from '@cli/configs/dev-server'
import { compileConfig, compilerToPromise, getDevServerUrl } from '@cli/configs/webpack/helper'
import { spaTemplateRender } from '@cli/configs/html-plugin'
import { success as successNotifier } from '@cli/services/notifier'
import { NodeEnv, VueEnv } from '@cli/environment'
import { DEV_SERVER_RUN_FAILED, FAILED_TO_COMPILE, yourApplicationIsRunningAt } from '@cli/texts'
import { vunConfig } from '@cli/configs/vuniversal'
import logger from '@cli/services/logger'

export function startSPAServer() {
  const clientConfig = getWebpackConfig({
    target: VueEnv.Client,
    environment: NodeEnv.Development
  })

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

  compilerToPromise(clientCompiler, VueEnv.Client)
    .then(() => {
      devServer.listen(vunConfig.dev.port, vunConfig.dev.host, error => {
        if (error) {
          logger.br()
          logger.error(DEV_SERVER_RUN_FAILED, error)
          process.exit(1)
        } else {
          const serverUrl = getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
          successNotifier(serverUrl)
          logger.done(yourApplicationIsRunningAt(serverUrl))
        }
      })
    })
    .catch(errors => {
      logger.br()
      logger.errors(FAILED_TO_COMPILE, errors)
      process.exit(1)
    })
}
