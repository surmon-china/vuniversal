import { RuleSetLoader } from 'webpack'
import { VunLibConfig } from '../vuniversal'

export function enableParallel(vunConfig: VunLibConfig) {
  return !!vunConfig.build.parallel
}
export function isNumberParallel(vunConfig: VunLibConfig) {
  return typeof vunConfig.build.parallel === 'number'
}

export function getThreadLoader(vunConfig: VunLibConfig): RuleSetLoader {
  return !enableParallel(vunConfig) ? {} : {
    loader: require.resolve('thread-loader'),
    options: isNumberParallel(vunConfig)
      ? { workers: vunConfig.build.parallel }
      : {}
  }
}