
import path from 'path'
import fs from 'fs-extra'
// import templateParser from 'lodash/template'
import { renderToString } from '@vue/server-renderer'
import { AppCreater } from '../helper/creater'
import { isDev } from '../helper/env'

const defaultTemplate = (params: RenderTemplateParams) => `
  <!doctype html>
  <html lang="en">
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Vuniversa 2323</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${params.assets.css.map(css => `<link rel="stylesheet" href="${css}">`)}
    </head>
    <body>
      <div id="app">
        ${params.appHTML}
      </div>
      ${params.assets.js.map(js => `<script src="${js}" defer crossorigin></script>`)}
    </body>
  </html>
`

export interface RenderTemplateParams {
  url: string
  meta: any
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
  const { app, router } = options.appCreater()
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
    meta: {},
    url: options.url
  })
}
