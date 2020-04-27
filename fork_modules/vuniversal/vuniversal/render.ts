
import path from 'path'
import fs from 'fs-extra'
import { renderToString } from '@vue/server-renderer'
import { AppCreater } from '../helper/creater'
import { Helme } from '../helper/helmet'
import { isDev } from '../helper/env'

const defaultTemplate = (params: RenderTemplateParams) => `
  <!doctype html>
  <html>
    <head>
      <title>TODO: title meta</title>
      ${params.assets.css.map(css => `<link rel="stylesheet" href="${css}">`)}
    </head>
    <body>
      <div id="app">${params.appHTML}</div>
      ${params.assets.js.map(js => `<script src="${js}" defer crossorigin></script>`)}
    </body>
  </html>
`

export interface RenderTemplateParams {
  url: string
  helmet: Helme
  appHTML: string
  assets: {
    js: string[]
    css: string[]
  }
}

export interface RenderOptions {
  appCreater: AppCreater
  url: string
  template?(params: RenderTemplateParams): string
}

export async function render(options: RenderOptions): Promise<string> {
  const { app, router, helmet } = options.appCreater()
  // TODO: 404 路由会如何反应呢，会不会是 404，这里应该区分 404 和 500
  await router.push(options.url)
  const appHTML = await renderToString(app)
  const assets = fs.readJSONSync(
    isDev
      ? process.env.VUN_CLIENT_MANIFEST as string
      : path.join(__dirname, 'client.manifest.json')
  )
  const template = options.template || defaultTemplate
  return template({
    assets,
    appHTML,
    helmet,
    url: options.url
  })
}
