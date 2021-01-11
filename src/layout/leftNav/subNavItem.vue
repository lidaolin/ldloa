<template>
  <div class="subNavItem" v-if="!item.meta.isHidden">
    <el-menu-item :index="toIndex(item)=='/'?'/index':toIndex(item)" v-if="(item.children?item.children.length===1:true)">
      <div class="navDiv" v-if="stretchNavState">
        <i :class="classFun(item.meta.icon)"></i>
        <span>{{item.meta.title}}</span>
      </div>
      <template v-else>
        <i :class="classFun(item.meta.icon)"></i>
        <span slot="title">{{item.meta.title}}</span>
      </template>
    </el-menu-item>
    <el-submenu :index="toIndex(item)" v-else>
      <template slot="title" v-if="stretchNavState">
        <div class="navDiv"  v-if="stretchNavState">
          <i :class="classFun(item.meta.icon)"></i>
          <span slot="title">{{item.meta.title}}</span>
        </div>
      </template>
      <div slot="title" v-if="!stretchNavState">
        <i  v-if="!stretchNavState" :class="classFun(item.meta.icon)"></i>
        <span v-if="!stretchNavState" slot="title">{{item.meta.title}}</span>
      </div>
      <subNavItem v-for="(items,index) in item.children" :key="index" :item="items" :pageData="toIndex(item)" />
    </el-submenu>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import subNavItem from "./subNavItem"
export default {
  name: "subNavItem",
  props:{
    item:{
      type:Object
    },
    pageData:{
      type:String
    }
  },
  components:{
    subNavItem
  },
  computed:{
    ...mapGetters([
      'stretchNavState'
    ]),
    toIndex(){
      return function (e){
        let indexInfo=e.path
        return  ((this.pageData?this.pageData+'/':'')+indexInfo).replace(/\/\//g, "/")
      }
    },
  },
  methods:{
    //判断字体
    classFun(iconClass){
      if (iconClass.indexOf("el-") !== -1){
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