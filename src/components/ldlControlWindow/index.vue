<template>
  <div ref="table" style="width: 100%" :style="{height:bottomHeight}">
    <div ref="lineDiv" class="lineDiv">
      <div style="background-color:#DCDCDC;height:2px;width:100%" />
      <div style="background-color:#DCDCDC;height:2px;width:100%" />
    </div>
    <div style="background: red;height:calc(100% - 4px)">
      11111
    </div>
  </div>
</template>

<script>
export default {
  name: "ldlControlWindow",
  props:{
    bottomHeight:String
  },
  mounted() {
    this.drag()
  },
  methods:{
    drag(){
      let that=this
      let tableDiv = this.$refs.table
      let oDiv = this.$refs.lineDiv
      oDiv.onmousedown = function(ev) {
        document.onselectstart=()=>{return false}
        let height = parseInt(tableDiv.offsetHeight)
        console.log(height)
        oDiv.style.cursor = 's-resize'
        let evs = ev || event
        // let mouseDownX = evs.clientX
        let mouseDownY = evs.clientY
        // IE8 取消默认行为-设置全局捕获
        if (oDiv.setCapture) {
          oDiv.setCapture()
        }
        document.onmousemove = function(evs) {
          // 鼠标移动时的鼠标位置
          // let mouseMoveX = evs.clientX
          let mouseMoveY = evs.clientY
          tableDiv.style.height = height + (mouseDownY - mouseMoveY) + 'px'
          let heightTable=height + (mouseDownY - mouseMoveY) + 'px'
          that.$emit('update:bottomHeight', heightTable)
        }
      }
      document.onmouseup = function() {
        document.onselectstart=()=>{return true}
        document.onmousemove = null
        // 释放全局捕获
        if (oDiv.releaseCapture) {
          oDiv.releaseCapture()
        }
      }
      return false
    },
  }
}
</script>

<style scoped>
.lineDiv{
  /*margin: 20px;*/
  /*margin-top: 5px;*/
}
.lineDiv:hover {
  cursor: s-resize;
}
</style>