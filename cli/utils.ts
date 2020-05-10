import fs from 'fs'
import logger from './services/logger'
import { vunConfig } from './configs/vuniversal'
import { resolveAppRoot } from './paths'
import { VUN_COMMND } from './texts'
import { VueEnv } from './environment'

export const isWindows = process.platform === 'win32'

export const args = process.argv.slice(2)
export const command = [VUN_COMMND, ...args].join(' ')

export function findExistingFile(files: string[]): any {
  for (const file of files) {
    if (fs.existsSync(resolveAppRoot(file))) {
      return file
    }
  }
}

const removeError = (text: string) => text.replace('Error: ', '')
export function requireResolve(file: string): string {
  try {
    return require.resolve(file)
  } catch (error) {
    error.stack = removeError(error.stack)
    error.message = removeError(error.message)
    logger.error(error)
    process.exit(1)
  }
}

export function resolveEntry(file: string, target: VueEnv): string {
  try {
    return require.resolve(file)
  } catch (error) {
    error.stack = removeError(error.stack)
    error.message = removeError(error.message)
    if (target === VueEnv.Client && !vunConfig.universal) {
      // TODO: text
      logger.warn('你是不是没有指定正确的客户端入口：clientEntry')
    }
    if (vunConfig.universal) {
      // TODO: text
      logger.warn('你是不是没有指定正确的两端入口：clientEntry，或者说你应该确定一下自己确定要开发 SSR 应用吗，如果要的话两端入口分别是 client 和 server')
    }
    logger.error(error)
    process.exit(1)
  }
}
