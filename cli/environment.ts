import { VunLibConfig } from './configs/vuniversal'

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

export function isUniversal(vunConfig: VunLibConfig): boolean {
  return vunConfig.universal !== false
}

export function isDev(environment: NodeEnv): boolean {
  return environment === NodeEnv.Development
}

export function isProd(environment: NodeEnv): boolean {
  return environment === NodeEnv.Production
}

export function isTest(environment: NodeEnv): boolean {
  return environment === NodeEnv.Test
}

export function isClientTarget(target: VueEnv): boolean {
  return target === VueEnv.Client
}

export function isServerTarget(target: VueEnv): boolean {
  return target === VueEnv.Server
}
