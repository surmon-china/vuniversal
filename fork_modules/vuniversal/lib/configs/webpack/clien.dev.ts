import path from 'path'
import webpack, { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import { VunConfig } from '../vuniversal'
import { VueEnv } from '../../environment'
import { APP_VUN_ASSETS_FOLDER } from '../../constants'

export default function modifyClientDevConfig(webpackConfig: Configuration, vunConfig: VunConfig): void {

  webpackConfig.stats = 'minimal'

  // specify our client entry point /client/index.js
  webpackConfig.entry = {
    client: [vunConfig.clientEntry]
  }

  // Configure our client bundles output. Not the public path is to 3001.
  webpackConfig.output = {
    path: vunConfig.dir.build,
    publicPath: vunConfig.build.publicPath,
    pathinfo: true,
    libraryTarget: 'var',
    filename: `${APP_VUN_ASSETS_FOLDER}/js/bundle.js`,
    chunkFilename: `${APP_VUN_ASSETS_FOLDER}/js/[name].chunk.js`,
    devtoolModuleFilenameTemplate: info => path.resolve(info.resourcePath).replace(/\\/g, '/')
  }

  // Add client-only development plugins
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBar({
      color: 'green',
      name: VueEnv.Client
    })
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
