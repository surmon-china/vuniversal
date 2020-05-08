import webpack, { Configuration } from 'webpack'
import { SERVER_JS_FILE, VUN_DEV_CACHE_PATH } from '@cli/paths'

export function modifyServerDevConfig(webpackConfig: Configuration): void {
  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    path: VUN_DEV_CACHE_PATH,
    publicPath: '/',
    filename: SERVER_JS_FILE,
    libraryTarget: 'commonjs2'
  }

  webpackConfig.plugins?.push(
    // Add hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  )
}
