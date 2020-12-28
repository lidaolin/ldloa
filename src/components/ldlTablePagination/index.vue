<template>
  <div class="ldlTablePaginationWrap">
    
    <ldl-table :style="{height:'calc(100% - '+dd+')'}" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingDataS"  @getList="getList"></ldl-table>
    <div class="ldlTablePaginationBox">
      <div>
        <searchBox></searchBox>
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
    }
  },
  mounted() {
    this.pagingDataS=this.pagingData
  },
  components:{
    ldlTable,
    ldlPagination,
    searchBox
  },
  methods:{
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