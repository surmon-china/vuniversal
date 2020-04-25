import fs from 'fs'
import path from 'path'
import { Configuration } from 'webpack'
import { VunLibConfig } from '../vuniversal/lib/configs/vuniversal'
import { isDev } from '../vuniversal/lib/utils'
import { BuildContext } from '../vuniversal/lib/configs/webpack'

function findExistingFile(context: string, files: string[]): any {
  for (const file of files) {
    if (fs.existsSync(path.join(context, file))) {
      return file
    }
  }
}

export function modifyCssConfig(webpackConfig: Configuration, vunConfig: VunLibConfig, buildContext: BuildContext): void {
  const IS_DEV = isDev(buildContext.environment)
  const IS_PROD = !IS_DEV

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
  const shouldExtract = buildOptions.css.extract !== false

  const filename = path.posix.join(
    buildOptions.assetsDir,
    `css/[name]${buildOptions.filenameHashing ? '.[contenthash:8]' : ''}.css`
  )

  const extractOptions = {
    filename,
    chunkFilename: filename,
    ...(typeof extract === 'object' ? extract : {})
  }

  // use relative publicPath in extracted CSS based on extract location
  const cssPublicPath = '../'.repeat(
    extractOptions.filename
        .replace(/^\.[\/\\]/, '')
        .split(/[\/\\]/g)
        .length - 1
  )

  // check if the project has a valid postcss config
  // if it doesn't, don't use postcss-loader for direct style imports
  // because otherwise it would throw error when attempting to load postcss config
  const hasPostCSSConfig = !!(
    loaderOptions.postcss ||
    api.service.pkg.postcss ||
    findExistingFile(api.resolve('.'), [
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
  const needInlineMinification = IS_PROD && !shouldExtract

  const cssnanoOptions: any = {
    preset: ['default', {
      mergeLonghand: false,
      cssDeclarationSorter: false
    }]
  }
  if (buildOptions.productionSourceMap && sourceMap) {
    cssnanoOptions.map = { inline: false }
  }

  function createCSSRule(CSSLang: string, test: RegExp, loader?: string, options?: any) {
    const baseRule = webpackConfig.module.rule(CSSLang).test(test)
    const applyLoaders = (rule, isCssModule) => {
      if (shouldExtract) {
        rule
          .use('extract-css-loader')
          .loader(require('mini-css-extract-plugin').loader)
          .options({
            hmr: !IS_PROD,
            publicPath: cssPublicPath
          })
      } else {
        rule
          .use('vue-style-loader')
          .loader(require.resolve('vue-style-loader'))
          .options({ sourceMap })
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

      rule
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssLoaderOptions)

      if (needInlineMinification) {
        rule
          .use('cssnano')
          .loader(require.resolve('postcss-loader'))
          .options({
            sourceMap,
            plugins: [require('cssnano')(cssnanoOptions)]
          })
      }

      rule
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'))
        .options({ sourceMap, ...loaderOptions.postcss })

      if (loader) {
        let resolvedLoader
        try {
          resolvedLoader = require.resolve(loader)
        } catch (error) {
          resolvedLoader = loader
        }

        rule
          .use(loader)
          .loader(resolvedLoader)
          .options(Object.assign({ sourceMap }, options))
      }
    }

    // rules for <style lang="module">
    const vueModulesRule = baseRule.oneOf('vue-modules').resourceQuery(/module/)
    applyLoaders(vueModulesRule, true)

    // rules for <style>
    const vueNormalRule = baseRule.oneOf('vue').resourceQuery(/\?vue/)
    applyLoaders(vueNormalRule, false)

    // rules for *.module.* files
    const extModulesRule = baseRule.oneOf('normal-modules').test(/\.module\.\w+$/)
    applyLoaders(extModulesRule, true)

    // rules for normal CSS imports
    const normalRule = baseRule.oneOf('normal')
    applyLoaders(normalRule, !requireModuleExtension)
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('postcss', /\.p(ost)?css$/)
  createCSSRule('scss', /\.scss$/, 'sass-loader', loaderOptions.scss || loaderOptions.sass)
  createCSSRule('sass', /\.sass$/, 'sass-loader', {
    ...loaderOptions.sass,
    sassOptions: {
      ...loaderOptions.sass?.sassOptions,
      indentedSyntax: true
    }
  })
  createCSSRule('less', /\.less$/, 'less-loader', loaderOptions.less)
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack',
    ...loaderOptions.stylus
  })

  // inject CSS extraction plugin
  if (shouldExtract) {
    webpackConfig
      .plugin('extract-css')
        .use(require('mini-css-extract-plugin'), [extractOptions])

    // minify extracted CSS
    if (IS_PROD) {
      webpackConfig
        .plugin('optimize-css')
          .use(require('@intervolga/optimize-cssnano-plugin'), [{
            sourceMap: buildOptions.productionSourceMap && sourceMap,
            cssnanoOptions
          }])
    }
  }
}
