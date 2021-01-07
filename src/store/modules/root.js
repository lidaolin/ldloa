const layout = {
    state: {
        root_isActive:"",
        groupInfo:{},
        selMenuAll:[],
        selBtnAll:[],

    },
    //过滤或者说数据处理类似于computed运算 this.$store.getters.newCount;
    getters:{

    },
    //提交修改state里的值 this.$store.commit("increment", value);
    mutations: {
        changeRootActive(state,data){
            state.root_isActive=data
        },
        changeGroupInfo(state,data){
            state.groupInfo = data
        },
        changeSelMenuAll(state,data){
            state.selMenuAll = data
        },
        changeSelBtnAll(state,data){
            state.selBtnAll = data
        }

    },
    //用于提交类似登录可以写入请求 this.$store.dispatch('getParamSync',{name,age,sex})
    actions: {
    },

}
export  default layout