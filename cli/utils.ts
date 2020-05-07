
import fs from 'fs'
import logger from './services/logger'
import { resolveAppRoot, resolveVunRoot } from './paths'

export const isWindows = process.platform === 'win32'

export const command = process.argv.slice(2).join(' ')
export const args = process.argv.slice(3)

export const appPackageJSON = require(resolveAppRoot('package.json'))
export const vunPackageJSON = require(resolveVunRoot('package.json'))

export function findExistingFile(files: string[]): any {
  for (const file of files) {
    if (fs.existsSync(resolveAppRoot(file))) {
      return file
    }
  }
}

export function requireResolve(file: string): string {
  try {
    return require.resolve(file)
  } catch (error) {
    logger.error(error.message, error)
    process.exit(1)
  }
}
