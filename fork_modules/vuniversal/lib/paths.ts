import fs from 'fs'
import path from 'path'
import { NodeEnv, isDev, isUniversal } from './environment'
import { VunLibConfig } from './configs/vuniversal'

// ---------------------------------------------------------
// Make sure any symlinks in the project folder are resolved
export const APP_ROOT_DIRECTORY_PATH = fs.realpathSync(process.cwd())
export const resolveAppRoot = (relativePath: string): string => {
  return path.resolve(APP_ROOT_DIRECTORY_PATH, relativePath)
}
export const APP_BABEL_RC_PATH = resolveAppRoot('.babelrc')
export const APP_VUN_CONFIG_PATH = resolveAppRoot('vun.config.js')
export const APP_PACKAGE_JSON_PATH = resolveAppRoot('package.json')
export const APP_JS_CONFIG_PATH = resolveAppRoot('jsconfig.json')
export const APP_TS_CONFIG_PATH = resolveAppRoot('tsconfig.json')

// ---------------------------------------------------------
// Vun constants
export const resolveVunRoot = (relativePath: string): string => {
  return path.resolve(__dirname, '..', relativePath)
}
export const VUN_NAME = 'Vuniversal'
export const VUN_ROOT_PATH = resolveVunRoot('.')
export const VUN_NODE_MODULES_PATH = resolveVunRoot('node_modules')
export const VUN_DEFAULT_HTML_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'index.html')
export const VUN_DEV_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'dev.html')
export const VUN_DEV_CACHE_PATH = resolveVunRoot('.vun')

// ---------------------------------------------------------
// Butid time constants
export const SERVER_JS_FILE = 'server.js'
export const CLIENT_ENTRY = 'client'
export const SERVER_ENTRY = 'server'
export const CLIENT_MANIFEST_FILE = 'client.manifest.json'
export const SERVER_MANIFEST_FILE = 'server.manifest.json'

// Butid time paths
// TODO: REMOVE
export function getBuildPath(environment: NodeEnv, vunConfig: VunLibConfig): string {
  return isDev(environment) && isUniversal(vunConfig)
    ? VUN_DEV_CACHE_PATH
    : vunConfig.dir.build
}

export function getServerBuildPath(vunConfig: VunLibConfig): string {
  return path.join(vunConfig.dir.build, SERVER_ENTRY)
}

export function getClientBuildPath(vunConfig: VunLibConfig): string {
  return isUniversal(vunConfig)
    ? path.join(vunConfig.dir.build, CLIENT_ENTRY)
    : vunConfig.dir.build
}

export function getManifestPath(environment: NodeEnv, vunConfig: VunLibConfig): string {
  return isDev(environment)
    ? VUN_DEV_CACHE_PATH
    : isUniversal(vunConfig)
      ? getServerBuildPath(vunConfig)
      : vunConfig.dir.build
}

// ---------------------------------------------------------
// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
export const NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(APP_ROOT_DIRECTORY_PATH, folder))
  .join(path.delimiter)

export const NODE_PATHS = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveAppRoot)
