import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { vunConfig } from '../vuniversal'

const defaultDevServerConfig: WebpackDevServer.Configuration = {
  hot: true,
  inline: true,
  overlay: true,
  disableHostCheck: true,
  // Browser log
  // clientLogLevel: 'error',
  // Hidden webpack bundle info
  noInfo: !vunConfig.dev.verbose,
  // Only output init info when true
  quiet: true,
  // HACK: logLevel for WebpackDevMiddleware
  // @ts-ignore
  logLevel: 'silent',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  watchContentBase: true,
  // historyApiFallback: true,
  // Enable gzip compression of generated files.
  compress: true,
  proxy: vunConfig.dev.proxy,
  publicPath: vunConfig.build.publicPath,
  contentBase: vunConfig.dir.public,
}

export const createWebpackDevServer = (
  webpackCompiler: webpack.Compiler,
  wdsConfig: WebpackDevServer.Configuration,
  webpackConfig?: webpack.Configuration
): WebpackDevServer => {
  if (webpackConfig) {
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, wdsConfig)
  }
  // https://webpack.docschina.org/configuration/dev-server
  const wds = new WebpackDevServer(webpackCompiler, {
    ...defaultDevServerConfig,
    ...wdsConfig
  })
  // HACK: Overlay the WebpackDevServer's log & remove status info
  // TODO: Rrmove when webpack-dev-server 4.x publish
  // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js#L52
  Object.assign(wds, {
    // BLOCK: Socket debug info...
    // log: logger,
    showStatus: () => void 0
  })
  return wds
}
