
import webpack, { Configuration } from 'webpack'
import { VunConfig } from '../vuniversal'

export default function modifyServerProdConfig(webpackConfig: Configuration, vunConfig: VunConfig): void {

  webpackConfig.stats = 'verbose'

  webpackConfig.entry = {
    server: vunConfig.serverEntry
  }

  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    ...webpackConfig.output,
    publicPath: '/'
  }

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      // maxChunks: 1,
    })
  ]
}
