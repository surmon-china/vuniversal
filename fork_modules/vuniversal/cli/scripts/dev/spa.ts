import path from 'path'
import fs from 'fs-extra'
import templateParser from 'lodash/template'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import getWebpackConfig from '../../configs/webpack'
import { defaultDevServerConfig } from '../../configs/dev-server'
import { resolveAppRoot, SPA_TEMPLATE_FILE } from '../../../base/paths'
import { NodeEnv, VueEnv } from '../../../base/environment'
import { compileConfig, compilerToPromise, getDevServerUrl } from '../../configs/webpack/helper'
import { success as successNotifier } from '../../services/notifier'
import vunConfig from '../../../base/config'
import logger from '../../services/logger'

export function startSPAServer() {
  const buildContext = { target: VueEnv.Client, environment: NodeEnv.Development }
  const clientConfig = getWebpackConfig(buildContext)
  const htmlTemplate = fs.readFileSync(vunConfig.template)
  const templateRender = templateParser(htmlTemplate.toString(), {
    interpolate: /{{([\s\S]+?)}}/g,
    evaluate: /{%([\s\S]+?)%}/g
  })

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    inject: false,
    minify: false,
    chunks: 'all',
    filename: resolveAppRoot(path.resolve(vunConfig.dir.build, SPA_TEMPLATE_FILE)),
    templateContent({ htmlWebpackPlugin }) {
      // console.log('---------vunConfig', vunConfig)
      // console.log('---------htmlWebpackPlugin', htmlWebpackPlugin)
      const HTML_ATTRS = ''
      const HEAD_ATTRS = ''
      const BODY_ATTRS = ''
      const APP = 'client'

      const HEAD = [
        `<title>Welcome to vuniversal! ⚡</title>`,
        ...htmlWebpackPlugin.files.css.map((css: string) => `<link rel="stylesheet" href="${css}">`)
      ].join('\n')

      const FOOTER = [
        ...htmlWebpackPlugin.files.js.map((js: string) => `<script src="${js}" defer crossorigin></script>`)
      ].join('\n')

      return templateRender({
        HTML_ATTRS,
        HEAD_ATTRS,
        BODY_ATTRS,
        HEAD,
        APP,
        FOOTER
      })
    }
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
