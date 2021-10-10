import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElDragDialog from '@/directives/el-dragDialog'
import waves from '@/directives/waves'


Vue.use( ElDragDialog );
Vue.use( waves );
Vue.use(codemirror)
import {inteRouter} from '@/router/inteRouter'
inteRouter().then(res=>{
  // 动态添加路由
  router.options.routes=router.options.routes.concat(res)
  router.addRoutes(res)
  store.commit('changeRoutesList')
})
import VueWechatTitle from 'vue-wechat-title'//动态修改title
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(VueWechatTitle)
Vue.use(ElementUI);
Vue.config.productionTip = false

import * as filters from "./filters"; // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
