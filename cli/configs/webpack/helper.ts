
import webpack, { Configuration } from 'webpack'
import logger from '@cli/services/logger'
import { VunEnvObject, VunLibConfig } from '../vuniversal'
import { VueEnv } from '@cli/environment'
import { FAILED_TO_COMPILE, FAILED_TO_BUNDLING, compiledSuccessfully, compiling } from '@cli/texts'
import { BuildContext } from '.'

export function isClientTarget(buildContext: BuildContext): boolean {
  return buildContext.target === VueEnv.Client
}

// Webpack compile in a try-catch
export function compileConfig(config: Configuration) {
  let compiler
  try {
    compiler = webpack(config)
  } catch (error) {
    logger.br()
    logger.error(FAILED_TO_COMPILE, error)
    process.exit(1)
  }
  return compiler
}

export function handleCompiler(successHandler: (stats: webpack.Stats) => void, name?: string) {
  return (error: Error, stats: webpack.Stats) => {
    if (error) {
      logger.br()
      logger.error(FAILED_TO_COMPILE, error)
      process.exit(1)
    }

    if (stats.hasErrors()) {
      logger.br()
      logger.errors(FAILED_TO_BUNDLING, stats.toJson().errors)
      process.exit(1)
    }

    logger.done(compiledSuccessfully(name))
    successHandler(stats)
  }
}

export function runPromise(compiler: webpack.Compiler, name?: string) {
  return new Promise((resolve) => {
    logger.start(compiling(name))
    compiler.run(handleCompiler(resolve, name))
  })
}

export function compilerToPromise(compiler: webpack.Compiler, name: string) {
  return new Promise((resolve, reject) => {
    compiler.hooks.done.tap(name, stats => {
      stats.hasErrors()
        ? reject(stats.toJson().errors)
        : resolve(stats)
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
