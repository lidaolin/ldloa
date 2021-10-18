// import {routes} from "@/router";
import router from "@/router";
const nav = {
    state: {
        openLogo:true,
        routesList:router.options.routes,
        //是否开启头部一级导航
        navHead:true,
        //当前的页面
        pageData:false
    },
    //过滤或者说数据处理类似于computed运算 this.$store.getters.newCount;
    getters:{
        routesListTwo(state){
          let pageData=state.pageData?state.pageData:router.currentRoute.matched[0]
          let routes=state.routesList
            // 开启头部一级
          if (state.navHead){
              for (let i = 0; i < routes.length; i++) {
                  // 判断是否等于当前的页面
                  if(routes[i].path==pageData.path){
                      if(routes[i].children){
                          return routes[i].children
                      }else{
                          return []
                      }
                  }
              }
          }else{
              return routes
          }
        }
    },
    //提交修改state里的值 this.$store.commit("increment", value);
    mutations: {
        changePageData(state,data){
            state.pageData=data
        },
        changeRoutesList(state){
            state.routesList=router.options.routes
        }
    },
    //用于提交类似登录可以写入请求 this.$store.dispatch('getParamSync',{name,age,sex})
    actions: {

    },
}
export  default nav