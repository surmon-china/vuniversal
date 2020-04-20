
import webpack, { Configuration } from 'webpack'
import { VunConfig } from '../vuniversal'

export default function modifyServerProdConfig(webpackConfig: Configuration, vunConfig: VunConfig): void {

  webpackConfig.entry = {
    server: vunConfig.serverEntry
  }

  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    ...webpackConfig.output,
    publicPath: '/'
  }

  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      // maxChunks: 1,
    })
    // TODO: 为生成的文件头部添加 banner（包含 vuniversal 信息）
    // new webpack.BannerPlugin(banner)
  ]
}
