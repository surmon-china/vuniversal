
import path from 'path'
import webpack, { Configuration } from 'webpack'
import mergeConfig from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/dist/plugin'
import vunConfig from '../../../base/config'
import getBabelOptions from '../babel'
import modifyClientConfig from './client'
import modifyServerConfig from './server'
import { modifyCssConfig } from '../css'
import { VUN_NODE_MODULES_PATH, CLIENT_MANIFEST_FILE } from '../../../base/paths'
import { transformToProcessEnvObject, getAssetsServerUrl } from './helper'
import { NodeEnv, VueEnv } from '../../../base/environment'
import { getManifestPath } from '../../../base/paths'

export interface BuildContext {
  target: VueEnv
  environment: NodeEnv
}
// TODO: 好东西！！ https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js

// This is the Webpack configuration factory. It's the juice!
export default function getWebpackConfig(buildContext: BuildContext): Configuration {

  // Define some useful shorthands.
  const IS_SERVER = buildContext.target === VueEnv.Server
  const IS_CLIENT = buildContext.target === VueEnv.Client
  const IS_DEV = buildContext.environment === NodeEnv.Development

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
    stats: IS_DEV ? 'none': 'verbose',
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // Logging
    // TODO: REMOVE when webpack5
    // @ts-ignore
    infrastructureLogging: {
      level: 'info'
    },
    // We need to tell webpack how to resolve both Vuniversal's node_modules and the users', so we use resolve.
    resolve: {
      modules: ['node_modules', VUN_NODE_MODULES_PATH, ...vunConfig.dir.modules],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json', '.vue'],
      alias: {
        '@': vunConfig.dir.source,
        '~': vunConfig.dir.source,
        'vue$': vunConfig.build.runtimeCompiler
          ? 'vue/dist/vue.esm.js'
          : 'vue/dist/vue.runtime.esm-bundler.js'
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.vue$/,
          loader: require.resolve('vue-loader'),
          options: {
            extractCSS: true
          }
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          // TODO: TS 需要独立
          options: { appendTsSuffixTo: [/\.vue$/] }
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: [vunConfig.dir.source],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelOptions(buildContext, vunConfig)
            }
          ]
        },
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx|mjs)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: `${vunConfig.build.assetsDir}/media/[name].[hash:8].[ext]`,
            emitFile: IS_CLIENT
          }
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: `${vunConfig.build.assetsDir}/image/[name].[hash:8].[ext]`,
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

  // modifyTypeScriptConfig

  modifyCssConfig(webpackConfig, buildContext)

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

  return webpackConfig
}
