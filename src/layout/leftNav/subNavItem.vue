<template>
  <div class="subNavItem" :class="stretchNavState?'':'minSubNavItem'">
    <el-menu-item :index="toIndex(item)" v-if="item.children?item.children.length==1:true">
      <div class="navDiv" v-if="stretchNavState">
        <i :class="classFun(item.meta.icon)"></i>
        <span>{{item.meta.title}}</span>
      </div>
      <template v-else>
        <i :class="classFun(item.meta.icon)"></i>
        <span slot="title">{{item.meta.title}}</span>
      </template>
    </el-menu-item>
    <el-submenu :index="item.path" v-else>
      <template slot="title">
        <div class="navDiv"  v-if="stretchNavState">
          <i :class="classFun(item.meta.icon)"></i>
          <span>{{item.meta.title}}</span>
        </div>
        <template v-else>
          <i :class="classFun(item.meta.icon)"></i>
        </template>
      </template>
      <div v-for="(itemSub,index) in item.children" :key="index">
        <el-menu-item :index="item.path +'/'+itemSub.path" v-if="itemSub.children?itemSub.children.length==1:true">
          <div class="navDiv" v-if="stretchNavState">
            <i :class="classFun(itemSub.meta.icon)"></i>
            <span>{{itemSub.meta.title}}</span>
          </div>
          <template v-else>
            <i :class="classFun(itemSub.meta.icon)"></i>
            <span>{{itemSub.meta.title}}</span>
          </template>
        </el-menu-item>
        <el-submenu :index="itemSub.path" v-else>
          <template slot="title">
            <div class="navDiv" v-if="stretchNavState">
              <i class="el-icon-location"></i>
              <span>{{itemSub.meta.title}}</span>
            </div>
            <template v-else>
              <i :class="classFun(item.meta.icon)"></i>
            </template>
          </template>
          <div v-for="(itemSubs,indexs) in item.children" :key="indexs">
            <el-menu-item :index="itemSubs.path" v-if="itemSubs.children?itemSubs.children.length==1:true">
              <div class="navDiv" v-if="stretchNavState">
                <i :class="classFun(itemSubs.meta.icon)"></i>
                <span>{{itemSubs.meta.title}}</span>
              </div>
              <template v-else>
                <i :class="classFun(itemSubs.meta.icon)"></i>
                <span>{{itemSubs.meta.title}}</span>
              </template>

            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </el-submenu>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "subNavItem",
  props:{
    item:{
      type:Object
    },
    pageData:{
      type:Object
    }
  },
  computed:{
    ...mapGetters([
      'stretchNavState'
    ]),
    toIndex(e){
      return function (){
        var indexInfo=e.item.redirect?e.item.redirect:e.item.path
        if (this.$store.state.leftNav.navHead){
          return this.pageData.path+'/'+indexInfo
        }else{
          return indexInfo
        }
      }
    }
  },
  mounted() {
    console.log(this.item)
  },
  methods:{
    classFun(iconClass){
      if (iconClass.indexOf("el-") != -1){
        return iconClass
      }else{
        return iconClass + ' iconfont'
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.navDiv{
  flex: 1;
  padding: 0 10px 0 0;
  display: flex;
  align-items: center;
}
.iconfont{
  margin-right: 5px;
  font-size: 24px;
}
</style>