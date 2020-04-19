
import express, { Handler } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { getVunConfig } from './config'
import { getAssets } from './assets'
import { AppCreater } from './helper'
import { render } from './render'
import { APP_VUN_ASSETS_FOLDER } from '../lib/constants'

export interface VuniversalMiddlewareOptions {
  appCreater: AppCreater
  // static?: string
  // redner?: boolean
}

export function vuniversalMiddleware(options: VuniversalMiddlewareOptions): Handler {
  const vunConfig = getVunConfig()
  return (request, response) => {

    const renderer = () => {
      render({
        appCreater: options.appCreater,
        url: request.originalUrl,
        assets: getAssets(),
        // template({ css, scripts }) {
        //   return ''
        // },
      })
      .then(html => response.status(200).send(html))
      .catch(error => response.status(404).send(String(error)))
    }

    const proxyer = () => {
      if (request.path.startsWith(`/${APP_VUN_ASSETS_FOLDER}/`) || request.path.includes('hot-update')) {
        createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true })(request, response, renderer)
      } else {
        renderer()
      }
    }

    express.static(vunConfig.dir.static)(request, response, proxyer)
  }
}