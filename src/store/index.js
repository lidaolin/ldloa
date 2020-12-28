import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 获取文件下所有js的内容
const modulesFiles = require.context('./modules', true, /\.js$/)
// 把modules文件夹下的所有导入这里
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
export default new Vuex.Store({
  //定义参数 this.$store.state.count;
  state: {
    // 页面高度控制
    pageHeight:document.documentElement.clientHeight,
    // 控制显示左侧的导航
    stretchNavState:true,
    haveLabel:true,
  },
  //过滤或者说数据处理类似于computed运算 this.$store.getters.newCount;
  getters:{
    pageHeight:state =>state.pageHeight,
    stretchNavState:state=>state.stretchNavState,
    routesList:state=>state.leftNav.routesList,
    haveLabel:state=>state.haveLabel
  },
  //提交修改state里的值 this.$store.commit("increment", value);
  mutations: {
    getPageInfo(state){
      state.pageHeight=document.documentElement.clientHeight
    },
    stretchNav(state,data){
      if(data){
        if (data=='false'){
          state.stretchNavState=false
        }
      }else{
        state.stretchNavState=!state.stretchNavState
      }
    }
  },
  //用于提交类似登录可以写入请求 this.$store.dispatch('getParamSync',{name,age,sex})
  actions: {
  },
  //模块化vuex结构引入
  modules:modules
})
