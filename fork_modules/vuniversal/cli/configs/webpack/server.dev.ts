import webpack, { Configuration } from 'webpack'
import { SERVER_JS_FILE, VUN_DEV_CACHE_PATH } from '../../../base/paths'

export default function modifyServerDevConfig(webpackConfig: Configuration): void {
  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    path: VUN_DEV_CACHE_PATH,
    publicPath: '/',
    filename: SERVER_JS_FILE,
    libraryTarget: 'commonjs2'
  }

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    // Add hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    // TODO: 如果放到内存中就不再需要了 Webpack5 有问题
    // Ignore assets.json and chunks.json to avoid infinite recompile bug
    // new webpack.WatchIgnorePlugin([
    //   resolveClientAssetsManifest(vunConfig.dir.build),
    //   resolveClientChunksManifest(vunConfig.dir.build)
    // ])
  ]
}
