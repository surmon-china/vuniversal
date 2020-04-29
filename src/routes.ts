import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { scrollWaiter } from './scrollWaiter'
import Home from './pages/index.vue'
import NotFound from './pages/not-found.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: Home.name,
    component: Home
  },
  {
    name: 'NotFound',
    path: '/:data(.*)',
    component: NotFound
  }
]

export default createRouter({
  routes,
  history: createWebHistory(),
  async scrollBehavior(to, from, savedPosition) {
    await scrollWaiter.wait()
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

