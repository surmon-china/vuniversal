
import path from 'path'
// import fs from 'fs-extra'
// import { vol } from 'memfs'
import { vol } from 'memfs'
import cluster from 'cluster'
import WebpackDevServer from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
// import StartServerPlugin from 'start-server-webpack-plugin'
import logger from '../../utils/logger'
import { VunConfig } from '../../configs/vuniversal'
import getWebpackConfig from '../../configs/webpack'
import { NodeEnv, VueEnv } from '../../environment'
import { getDefaultDevServerConfig } from '../../configs/webpack/base'
// import { VUN_DEV_TEMPLATE_PATH } from '../../constants'
import { VUN_DEV_TEMPLATE_PATH, SERVER_JS_NAME } from '../../constants'
import { compileConfig, compilerToPromise, getAssetsServerPort, getDevServerUrl } from '../../configs/webpack/helper'
// import { args } from '../../arguments'

export default function startSSRServer(vunConfig: VunConfig) {

  const assetsServerPost = getAssetsServerPort(vunConfig.dev.port)
  const assetsServerUrl = getDevServerUrl(vunConfig.dev.host, assetsServerPost)

  const clientConfig = getWebpackConfig({ target: VueEnv.Client, environment: NodeEnv.Development }, vunConfig)
  const serverConfig = getWebpackConfig({ target: VueEnv.Server, environment: NodeEnv.Development }, vunConfig)

  if (clientConfig.output) {
    // chunks url & socket url host & hot-upload url
    clientConfig.output.publicPath = assetsServerUrl + '/'
  }
  if (serverConfig.output) {
    // 3001?
    serverConfig.output.publicPath = assetsServerUrl
    serverConfig.output.filename = SERVER_JS_NAME
  }

  clientConfig.plugins?.push(new HtmlWebpackPlugin({
    template: VUN_DEV_TEMPLATE_PATH,
    inject: false
  }) as any)

  /*
  // Auro run ssr server when build done.
  const StartServerPlugin = require('./start')
  serverConfig.plugins?.push(new StartServerPlugin({
    // https://github.com/ericclemmons/start-server-webpack-plugin/blob/master/src/StartServerPlugin.js#L110
    // TODO: TEST 这里的名字需要约束与 bound name 保持一致
    name: SERVER_JS_NAME,
    // Capture any --inspect or --inspect-brk flags (with optional values) so that we
    // can pass them when we invoke nodejs
    nodeArgs: args || [],
    keyboard: true
  }))
  */

  const clientCompiler = compileConfig(clientConfig)
  const devServerConfig: WebpackDevServer.Configuration = {
    ...getDefaultDevServerConfig(vunConfig),
    port: assetsServerPost,
    historyApiFallback: false,
    open: false
  }
  // https://webpack.docschina.org/configuration/dev-server
  WebpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig)
  const clientServer = new WebpackDevServer(clientCompiler, devServerConfig)

  // TODO: 内存中好办
  const serverCompiler = compileConfig(serverConfig)
  // https://github.com/webpack/webpack-dev-middleware/blob/v4.0.0-rc.1/src/utils/setupOutputFileSystem.js#L3
  const mfs = vol
  // @ts-ignore
  global.mfs = vol
  // require('fs-monkey').patchRequire(mfs)
  // @ts-ignore
  serverCompiler.outputFileSystem = mfs
  serverCompiler.outputFileSystem.join = path.join.bind(path)
  serverCompiler.watch({ ignored: /node_modules/ }, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      // logger.log(stats.toString(serverConfig.stats))
      console.log('--------watch', stats.toString(serverConfig.stats))
      // const serverjs = mfs.readFileSync('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js', 'utf8').toString()
      // console.log('-------mfs', serverjs)
      // eval(serverjs)
      // patchRequire(mfs)
      // console.log('-------mfs', require('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js'))
      // TODO: 这里可以拿到内存中的文件 dosomething
      // https://www.namecheap.com/blog/production-ready-vue-ssr-in-5-simple-steps/
      // https://github.com/vuejs/vue-hackernews-2.0/blob/master/build/setup-dev-server.js#L80
      // https://github.com/Q-Angelo/web_front_end_frame#nodejs%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%AD%A3%E5%BC%8F%E7%8E%AF%E5%A2%83%E6%B8%B2%E6%9F%93
      //  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
      return
    }

    if (error) {
      logger.error('Failed to compile.', error)
    }

    if (stats.hasErrors()) {
      logger.errors('Failed to bundling.', stats.toJson().errors)
    }
  })

  // https://github.com/ericclemmons/start-server-webpack-plugin/blob/master/src/StartServerPlugin.js#L142
  let ssrDevworkers: cluster.Worker[] = []
  // serverCompiler.apply()
  serverCompiler.hooks.afterEmit.tapAsync('StartServer', (compilation, callback) => {
    // @ts-ignore
    console.log('--------听说 done 啦', !!compilation.compiler.outputFileSystem)

    const serverjs = mfs.readFileSync('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js', 'utf8').toString()
    // console.log('-------mfs', typeof serverjs)
    // console.log('-------cluster', path.join(__dirname, 'test.js'))

    // worker??
    cluster.setupMaster({
      // exec: compilation.assets[SERVER_JS_NAME].existsAt,
      exec: path.join(__dirname, 'test.js'),
      args: ['-e', serverjs]
      // execArgv: [`--eval="console.log('xzxczxc')"`]
    })
    cluster.on('online', worker => {
      console.log('-------cluster online', ssrDevworkers.length)
      ssrDevworkers.push(worker)

      const endpoint = ssrDevworkers.length - 2
      for (let index = 0; index < endpoint; index++) {
        ssrDevworkers[index].disconnect()
        ssrDevworkers.splice(1)
      }
    })
    cluster.fork()
    // const vm = require('vm')
    // new vm.Script(serverjs, { filename: 'server.js' }).runInNewContext()
    // ('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js')
    return callback()
  })

  Promise.all([
    compilerToPromise(clientCompiler, VueEnv.Client),
    compilerToPromise(serverCompiler, VueEnv.Server)
  ]).then(() => {
    console.log('-------promise done')
    clientServer.listen(assetsServerPost, vunConfig.dev.host, error => {
      if (error) {
        logger.br()
        logger.error('Dev server run failed: ', error)
      }
    })
  }).catch(error => {
    logger.error(`Failed to compile.`, error)
  })
}
