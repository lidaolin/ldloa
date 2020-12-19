<template>
  <div :style="{'height':height+'px',overflow:'hidden',}">
    <!--element的滑动视图-->
    <el-scrollbar wrap-class="scrollbar-wrapper" :style="{'height':height+17+'px'}">
        <el-menu
            :default-active="activeMenu"
            :collapse="!stretchNavState"
            :background-color="cssConfig.navBackground"
            :text-color="cssConfig.menuText"
            :unique-opened="false"
            :active-text-color="cssConfig.menuActiveText"
            :collapse-transition="false"
            mode="vertical"
        >

<!--          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />-->
        </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import config from '@/assets/layout/config.scss'
import {mapGetters} from "vuex";
export default {
  name: "leftNav",
  computed:{
    ...mapGetters([
      'stretchNavState'
    ]),
    height(){
      return this.$store.state.pageHeight - (this.$store.state.layout.openLogo? 60:0)
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