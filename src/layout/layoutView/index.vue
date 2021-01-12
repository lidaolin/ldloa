<template>
  <div class="layoutViewBox" :style="{'height':pageHeight+'px'}">
    <transition name="fade-transform" mode="out-in">
<!--  这个里面的cachedViews决定要缓存的是哪个页面    <keep-alive :include="cachedViews">-->
      <keep-alive>
        <router-view  v-if="$route.meta.keepAlive" v-wechat-title='$route.meta.title' :key="key" />
      </keep-alive>
<!--        {{$route.meta.keepAlive}}-->

    </transition >
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"  v-wechat-title='$route.meta.title'></router-view>
    </transition>
  </div>
</template>

<script>
export default {
name: "layoutView",
  computed:{
    key() {
      return this.$route.path
    }
  },
  props:{
    pageHeight:Number
  }
}
</script>

<style scoped>

</style>