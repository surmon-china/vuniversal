import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { SPA_TEMPLATE_FILE, getClientBuildDir } from '@cli/paths'
import { vunConfig } from '../vuniversal'
import { spaTemplateRender } from './render'

// HTML plugin config
export function modifyHTMLConfig(webpackConfig: Configuration) {
  webpackConfig.plugins?.push(new HtmlWebpackPlugin({
    filename: path.resolve(getClientBuildDir(vunConfig), SPA_TEMPLATE_FILE),
    templateContent: spaTemplateRender,
    inject: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    }
  }))
}
