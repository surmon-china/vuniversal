/**
 * @file Environment
 * @module environment
 * @author Surmon <https://github.com/surmon-china>
 */

export enum UniversalMode {
  SPA = 'spa',
  UNIVERSAL = 'universal'
}

export enum VueEnv {
  Client = 'client',
  Server = 'server'
}

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test'
}

export const isDev = () => process.env.NODE_ENV === NodeEnv.Development
export const isProd = () => process.env.NODE_ENV === NodeEnv.Production
export const isTest = () => process.env.NODE_ENV === NodeEnv.Test
