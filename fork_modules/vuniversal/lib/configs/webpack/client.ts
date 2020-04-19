import path from 'path'
import { Configuration } from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import { NodeEnv } from '../../environment'
import { VunConfig } from '../vuniversal'
import { CLIENT_ASSETS_MANIFEST, VUN_DEV_FOLDER_PATH, CLIENT_CHUNKS_MANIFEST } from '../../constants'
import { BuildContext } from '.'
import modifyClientDevConfig from './clien.dev'
import modifyClientProdConfig from './client.prod'

export default function modifyClientConfig(config: Configuration, buildContext: BuildContext, vunConfig: VunConfig): void {
  const IS_DEV = buildContext.environment === NodeEnv.Development
  const IS_UNIVERSAL = vunConfig.universal !== false
  const IS_DEV_UNIVERSAL = IS_DEV && IS_UNIVERSAL

  config.plugins = [
    ...(config.plugins || []),
    // Output our JS and CSS files in a manifest file called assets.json
    // in the build directory.
    new AssetsPlugin({
      path: IS_DEV_UNIVERSAL
        ? VUN_DEV_FOLDER_PATH
        : vunConfig.dir.build,
      filename: CLIENT_ASSETS_MANIFEST,
      prettyPrint: IS_DEV,
      keepInMemory: !IS_UNIVERSAL && !IS_DEV
    }),
    // Output our JS and CSS files in a manifest file called chunks.json
    // in the build directory.
    // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
    new ManifestPlugin({
      fileName: path.resolve(
        IS_DEV_UNIVERSAL
          ? VUN_DEV_FOLDER_PATH
          : vunConfig.dir.build,
        CLIENT_CHUNKS_MANIFEST
      ),
      writeToFileEmit: IS_DEV_UNIVERSAL,
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
