import { resolveAppRoot, resolveVunRoot } from '../../paths'

export const appPackageJSON = require(resolveAppRoot('package.json'))
export const vunPackageJSON = require(resolveVunRoot('package.json'))
