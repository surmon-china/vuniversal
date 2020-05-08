// Fork form: https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/css.js
import path from 'path'
import { Configuration, RuleSetRule } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { isDev, isClientTarget } from '@cli/environment'
import { findExistingFile, appPackageJSON, requireResolve } from '@cli/utils'
import { BuildContext } from '../webpack'
import { autoContentHash } from '../webpack/helper'
import { vunConfig } from '../vuniversal'

export function modifyCSSConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)
  const IS_CLIENT = isClientTarget(buildContext.target)

  const buildOptions = vunConfig.build
  const cssOptions = buildOptions.css
  const loaderOptions = cssOptions.loaderOptions || {}
  const styleResources = cssOptions.styleResources || {}
  const sourceMap = cssOptions.sourceMap

  // About css module
  let { requireModuleExtension } = cssOptions
  if (typeof requireModuleExtension === 'undefined') {
    if (loaderOptions.css?.modules) {
      throw new Error('`css.requireModuleExtension` is required when custom css modules options provided')
    }
    requireModuleExtension = true
  }

  const { extract } = buildOptions.css
  const shouldExtract = extract !== false
  const canExtract = IS_CLIENT

  const filename = path.posix.join(
    buildOptions.assetsDir,
    `css/[name]${autoContentHash(vunConfig)}.css`
  )

  const extractOptions = {
    filename,
    chunkFilename: filename,
    ...(typeof extract === 'object' ? extract : {})
  }

  // check if the project has a valid postcss config
  // if it doesn't, don't use postcss-loader for direct style imports
  // because otherwise it would throw error when attempting to load postcss config
  const hasPostCSSConfig = !!(
    loaderOptions.postcss ||
    appPackageJSON.postcss ||
    findExistingFile([
      '.postcssrc',
      '.postcssrc.js',
      'postcss.config.js',
      '.postcssrc.yaml',
      '.postcssrc.json'
    ])
  )

  if (!hasPostCSSConfig) {
    loaderOptions.postcss = {
      plugins: () => [require('autoprefixer')]
    }
  }

  // if building for production but not extracting CSS, we need to minimize
  // the embbeded inline CSS as they will not be going through the optimizing
  // plugin.
  const needInlineMinification = !IS_DEV && !shouldExtract

  const cssnanoOptions: any = {
    preset: ['default', {
      mergeLonghand: false,
      cssDeclarationSorter: false
    }]
  }
  if (buildOptions.productionSourceMap && sourceMap) {
    cssnanoOptions.map = { inline: false }
  }

  function createCSSRule(params: { test: RegExp, loader?: string, options?: any, resources?: string[] }): RuleSetRule {

    const createLoaders = (rule: RuleSetRule, isCssModule: boolean): RuleSetRule => {
      rule.use = []

      // extract
      if (shouldExtract && canExtract) {
        rule.use.push({
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: IS_DEV,
            // TODO: 必有深意
            // use relative publicPath in extracted CSS based on extract location
            publicPath: '../'.repeat(
              extractOptions.filename
                .replace(/^\.[\/\\]/, '')
                .split(/[\/\\]/g)
                .length - 1
            )
          }
        })
      } else {
        rule.use.push({
          loader: requireResolve('vue-style-loader'),
          options: { sourceMap }
        })
      }

      const cssLoaderOptions: any = {
        sourceMap,
        importLoaders: (
          1 + // stylePostLoader injected by vue-loader
          1 + // postcss-loader
          (needInlineMinification ? 1 : 0)
        ),
        ...loaderOptions.css
      }

      // css-loader options
      if (isCssModule) {
        cssLoaderOptions.modules = {
          localIdentName: '[name]_[local]_[hash:base64:5]',
          ...cssLoaderOptions.modules
        }
      } else {
        delete cssLoaderOptions.modules
      }

      // css-loader
      rule.use.push({
        loader: requireResolve('css-loader'),
        options: cssLoaderOptions
      })

      // inline
      if (needInlineMinification) {
        rule.use.push({
          loader: requireResolve('postcss-loader'),
          options: {
            sourceMap,
            plugins: () => [require('cssnano')(cssnanoOptions)]
          }
        })
      }

      // postcss
      rule.use.push({
        loader: requireResolve('postcss-loader'),
        options: { sourceMap, ...loaderOptions.postcss }
      })

      // loader
      if (params.loader) {
        let resolvedLoader
        try {
          resolvedLoader = require.resolve(params.loader)
        } catch (error) {
          resolvedLoader = params.loader
        }

        rule.use.push({
          loader: resolvedLoader,
          options: { sourceMap, ...params.options }
        })
      }

      // style-resource-loader
      if (params.resources?.length) {
        rule.use.push({
          // https://github.com/yenshih/style-resources-loader
          loader: requireResolve('style-resources-loader'),
          options: {
            patterns: params.resources
          }
        })
      }

      return rule
    }

    return {
      test: params.test,
      oneOf: [
        // rules for <style lang="module">
        // vue-modules
        createLoaders({ resourceQuery: /module/ }, true),
        // rules for <style>
        createLoaders({ resourceQuery: /\?vue/ }, false),
        // rules for *.module.* files
        createLoaders({ resourceQuery: /\.module\.\w+$/ }, true),
        // rules for normal CSS imports
        createLoaders({}, !requireModuleExtension)
      ]
    }
  }

  webpackConfig.module?.rules?.push(
    // css
    createCSSRule({ test: /\.css$/ }),
    // postcss
    createCSSRule({ test: /\.p(ost)?css$/ }),
    // less
    createCSSRule({
      test: /\.less$/,
      loader: 'less-loader',
      options: loaderOptions.less,
      resources: styleResources.less
    }),
    // scss
    createCSSRule({
      test: /\.scss$/,
      loader: 'sass-loader',
      options: loaderOptions.scss || loaderOptions.sass,
      resources: styleResources.scss
    }),
    // sass
    createCSSRule({
      test: /\.sass$/,
      loader: 'sass-loader',
      resources: styleResources.sass,
      options: {
        ...loaderOptions.sass,
        sassOptions: {
          ...loaderOptions.sass?.sassOptions,
          indentedSyntax: true
        }
      }
    }),
    // stylus
    createCSSRule({
      test: /\.styl(us)?$/,
      loader: 'stylus-loader',
      resources: styleResources.stylus,
      options: {
        preferPathResolver: 'webpack',
        ...loaderOptions.stylus
      }
    })
  )

  // inject CSS extraction plugin
  if (shouldExtract && canExtract) {
    webpackConfig.plugins?.push(
      // @ts-ignore
      new MiniCssExtractPlugin(extractOptions)
    )

    // minify extracted CSS
    if (!IS_DEV) {
      // optimize-css
      // TODO remove: 15 star https://github.com/intervolga/optimize-cssnano-plugin
      const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')
      webpackConfig.plugins?.push(
        new OptimizeCssnanoPlugin({
          sourceMap: buildOptions.productionSourceMap && sourceMap,
          cssnanoOptions
        })
      )
    }
  }
}
