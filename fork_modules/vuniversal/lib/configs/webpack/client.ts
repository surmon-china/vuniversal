import path from 'path'
import { Configuration } from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { VunConfig } from '../vuniversal'
import { BuildContext } from '.'
import modifyClientDevConfig from './clien.dev'
import modifyClientProdConfig from './client.prod'
import { CLIENT_ASSETS_MANIFEST, CLIENT_CHUNKS_MANIFEST } from '../../constants'
import { isDev, isUniversal, getAssetsPath } from '../../utils'

export default function modifyClientConfig(config: Configuration, buildContext: BuildContext, vunConfig: VunConfig): void {
  const IS_DEV = isDev(buildContext.environment)
  const IS_UNIVERSAL = isUniversal(vunConfig)
  const ASSETS_PATH = getAssetsPath(buildContext.environment, vunConfig)

  config.plugins = [
    ...(config.plugins || []),
    // TODO: 确定好作用，和下面的插件之间只留一个
    // Output our JS and CSS files in a manifest file called assets.json
    // in the build directory.
    new AssetsPlugin({
      path: ASSETS_PATH,
      filename: CLIENT_ASSETS_MANIFEST,
      prettyPrint: IS_DEV,
      // TODO:  确定如何工作
      keepInMemory: false
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    // in the build directory.
    // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
    new ManifestPlugin({
      fileName: path.resolve(ASSETS_PATH, CLIENT_CHUNKS_MANIFEST),
      writeToFileEmit: (IS_DEV && IS_UNIVERSAL) || !IS_DEV,
      // filter: item => item.isChunk,
      /*
      generate(seed, files) {
        const entrypoints = new Set()
        files.forEach(file =>
          // @ts-ignore
          (file.chunk?._groups || []).forEach(group => entrypoints.add(group))
        )
        // @ts-ignore
        const entries = [...entrypoints]
        const entryArrayManifest = entries.reduce((acc, entry) => {
          const name =
            (entry.options || {}).name || (entry.runtimeChunk || {}).name;
          const files = []
            .concat(
              // @ts-ignore
              ...(entry.chunks || []).map(
                // @ts-ignore
                chunk => chunk.files.map(
                  // @ts-ignore
                  path => config.output.publicPath + path
                )
              )
            )
            .filter(Boolean);
  
          // @ts-ignore
          const cssFiles = files.filter(item => item.includes('.css'))
          // @ts-ignore
          const jsFiles = files.filter(item => item.includes('.js'))
  
          return name
            ? {
                ...acc,
                [name]: {
                  css: cssFiles,
                  js: jsFiles,
                },
              }
            : acc
        }, seed)
        return entryArrayManifest
      }
    */
    })
  ]

  IS_DEV
    ? modifyClientDevConfig(config, vunConfig)
    : modifyClientProdConfig(config, vunConfig)
}
