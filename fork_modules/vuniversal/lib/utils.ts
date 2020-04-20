
import { VunConfig } from './configs/vuniversal'
import { NodeEnv, VUN_DEV_FOLDER_PATH } from './constants'

export function isUniversal(vunConfig: VunConfig): boolean {
  return vunConfig.universal !== false
}

export function isDev(environment: NodeEnv): boolean {
  return environment === NodeEnv.Development
}

export function getAssetsPath(environment: NodeEnv, vunConfig: VunConfig): string {
  return isUniversal(vunConfig) && isDev(environment)
    ? VUN_DEV_FOLDER_PATH
    : vunConfig.dir.build
}
