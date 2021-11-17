<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>

  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {sale_summaryt,exports} from "@/api/DeliveryManage/InventoryManage/SalesSummary";

export default {
  name: "SalesSummary",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'product_name',label:'商品名称', width: 350,},
          {prop:'sku_name',label:'商品规格名称'},
          {prop:'company_id',label:'服务商名称', width: 120,},
          {prop:'number',label:'销售数量',sortable:"custom", width: 100,},
          {prop:'price',label:'销售金额',sortable:"custom", width: 100,},
          {prop:'ave_price',label:'平均单价',sortable:"custom", width: 100,},
          {prop: 'time', label: '查询时间', type: "date", width: 280, sortable: "custom",},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  methods:{

    //导出
    getExport() {
      exports(this.pagingData)
        .then(res => {
          const a = document.createElement('a')
          a.setAttribute('href', `${res.data.url}`)
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a) // 下载后移除a标签
        })
        .catch(err => this.$message.error(err))
    },



    /**这是按钮方法调用*/
    functionCall(name) {
      if (name.length == 1) {
        this[name[0]]();
      } else {
        this[name[0]](name[1]);
      }
    },
    /**这是按钮方法调用*/

    getList(){
      sale_summaryt(this.pagingData).then(res=>{
        this.pagingData={...
              this.pagingData,
          page:res.data.current_page,
          limit:res.data.per_page,
          total:res.data.total,
        }
        let tableDataInfo={... this.tableDataInfo,dataList:res.data.data}
        this.tableDataInfo=tableDataInfo
      })
    }
  },

}
</script>

<style scoped>

</style>