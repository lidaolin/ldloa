<template>
  <div class="ldlTableWrap">
    <el-table
        @row-dblclick="dblclick"
        @row-click="listClick"
        @selection-change="selectionChange"
        @sort-change="sortChanges"
        tooltip-effect="light"
        v-loading="tableDataInfo.loading"
        :data="tableDataInfo.dataList"
        :row-key="tableDataInfo.rowKey!==undefined?tableDataInfo.rowKey:''"
        :tree-props="tableDataInfo.treeProps!==undefined?tableDataInfo.treeProps:{}"
        :height="tableDataInfo.height!==undefined? tableDataInfo.height:'100%'"
        :max-height="tableDataInfo.maxHeight!==undefined? tableDataInfo.maxHeight:'100%'"
        :border="tableDataInfo.border!==undefined? tableDataInfo.border:true"
        :stripe="tableDataInfo.stripe!==undefined?tableDataInfo.stripe:false"
        :size="tableDataInfo.size !== undefined? tableDataInfo.size:'mini'"
        :fit="tableDataInfo.fit!==undefined?tableDataInfo.fit:true"
        :show-header="tableDataInfo.fit!==undefined?tableDataInfo.fit:true"
        :highlight-current-row="tableDataInfo.highlightCurrentRow!==undefined?tableDataInfo.highlightCurrentRow:true"
        :show-summary="tableDataInfo.showSummary!==undefined?tableDataInfo.showSummary:false"
        :default-sort="defaultSort"
        style="width: 100%">
          <template
              v-for="(item,index) in tableDataInfo.dataListInfo"
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
                :show-overflow-tooltip="item.showOverflowTooltip"
                :class-name="pagingData.dbname==item.prop? pagingData.paixu=='desc'?'descending':'ascending':''"
            >
            </el-table-column>
            <el-table-column
                v-else-if="item.type=='selection'"
                :key="index"
                type="selection"
                align="center"
                :class-name="pagingData.dbname==item.prop? pagingData.paixu=='desc'?'descending':'ascending':''"
                :width="item.width?item.width:35">
            </el-table-column>
            <el-table-column
                :key="index+Math.random()"
                align="center"
                :width="item.width!==undefined?item.width:''"
                :label="item.label"
                :prop="item.prop"
                :sortable="item.sortable"
                :class-name="pagingData.dbname==item.prop? pagingData.paixu=='desc'?'descending':'ascending':''"
                :formatter="(row, column,)=>{return formatter(row, column,item.unit)}"
                v-else
            >
              <template slot-scope="scope">
                <span :scope="scope.row" v-if="item.type=='html'" v-html="scope.row[item.prop]"></span>
                <span class="el-icon-rank handle" :scope="scope.row" v-if="item.type=='derk'"></span>
                <span v-if="item.type=='date'" >{{ scope.row[item.prop] | parseTime(item.dateFormat) }}</span>
                <div v-if="item.type=='tag'" class="tagWrap">
                  <template v-for="(tagItem,tagIndex) in (scope.row[item.prop] instanceof Array? scope.row[item.prop]:[scope.row[item.prop]])">
                    <template v-for="(tagTypeItems,tagTypeIndex) in item.data">
                      <el-tag :type='tagTypeItems.type' :size="tagTypeItems.size===undefined?'mini':tagTypeItems.size" class="ldlTableTag" v-if="tagItem==tagTypeItems.key"  :key="tagIndex+','+tagTypeIndex">{{ tagTypeItems.name}}</el-tag>
                    </template>
                  </template>
                </div>
                <div v-if="item.type=='tags'" class="">
                  <template v-for="(tagItem,tagIndex) in (scope.row[item.prop] instanceof Array? scope.row[item.prop]:[scope.row[item.prop]])">
                      <el-tag size="mini" :key="tagIndex+','+tagItem[item.data.key]">{{ tagItem[item.data.nameKey]}}</el-tag>
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
                        :src="item.imgProp?item.imgProp:imgItem"
                        :preview-src-list="scope.row[item.prop] instanceof Array?scope.row[item.prop]:[scope.row[item.prop]]">
                    </el-image>
                  </template>
                </div>
                <div v-if="item.type=='video'">
                  <video :src="scope.row[item.prop]" v-if="scope.row[item.prop]" controls :style="item.imgStyle"></video>
                </div>
                <div v-if="item.type=='avatar'" class="tableAvatarBox">
                  <el-avatar icon="el-icon-user-solid" style="display: block" :size="item.size" :src="scope.row[item.prop]"></el-avatar>
                </div>
              </template>
            </el-table-column>
          </template>
    </el-table>
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
      // tableDataInfo: {}
    }
  },
  computed:{
    defaultSort(){
      return {prop:this.pagingData.dbname,order:this.pagingData.paixu=='desc'?'descending':'ascending'}
    }
  },
  // watch:{
  //   tableDataInfo: {
  //     handler() {
  //       let that=this
  //       this.$nextTick(()=>{
  //         setTimeout(()=>{
  //           console.log('----------',{prop:'create_time',order:'descending'})
  //           that.defaultSort={prop:'create_time',order:'descending'}
  //             // that.defaultSort={prop:that.pagingData.dbname,order:that.pagingData.paixu=='desc'?'descending':'ascending'}
  //           },3000)
  //       })
  //     },
  //   },
  // },
  mounted() {

    // this.tableDataInfo= {... this.tableDataInfo}
    // this.$nextTick(()=>{
      this.rowDrop()
      this.columnDrop()
    // })
  },
  methods:{
    //大图处理
    // bigImage(res,key){
    //   if(res.length>1){
    //
    //   }else{
    //     const img=[]
    //     for (let i = 0; i < res.length; i++) {
    //       img.push(res[i][key])
    //     }
    //     return img
    //   }
    // },
    selectionChange(e){
      this.$emit('selectionChange',e)
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      // const _this = this
      Sortable.create(tbody, {
        handle: '.handle',
        // onEnd({ newIndex, oldIndex }) {
        //   console.log(newIndex,oldIndex)
        //   let tableDataInfo= {... _this.tableDataInfo}
        //   const currRow =tableDataInfo.dataList.splice(oldIndex, 1)[0]
        //   tableDataInfo.dataList.splice(newIndex, 0, currRow)
        //   _this.tableDataInfo= {... tableDataInfo}
        // }
      })
    },
    //列拖拽
    columnDrop() {
      const that=this
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        // handle:'.cell',
        animation: 180,
        delay: 0,
        onEnd: evt => {
          let tableDataInfo={... that.tableDataInfo}
          let dataListInfo=[... tableDataInfo.dataListInfo]
          console.log(dataListInfo)
          const oldItem= {... dataListInfo[evt.oldIndex]}
          dataListInfo.splice(evt.oldIndex, 1)
          dataListInfo.splice(evt.newIndex,0,oldItem)
          tableDataInfo.dataListInfo= [... dataListInfo]
          that.tableDataInfo={}
          that.tableDataInfo= JSON.parse(JSON.stringify(tableDataInfo))
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
      this.$emit('listClick',e)
      this.clickRow=e
    },
    //排序
    sortChanges(e){
      let paixu = ''
      console.log(e,88888888888)
      if (e.order == 'descending') {
        paixu = 'desc'
      } else {
        paixu = 'asc'
      }
      let pagingData= {... this.pagingData,paixu:'',dbname:''}
      pagingData.dbname=e.prop
      pagingData.paixu=paixu
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
    }
  }
}
</script>

<style scoped>
.ldlTableWrap{
  max-height: 100%;
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
</style>
<style lang="scss">
@import 'table';
//这地方魔改了elementui样式不要可以去除
</style>