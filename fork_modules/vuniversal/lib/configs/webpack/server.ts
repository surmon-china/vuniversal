import path from 'path'
import { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import vunConfig from '../vuniversal'
import { NodeEnv, VueEnv } from '../../environment'
import modifyServerDevConfig from './server.dev'
import modifyServerProdConfig from './server.prod'
import { SERVER_ENTRY, SERVER_MANIFEST_FILE, getManifestPath } from '../../paths'
import { BuildContext } from '.'

export default function modifyServerConfig(webpackConfig: Configuration, buildContext: BuildContext): void {

  // https://github.com/ericclemmons/start-server-webpack-plugin
  webpackConfig.entry = {
    [SERVER_ENTRY]: [vunConfig.serverEntry]
  }

  // TODO: 待测试
  // We want to uphold node's __filename, and __dirname.
  webpackConfig.node = false
  // webpackConfig.node = {
  //   __console: false,
  //   __dirname: false,
  //   __filename: false,
  // }

  // We need to tell webpack what to bundle into our Node bundle.
  webpackConfig.externals = [
    nodeExternals({
      whitelist: [
        'webpack/hot/poll?100',
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/
      ]
    })
  ]

  webpackConfig.plugins?.push(
    new WebpackBar({
      color: 'orange',
      name: VueEnv.Server
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    // in the build directory.
    // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
    new ManifestPlugin({
      fileName: path.join(
        getManifestPath(buildContext.environment, vunConfig),
        SERVER_MANIFEST_FILE
      ),
      writeToFileEmit: true
    })
  )

  buildContext.environment === NodeEnv.Development
    ? modifyServerDevConfig(webpackConfig)
    : modifyServerProdConfig(webpackConfig)
}
