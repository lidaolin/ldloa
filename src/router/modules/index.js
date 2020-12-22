import Layout from '@/layout'
// title 标题 icon 图标 affix 是否图钉在上面 keepAlive是否保存页面
const index =   {
        path: '/a',
        name: 'Layout',
        component: Layout,
        meta: { title: '控制台', icon: 'el-icon-check', affix: false },
        children: [
            {
                path: 'aa',
                component: () => import('@/views/page/a/aa'),
                name: 'aa',
                meta: { title: 'aa', icon: 'dashboard', affix: false ,keepAlive:true}
            },
            {
                path: 'ab',
                component: () => import('@/views/page/a/ab'),
                name: 'ab',
                meta: { title: 'ab', icon: 'dashboard', affix: false ,keepAlive:true }
            }
        ]
    }

export default index