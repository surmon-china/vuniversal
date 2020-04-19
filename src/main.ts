import VueApp from './App.vue';
import { router } from './router'
import { globalState } from './store'
import { createUniversalApp, AppCreater } from '../fork_modules/vuniversal/vuniversal/helper'

export const createVueApp: AppCreater = () => {
  const app = createUniversalApp(VueApp)
  app.provide('state', globalState)
  app.use(router)
  return { app, router }
}