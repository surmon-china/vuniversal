import path from 'path'
import { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import ManifestPlugin from 'webpack-manifest-plugin'
import vunConfig from '../vuniversal'
import { modifyClientDevConfig } from './clien.dev'
import { modifyClientProdConfig } from './client.prod'
import { VueEnv, isDev, isUniversal } from '@cli/environment'
import { CLIENT_ENTRY, CLIENT_MANIFEST_FILE, getManifestPath, getClientBuildPath } from '@cli/paths'
import { requireResolve } from '@cli/utils'
import { autoHash } from './helper'
import { BuildContext } from '.'

export function modifyClientConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)
  const clientBuildPath = getClientBuildPath(vunConfig)

  // TODO: morden
  // isLegacyBundle ? '[name]-legacy.js' : '[name].js'
  // const outputFilename = getAssetPath(
  //   options,
  //   `js/[name]${isLegacyBundle ? `-legacy` : ``}${isProd && options.filenameHashing ? '.[contenthash:8]' : ''}.js`

  // specify our client entry point src/client
  webpackConfig.entry = {
    // Make sure entry file exist
    [CLIENT_ENTRY]: [requireResolve(vunConfig.clientEntry)]
  }

  // Specify the client output directory and paths.
  webpackConfig.output = {
    path: clientBuildPath,
    publicPath: vunConfig.build.publicPath,
    filename: `${vunConfig.build.assetsDir}/js/[name]${autoHash(vunConfig)}.js`,
    chunkFilename: `${vunConfig.build.assetsDir}/js/[name]${autoHash(vunConfig)}.js`,
  }

  webpackConfig.optimization = {
    ...vunConfig.build.optimization
  }

  webpackConfig.node = {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // process is injected via DefinePlugin, although some 3rd party
    // libraries may require a mock to work properly (#934)
    process: 'mock',
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }

  webpackConfig.plugins?.push(
    new WebpackBar({
      color: 'green',
      name: VueEnv.Client
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    // in the build directory.
    // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
    new ManifestPlugin({
      fileName: path.join(
        getManifestPath(buildContext.environment, vunConfig),
        CLIENT_MANIFEST_FILE
      ),
      writeToFileEmit: isUniversal(vunConfig),
      filter: item => item.isChunk,
      generate(_, __, entrypoints) {
        return {
          js: entrypoints[CLIENT_ENTRY]
            .filter(file => file.endsWith('.js'))
            .map(file => webpackConfig.output?.publicPath + file)
          ,
          css: entrypoints[CLIENT_ENTRY]
            .filter(file => file.endsWith('.css'))
            .map(file => webpackConfig.output?.publicPath + file)
        }
      }
    })
  )

  IS_DEV
    ? modifyClientDevConfig(webpackConfig)
    : modifyClientProdConfig(webpackConfig)
}
