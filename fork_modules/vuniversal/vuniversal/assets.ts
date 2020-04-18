
import fs from 'fs-extra'
import { resolveClientAssetsManifest } from '../lib/constants'
// import { isDevEnv } from './environment'
import { getVunConfig } from './config'

export interface Assets {
  [name: string]: {
    [ext: string]: string
  }
}

// TODO: 也可以在 mfs 中拿到，如果 mfs 则生产开发需要区分开
export function getAssets(): Assets {
  return {
    client: {
      js: 'http://localhost:3001/vun/js/bundle.js'
    }
  }
  const vunConfig = getVunConfig()
  // 生产和开发用的同一份文件
  const assetsPath = resolveClientAssetsManifest(vunConfig.dir.build)
  return fs.readJSONSync(assetsPath)
}
