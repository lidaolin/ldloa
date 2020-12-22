<template>
  <div class="layoutTopLabel"  ref="scrollWarp">
      <div class="layoutTopLabelBox" v-on:mouseover="changeActive($event)">
        <el-tag
            @click="toPath(item.path)"
            :effect="item.path==activeMenu?'dark':'plain'"
            size="mini"
            :type="item.path==activeMenu?'success':'info'"
            :class="item.path==activeMenu?'ldl_tag_active':''"
            :closable="!item.meta.affix"
            @close="delTag(index)" v-for="(item,index) in tagLabelList"
            :key="index"
        >
          {{item.meta.title}}
        </el-tag>

      </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "layoutTopLabel",
  computed:{
    ...mapGetters([
      'routesList'
    ]),
    activeMenu(){
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  watch:{
    $route(){
      this.addTagLabel()
    }
  },
  data(){
    return{
      tagLabelList:[],
    }
  },
  mounted() {
    this.getRouterTagLabel()
    this.$nextTick(()=>{
      this.addTagLabel()
    })
  },
  methods:{
    addTagLabel(){
      let repeat=true
      for (let i = 0; i < this.tagLabelList.length; i++) {
        if (this.tagLabelList[i].path==this.activeMenu){
          repeat = false
        }
      }
      if (repeat){
        let data={name:this.$route.name,path:this.$route.path,meta:this.$route.meta}
        this.tagLabelList.push(data)
      }
    },
    toPath(e){
      if(e !== this.activeMenu) {
        this.$router.push({ path: e })
      }
    },
    getTagLabelList(e,s){
      var that=this
      if (e.children){
        if (e.children.length>1){
          let url=e.path
          for (let i = 0; i < e.children.length; i++) {
            that.getTagLabelList(e.children[i],url)
          }
        }else{
          if (e.children[0].meta.affix){
            let data = {path:e.redirect?e.redirect:s+'/'+e.children[0].path,meta:e.children[0].meta}
            that.tagLabelList.push(data)
          }
          return false
        }
      }else{
        if (e.meta.affix){
          let data = {path:e.redirect?e.redirect:s+'/'+e.path,meta:e.meta}
          that.tagLabelList.push(data)
        }
      }
    },
    getRouterTagLabel(){
      let routesList=this.routesList
      for (let i = 0; i < routesList.length; i++) {
        let oneRoutesList=routesList[i]
        this.getTagLabelList(oneRoutesList,'/')
      }
    },
    delTag(e){
      const tagLabelList=[... this.tagLabelList]
      tagLabelList.splice(e,1)
      this.tagLabelList=tagLabelList
      if(e-1<0){
        this.$router.push({ path: '/'})
      }else{
        this.$router.push({ path: tagLabelList[e-1].path})
      }
    },
    changeActive(){
      var that=this
      let isIE = navigator.userAgent.match(/MSIE (\d)/i);
      isIE = isIE ? isIE[1] : undefined;
      let isFF = /FireFox/i.test(navigator.userAgent);
      if (isIE < 9){
        that.$refs.scrollWarp.attachEvent("onmousewheel", that.changeG,true)
      }else if (!isFF){
        that.$refs.scrollWarp.addEventListener('mousewheel',that.changeG,true)
      }else{
        that.$refs.scrollWarp.addEventListener('DOMMouseScroll',that.changeG,true)
      }
    },
    changeG(e){
      this.$refs.scrollWarp.scrollLeft += e.deltaY
    },

  }
}
</script>

<style scoped>
</style>