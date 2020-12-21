<template>
<div class="ldl-layoutTopNav">
  <div class="ldl-layoutTopNavLeft">
    <div class="ldl-navButton" @click="stretchNav">
      <i class="el-icon-s-fold" v-if="stretchNavState"></i>
      <i class="el-icon-s-unfold" v-else></i>
    </div>
  </div>
  <div class="ldl-layoutTopNavRight">
    <el-menu
        router
        :default-active="activeMenu"
        :unique-opened="false"
        mode="horizontal"
        v-if="navHead"
    >
      <el-menu-item :index="item.path=='/'?'/index':item.path" v-for="(item,index) in routesList" :key="index">{{ item.meta.title }}</el-menu-item>
    </el-menu>
    <div class="ldl-info"></div>
  </div>
</div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "layoutTopNav",
  data(){
    return{
      openLogo:this.$store.state.layout.openLogo
    }
  },
  computed:{
    ...mapGetters([
      'pageHeight',
      'stretchNavState',
      'routesList'
    ]),
    navHead(){
      return this.$store.state.leftNav.navHead
    },
    activeMenu(){
      // const route = this.$route
      // const { meta, path } = route
      // if (meta.activeMenu) {
      //   return meta.activeMenu
      // }
      return this.$router.currentRoute.matched[0].path
    }
  },
  methods:{
    stretchNav(){
      this.$store.commit('stretchNav')
    }
  }
}
</script>

<style scoped>
</style>