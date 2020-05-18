import { Configuration } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { getClientBuildDir } from '@cli/paths'
import { getTerserConfig } from '../terser'
import { vunConfig } from '../vuniversal'

const TerserPlugin = require('terser-webpack-plugin')

export function modifyClientProdConfig(webpackConfig: Configuration): void {
  const clientBuildPath = getClientBuildDir(vunConfig)

  webpackConfig.plugins?.push(
    new CopyWebpackPlugin([
      { from: vunConfig.dir.public, to: clientBuildPath }
    ])
  )

  webpackConfig.optimization = {
    ...webpackConfig.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin(getTerserConfig(vunConfig))
    ]
  }
}
