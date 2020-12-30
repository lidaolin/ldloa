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
    <el-dropdown @command="overLogin">
      <div class="ldl-info">

        <div>
          <el-avatar shape="square" :size="30" :src="getInfo.avatar"></el-avatar>
        </div>
        <div class="ldl-infoName">
            {{getInfo.account}}
        </div>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
    getInfo(){
      return this.$store.state.user.userInfo
    },
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
  mounted() {
    console.log(this.$store.state)
  },
  methods:{
    overLogin(){
      this.$store.dispatch('outLogin')
    },
    stretchNav(){
      this.$store.commit('stretchNav')
    }
  }
}
</script>

<style scoped>
</style>