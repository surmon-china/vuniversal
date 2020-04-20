import { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { VunConfig } from '../vuniversal'
import { NodeEnv, SERVER_JS_NAME } from '../../constants'
import { BuildContext } from '.'
import modifyServerDevConfig from './server.dev'
import modifyServerProdConfig from './server.prod'

export default function modifyServerConfig(webpackConfig: Configuration, buildContext: BuildContext, vunConfig: VunConfig): void {

  // Specify webpack Node.js output path and filename
  webpackConfig.output = {
    path: vunConfig.dir.build,
    // TODO: 生产环境不应该产出 server.js，应该有规则
    filename: SERVER_JS_NAME,
    libraryTarget: 'commonjs2'
  }

  // TODO: 待测试
  // We want to uphold node's __filename, and __dirname.
  webpackConfig.node = false
  // webpackConfig.node = {
  //   __console: false,
  //   __dirname: false,
  //   __filename: false,
  // }

  // We need to tell webpack what to bundle into our Node bundle.
  webpackConfig.externals = [
    nodeExternals({
      whitelist: [
        'webpack/hot/poll?100',
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/
      ]
    })
  ]

  buildContext.environment === NodeEnv.Development
    ? modifyServerDevConfig(webpackConfig, vunConfig)
    : modifyServerProdConfig(webpackConfig, vunConfig)
}
