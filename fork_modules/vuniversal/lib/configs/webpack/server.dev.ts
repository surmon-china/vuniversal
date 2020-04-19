import webpack, { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import { VueEnv } from '../../environment'
import { VunConfig } from '../vuniversal'
import { resolveClientAssetsManifest, resolveClientChunksManifest } from '../../constants'

export default function modifyServerDevConfig(webpackConfig: Configuration, vunConfig: VunConfig): void {

  // Use watch mode
  webpackConfig.watch = true

  // quite
  webpackConfig.stats = 'none'

  // https://github.com/ericclemmons/start-server-webpack-plugin
  webpackConfig.entry = {
    server: [
      'webpack/hot/poll?100',
      vunConfig.serverEntry
    ]
  }

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    // Add hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new WebpackBar({
      color: 'orange',
      name: VueEnv.Server
    }),
    // TODO: 如果放到内存中就不再需要了 Webpack5 有问题
    // Ignore assets.json and chunks.json to avoid infinite recompile bug
    new webpack.WatchIgnorePlugin([
      resolveClientAssetsManifest(vunConfig.dir.build),
      resolveClientChunksManifest(vunConfig.dir.build)
    ])
  ]
}
