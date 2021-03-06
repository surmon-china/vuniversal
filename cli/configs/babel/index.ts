import path from 'path'
import { RuleSetRule } from 'webpack'
import { loadPartialConfig } from '@babel/core'
import { isWindows, requireResolve } from '@cli/utils'
import { VunLibConfig } from '../vuniversal'
import { BuildContext } from '../webpack'

const defaultOptions = {
  presets: [requireResolve('@vue/babel-preset-app')]
}

export function getBabelLoader(vunConfig: VunLibConfig, buildContext: BuildContext): RuleSetRule {
  // Validate a user's config
  loadPartialConfig()

  let loaderOptions = defaultOptions
  if (typeof vunConfig.babel === 'object') {
    loaderOptions = {
      ...defaultOptions,
      ...vunConfig.babel
    }
  } else if (typeof vunConfig.babel === 'function') {
    loaderOptions = vunConfig.babel({ target: buildContext.target }) as any
  }

  return {
    loader: requireResolve('babel-loader'),
    options: loaderOptions
  }
}

export function getExcluder(vunConfig: VunLibConfig) {
  const transpileDepRegex = genTranspileDepRegex(vunConfig.build.transpileDependencies)
  return (filepath: string) => {
    // always transpile js in vue files
    if (/\.vue\.jsx?$/.test(filepath)) {
      return false
    }
  
    // only include @babel/runtime when the @vue/babel-preset-app preset is used
    // https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/babel-preset-app/index.js#L218
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel#L50
    if (filepath.includes(path.join('@babel', 'runtime'))) {
      return false
    }
  
    // check if this is something the user explicitly wants to transpile
    if (transpileDepRegex && transpileDepRegex.test(filepath)) {
      return false
    }
    // Don't transpile node_modules
    return /node_modules/.test(filepath)
  }
}

// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-babel/index.js#L5
function genTranspileDepRegex(transpileDependencies: VunLibConfig['build']['transpileDependencies']) {
  // @ts-ignore
  const deps = transpileDependencies.map(dep => {
    if (typeof dep === 'string') {
      const depPath = path.join('node_modules', dep, '/')
      return isWindows
        ? depPath.replace(/\\/g, '\\\\') // double escape for windows style path
        : depPath
    } else if (dep instanceof RegExp) {
      return dep.source
    }
  })
  return deps.length ? new RegExp(deps.join('|')) : null
}
