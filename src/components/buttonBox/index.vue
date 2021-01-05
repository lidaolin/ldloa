<template>
  <div class="buttonBoxWrap" :style="{height:buttonBoxState?'30px':'10px'}">
    <div class="buttonBoxNavPrev buttonBoxNav" v-if="width>widthWrap&&buttonBoxState" @click="changeView('prev')" >
      <i class="el-icon-arrow-left"></i>
    </div>
    <div  style="width:calc(100% - 50px);height:100%;position:relative;overflow: hidden"  ref="buttonBoxWrap" v-if="buttonBoxState">
      <div class="buttonBox" ref="buttonBox" :style="{transform:'translateX('+leftViewWidth+'px)'}">

        <slot :data="Path"></slot>
        <el-button size="mini" :icon="item.icon" v-for="(item,index) in buttonData" :type="item.color.split('/')[0]" :plain="item.color.split('/').length>1"  v-waves :key="index" @click="Callback(item.event)">{{ item.title }}</el-button>
      </div>
    </div>
    <div class="buttonBoxNavNext buttonBoxNav"  v-if="width>widthWrap&&buttonBoxState" @click="changeView('next')">
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
import {bu_list} from '@/api'
export default {
  name: "buttonBox",
  data(){
    return{
      leftViewWidth:0,
      width:10,
      widthWrap:0,
      buttonData:[]
    }
  },
  props:{
    Path:{
      type: String,
      default(){
        return null
      }
    },
    buttonBoxState:Boolean
  },
  mounted() {
    this.$nextTick(()=>{
      this.width=this.$refs.buttonBox.clientWidth
      this.widthWrap=this.$refs.buttonBoxWrap.clientWidth
    })
    const routerData = this.$route.path.split('/')
    bu_list({name:routerData[routerData.length-1]}).then(res=>{
      if(res.data.length>0){
        this.buttonData=res.data
      }else{
        this.$emit('update:buttonBoxState',false)
      }
    })
  },
  methods:{
    // 按钮事件返回
    Callback(e){
      this.$emit('Callback', e.split('/'))
    },
    //容器修改
    changeView(e){
      let that=this
      let width=this.$refs.buttonBox.clientWidth
      let widthWrap=this.$refs.buttonBoxWrap.clientWidth
      if(e==='next'){
        if(width+that.leftViewWidth<widthWrap){
          this.leftViewWidth=that.leftViewWidth
        }else{
          this.leftViewWidth=that.leftViewWidth-((width-widthWrap)%widthWrap)
        }
      }else{
        if (that.leftViewWidth+((width-widthWrap)%widthWrap)< 0){
          this.leftViewWidth=that.leftViewWidth+((width-widthWrap)%widthWrap)
        }else{
          this.leftViewWidth=0
        }
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang="scss" scoped>
.buttonBoxWrap{
  padding: 2.5px 10px;
  overflow: hidden;
  width:calc(100% - 20px);
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buttonBoxNav{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  text-align: center;
  overflow: hidden;
  height: 23px;
  font-size:20px;
  line-height: 20px;
  //border: 1px solid #dddddd;
  background: #fff;
  color: #dddddd;
  z-index: 2;
  cursor: pointer;
}
.buttonBoxNavPrev{
  left: 0;
}
.buttonBoxNavNext{
  right: 0;
}
.buttonBox{
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 1;
  transition:all 1s;
  button{
    padding: 3px 5px;
  }
}
</style>