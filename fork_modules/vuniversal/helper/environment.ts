/**
 * @file Environment
 * @module environment
 * @author Surmon <https://github.com/surmon-china>
 */

import { VueEnv, isDev, isProd, isTest } from '../lib/environment'
export { VueEnv, NodeEnv } from '../lib/environment'

export const NODE_ENV = process.env.NODE_ENV
export const isDevEnv = isDev()
export const isProdEnv = isProd()
export const isTestEnv = isTest()

export const VUE_ENV = process.env.VUE_ENV
export const isClient = process.env.VUE_ENV === VueEnv.Client
export const isServer = process.env.VUE_ENV === VueEnv.Server
