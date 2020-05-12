import fs from 'fs-extra'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { NodeEnv, VueEnv } from '@cli/environment'
import { getWebpackConfig } from '@cli/configs/webpack'
import { SPA_TEMPLATE_FILE, DEFAULT_FALLBACK_FILE } from '@cli/paths'
import { COMPILED_SUCCESSFULLY, compiledSuccessfully } from '@cli/texts'
import { compileConfig, runPromise } from '@cli/configs/webpack/helper'
import { spaTemplateRender } from '@cli/configs/html'
import { vunConfig } from '@cli/configs/vuniversal'
import notifier from '@cli/services/notifier'
import logger from '@cli/services/logger'

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
        },
        ...vunConfig.prerender?.options
      }))
    }
  }

  // TODO: prefetch & preload plugins

  // Compile
  const compiler = compileConfig(clientConfig)
  // WORKAROUND: https://github.com/chrisvfritz/prerender-spa-plugin/blob/v3.4.0/es6/index.js#L60
  // TODO: Remove when prerender-spa-plugin upgrade
  // @ts-ignore
  compiler.outputFileSystem.mkdirp = require('mkdirp')

  // Run
  runPromise(compiler).then(() => {
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

    logger.done(compiledSuccessfully())
    notifier.successfully(COMPILED_SUCCESSFULLY)
    process.exit()
  })
}
