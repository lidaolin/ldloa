import Layout from '@/layout'
// title 标题 icon 图标 affix 是否图钉在上面 keepAlive是否保存页面
// let data=[
//     {name:'a',meta:{title: '控制台', icon: 'el-icon-check', affix: false,keepAlive:false, },path:'page/a/aa',children:[]},
//     {name:'a',meta:{title: '控制台', icon: 'el-icon-check', affix: false,keepAlive:false,isHidden:true },children:[{name:'a',meta:{title: '控制台', icon: 'el-icon-check', affix: false,keepAlive:false,isHidden:true  },path:'@/views/page/a/aa'}]}
// ]
//
// let dataRouters= {}
// for (let i = 0; i < data.length; i++) {
//     let thatData=data[i]
//     if (data[i].children.length>0){
//     console.log('***')
//     }else{
//         dataRouters={
//             path: '/'+thatData.name,
//             name:thatData.name,
//             component: Layout,
//             meta:thatData.meta,
//             redirect:'/'+thatData.name+'/'+thatData.name,
//             children:[
//                 {
//                     path:thatData.name,
//                     component:resolve => require([`@/views/${thatData.path}`], resolve),
//                     meta:thatData.meta
//                 }
//             ]
//         }
//     }
// }
// console.log(dataRouters)
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