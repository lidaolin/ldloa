<template>
  <div :style="{'height':height+'px',overflow:'hidden',}" class="elScrollbarBox">
    <!--element的滑动视图-->
    <el-scrollbar wrap-class="scrollbar-wrapper"  :style="{'height':height+'px'}">
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
          <subNavItem v-for="(item,index) in routesListTwo" :routesListTwo="routesListTwo" :key="index" :item="item" :pageData="pageData.path?pageData.path:''" />
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
      pageData:this.$store.state.leftNav.navHead?this.$router.currentRoute.matched[0]:''
    }
  },
  components:{
    subNavItem
  },
  watch:{
    $route(){
      this.pageData=this.$store.state.leftNav.navHead?this.$router.currentRoute.matched[0]:''
      this.$store.commit("changePageData", this.$router.currentRoute.matched[0]);
    }
  },
  computed:{
    ...mapGetters([
      'stretchNavState',
      'routesListTwo'
    ]),
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
  }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/layout/index.scss";

</style>