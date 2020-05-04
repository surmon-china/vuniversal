
import path from 'path'
import webpack, { Configuration } from 'webpack'
import mergeConfig from 'webpack-merge'
import { stringify } from 'javascript-stringify'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/dist/plugin'
import { APP_NODE_MODULES_PATH, VUN_NODE_MODULES_PATH, CLIENT_MANIFEST_FILE } from '@cli/paths'
import { NodeEnv, VueEnv, isServerTarget, isClientTarget, isDev } from '@cli/environment'
import { requireResolve } from '@cli/utils'
import { getManifestPath } from '@cli/paths'
import { getBabelLoader, getExcluder } from '../babel'
import { modifyTypeScriptConfig } from '../typescript'
import { getThreadLoader } from '../parallel'
import { modifyCSSConfig } from '../css'
import { modifyClientConfig } from './client'
import { modifyServerConfig } from './server'
import { transformToProcessEnvObject, getAssetsServerUrl, autoHash } from './helper'
import vunConfig from '../vuniversal'
import logger from '@cli/services/logger'

export interface BuildContext {
  target: VueEnv
  environment: NodeEnv
}
// TODO: 好东西！！ https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js

const genAssetSubPath = (dir: string) => {
  return path.posix.join(
    vunConfig.build.assetsDir,
    `${dir}/[name]${autoHash(vunConfig)}.[ext]`
  )
}

// This is the Webpack configuration factory. It's the juice!
export function getWebpackConfig(buildContext: BuildContext): Configuration {
  const IS_SERVER = isServerTarget(buildContext.target)
  const IS_CLIENT = isClientTarget(buildContext.target)
  const IS_DEV = isDev(buildContext.environment)

  const modules = [
    'node_modules',
    APP_NODE_MODULES_PATH,
    VUN_NODE_MODULES_PATH,
    ...vunConfig.dir.modules
  ]

  // This is our base webpack config.
  let webpackConfig: Configuration = {
    // Set webpack mode:
    mode: IS_DEV ? NodeEnv.Development : NodeEnv.Production,
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target: IS_SERVER ? 'node' : 'web',
    watch: IS_DEV,
    // Quite when dev
    stats: vunConfig.dev.verbose || !IS_DEV
      ? 'verbose'
      : 'none',
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV
      ? 'cheap-module-source-map'
      : vunConfig.build.productionSourceMap
        ? 'source-map'
        : false,
    // TODO: REMOVE when webpack5
    // infrastructureLogging: {
    //   level: 'info'
    // },
    // We need to tell webpack how to resolve both Vuniversal's node_modules and the users', so we use resolve.
    resolve: {
      modules,
      extensions: ['.js', '.jsx', '.mjs', '.json', '.vue'],
      alias: {
        '@': vunConfig.dir.source,
        '~': vunConfig.dir.source,
        // 'vue': vunConfig.build.runtimeCompiler
        //   ? '@vue/runtime-dom'
        //   : 'vue'
        // TODO: ESM 无法启用 HMR 啊
        // 'vue$': vunConfig.build.runtimeCompiler
        //   ? 'vue/dist/vue.runtime.esm-bundler.js'
        //   : 'vue/dist/vue.esm.js'
      }
    },
    resolveLoader: {
      modules
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.vue$/,
          loader: requireResolve('vue-loader'),
          options: {
            extractCSS: !!vunConfig.build.css.extract
          }
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [vunConfig.dir.source],
          exclude: [getExcluder(vunConfig)],
          use: [
            getBabelLoader(vunConfig),
            getThreadLoader(vunConfig)
          ]
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          loader: requireResolve('url-loader'),
          options: {
            limit: 10000,
            name: genAssetSubPath('image'),
            emitFile: IS_CLIENT
          }
        },
        // do not base64-inline SVGs.
        // https://github.com/facebookincubator/create-react-app/pull/1180
        {
          test: /\.(svg)(\?.*)?$/,
          loader: requireResolve('file-loader'),
          options: {
            name: genAssetSubPath('image'),
            emitFile: IS_CLIENT
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: requireResolve('url-loader'),
          options: {
            name: genAssetSubPath('media'),
            emitFile: IS_CLIENT
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          loader: requireResolve('url-loader'),
          options: {
            name: genAssetSubPath('fonts'),
            emitFile: IS_CLIENT
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      // @ts-ignore
      new VueLoaderPlugin(),
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin({ debug: false }),
      // Define environment vars
      // We define environment variables that can be accessed globally in our
      new webpack.DefinePlugin(transformToProcessEnvObject({
        ...vunConfig.env,
        NODE_ENV: buildContext.environment,
        VUE_ENV: buildContext.target,
        VUN_PUBLIC_DIR: vunConfig.dir.public,
        VUN_ASSETS_DIR: vunConfig.build.assetsDir,
        VUN_DEV_SERVER_URL: getAssetsServerUrl(vunConfig.dev.host, vunConfig.dev.port),
        VUN_SSR_TEMPLATE: vunConfig.template,
        VUN_CLIENT_MANIFEST: path.join(
          getManifestPath(buildContext.environment, vunConfig),
          CLIENT_MANIFEST_FILE
        )
      }))
    ],
    watchOptions: {
      // Webpack 5
      // ignored: ['files/**/*.js', 'node_modules/**']
      // Webpack 4
      ignored: /node_modules/
    }
  }

  modifyTypeScriptConfig(webpackConfig, buildContext)
  modifyCSSConfig(webpackConfig, buildContext)

  if (IS_CLIENT) {
    modifyClientConfig(webpackConfig, buildContext)
  }

  if (IS_SERVER) {
    modifyServerConfig(webpackConfig, buildContext)
  }

  // Apply vun plugins, if they are present in vun.config.js
  // Check if vun.config has a modify function. If it does, call it on the
  // configs we created.
  if (vunConfig.webpack) {
    if (typeof vunConfig.webpack === 'function') {
      const response = vunConfig.webpack(webpackConfig, buildContext)
      if (response) {
        webpackConfig = mergeConfig(webpackConfig, response)
      }
    } else {
      webpackConfig = mergeConfig(webpackConfig, vunConfig.webpack)
    }
  }

  // Inspect
  if (vunConfig.inspect) {
    const { highlight } = require('cli-highlight')
    const inspectConfig = {
      ...webpackConfig,
      // @ts-ignore
      plugins: webpackConfig?.plugins?.map(plugin => plugin.constructor?.name)
    }
    logger.info('Inspect webpack config')
    logger.br()
    logger.log(highlight(stringify(inspectConfig, null, 2), { language: 'js' }))
    logger.br()
  }

  return webpackConfig
}
