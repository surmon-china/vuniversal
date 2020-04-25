
// import path from 'path'
// import fs from 'fs-extra'
import webpack from 'webpack'
import logger from '../../services/logger'
import getWebpackConfig from '../../configs/webpack'
import { compileConfig, compilerToPromise } from '../../configs/webpack/helper'
import { NodeEnv, VueEnv } from '../../environment'

export default function startSSRServer() {

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Production })
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Production })

  const clientCompiler = compileConfig(clientConfig)
  const serverCompiler = compileConfig(serverConfig)

  clientCompiler.run((error: Error, stats: webpack.Stats) => {
    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }

    logger.info(`Compiled ${VueEnv.Client} done.`)
  })

  serverCompiler.run((error: Error, stats: webpack.Stats) => {
    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }

    logger.info(`Compiled ${VueEnv.Server} done.`)
  })

  Promise.all([
    compilerToPromise(clientCompiler, VueEnv.Client),
    compilerToPromise(serverCompiler, VueEnv.Server)
  ]).then(() => {
    logger.done(`Compiled successfully.`)
  }).catch(() => process.exit(1))
}
