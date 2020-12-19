import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'

import index from './modules/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/page/'),
        name: 'index',
        meta: { title: '控制台', icon: 'dashboard', affix: true }
      }
    ]
  },
  index
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
