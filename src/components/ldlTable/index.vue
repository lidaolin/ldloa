<template>
  <div class="ldlTableWrap">
    <el-table
        @row-dblclick="dblclick"
        @row-click="listClick"
        @sort-change="sortChanges"
        v-loading="tableDataInfo.loading"
        :data="tableDataInfo.dataList"
        :height="tableDataInfo.height!==undefined? tableDataInfo.height:'100%'"
        :max-height="tableDataInfo.maxHeight!==undefined? tableDataInfo.maxHeight:'100%'"
        :border="tableDataInfo.border!==undefined? tableDataInfo.border:true"
        :stripe="tableDataInfo.stripe!==undefined?tableDataInfo.stripe:false"
        :size="tableDataInfo.size !== undefined? tableDataInfo.size:'mini'"
        :fit="tableDataInfo.fit!==undefined?tableDataInfo.fit:true"
        :show-header="tableDataInfo.fit!==undefined?tableDataInfo.fit:true"
        :highlight-current-row="tableDataInfo.highlightCurrentRow!==undefined?tableDataInfo.highlightCurrentRow:true"
        :show-summary="tableDataInfo.showSummary!==undefined?tableDataInfo.showSummary:false"
        style="width: 100%">
          <el-table-column
              align="center"
              width="150"
              label="创建时间"
              prop="createTime"
              sortable="custom"
          >
          </el-table-column>
    </el-table>
  </div>
</template>

<script>
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
    }
  },
  methods:{
    dblclick(){
      console.log('双击')
    },
    listClick(e){
      this.clickRow=e
    },
    sortChanges(e){
      var sort = ''
      if (e.order == 'descending') {
        sort = 'desc'
      } else {
        sort = 'asc'
      }
      let pagingData= {... this.pagingData,sort:''}
      pagingData.sort=sort
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
      console.log(sort)
    }
  }
}
</script>

<style scoped>

</style>