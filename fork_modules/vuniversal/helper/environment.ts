/**
 * @file Environment
 * @module environment
 * @author Surmon <https://github.com/surmon-china>
 */

export enum VueEnv {
  Client = 'client',
  Server = 'server'
}

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

export const NODE_ENV = process.env.NODE_ENV as NodeEnv
export const isDev = NODE_ENV === NodeEnv.Development
export const isProd = NODE_ENV === NodeEnv.Production
export const isTest = NODE_ENV === NodeEnv.Test

export const VUE_ENV = process.env.VUE_ENV as VueEnv
export const isClient = VUE_ENV === VueEnv.Client
export const isServer = VUE_ENV === VueEnv.Server
