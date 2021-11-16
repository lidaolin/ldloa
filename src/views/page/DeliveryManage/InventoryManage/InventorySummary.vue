<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>

  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {stockSummaryList,exports} from "@/api/DeliveryManage/InventoryManage/InventorySummary";

export default {
  name: "InventorySummary",
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
          {prop:'product_name',label:'商品名称',},
          {prop:'product_sku_name',label:'商品规格名称',},
          {prop:'company_id',label:'单位名称',},
          {prop:'ke_number',label:'可用库存',sortable:"custom"},
          {prop:'d_lock_number',label:'销售锁定',sortable:"custom"},
          {prop:'d_zt_number',label:'销售在途',sortable:"custom"},
          {prop:'d_ck_number',label:'销售出库',sortable:"custom"},
          {prop:'z_rk_number',label:'生产入库',sortable:"custom"},
          {prop:'z_ck_number',label:'生产出库',sortable:"custom"},
          {prop:'pd_rk_number',label:'盘点入库',sortable:"custom"},
          {prop:'pd_ck_number',label:'盘点出库',sortable:"custom"},
          {prop:'th_rk_number',label:'退货入库',sortable:"custom"},
          {prop:'th_ck_number',label:'退货出库',sortable:"custom"},
          {prop:'p_lock_number',label:'进货锁定',sortable:"custom"},
          {prop:'p_zt_number',label:'进货在途',sortable:"custom"},
          {prop:'p_ck_number',label:'累计进货数量',sortable:"custom",width: 120},
          {prop:'p_rk_number',label:'累计入库数量',sortable:"custom",width: 120},
          {prop:'cp_number',label:'次品仓',sortable:"custom"},
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
      stockSummaryList(this.pagingData).then(res=>{
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