<template>
    <el-container>
      <el-aside :width="stretchNavState?cssConfig.navBarMaxWidth:cssConfig.navBarMinWidth" :style="{height:pageHeight+'px'}" class="ldl-aside">
        <div class="ldl-logo" v-if="openLogo">
          <el-image class="ldl-logoImage" :src="require('@/assets/layout/publicImg/logo.png')" fit="contain"></el-image>
        </div>
        <leftNav/>
      </el-aside>
      <el-container>
        <el-header :height="haveLabel?'70px':'40px'" class="ldl-headerTop">
          <layoutTopNav></layoutTopNav>
          <layoutTopLabel></layoutTopLabel>
        </el-header>
        <el-main>
          <router-view v-wechat-title='$route.meta.title'/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import leftNav from './leftNav'
import layoutTopNav from './layoutTopNav'
import layoutTopLabel from './layoutTopLabel'
import config from '@/assets/layout/config.scss'
import {mapGetters} from 'vuex'
export default {
  name: "Layout",
  data(){
    return{

    }
  },
  computed: {
    ...mapGetters([
      'pageHeight',
      'stretchNavState',
      'haveLabel'
    ]),
    openLogo(){return this.$store.state.layout.openLogo},
    cssConfig(){
      return config
    }
  },
  components:{
    leftNav,
    layoutTopNav,
    layoutTopLabel
  },
  methods:{
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

<style>

@import "~@/assets/layout/iconFont/iconfont.css";
</style>
<style rel="stylesheet/scss" lang="scss">
@import "~@/assets/layout/index.scss";

</style>