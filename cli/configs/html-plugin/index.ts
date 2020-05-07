import fs from 'fs-extra'
import templateParser from 'lodash/template'
import vunConfig from '../vuniversal'

const htmlTemplate = fs.readFileSync(vunConfig.template)
const templateRender = templateParser(htmlTemplate.toString(), {
  interpolate: /{{([\s\S]+?)}}/g,
  evaluate: /{%([\s\S]+?)%}/g
})

export function spaTemplateRender({ htmlWebpackPlugin }: any) {
  const HTML_ATTRS = ''
  const HEAD_ATTRS = ''
  const BODY_ATTRS = ''
  const APP = ''
  const HEAD = htmlWebpackPlugin.files.css
    .map((css: string) => `<link rel="stylesheet" href="${css}">`)
    .join('\n')
  const FOOTER = htmlWebpackPlugin.files.js
    .map((js: string) => `<script src="${js}" defer crossorigin></script>`)
    .join('\n')

  return templateRender({
    HTML_ATTRS,
    HEAD_ATTRS,
    BODY_ATTRS,
    HEAD,
    APP,
    FOOTER
  })
}
