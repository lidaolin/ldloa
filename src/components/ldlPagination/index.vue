<template>
  <el-pagination
      class="ldlPagination"
      background
      size="mini"
      :page-sizes="[10,20,50,80,100, 200, 300,400]"
      :page-size="pagingData.limit"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagingData.page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagingData.total">
  </el-pagination>
</template>

<script>
export default {
  name: "ldlPagination",
  data(){
    return{

    }
  },
  props:{
    pagingData:{
      type:Object,
      default:function (){
        return{
          page:1,
          limit:50,
          total:1000,
        }
      }
    },
  },
  methods:{
    handleSizeChange(val){
      let pagingData=this.pagingData
      pagingData.limit=val
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
    },
    handleCurrentChange(val){
      let pagingData=this.pagingData
      pagingData.page=val
      this.$emit('update:pagingData',pagingData)
      this.$emit('getList')
    }

  }
}
</script>

<style scoped>

</style>

<style lang="scss">
@import 'pagination';
//这地方魔改了elementui样式不要可以去除
</style>