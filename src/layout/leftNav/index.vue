<template>
  <div :style="{'height':height+'px',overflow:'hidden',}">
    <!--element的滑动视图-->
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
        <el-menu
            router
            :default-active="activeMenu"
            :collapse="!stretchNavState"
            :background-color="cssConfig.navBackground"
            :text-color="cssConfig.menuText"
            :unique-opened="false"
            :active-text-color="cssConfig.menuActiveText"
            :popper-append-to-body="true"
            mode="vertical"
        >
          <subNavItem v-for="route in routesListTwo" :key="route.path" :item="route" :pageData="pageData" />
        </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import config from '@/assets/layout/config.scss'
import subNavItem from "@/layout/leftNav/subNavItem";
import {mapGetters} from "vuex";
export default {
  name: "leftNav",
  data(){
    return {
      pageData:this.$router.currentRoute.matched[0]
    }
  },
  components:{
    subNavItem
  },
  watch:{
    $route(){
      this.pageData=this.$router.currentRoute.matched[0]
    }
  },
  computed:{
    ...mapGetters([
      'stretchNavState',
    ]),
    //获取路由进行一级路由的判断筛选形成新的路由机构模式
    routesListTwo(){
      let pageData=this.pageData
      let routes=this.$store.getters.routesList
      var datas={
        path: 'index',
        component: () => import('@/views/page/'),
        name: 'index',
        meta: { title: '控制台', icon: 'icon-gongsi', affix: true }
      }
      if (this.$store.state.leftNav.navHead){
        for (var i=0;i<routes.length;i++){
          if (routes[i].path==pageData.path){
            if (routes[i].children){
              var routesData= routes[i].children
              // routesData.splice(0,0,datas)
              return routesData
            }
          }
        }
        return [datas]
      }else{
        return routes
      }
    },
    height(){
      return this.$store.state.pageHeight - (this.$store.state.layout.openLogo? 80:0)
    },
    cssConfig() {
      return config
    },
    activeMenu(){
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  mounted() {
    this.$store.dispatch('getRouter')
  }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/layout/index.scss";

</style>