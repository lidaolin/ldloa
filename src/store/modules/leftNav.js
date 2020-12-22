import {routes,} from "@/router";
const nav = {
    state: {
        openLogo:true,
        routesList:routes,
        //是否含有一级导航
        navHead:false,
    },
    //过滤或者说数据处理类似于computed运算 this.$store.getters.newCount;
    getters:{},
    //提交修改state里的值 this.$store.commit("increment", value);
    mutations: {
    },
    //用于提交类似登录可以写入请求 this.$store.dispatch('getParamSync',{name,age,sex})
    actions: {
    },
}
export  default nav