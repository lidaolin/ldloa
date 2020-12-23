import {login} from '@/api/index'

export function inteRouter(){
    return new Promise((resolve) => {
        login().then(res=>{
            console.log(res,'ddd')
            return resolve(res)
        })
    })
}
// router.addRoutes()
