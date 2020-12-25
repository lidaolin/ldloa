<template>
  <div>
    <ldl-table @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table>
  </div>
</template>

<script>
import ldlTable from '@/components/ldlTable'
export default {
  name: "ab",
  components:{
    ldlTable
  },
  data(){
    return{
      tableDataInfo:{
        dataListInfo:[],
        dataList:[],
      },
      pagingData:undefined
    }
  },
  methods:{
    getList(){
      console.log(this.pagingData)
    }
  }
}
</script>

<style scoped>

</style>