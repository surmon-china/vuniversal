import webpack, { Configuration } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
// import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { getClientBuildPath } from '../../paths'
import { getTerserConfig } from '../terser'
import vunConfig from '../vuniversal'

export function modifyClientProdConfig(webpackConfig: Configuration): void {
  const clientBuildPath = getClientBuildPath(vunConfig)

  webpackConfig.plugins?.push(
    new webpack.optimize.AggressiveMergingPlugin(),
    new CopyWebpackPlugin([
      { from: vunConfig.dir.public, to: clientBuildPath }
    ]),
    new webpack.HashedModuleIdsPlugin({
      hashDigest: 'hex'
    }),
  )

  webpackConfig.optimization = {
    ...webpackConfig.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin(getTerserConfig(vunConfig)),
      /*
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: require('postcss-safe-parser'),
          // @todo add flag for sourcemaps
          map: {
            // `inline: false` forces the sourcemap to be output into a separate file
            inline: false,
            // `annotation: true` appends the sourceMappingURL to the end of
            // the css file, helping the browser find the sourcemap
            annotation: true
          }
        }
      })
      */
    ]
  }
}
