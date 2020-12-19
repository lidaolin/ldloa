import Layout from '@/layout'
// title 标题 icon 图标 affix 是否图钉在上面 keepAlive是否保存页面
const index =   {
        path: '/a',
        name: 'Layout',
        component: Layout,
        children: [
            {
                path: 'aa',
                component: () => import('@/views/page/a/aa'),
                name: 'aa',
                meta: { title: 'aa', icon: 'dashboard', affix: true ,keepAlive:true}
            },

            {
                path: 'ab',
                component: () => import('@/views/page/a/aa'),
                name: 'ab',
                meta: { title: 'ab', icon: 'dashboard', affix: true ,keepAlive:true }
            }
        ]
    }

export default index