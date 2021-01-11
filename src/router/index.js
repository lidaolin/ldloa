import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout'
// import index from './modules/index'
import login from '@/views/login/login'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    name: 'index',
    component: Layout,
    redirect: '/index',
    meta: { title: '控制台', icon: 'icon-gongsi', affix: true,keepAlive:true,isHidden:true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/page/'),
        name: '',
        meta: { title: '控制台', icon: 'icon-gongsi', affix: true,keepAlive:true,isHidden:true }
      }
    ]
  },
  {
    path: '/login',
    name:'login',
    component: login,
    meta:{title:'登录',icon:'', affix: false,keepAlive:false,isHidden:true}
  },
  // index,
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
