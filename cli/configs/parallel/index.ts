import { RuleSetRule } from 'webpack'
import { requireResolve } from '@cli/utils'
import { VunLibConfig } from '../vuniversal'

export function enableParallel(vunConfig: VunLibConfig) {
  return !!vunConfig.build.parallel
}
export function isNumberParallel(vunConfig: VunLibConfig) {
  return typeof vunConfig.build.parallel === 'number'
}

export function getThreadLoader(vunConfig: VunLibConfig): RuleSetRule {
  return !enableParallel(vunConfig) ? {} : {
    loader: requireResolve('thread-loader'),
    options: isNumberParallel(vunConfig)
      ? { workers: vunConfig.build.parallel }
      : {}
  }
}