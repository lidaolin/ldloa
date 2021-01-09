<template>
 <div class="pageWrap">
   <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
   <ldl-table-pagination :selectRow.sync="selectRow" :selectionList.sync="selectionList" :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}" @getList="getList" :tableDataInfo="tableDataInfo" :pagingData.sync="pagingData"></ldl-table-pagination>
 </div>
</template>

<script>

import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {d_list} from "@/api/DeliveryManage/DeliverGoodsManage/SynchroDeliver";
export default {
  name: "SynchroDeliver",
  data(){
    return{
      /**必要参数*/
      selectionList:undefined,//多选
      selectRow:undefined, //选中行
      pagingData:undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState:true,//开启按钮行的状态
      tableDataInfo:{ //表格信息
        dataListInfo:[
          {type:'selection',width: 35},
          {prop:'plfahuo_code',label:'发货单号',width: 150},
          {prop:'intercept_status',label:'是否拦截',type:'tag',data:[{type:'',key:1,name:'未拦截'},{type:'danger',key:2,name:'已拦截'}],},
          {prop:'plfahuo_status',label:'状态',},
          {prop:'create_time',label:'创建时间',type:"date",width:140,sortable:"custom",},
          {prop:'guzong',label:'估重',sortable:"custom"},
          {prop:'shizong',label:'实重',sortable:"custom"},
          {prop:'bz_xin',label:'包货箱型',},
          {prop:'product_number',label:'商品数量',sortable:"custom"},
          {prop:'ps_fee',label:'配送费用',sortable:"custom"},
          {prop:'companyName',label:'配送单位',},
          {prop:'sj_name',label:'收件人姓名',},
          {prop:'sj_phone',label:'收件人手机',},
          {prop:'province',label:'省',},
          {prop:'city',label:'市',},
          {prop:'district',label:'区',},
          {prop:'detail_address',label:'详细地址',},
          {prop:'plfahuo_characteristic',type:'tag',label:'发货单标识',data:[{type:'danger',key:2,name:'拆分单'},{type:'success',key:3,name:'合并单'}],},
          {prop:'express_status',type:'tag',label:'快递单打印状态',width:100,data:[{type:'info',key:1,name:'未打印'},{type:'',key:2,name:'打印成功'},{type:'danger',key:2,name:'打印失败'}],},
          {prop:'qingdan_status',type:'tag',label:'清单打印状态',width:100,data:[{type:'info',key:1,name:'未打印'},{type:'',key:2,name:'打印成功'}],},
          {prop:'k_dy_time',label:'快递单打印时间',type:"date",sortable:"custom",width:140},
          {prop:'qd_dy_time',label:'清单打印时间',type:"date",sortable:"custom",width:140},
          {prop:'examine_time',label:'审单时间',type:"date",sortable:"custom",width:140},
          {prop:'ship_time',label:'发货时间',type:"date",sortable:"custom",width:140},
          {prop:'sign_time',label:'签收时间',type:"date",sortable:"custom",width:140},
        ],//表格列信息
        dataList:[]//表格行信息
      },
      /**必要参数*/
    }
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
      d_list(this.pagingData).then(res=>{
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
  mounted() {
    this.$nextTick(()=>{
      this.getList()
    })
  },
  components:{
    ldlTablePagination,
    buttonBox,
  },
}
</script>

<style scoped>

</style>