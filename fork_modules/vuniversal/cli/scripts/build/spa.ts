import fs from 'fs-extra'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getWebpackConfig } from '../../configs/webpack'
import { SPA_TEMPLATE_FILE, DEFAULT_FALLBACK_FILE } from '../../paths'
import { NodeEnv, VueEnv } from '../../environment'
import { compileConfig, runPromise } from '../../configs/webpack/helper'
import { spaTemplateRender } from '../../configs/html-plugin'
import vunConfig from '../../configs/vuniversal'

export function startBuildSPA() {
  const indexHTMLpath = path.resolve(vunConfig.dir.build, SPA_TEMPLATE_FILE)
  const clientConfig = getWebpackConfig({
    target: VueEnv.Client,
    environment: NodeEnv.Production
  })

  // HTML
  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    filename: indexHTMLpath,
    templateContent: spaTemplateRender,
    inject: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    }
  }))

  // Prerender
  if (vunConfig.prerender) {
    const { routes } = vunConfig.prerender
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
  }

  // Run
  runPromise(compileConfig(clientConfig), VueEnv.Client).then(() => {
    // Prerender fallback
    if (typeof vunConfig.prerender === 'object') {
      const { fallback } = vunConfig.prerender
      if (fallback) {
        const fallbackFile = fallback === true
          ? DEFAULT_FALLBACK_FILE
          : fallback
        fs.copySync(
          indexHTMLpath,
          path.resolve(vunConfig.dir.build, fallbackFile)
        )
      }
    }
  })
}
