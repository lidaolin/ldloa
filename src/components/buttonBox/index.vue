<template>
  <div class="buttonBoxWrap">
    <div class="buttonBoxNavPrev buttonBoxNav" v-if="width>widthWrap" @click="changeView('prev')">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div  style="width:calc(100% - 50px);height:100%;position:relative;overflow: hidden"  ref="buttonBoxWrap">
      <div class="buttonBox" ref="buttonBox" :style="{transform:'translateX('+leftViewWidth+'px)'}">
        <el-button size="mini">默认按钮</el-button>
        <el-button size="mini" type="primary">主要按钮</el-button>
        <el-button size="mini" type="success">成功按钮</el-button>
        <el-button size="mini" type="info">信息按钮</el-button>
        <el-button size="mini" type="warning">警告按钮</el-button>
        <el-button size="mini" type="danger">危险按钮</el-button>
        <el-button size="mini" plain>朴素按钮</el-button>
        <el-button size="mini" type="primary" plain>主要按钮</el-button>
        <el-button size="mini" type="success" plain>成功按钮</el-button>
        <el-button size="mini" type="info" plain>信息按钮</el-button>
        <el-button size="mini" type="warning" plain>警告按钮</el-button>
        <el-button size="mini" type="danger" plain>危险按钮</el-button>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
        <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </div>

    </div>
    <div class="buttonBoxNavNext buttonBoxNav"  v-if="width>widthWrap" @click="changeView('next')">
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "buttonBox",
  data(){
    return{
      leftViewWidth:0,
      width:10,
      widthWrap:0
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.width=this.$refs.buttonBox.clientWidth
      this.widthWrap=this.$refs.buttonBoxWrap.clientWidth
    })
  },
  methods:{
    changeView(e){
      let that=this
      let width=this.$refs.buttonBox.clientWidth
      let widthWrap=this.$refs.buttonBoxWrap.clientWidth
      console.log((width-widthWrap)%widthWrap)
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