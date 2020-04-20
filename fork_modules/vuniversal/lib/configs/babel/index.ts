
import fs from 'fs-extra'
import { VunConfig } from '../vuniversal'
import { BuildContext } from '../webpack'
import { NodeEnv, APP_BABEL_RC_PATH } from '../../constants'

export default function getBabelOptions(buildContext: BuildContext, vunConfig: VunConfig) {
  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-razzle.
  const hasBabelRc = fs.existsSync(APP_BABEL_RC_PATH)
  const mainBabelOptions = {
    babelrc: hasBabelRc,
    cacheDirectory: true,
    presets: [] as any[],
    plugins: [] as any[]
  }

  // TODO: 这个检验不严格，还有 bable.config.js
  if (!hasBabelRc) {
    mainBabelOptions.presets.push(require.resolve('@babel/preset-env'))
    mainBabelOptions.plugins.push(require.resolve('@babel/plugin-transform-runtime'))

    if (buildContext.environment === NodeEnv.Test) {
      mainBabelOptions.plugins.push([
        // Compiles import() to a deferred require()
        require.resolve('babel-plugin-dynamic-import-node'),
        // Transform ES modules to commonjs for Jest support
        [
          require.resolve('@babel/plugin-transform-modules-commonjs'),
          { loose: true }
        ]
      ])
    }
  }

  // Allow app to override babel options
  const babelOptions = vunConfig.babel
    ? vunConfig.babel(mainBabelOptions)
    : mainBabelOptions

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root');
  }

  return babelOptions
}
