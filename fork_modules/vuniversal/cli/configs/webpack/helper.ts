
import webpack, { Configuration } from 'webpack'
import logger from '../../services/logger'
import { VunEnvObject } from '../../../base/config'
import { VueEnv } from '../../../base/environment'
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

export function getDevServerUrl(host: string, port: number): string {
  return `http://${host}:${port}`
}

export function getAssetsServerPort(port: number): number {
  return port + 1
}

export function getAssetsServerUrl(host: string, port: number): string {
  return `http://${host}:${getAssetsServerPort(port)}`
}
