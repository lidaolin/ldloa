<template>
    <el-container>
      <el-aside :width="stretchNavState?cssConfig.navBarMaxWidth:cssConfig.navBarMinWidth" :style="{height:pageHeight+'px'}" class="ldl-aside">
        <div class="ldl-logo" v-if="openLogo&&stretchNavState">
          <el-image class="ldl-logoImage" :src="require('@/assets/layout/publicImg/logo.png')" fit="contain"></el-image>
        </div>
        <leftNav/>
      </el-aside>
      <el-container>
        <el-header class="ldl-headerTop" height="40px">
          <div class="ldl-navButton" @click="stretchNav">
            <i class="el-icon-s-fold" v-if="stretchNavState"></i>
            <i class="el-icon-s-unfold" v-else></i>
          </div>
          <div class="ldl-info"></div>
        </el-header>
        <el-main>
          <router-view v-wechat-title='$route.meta.title'/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import leftNav from './leftNav'
import config from '@/assets/layout/config.scss'
import {mapGetters} from 'vuex'
export default {
  name: "Layout",
  data(){
    return{
      openLogo:this.$store.state.layout.openLogo
    }
  },
  computed: {
    ...mapGetters([
      'pageHeight',
      'stretchNavState'
    ]),
    cssConfig(){
      return config
    }
  },
  components:{
    leftNav
  },
  methods:{
    stretchNav(){
      this.$store.commit('stretchNav')
    }
  },
  mounted() {
    //注册个时间屏幕
    let that=this
    window.onresize = () => {
      return (() => {
        that.$store.commit('getPageInfo');
      })();
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
@import "~@/assets/layout/index.scss";

</style>