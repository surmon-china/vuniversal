import path from 'path'
import { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import ManifestPlugin from 'webpack-manifest-plugin'
import { vunConfig } from '../vuniversal'
import { modifyClientDevConfig } from './clien.dev'
import { modifyClientProdConfig } from './client.prod'
import { VueEnv, isDev, isUniversal } from '@cli/environment'
import { CLIENT_ENTRY, CLIENT_MANIFEST_FILE, getManifestDir, getClientBuildDir } from '@cli/paths'
import { resolveEntry } from '@cli/utils'
import { autoChunkHash } from './helper'
import { BuildContext } from '.'

export function modifyClientConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)
  const clientBuildDir = getClientBuildDir(vunConfig)

  // TODO: morden
  // isLegacyBundle ? '[name]-legacy.js' : '[name].js'
  // const outputFilename = getAssetPath(
  //   options,
  //   `js/[name]${isLegacyBundle ? `-legacy` : ``}${isProd && options.filenameHashing ? '.[contenthash:8]' : ''}.js`

  // specify our client entry point src/client
  webpackConfig.entry = {
    [CLIENT_ENTRY]: [resolveEntry(vunConfig.clientEntry, VueEnv.Client)]
  }

  // Specify the client output directory and paths.
  webpackConfig.output = {
    path: clientBuildDir,
    publicPath: vunConfig.build.publicPath,
    filename: `${vunConfig.build.assetsDir}/js/[name]${autoChunkHash(vunConfig)}.js`,
    chunkFilename: `${vunConfig.build.assetsDir}/js/[name]${autoChunkHash(vunConfig)}.js`
  }

  webpackConfig.node = false
  webpackConfig.optimization = {
    ...webpackConfig.optimization,
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }

  webpackConfig.plugins?.push(
    new WebpackBar({
      color: 'green',
      name: VueEnv.Client
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    // in the build directory.
    // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
    // @ts-ignore
    new ManifestPlugin({
      fileName: path.join(
        getManifestDir(buildContext.environment, vunConfig),
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
