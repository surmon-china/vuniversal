import { Configuration } from 'webpack'
import { requireResolve } from '@cli/utils'
import { BuildContext } from '../webpack'
import vunConfig from '../vuniversal'

export function modifyEslintConfig(webpackConfig: Configuration, buildContext: BuildContext) {

  const { lintOnSave } = vunConfig
  const hasTypeScript = !!vunConfig.typescript
  const baseExtensions = ['.js', '.jsx', '.vue']
  const extensions = hasTypeScript
    ? [...baseExtensions, '.ts', '.tsx']
    : baseExtensions

  webpackConfig.module?.rules.unshift({
    enforce: 'pre',
    test: /\.(vue|(j|t)sx?)$/,
    include: [vunConfig.dir.source],
    exclude: [/node_modules/],
    use: [
      {
        loader: requireResolve('eslint-loader'),
        options: {
          extensions,
          cache: true,
          emitWarning: lintOnSave === true || lintOnSave === 'warning',
          // only emit errors in production mode.
          emitError: lintOnSave === 'error'
        }
      }
    ]
  })
}
