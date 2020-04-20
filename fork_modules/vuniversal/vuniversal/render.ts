
// import templateParser from 'lodash/template'
import { renderToString } from '@vue/server-renderer'
import { AppCreater } from '../helper/creater'
import { Assets } from './assets'

export interface RenderTemplateParams {
  css: string[]
  scripts: string[]
  state: string
  meta: any
}

export interface RenderOptions {
  appCreater: AppCreater
  template?(params: RenderTemplateParams): string
  assets: Assets
  url: string
}

export async function render(options: RenderOptions): Promise<string> {
  const { app, router } = options.appCreater()
  // TODO: 404 路由会如何反应呢，会不会是 404，这里应该区分 404 和 500
  await router.push(options.url)
  const appHtml = await renderToString(app)
  // const ASSETS = 
  // templateParser(options.template, {  })

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Vuniversa 2323</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${
          options.assets.client?.css
            ? `<link rel="stylesheet" href="${options.assets.client.css}">`
            : ''
        }
      </head>
      <body>
        <div id="app">
          ${appHtml}
        </div>
        <script src="${options.assets.client?.js}" defer crossorigin></script>
      </body>
    </html>
  `
}
