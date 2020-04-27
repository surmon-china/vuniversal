// import fs from 'fs-extra'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import getWebpackConfig from '../../configs/webpack'
import { getClientBuildPath } from '../../paths'
import { NodeEnv, VueEnv } from '../../environment'
import { compileConfig } from '../../configs/webpack/helper'
import vunConfig from '../../configs/vuniversal'
import logger from '../../services/logger'

export default function startSPAServer() {

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Production })

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    filename: path.resolve(getClientBuildPath(vunConfig), 'index.html'),
    // TODO: 假的
    // 如果我用了 html 模板，则将会导致 这里需要用函数，并且要引入 vue 进行 to string in 假 context 来做到，但应该是可以的
    template: vunConfig.template,
    chunks: 'all'
  }) as any)

  const clientCompiler = compileConfig(clientConfig)
  clientCompiler.run((error: Error, stats: webpack.Stats) => {
    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }

    logger.done(`Compiled ${VueEnv.Client} successfully.`)
  })
}
