import path from 'path'
import webpack, { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import ManifestPlugin from 'webpack-manifest-plugin'
import nodeExternals from 'webpack-node-externals'
import { vunConfig } from '../vuniversal'
import { VueEnv, isDev } from '@cli/environment'
import {
  SERVER_ENTRY,
  SERVER_JS_FILE,
  SERVER_MANIFEST_FILE,
  VUN_DEV_CACHE_PATH,
  WEBPACK_HOT_POLL_ENTRY,
  getManifestPath,
  getServerBuildPath
} from '@cli/paths'
import { resolveEntry } from '@cli/utils'
import { BuildContext } from '.'

export function modifyServerConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)

  webpackConfig.entry = {
    [SERVER_ENTRY]: [resolveEntry(vunConfig.serverEntry, VueEnv.Server)]
  }

  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    path: IS_DEV
      ? VUN_DEV_CACHE_PATH
      : getServerBuildPath(vunConfig),
    publicPath: vunConfig.build.publicPath,
    filename: SERVER_JS_FILE,
    libraryTarget: 'commonjs2'
  }

  // We need to tell webpack what to bundle into our Node bundle.
  const whitelist = [
    /\.(eot|woff|woff2|ttf|otf)$/,
    /\.(svg|png|jpg|jpeg|gif|ico)$/,
    /\.(mp4|mp3|ogg|swf|webp)$/,
    /\.(css|scss|sass|sss|less)$/
  ]
  webpackConfig.node = false
  webpackConfig.externals = [
    nodeExternals({
      whitelist: IS_DEV
        ? [WEBPACK_HOT_POLL_ENTRY, ...whitelist]
        : whitelist
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
    // @ts-ignore
    new ManifestPlugin({
      fileName: path.join(
        getManifestPath(buildContext.environment, vunConfig),
        SERVER_MANIFEST_FILE
      ),
      writeToFileEmit: true
    }),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  )

  if (IS_DEV) {
    webpackConfig.plugins?.push(
      // Add hot module replacement
      new webpack.HotModuleReplacementPlugin()
    )
  }
}
