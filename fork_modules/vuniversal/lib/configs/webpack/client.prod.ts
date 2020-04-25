import webpack, { Configuration } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
// import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { getClientBuildPath } from '../../paths'
import vunConfig from '../vuniversal'

export default function modifyClientProdConfig(webpackConfig: Configuration): void {

  const clientBuildPath = getClientBuildPath(vunConfig)

  // Specify the client output directory and paths. Notice that we have
  // changed the publiPath to just '/' from http://localhost:3001. This is because
  // we will only be using one port in production.
  webpackConfig.output = {
    path: clientBuildPath,
    publicPath: vunConfig.build.publicPath,
    filename: `${vunConfig.build.assetsDir}/js/bundle.[chunkhash:8].js`,
    chunkFilename: `${vunConfig.build.assetsDir}/js/[name].[chunkhash:8].chunk.js`,
    libraryTarget: 'var'
  }

  webpackConfig.plugins?.push(
    new CopyWebpackPlugin([
      { from: vunConfig.dir.public, to: clientBuildPath }
    ]),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  )

  webpackConfig.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want uglify-js to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        // @todo add flag for sourcemaps
        sourceMap: true,
      }),
      /*
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: require('postcss-safe-parser'),
          // @todo add flag for sourcemaps
          map: {
            // `inline: false` forces the sourcemap to be output into a
            // separate file
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
