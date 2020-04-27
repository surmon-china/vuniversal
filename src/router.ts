import { RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'
import Nested from './views/Nested.vue'
import NestedWithId from './views/NestedWithId.vue'
import User from './views/User.vue'
import NotFound from './views/NotFound.vue'
import component from './views/Generic.vue'
// import LongView from './views/LongView.vue'
import GuardedWithLeave from './views/GuardedWithLeave.vue'
import ComponentWithData from './views/ComponentWithData.vue'

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t))
export const routes: RouteRecordRaw[] = [
  { path: '/home', redirect: '/' },
  { path: '/', component: Home },
  {
    path: '/always-redirect',
    redirect: () => ({
      name: 'user',
      params: { id: String(Math.round(Math.random() * 100)) },
    }),
  },
  { path: '/users/:id', name: 'user', component: User, props: true },
  { path: '/documents/:id', name: 'docs', component: User },
  { path: encodeURI('/n/€'), name: 'euro', component },
  { path: '/n/:n', name: 'increment', component },
  { path: '/multiple/:a/:b', name: 'multiple', component },
  { path: '/long-:n', name: 'long', component: import('./views/LongView.vue') },
  {
    path: '/lazy',
    component: async () => {
      await delay(500)
      return component
    },
  },
  {
    path: '/with-guard/:n',
    name: 'guarded',
    component,
    beforeEnter(to, from, next) {
      if (to.params.n !== 'valid') next(false)
      next()
    },
  },
  { path: '/cant-leave', component: GuardedWithLeave },
  {
    path: '/children',
    component,
    children: [
      { path: '', name: 'default-child', component },
      { path: 'a', name: 'a-child', component },
      { path: 'b', name: 'b-child', component },
    ],
  },
  { path: '/with-data', component: ComponentWithData, name: 'WithData' },
  { path: '/rep/:a*', component: component, name: 'repeat' },
  { path: '/:data(.*)', component: NotFound, name: 'NotFound' },
  {
    path: '/nested',
    alias: '/anidado',
    component: Nested,
    name: 'Nested',
    children: [
      {
        path: 'nested',
        alias: 'a',
        name: 'NestedNested',
        component: Nested,
        children: [
          {
            name: 'NestedNestedNested',
            path: 'nested',
            component: Nested,
          },
        ],
      },
      {
        path: 'other',
        alias: 'otherAlias',
        component: Nested,
        name: 'NestedOther',
      },
      {
        path: 'also-as-absolute',
        alias: '/absolute',
        name: 'absolute-child',
        component: Nested,
      },
    ],
  },
  {
    path: '/parent/:id',
    name: 'parent',
    component: NestedWithId,
    props: true,
    alias: '/p/:id',
    children: [
      // empty child
      { path: '', component },
      // child with absolute path. we need to add an `id` because the parent needs it
      { path: '/p_:id/absolute-a', alias: 'as-absolute-a', component },
      // same as above but the alias is absolute
      { path: 'as-absolute-b', alias: '/p_:id/absolute-b', component },
    ],
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: Nested,
    options: { end: false, strict: true }
  },
]

