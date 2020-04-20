
import fs from 'fs-extra'
import path from 'path'
import vunConfig from './config'
import { getAssetsPath } from '../lib/utils'
import { CLIENT_ASSETS_MANIFEST } from '../lib/constants'
import { NODE_ENV } from '../helper/environment'

export interface Assets {
  [name: string]: {
    [ext: string]: string
  }
}

export function getAssets(): Assets {
  return fs.readJSONSync(path.resolve(
    getAssetsPath(NODE_ENV, vunConfig),
    CLIENT_ASSETS_MANIFEST
  ))
}
