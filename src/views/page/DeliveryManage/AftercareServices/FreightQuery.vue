<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {order_plfahuo} from "@/api/DeliveryManage/AftercareServices/FreightQuery";
export default {
  name: "FreightQuery",
  components:{
    ldlTablePagination,
    buttonBox,
  },
  data(){
    return{
      expressList: [],
      express: '',
      tableData: [],
      tableHeader: [],
      uploadLoading: false,
      uploadShow: false,
      /**必要参数*/
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {prop:'plfahuo_code',label:'发货单号',},
          {prop:'order_code',label:'订单号',},
          {prop:'express_code',label:'快递单号',},
          {prop:'ps_fee',label:'配送运费',sortable:"custom"},
          {prop:'ship_time',label:'发货时间',type:"date",sortable:"custom"},
          {prop:'companyName',label:'配送中心',},
          {prop:'kdname',label:'快递单位名称',},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.getList()
      this.getExpress()
    })
  },
  methods:{
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
      order_plfahuo(this.pagingData).then(res=>{
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
.expressSelect {
  margin-bottom: 20px;
}
</style>
<style>
.FR_modalFoot{
  display: block !important;
  width: 100% !important;
  padding-top: 10px !important;
  text-align: center;
}
</style>