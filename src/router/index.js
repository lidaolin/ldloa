import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

import index from './modules/index'
Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/index',
    meta: { title: '控制台', icon: 'icon-gongsi', affix: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/page/'),
        name: 'index',
        meta: { title: '控制台', icon: 'icon-gongsi', affix: true }
      }
    ]
  },
  index,
  {
    path: '/b',
    name: 'sss',
    component: Layout,
    meta: { title: 'sss的控制', icon: 'icon-gongsi', affix: true },
    children: [
      {
        path: 'b',
        component: () => import('@/views/page/b'),
        name: 'b',
        meta: { title: 'bb', icon: 'icon-gongsi', affix: true }
      },
      {
        path: 'bb',
        component: () => import('@/views/page/b/bb'),
        name: 'bb',
        meta: { title: 'bbb', icon: 'icon-gongsi', affix: true }
      }
    ]
  }

]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
