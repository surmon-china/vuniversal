
import dedent from 'dedent'
import { VunLibConfig, TemplateRenderParameters } from './interface'
import { NodeEnv, isProd, isServerTarget } from '../environment'

export const defaultConfig: VunLibConfig = {
  universal: true,
  modern: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  env: {},
  dir: {
    build: 'dist',
    public: 'public',
    source: 'src',
    root: '.',
    modules: []
  },
  dev: {
    host: 'localhost',
    port: 3000,
    proxy: {},
    devServer: {}
  },
  build: {
    publicPath: '/',
    assetsDir: 'vun',
    analyze: false,
    runtimeCompiler: false,
    productionSourceMap: true,
    transpileDependencies: [],
    lintOnSave: true,
    get parallel() {
      try {
        return require('os').cpus().length > 1
      } catch (error) {
        return false
      }
    },
    css: {
      get extract() {
        return isProd(process.env.NODE_ENV as NodeEnv)
      },
      requireModuleExtension: true,
      sourceMap: false,
      loaderOptions: {}
    }
  },
  templateRender(params: TemplateRenderParameters) {
    const { target, assets, appHTML = '', state } = params
    const isServer = isServerTarget(target)

    const stateHTML = !isServer
      ? ''
      : `<script>window.__INIT_STATE__ = ${JSON.stringify(state)}</script>`

    const headHTML = !isServer
      ? `<title>Welcome to vuniversal!</title>`
      : `<title>Vuniversal SSR!</title>`
      // : ([
      //     meta.title.text(),
      //     meta.link.text(),
      //     meta.style.text(),
      //     meta.script.text(),
      //     meta.noscript.text()
      //   ].join('\n'))

    return dedent`
      <!doctype html>
      <html>
        <head>
          ${headHTML}
          ${assets.css.map(css => `<link rel="stylesheet" href="${css}">`)}
        </head>
        <body>
          <div id="app">${appHTML}</div>
          ${assets.js.map(js => `<script src="${js}" defer crossorigin></script>`)}
          ${stateHTML}
        </body>
      </html>
    `
  },
  prerender: {
    routers: [],
    fallback: true
  },
  babel: {},
  webpack: {
  }
  // AUTO
  // typescript: {}
}
