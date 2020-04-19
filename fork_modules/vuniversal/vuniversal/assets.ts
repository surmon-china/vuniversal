
import fs from 'fs-extra'
import path from 'path'
import { isDevEnv } from './environment'
import { getVunConfig } from './config'
import { CLIENT_ASSETS_MANIFEST, VUN_DEV_FOLDER_PATH } from '../lib/constants'

export interface Assets {
  [name: string]: {
    [ext: string]: string
  }
}

export function getAssets(): Assets {
  const vunConfig = getVunConfig()
  return fs.readJSONSync(path.resolve(
    isDevEnv ? VUN_DEV_FOLDER_PATH : vunConfig.dir.build,
    CLIENT_ASSETS_MANIFEST
  ))
}
