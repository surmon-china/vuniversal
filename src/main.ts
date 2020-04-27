
import { createRouter } from 'vue-router'
import VueApp from './App.vue';
import { routes } from './router'
import { globalState } from './store'
import { helmetConfig } from './helmet'
import { scrollWaiter } from './scrollWaiter'
import { createUniversalApp, createUniversalHistory, createHelmet, AppCreater } from '../fork_modules/vuniversal/helper'

import './assets/app.css'
import './assets/test.scss'

export const createVueApp: AppCreater = () => {

  const helmet = createHelmet(helmetConfig, {
    autoRefresh: false
  })
  const router = createRouter({
    routes,
    history: createUniversalHistory(),
    async scrollBehavior(to, from, savedPosition) {
      await scrollWaiter.wait()
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })

  // TODO: 确认 createSSRApp 是不是通用的东西
  const app = createUniversalApp(VueApp)
  app.provide('state', globalState)
  app.use(router)
  app.use(helmet)

  return { app, router, helmet }
}
