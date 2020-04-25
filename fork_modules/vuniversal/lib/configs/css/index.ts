import path from 'path'
import { Configuration, RuleSetRule } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { isDev, isClientTarget } from '../../environment'
import { findExistingFile, appPackageJSON } from '../../utils'
import { BuildContext } from '../webpack'
import vunConfig from '../vuniversal'

export function modifyCssConfig(webpackConfig: Configuration, buildContext: BuildContext): void {
  // 此文件应该区分服务端和客户端，服务端应该是什么都不需要做的
  const IS_DEV = isDev(buildContext.environment)
  const IS_CLIENT = isClientTarget(buildContext.target)

  const buildOptions = vunConfig.build
  const cssOptions = buildOptions.css
  const loaderOptions = cssOptions.loaderOptions || {}
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
    `css/[name].[contenthash:8].css`
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
      plugins: [
        require('autoprefixer')
      ]
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

  function createCSSRule(test: RegExp, loader?: string, options?: any): RuleSetRule {
    const createLoaders = (rule: RuleSetRule, isCssModule: boolean): RuleSetRule => {
      rule.use = []

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
          loader: require.resolve('vue-style-loader'),
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

      if (isCssModule) {
        cssLoaderOptions.modules = {
          localIdentName: '[name]_[local]_[hash:base64:5]',
          ...cssLoaderOptions.modules
        }
      } else {
        delete cssLoaderOptions.modules
      }

      rule.use.push({
        loader: require.resolve('css-loader'),
        options: cssLoaderOptions
      })

      if (needInlineMinification) {
        rule.use.push({
          loader: require.resolve('postcss-loader'),
          options: {
            sourceMap,
            plugins: [require('cssnano')(cssnanoOptions)]
          }
        })
      }

      rule.use.push({
        loader: require.resolve('postcss-loader'),
        options: { sourceMap, ...loaderOptions.postcss }
      })

      if (loader) {
        let resolvedLoader
        try {
          resolvedLoader = require.resolve(loader)
        } catch (error) {
          resolvedLoader = loader
        }

        rule.use.push({
          loader: resolvedLoader,
          options: { sourceMap, ...options }
        })
      }

      return rule
    }

    return {
      test,
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

  // css
  webpackConfig.module?.rules.push(
    createCSSRule(/\.css$/)
  )
  // postcss
  webpackConfig.module?.rules.push(
    createCSSRule(/\.p(ost)?css$/)
  )
  // less
  webpackConfig.module?.rules.push(
    createCSSRule(/\.less$/, 'less-loader', loaderOptions.less)
  )
  // scss
  webpackConfig.module?.rules.push(
    createCSSRule(/\.scss$/, 'sass-loader', loaderOptions.scss || loaderOptions.sass)
  )
  // sass
  webpackConfig.module?.rules.push(
    createCSSRule(/\.sass$/, 'sass-loader', {
      ...loaderOptions.sass,
      sassOptions: {
        ...loaderOptions.sass?.sassOptions,
        indentedSyntax: true
      }
    })
  )
  // stylus
  webpackConfig.module?.rules.push(
    createCSSRule(/\.styl(us)?$/, 'stylus-loader', {
      preferPathResolver: 'webpack',
      ...loaderOptions.stylus
    })
  )

  // inject CSS extraction plugin
  if (shouldExtract && canExtract) {
    webpackConfig.plugins?.push(
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
