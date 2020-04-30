
import webpack, { Configuration } from 'webpack'
import logger from '../../services/logger'
import { VunEnvObject, VunLibConfig } from '../vuniversal'
import { VueEnv } from '../../environment'
import { BuildContext } from '.'

export function isClientTarget(buildContext: BuildContext): boolean {
  return buildContext.target === VueEnv.Client
}

// Webpack compile in a try-catch
export function compileConfig(config: Configuration) {
  let compiler
  try {
    compiler = webpack(config)
  } catch (e) {
    logger.errors('Failed to compile.', [e])
    process.exit(1)
  }
  return compiler
}

export function runPromise(compiler: webpack.Compiler, name: string = '') {
  return new Promise((resolve, reject) => {
    compiler.run((error: Error, stats: webpack.Stats) => {
      if (error) {
        logger.error('Failed to compile.', error)
        reject(error)
        return
      }

      if (stats.hasErrors()) {
        const errors = stats.toJson().errors
        logger.errors('Failed to bundling.', errors)
        reject(errors)
        return
      }

      logger.done(`Compiled ${name} successfully.`)
      resolve(stats)
      return
    })
  }).catch(() => process.exit(1))
}

export function compilerToPromise(compiler: webpack.Compiler, name: string) {
  return new Promise((resolve, reject) => {
      // compiler.hooks.compile.tap(name, () => {
      //   logger.start(`${name} compiling...`)
      // })
      compiler.hooks.done.tap(name, stats => {
        if (!stats.hasErrors()) {
          return resolve(stats)
        }
        return reject(stats)
      })
  })
}

export function stringifyEnvObject(envObject: VunEnvObject): VunEnvObject {
  const codeValueObject: VunEnvObject = {}
  Object.keys(envObject).forEach(key => {
    codeValueObject[key] = JSON.stringify(envObject[key])
  })
  return codeValueObject
}

export function transformToProcessEnvObject(envObject: VunEnvObject): VunEnvObject {
  return {
    'process.env': stringifyEnvObject(envObject)
  }
}

export function autoHash(vunConfig: VunLibConfig) {
  return vunConfig.build.filenameHashing ? '.[hash:8]' : ''
}

export function autoContentHash(vunConfig: VunLibConfig) {
  return vunConfig.build.filenameHashing ? '.[contenthash:8]' : ''
}

export function autoChunkHash(vunConfig: VunLibConfig) {
  return vunConfig.build.filenameHashing ? '.[chunkhash:8]' : ''
}

export function getDevServerUrl(host: string, port: number): string {
  return `http://${host}:${port}`
}

export function getAssetsServerPort(port: number): number {
  return port + 1
}

export function getAssetsServerUrl(host: string, port: number): string {
  return `http://${host}:${getAssetsServerPort(port)}`
}
