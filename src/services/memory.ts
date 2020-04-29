/**
 * @file Memory storage
 * @module services/memory
 * @author Surmon <https://github.com/surmon-china>
 */

const getCachePool = (): any => {
  const global = window as any
  global.appCache = global.appCache || {}
  return global.appCache
}

export const get = (key: string) => getCachePool()[key]
export const has = (key: string) => get(key) !== undefined
export const set = (key: string, data: any) => {
  getCachePool()[key] = data
}
