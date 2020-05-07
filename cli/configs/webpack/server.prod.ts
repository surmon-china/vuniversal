
import webpack, { Configuration } from 'webpack'
import { SERVER_JS_FILE, getServerBuildPath } from '@cli/paths'
import vunConfig from '../vuniversal'

export function modifyServerProdConfig(webpackConfig: Configuration): void {
  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    path: getServerBuildPath(vunConfig),
    publicPath: '/',
    filename: SERVER_JS_FILE,
    libraryTarget: 'commonjs2'
  }

  webpackConfig.plugins?.push(
    // Prevent creating multiple chunks for the server
    // TODO: !!!
    new webpack.optimize.LimitChunkCountPlugin({
      // maxChunks: 1,
    })
    // TODO: 为生成的文件头部添加 banner（包含 vuniversal 信息）
    // new webpack.BannerPlugin(banner)
  )
}