import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import logger from '@cli/services/logger'
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
  // https://github.com/webpack/webpack-dev-server/blob/master/lib/utils/status.js#L56
  // https://github.com/webpack/webpack-dev-server/blob/master/lib/utils/runOpen.js
  // @ts-ignore
  wds.showStatus = () => {
    const self = wds as any
    const createDomain = require('webpack-dev-server/lib/utils/createDomain')
    require('webpack-dev-server/lib/utils/runOpen')(
      createDomain(self.options, self.listeningApp),
      self.options,
      {
        ...self.log,
        info: logger.info
      }
    )
  }

  return wds
}
