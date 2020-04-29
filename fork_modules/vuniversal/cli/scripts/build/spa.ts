import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'
import templateParser from 'lodash/template'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import getWebpackConfig from '../../configs/webpack'
import { SPA_TEMPLATE_FILE } from '../../../base/paths'
import { NodeEnv, VueEnv } from '../../../base/environment'
import { compileConfig } from '../../configs/webpack/helper'
import vunConfig from '../../../base/config'
import logger from '../../services/logger'

export default function startSPAServer() {

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Production })
  const htmlTemplate = fs.readFileSync(vunConfig.template)
  const templateRender = templateParser(htmlTemplate.toString(), {
    interpolate: /{{([\s\S]+?)}}/g,
    evaluate: /{%([\s\S]+?)%}/g
  })

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    inject: false,
    minify: true,
    chunks: 'all',
    filename: path.resolve(vunConfig.dir.build, SPA_TEMPLATE_FILE),
    templateContent({ htmlWebpackPlugin }) {
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

  if (vunConfig.prerender) {
    const { routes, fallback } = vunConfig.prerender
    if (Array.isArray(routes) && routes.length) {
      const PrerenderSPAPlugin = require('prerender-spa-plugin')
      clientConfig.plugins?.push(new PrerenderSPAPlugin({
        staticDir: vunConfig.dir.build,
        routes,
        server: {
          port: vunConfig.dev.port,
          proxy: vunConfig.dev.proxy
        }
      }))
    }

    if (fallback) {
      const fallbackFile = fallback === true
        ? '404.html'
        : fallback
      console.log('prerender done! fallback', fallbackFile)
    }
  }

  const clientCompiler = compileConfig(clientConfig)
  clientCompiler.run((error: Error, stats: webpack.Stats) => {
    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }

    logger.done(`Compiled ${VueEnv.Client} successfully.`)
  })
}
