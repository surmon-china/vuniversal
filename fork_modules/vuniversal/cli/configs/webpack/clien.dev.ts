import webpack, { Configuration } from 'webpack'

export function modifyClientDevConfig(webpackConfig: Configuration): void {
  // Add client-only development plugins
  webpackConfig.plugins?.push(
    new webpack.HotModuleReplacementPlugin()
  )
}
