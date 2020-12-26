<template>
  <div class="ldlTableWrap" ref="table">
    <el-table
        @row-dblclick="dblclick"
        @row-click="listClick"
        @sort-change="sortChanges"
        v-loading="tableDataInfos.loading"
        :data="tableDataInfos.dataList"
        :height="tableDataInfos.height!==undefined? tableDataInfos.height:'calc(100% - 5px)'"
        :max-height="tableDataInfos.maxHeight!==undefined? tableDataInfos.maxHeight:'100%'"
        :border="tableDataInfos.border!==undefined? tableDataInfos.border:true"
        :stripe="tableDataInfos.stripe!==undefined?tableDataInfos.stripe:false"
        :size="tableDataInfos.size !== undefined? tableDataInfos.size:'mini'"
        :fit="tableDataInfos.fit!==undefined?tableDataInfos.fit:true"
        :show-header="tableDataInfos.fit!==undefined?tableDataInfos.fit:true"
        :highlight-current-row="tableDataInfos.highlightCurrentRow!==undefined?tableDataInfos.highlightCurrentRow:true"
        :show-summary="tableDataInfos.showSummary!==undefined?tableDataInfos.showSummary:false"
        style="width: 100%">
          <template
              v-for="(item,index) in tableDataInfos.dataListInfo"
          >
            <el-table-column
                align="center"
                :key="index+Math.random()"
                :width="item.width!==undefined?item.width:''"
                :label="item.label"
                :prop="item.prop"
                :sortable="item.sortable"
                :formatter="(row, column,)=>{return formatter(row, column,item.unit)}"
                v-if="item.type==undefined"
            >
            </el-table-column>
            <el-table-column
                :key="index+Math.random()"
                align="center"
                :width="item.width!==undefined?item.width:''"
                :label="item.label"
                :prop="item.prop"
                :sortable="item.sortable"
                :formatter="(row, column,)=>{return formatter(row, column,item.unit)}"
                v-else
            >
              <template slot-scope="scope">
                <span v-if="item.type=='date'" class="handle" >{{ scope.row[item.prop] | parseTime(item.dateFormat) }}</span>
                <div v-if="item.type=='tag'" class="tagWrap">
                  <template v-for="(tagItem,tagIndex) in (scope.row[item.prop] instanceof Array? scope.row[item.prop]:[scope.row[item.prop]])">
                    <template v-for="(tagTypeItems,tagTypeIndex) in item.data">
                      <el-tag :type='tagTypeItems.type' :size="tagTypeItems.size===undefined?'mini':tagTypeItems.size" class="ldlTableTag" v-if="tagItem==tagTypeItems.key"  :key="tagIndex+','+tagTypeIndex">{{ tagTypeItems.name}}</el-tag>
                    </template>
                  </template>
                </div>
                <div v-if="item.type=='image'" class="tableAvatarBox">
                  <template v-for="(imgItem,imgIndex) in (scope.row[item.prop] instanceof Array? scope.row[item.prop]:[scope.row[item.prop]])">
                    <el-image
                        style="display: block"
                        v-if="imgItem"
                        :key="imgIndex"
                        :fit="item.fit?item.fit:'contain'"
                        :style="item.imgStyle"
                        :src="imgItem[item.imgProp]"
                        :preview-src-list="item.imgProp?bigImage(scope.row[item.prop],item.imgProp):imgItem">
                    </el-image>
                  </template>
                </div>
                <div v-if="item.type=='avatar'" class="tableAvatarBox">
                  <el-avatar icon="el-icon-user-solid" style="display: block" :size="item.size" :src="scope.row[item.prop]"></el-avatar>
                </div>
              </template>
            </el-table-column>
          </template>
    </el-table>
    <div ref="lineDiv" class="lineDiv">
      <div style="background-color:#DCDCDC;height:2px;width:100%" />
      <div style="background-color:#DCDCDC;height:2px;width:100%" />
    </div>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  name: "ldlTable",
  props:{
    tableDataInfo:Object,
    pagingData:{
      type:Object,
      default:function (){
        return{
          page:1,
          limit:50,
          total:0,
        }
      }
    },
  },
  data(){
    return{
      clickRow:{},
      tableDataInfos: {}
    }
  },
  mounted() {

    this.tableDataInfos= {... this.tableDataInfo}
    this.$nextTick(()=>{
      this.rowDrop()
      this.columnDrop()
      this.drag()
    })
  },
  methods:{
    drag(){
      let tableDiv = this.$refs.table
      let oDiv = this.$refs.lineDiv
      oDiv.onmousedown = function(ev) {
        document.onselectstart=()=>{return false}
        let height = parseInt(tableDiv.offsetHeight)
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
          tableDiv.style.height = height + (mouseMoveY - mouseDownY) + 'px'
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
    //大图处理
    bigImage(res,key){
      console.log(res)
      const img=[]
      for (let i = 0; i < res.length; i++) {
        img.push(res[i][key])
      }
      console.log(img)
      return img
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      // const _this = this
      Sortable.create(tbody, {
        handle: '.handle',
        // onEnd({ newIndex, oldIndex }) {
          // console.log(newIndex,oldIndex)
          // let tableDataInfo= {... _this.tableDataInfo}
          // const currRow =tableDataInfo.dataList.splice(oldIndex, 1)[0]
          // tableDataInfo.dataList.splice(newIndex, 0, currRow)
          // _this.tableDataInfo= {... tableDataInfo}
        // }
      })
    },
    //列拖拽
    columnDrop() {
      const that=this
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          let tableDataInfos={... that.tableDataInfos}
          console.log(tableDataInfos.dataListInfo,'old')
          let dataListInfo=[... tableDataInfos.dataListInfo]
          console.log(dataListInfo)
          const oldItem= {... dataListInfo[evt.oldIndex]}
          dataListInfo.splice(evt.oldIndex, 1)
          dataListInfo.splice(evt.newIndex,0,oldItem)
          tableDataInfos.dataListInfo= [... dataListInfo]
          that.tableDataInfos={}
          that.tableDataInfos= JSON.parse(JSON.stringify(tableDataInfos))
          console.log(tableDataInfos.dataListInfo,'new')
        }
      })
    },
    formatter(row,column,unit){
      if(unit){
        return row[column.property]+unit
      }else{
        return row[column.property]
      }
    },
    //多选
    dblclick(){
      console.log('双击')
    },
    //单选
    listClick(e){
      this.clickRow=e
    },
    //排序
    sortChanges(e){
      let sort = ''
      if (e.order == 'descending') {
        sort = 'desc'
      } else {
        sort = 'asc'
      }
      let pagingData= {... this.pagingData,sort:''}
      pagingData.sort=sort
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
    }
  }
}
</script>

<style scoped>
.ldlTableWrap{
  max-height: calc(100% - 5px);
}
.tagWrap{
  display: flex;
  align-items: center;
  justify-content: center;
}
.ldlTableTag{
  display: flex;
  margin-left: 10px;
}
.ldlTableTag:nth-child(1){
  margin-left: 0;
}
.lineDiv:hover {
  cursor: s-resize;
}
</style>
<style lang="scss">
@import 'table';
//这地方魔改了elementui样式不要可以去除
</style>