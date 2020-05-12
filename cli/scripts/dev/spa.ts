import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getWebpackConfig } from '@cli/configs/webpack'
import { createWebpackDevServer } from '@cli/configs/wds'
import { compileConfig, compilerToPromise, getDevServerUrl } from '@cli/configs/webpack/helper'
import { NodeEnv, VueEnv } from '@cli/environment'
import { spaTemplateRender } from '@cli/configs/html'
import { DEV_SERVER_RUN_FAILED, DEV_SERVER_RUN_SUCCESSFULLY, projectIsRunningAt } from '@cli/texts'
import { vunConfig } from '@cli/configs/vuniversal'
import notifier from '@cli/services/notifier'
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
  const devServer = createWebpackDevServer(
    clientCompiler,
    {
      host: vunConfig.dev.host,
      port: vunConfig.dev.port,
      historyApiFallback: true,
      open: true,
      ...vunConfig.dev.devServer
    },
    clientConfig
  )

  compilerToPromise(clientCompiler, VueEnv.Client)
    .catch(() => null)
    .finally(() => {
      devServer.listen(vunConfig.dev.port, vunConfig.dev.host, (error?: Error) => {
        if (error) {
          logger.error(DEV_SERVER_RUN_FAILED, error)
          notifier.notify('', DEV_SERVER_RUN_FAILED)
          process.exit(1)
        } else {
          const serverUrl = getDevServerUrl(vunConfig.dev.host, vunConfig.dev.port)
          const projectIsRunningAtUrl = projectIsRunningAt(serverUrl)
          logger.done(projectIsRunningAtUrl)
          notifier.notify(projectIsRunningAtUrl, DEV_SERVER_RUN_SUCCESSFULLY)
        }
      })
    })
}
