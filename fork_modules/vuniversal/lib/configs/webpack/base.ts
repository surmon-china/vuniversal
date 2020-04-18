
import WebpackDevServer from 'webpack-dev-server'
import { VunConfig } from '../vuniversal'

export function getDefaultDevServerConfig(vunConfig: VunConfig): WebpackDevServer.Configuration {
  return {
    hot: true,
    inline: true,
    overlay: true,
    disableHostCheck: true,
    // Browser log
    // clientLogLevel: 'error',
    // Hidden webpack bundle info
    noInfo: true,
    // Only output init info when true
    // quiet: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: vunConfig.dev.proxy,
    publicPath: vunConfig.build.publicPath,
    contentBase: vunConfig.dir.static,
    watchContentBase: true,
    historyApiFallback: true,
    // Enable gzip compression of generated files.
    compress: true,
    open: true
  }
}