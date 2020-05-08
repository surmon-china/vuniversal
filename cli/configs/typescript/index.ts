
import path from 'path'
import { Configuration } from 'webpack'
import { Options as TsLoaderOptions } from 'ts-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import logger from '@cli/services/logger'
import { requireResolve } from '@cli/utils'
import { isProd, isClientTarget } from '@cli/environment'
import { BuildContext } from '../webpack'
import { getBabelLoader } from '../babel'
import { enableParallel, getThreadLoader } from '../parallel'
import { vunConfig } from '../vuniversal'

// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-typescript/index.js
export function modifyTypeScriptConfig(webpackConfig: Configuration, buildContext: BuildContext) {
  const IS_PROD = isProd(buildContext.environment)
  const IS_CLIENT = isClientTarget(buildContext.target)

  // Threads
  const useThreads = IS_PROD && enableParallel(vunConfig)

  // ts-loader
  const vunTsLoaderOptions = typeof vunConfig.typescript === 'object'
    ? vunConfig.typescript.tsLoader
    : {}
  const tsLoader = {
    loader: requireResolve('ts-loader'),
    options: {
      transpileOnly: true,
      experimentalWatchApi: true,
      appendTsSuffixTo: [/\.vue$/],
      // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
      happyPackMode: useThreads,
      ...vunTsLoaderOptions
    } as TsLoaderOptions
  }

  // loaders
  webpackConfig.resolve?.extensions?.unshift('.ts', '.tsx')
  webpackConfig.module?.rules?.unshift({
    test: /\.(ts|tsx)$/,
    include: [vunConfig.dir.source],
    exclude: [/node_modules/],
    use: [
      getBabelLoader(vunConfig),
      tsLoader,
      getThreadLoader(vunConfig)
    ]
  })

  // ForkTsChecker
  const enableForkTsChecker = (
    typeof vunConfig.typescript === 'object' &&
    !!vunConfig.typescript.forkTsChecker
  )
  // 是不是服务端拥有更完整的代码
  // 服务端和客户端大部分代码是重合的，但是运行了两个实例，也就是说同样的错误会报两遍
  // TODO: confirm client universal
  if (IS_CLIENT && enableForkTsChecker) {
    const vunForkTsCheckerOptions = (
      typeof vunConfig.typescript === 'object' &&
      typeof vunConfig.typescript.forkTsChecker === 'object'
    ) ? vunConfig.typescript.forkTsChecker : {}

    webpackConfig.plugins?.unshift(
      new ForkTsCheckerWebpackPlugin({
        // TODO: 不知道该咋办
        // eslint: true,
        // eslintOptions: {},
        logger,
        formatter: 'codeframe',
        // sync when IS_PROD
        // async: !IS_PROD,
        // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
        checkSyntacticErrors: useThreads,
        vue: {
          // https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-typescript/index.js#L82
          enabled: true,
          compiler: requireResolve(path.resolve(__dirname, 'compiler.shim'))
        },
        ...vunForkTsCheckerOptions
      })
    )
  }
}
