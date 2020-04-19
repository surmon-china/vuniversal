
import webpack, { Configuration } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/dist/plugin'
import { VunConfig } from '../vuniversal'
import { NodeEnv, VueEnv } from '../../environment'
import getBabelOptions from '../babel'
import modifyClientConfig from './client'
import modifyServerConfig from './server'
import { VUN_NODE_MODULES_PATH, VUN_ASSETS_FOLDER } from '../../constants'
import { transformToProcessEnvObject } from './helper'

export interface BuildContext {
  target: VueEnv
  environment: NodeEnv
}

// TODO: 好东西！！ https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js

// This is the Webpack configuration factory. It's the juice!
export default function getWebpackConfig(buildContext: BuildContext, vunConfig: VunConfig): Configuration {

  // Define some useful shorthands.
  const IS_SERVER = buildContext.target === VueEnv.Server
  const IS_CLIENT = buildContext.target === VueEnv.Client
  const IS_DEV = buildContext.environment === NodeEnv.Development

  // This is our base webpack config.
  const config: Configuration = {
    // Set webpack mode:
    mode: IS_DEV ? NodeEnv.Development : NodeEnv.Production,
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target: IS_SERVER ? 'node' : 'web',
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // Logging
    // TODO: REMOVE when webpack5
    // @ts-ignore
    infrastructureLogging: {
      level: 'info'
    },
    // We need to tell webpack how to resolve both Razzle's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', ...vunConfig.dir.modules],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json', '.vue']
    },
    resolveLoader: {
      modules: [VUN_NODE_MODULES_PATH, ...vunConfig.dir.modules]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.vue$/,
          loader: require.resolve('vue-loader')
        },
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          // TODO: TS 或许也是需要独立的
          // options: { appendTsSuffixTo: [/\.vue$/] }
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
            name: `${VUN_ASSETS_FOLDER}/media/[name].[hash:8].[ext]`,
            emitFile: IS_CLIENT
          }
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: `${VUN_ASSETS_FOLDER}/image/[name].[hash:8].[ext]`,
            emitFile: IS_CLIENT
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      // @ts-ignore
      new VueLoaderPlugin(),
      // Define environment vars
      // We define environment variables that can be accessed globally in our
      new webpack.DefinePlugin(transformToProcessEnvObject({
        ...vunConfig.env,
        NODE_ENV: buildContext.environment,
        VUE_ENV: buildContext.target
      }))
    ],
    watchOptions: {
      // Webpack 5
      // ignored: ['files/**/*.js', 'node_modules/**']
      // Webpack 4
      ignored: /node_modules/
    }
  }

  if (IS_CLIENT) {
    modifyClientConfig(config, buildContext, vunConfig)
  }

  if (IS_SERVER) {
    modifyServerConfig(config, buildContext, vunConfig)
  }

  // Apply vun plugins, if they are present in vun.config.js
  // Check if vun.config has a modify function. If it does, call it on the
  // configs we created.
  if (typeof vunConfig.webpack === 'function') {
    vunConfig.webpack(config, buildContext)
  }

  return config
}
