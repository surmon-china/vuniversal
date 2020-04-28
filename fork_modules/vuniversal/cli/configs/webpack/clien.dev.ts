import path from 'path'
import webpack, { Configuration } from 'webpack'
import vunConfig from '../../../base/config'

export default function modifyClientDevConfig(webpackConfig: Configuration): void {

  // Configure our client bundles output. Not the public path is to 3001.
  webpackConfig.output = {
    path: vunConfig.dir.build,
    publicPath: vunConfig.build.publicPath,
    pathinfo: true,
    libraryTarget: 'var',
    filename: `${vunConfig.build.assetsDir}/js/bundle.js`,
    chunkFilename: `${vunConfig.build.assetsDir}/js/[name].chunk.js`,
    devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/')
  }

  // Add client-only development plugins
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin()
  ]

  webpackConfig.optimization = {
    // @todo automatic vendor bundle
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // splitChunks: {
    //   chunks: 'all',
    // },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // runtimeChunk: true,
  }
}
