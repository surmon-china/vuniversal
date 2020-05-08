import { Configuration } from 'webpack'
import { requireResolve } from '@cli/utils'
import vunConfig from '../vuniversal'

export function modifyEslintConfig(webpackConfig: Configuration) {
  const { lintOnSave } = vunConfig
  const hasTypeScript = !!vunConfig.typescript
  const baseExtensions = ['.js', '.jsx', '.vue']
  const extensions = hasTypeScript
    ? ['.ts', '.tsx', ...baseExtensions]
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
          // TODO: CACHE
          // https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-eslint/index.js
          // cache: true,
          emitWarning: lintOnSave === true || lintOnSave === 'warning',
          // only emit errors in production mode.
          emitError: lintOnSave === 'error'
        }
      }
    ]
  })
}
