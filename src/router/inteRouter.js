import {get_menu} from '@/api/index'

export function inteRouter(){
    return new Promise((resolve) => {
        get_menu().then(res=>{
            console.log(res,'ddd')
            return resolve(res)
        })
    })
}
// router.addRoutes()
