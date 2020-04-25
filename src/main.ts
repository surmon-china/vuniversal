import VueApp from './App.vue';
import { router } from './router'
import { globalState } from './store'
import { createUniversalApp, AppCreater } from '../fork_modules/vuniversal/helper'

import './assets/app.css'
import './assets/test.scss'

export const createVueApp: AppCreater = () => {
  // TODO: 确认 createSSRApp 是不是通用的东西
  const app = createUniversalApp(VueApp)
  app.provide('state', globalState)
  app.use(router)
  return { app, router }
}
