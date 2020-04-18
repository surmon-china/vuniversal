
import { VunConfig } from '.'

export const defaultConfig: VunConfig = {
  universal: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  env: {},
  dir: {
    build: '.vun',
    static: 'static',
    source: 'src',
    root: '.',
    modules: ['node_modules']
  },
  dev: {
    host: 'localhost',
    port: 3000
  },
  build: {
    publicPath: '/',
  },
  // AUTO
  // typescript: {}
}
