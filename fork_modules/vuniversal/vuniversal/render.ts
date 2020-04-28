
import path from 'path'
import fs from 'fs-extra'
import { renderToString } from '@vue/server-renderer'
import { NODE_ENV, VueEnv, isDev } from '../helper/env'
import { AppCreater } from '../helper/creater'
import { getVunConfig } from './utils'

export interface RenderOptions {
  appCreater: AppCreater
  url: string
}

const vunConfig = getVunConfig()

export async function render(options: RenderOptions): Promise<string> {
  const { app, router, ...rest } = options.appCreater()
  // TODO: 404 路由会如何反应呢，会不会是 404，这里应该区分 404 和 500
  await router.push(options.url)
  const appHTML = await renderToString(app)
  const assets = fs.readJSONSync(
    isDev
      ? process.env.VUN_CLIENT_MANIFEST as string
      : path.join(__dirname, 'client.manifest.json')
  )

  // @ts-ignore
  return vunConfig.templateRender({
    target: VueEnv.Server,
    environment: NODE_ENV,
    assets,
    appHTML,
    state: {},
    url: options.url,
    ...rest,
  })
}
