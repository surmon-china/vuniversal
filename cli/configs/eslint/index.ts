import { Configuration } from 'webpack'
import { requireResolve } from '@cli/utils'
import { vunConfig } from '../vuniversal'

export function modifyEslintConfig(webpackConfig: Configuration) {
  const { lintOnSave } = vunConfig
  const hasTypeScript = !!vunConfig.typescript
  const baseExtensions = ['.js', '.jsx', '.vue']
  const extensions = hasTypeScript
    ? ['.ts', '.tsx', ...baseExtensions]
    : baseExtensions

  webpackConfig.module?.rules?.push({
    enforce: 'pre',
    test: /\.(vue|(j|t)sx?)$/,
    include: [vunConfig.dir.source],
    exclude: [/node_modules/],
    loader: requireResolve('eslint-loader'),
    options: {
      extensions,
      cache: true,
      // only emit errors in production mode.
      emitError: lintOnSave === 'error',
      emitWarning: lintOnSave === true || lintOnSave === 'warning'
    }
  })
}
