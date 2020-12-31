import {get_menu} from '@/api/index'
import Layout from '@/layout'
import twoLayout from '@/layout/twoLayout'
import store from "@/store";
export function inteRouter(){
    return new Promise((resolve,reject) => {
        if(store.getters.token){
            get_menu().then(res=>{
                console.log(res.data,'ddd')
                // let newRouterList=[]
                let intRouterList=res.data
                addInteRouter(intRouterList,0).then(res=>{
                    // newRouterList.push(res)
                    return resolve(res)
                })

            })
        }else{
            reject()
        }
    })
}
export function addInteRouter(data,pagePath){
    return new Promise((resolve) => {
        let newRouterList=[]
        for (let i = 0; i < data.length; i++) {
            if (data[i].children&&data[i].children.length>0){
                if(data[i].children.length===1&&pagePath===0){
                    if (data[i].children[0].children.length>0){
                        addInteRouter(data[i].children,pagePath+data[i].name).then(res=>{
                            newRouterList.push({
                                path: '/'+data[i].name,
                                name:data[i].name,
                                component: Layout,
                                meta:data[i].meta,
                                children:res
                            })
                        })
                    }else{
                        newRouterList.push({
                            path: '/'+data[i].name,
                            name:data[i].name,
                            component: Layout,
                            meta:data[i].meta,
                            redirect:'/'+data[i].children[0].name,
                            children:[
                                {
                                    path:'/'+data[i].children[0].name,
                                    component:resolve => require([`@/views/page/${data[i].name}/${data[i].children[0].name}`], resolve),
                                    meta:data[i].meta
                                }
                            ]
                        })

                    }
                }else{
                    if (pagePath===0){
                        addInteRouter(data[i].children,data[i].name).then(res=>{
                            newRouterList.push({
                                path: '/'+data[i].name,
                                name:data[i].name,
                                component: Layout,
                                meta:data[i].meta,
                                children:res
                            })
                        })
                    }else{
                        addInteRouter(data[i].children,pagePath+'/'+data[i].name).then(res=>{
                            newRouterList.push({
                                path: data[i].name,
                                name:data[i].name,
                                meta:data[i].meta,
                                component:twoLayout,
                                children:res
                            })
                        })

                    }
                }
            }else{
                if (pagePath!==0){
                    newRouterList.push({
                        path:data[i].name,
                        component:resolve => require([`@/views/page/${pagePath+'/'+data[i].name}`], resolve),
                        meta: {... data[i].meta,datad:[`@/views/page/${pagePath+'/'+data[i].name}`]}
                    })
                }else{
                    newRouterList.push({
                        path: '/'+data[i].name,
                        name:data[i].name,
                        component: Layout,
                        meta:data[i].meta,
                        redirect:'/'+data[i].name,
                        children:[
                            {
                                path:'/'+data[i].name,
                                component:resolve => require([`@/views/page/${data[i].name}`], resolve),
                                meta:data[i].meta
                            }
                        ]
                    })

                }
            }
        }
        resolve(newRouterList)
    })
}
// router.addRoutes()
