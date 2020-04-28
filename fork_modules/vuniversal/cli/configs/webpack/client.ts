import path from 'path'
import { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import ManifestPlugin from 'webpack-manifest-plugin'
import vunConfig from '../../../base/config'
import modifyClientDevConfig from './clien.dev'
import modifyClientProdConfig from './client.prod'
import { VueEnv, isDev, isUniversal } from '../../../base/environment'
import { CLIENT_ENTRY, CLIENT_MANIFEST_FILE, getManifestPath } from '../../../base/paths'
import { BuildContext } from '.'

export default function modifyClientConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)

  // specify our client entry point /client/index.js
  webpackConfig.entry = {
    [CLIENT_ENTRY]: [vunConfig.clientEntry]
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
