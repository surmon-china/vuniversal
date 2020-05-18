
import path from 'path'
import { Configuration } from 'webpack'
import { Options as TsLoaderOptions } from 'ts-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { requireResolve } from '@cli/utils'
import { isProd, isClientTarget } from '@cli/environment'
import { BuildContext } from '../webpack'
import { getBabelLoader } from '../babel'
import { enableParallel, getThreadLoader } from '../parallel'
import { vunConfig } from '../vuniversal'
import logger from '@cli/services/logger'

// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-typescript/index.js
export function modifyTypeScriptConfig(webpackConfig: Configuration, buildContext: BuildContext) {
  const IS_PROD = isProd(buildContext.environment)
  const IS_CLIENT = isClientTarget(buildContext.target)

  // Threads
  const useThreads = IS_PROD && enableParallel(vunConfig)

  // ts-loader
  webpackConfig.resolve?.extensions?.unshift('.ts', '.tsx')
  webpackConfig.module?.rules?.unshift({
    test: /\.(ts|tsx)$/,
    include: [vunConfig.dir.source],
    exclude: [/node_modules/],
    use: [
      getBabelLoader(vunConfig, buildContext),
      {
        loader: requireResolve('ts-loader'),
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
          appendTsSuffixTo: [/\.vue$/],
          // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
          happyPackMode: useThreads,
          ...(
            typeof vunConfig.typescript === 'object'
              ? vunConfig.typescript.tsLoader
              : {}
          )
        } as TsLoaderOptions
      },
      getThreadLoader(vunConfig)
    ]
  })

  // ForkTsChecker
  const enableForkTsChecker = (
    typeof vunConfig.typescript === 'object' &&
    !!vunConfig.typescript.forkTsChecker
  )
  // 服务端和客户端大部分代码是重合的，但是运行了两个实例，也就是说同样的错误会报两遍
  if (IS_CLIENT && enableForkTsChecker) {
    const vunForkTsCheckerOptions = (
      typeof vunConfig.typescript === 'object' &&
      typeof vunConfig.typescript.forkTsChecker === 'object'
    ) ? vunConfig.typescript.forkTsChecker : {}

    webpackConfig.plugins?.push(
      new ForkTsCheckerWebpackPlugin({
        // Not friendly & duplicate with eslint-loader
        // eslint: !!vunConfig.lintOnSave,
        logger,
        // Disable logger
        silent: true,
        // Emit errors to webpack: https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options
        async: false,
        formatter: 'codeframe',
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
