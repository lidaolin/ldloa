<template>
  <div class="ldlTablePaginationWrap">
    <ldl-table @listClick="listClick" @selectionChange="selectionChange" :style="{height:'calc(100% - '+dd+')'}" v-if="tableDataInfoS&&tableDataInfoS.dataList" :tableDataInfo="tableDataInfoS" :pagingData.sync="pagingDataS"  @getList="getList"></ldl-table>
    <div class="ldlTablePaginationBox">
      <div>
        <searchBox :pagingData.sync="pagingDataS" @getList="getList"></searchBox>
      </div>
      <ldl-pagination :pagingData.sync="pagingDataS" @getList="getList"></ldl-pagination>
    </div>
  </div>
</template>

<script>
import ldlTable from '@/components/ldlTable'
import ldlPagination from '@/components/ldlPagination'
import searchBox from '@/components/searchBox'
export default {
  name: "ldlTablePagination",
  props:{
    tableDataInfo:Object,
    pagingData:Object
  },
  data(){
    return{
      dd:'36px',
      tableDataInfoS:false,
      pagingDataS:undefined
    }
  },
  watch:{
    pagingData: {
      handler() {
        this.pagingDataS=this.pagingData
      },
      immediate: true,
      deep: true
    },
    tableDataInfo:{
      handler() {
        this.tableDataInfoS=this.tableDataInfo
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.tableDataInfoS=this.tableDataInfo
    this.pagingDataS=this.pagingData
  },
  components:{
    ldlTable,
    ldlPagination,
    searchBox
  },
  methods:{

    listClick(e){
      this.$emit('update:selectRow',e)
      this.$emit('listClick',e)
    },
    selectionChange(e){
      this.$emit('update:selectionList',e)
      this.$emit('selectionChange',e)
    },
    getList(){
      let pagingData= {... this.pagingDataS}
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
    }
  }
}
</script>

<style scoped>
.ldlTablePaginationWrap{
  /*height: 100%;*/
  width:calc(100% - 20px);
  padding: 0 10px;
}
.ldlTablePaginationBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:5px 10px;
}
</style>