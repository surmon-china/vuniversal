import path from 'path'
import fs from 'fs-extra'
import { Configuration, Compiler } from 'webpack'
import { SPA_TEMPLATE_FILE, DEFAULT_FALLBACK_FILE, getClientBuildDir } from '@cli/paths'
import { vunConfig } from '../vuniversal'

export function TODO_fixPrerenderMkdirp(compiler: Compiler) {
  // WORKAROUND: https://github.com/chrisvfritz/prerender-spa-plugin/blob/v3.4.0/es6/index.js#L60
  // TODO: Remove when prerender-spa-plugin upgrade
  // @ts-ignore
  compiler.outputFileSystem.mkdirp = require('mkdirp')
  return compiler
}

// Prerender config
export function modifyPrerenderConfig(webpackConfig: Configuration) {
  if (typeof vunConfig.prerender === 'object') {
    const { routes } = vunConfig.prerender
    if (Array.isArray(routes) && routes.length) {
      const PrerenderSPAPlugin = require('prerender-spa-plugin')
      webpackConfig.plugins?.push(new PrerenderSPAPlugin({
        staticDir: getClientBuildDir(vunConfig),
        routes,
        server: {
          port: vunConfig.dev.port,
          proxy: vunConfig.dev.proxy
        },
        ...vunConfig.prerender?.options
      }))
    }
  }
}

// Prerender fallback
export function prerenderFallback() {
  if (typeof vunConfig.prerender === 'object') {
    const { fallback } = vunConfig.prerender
    if (fallback) {
      const clientBuildDir = getClientBuildDir(vunConfig)
      const fallbackFile = fallback === true
        ? DEFAULT_FALLBACK_FILE
        : fallback
      fs.copySync(
        path.resolve(clientBuildDir, SPA_TEMPLATE_FILE),
        path.resolve(clientBuildDir, fallbackFile)
      )
    }
  }
}


