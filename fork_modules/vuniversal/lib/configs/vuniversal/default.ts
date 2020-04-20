
import { VunConfig } from './type'

export const defaultConfig: VunConfig = {
  universal: true,
  clientEntry: 'src/client',
  serverEntry: 'src/server',
  env: {},
  dir: {
    build: 'dist',
    static: 'static',
    source: 'src',
    root: '.',
    modules: []
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
